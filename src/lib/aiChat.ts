const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export type Attachment = {
  type: "image" | "document";
  dataUrl?: string;
  mimeType: string;
  name?: string;
  excerpt?: string;
};

export type MathStep = {
  expression: string;
  operation: string;
  result: number;
  description: string;
};

export type MathResultPayload = {
  expression: string;
  result: number;
  formattedResult: string;
  steps: MathStep[];
};

export type Message = {
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  mathResult?: MathResultPayload;
};

type StreamResult = {
  mathResult?: MathResultPayload;
  clarification?: string;
};

export async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError?: (error: Error) => void;
}): Promise<StreamResult | undefined> {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    const contentType = resp.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const payload = await resp.json().catch(() => ({ error: "حدث خطأ في الاتصال" }));

      if (!resp.ok || payload.error) {
        throw new Error(payload.error || `خطأ: ${resp.status}`);
      }

      const mathResult = payload.type === "math-result" ? payload : undefined;
      const clarification = payload.type === "math-clarification" ? payload.message : undefined;
      onDone();
      return { mathResult, clarification };
    }

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({ error: "حدث خطأ في الاتصال" }));
      throw new Error(errorData.error || `خطأ: ${resp.status}`);
    }

    if (!resp.body) {
      throw new Error("لا يوجد استجابة من الخادم");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { 
          /* ignore partial leftovers */ 
        }
      }
    }

    onDone();
  } catch (error) {
    console.error("Stream error:", error);
    if (onError) {
      onError(error instanceof Error ? error : new Error("حدث خطأ غير متوقع"));
    }
    onDone();
  }
}
