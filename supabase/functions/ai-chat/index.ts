import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { calculateStepByStep } from "../../../utils/mathEngine.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ChatMessage = {
  role: string;
  content?: string;
};

const isMathLikeQuestion = (content: string) => {
  const normalized = content.replace(/،/g, ",").trim();
  const numberLike = /\d/.test(normalized);
  const operatorLike = /[+\-*/%^]/.test(normalized);
  const keywords = /(مسألة|حل|خطوات|ناتج|احسب|اجمع|اطرح|اضرب|اقسم|كم)/i;
  return Boolean((numberLike && operatorLike) || keywords.test(normalized));
};

const extractMathExpression = (content: string) => {
  const expressionMatches = content.match(/[0-9+\-*/%^().\s]+/g);
  if (expressionMatches && expressionMatches.length > 0) {
    const joined = expressionMatches.join(" ").replace(/\s+/g, " ").trim();
    if (joined) return joined;
  }
  return content;
};

const respondWithJson = (payload: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return respondWithJson({ error: "تنسيق الرسائل غير صحيح" }, 400);
    }
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    console.log("Received chat request with", messages.length, "messages");

    const latestUserMessage: ChatMessage | undefined = [...messages].reverse().find((msg: ChatMessage) => msg.role === "user");

    if (latestUserMessage?.content && isMathLikeQuestion(latestUserMessage.content)) {
      console.log("Math query detected. Using Math Engine for:", latestUserMessage.content);
      const mathResult = calculateStepByStep({ expression: extractMathExpression(latestUserMessage.content) });
      if (mathResult) {
        return respondWithJson({ type: "math-result", ...mathResult });
      }
      return respondWithJson({ type: "math-clarification", message: "المسألة غير واضحة" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "عند حل المسائل الرياضية يجب الالتزام بالقواعد التالية: – لا تستنتج أرقام غير موجودة في السؤال.\n" +
              "– لا تنشئ خطوات غير ضرورية.\n" +
              "– إذا لم تكن المعطيات كافية، قل: (المسألة غير واضحة).\n" +
              "– استخدم فقط المعلومات التي ذكرها الطالب.\n" +
              "– العمليات الحسابية يتم تنفيذها بواسطة Math Engine وليس بواسطة النموذج."
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ 
            error: "لقد تجاوزت الحد المسموح من الطلبات. يرجى المحاولة مرة أخرى بعد قليل." 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ 
            error: "نحتاج إلى تفعيل الخدمة. يرجى التواصل مع إدارة المدرسة." 
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "حدث خطأ في الاتصال بالذكاء الاصطناعي" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Streaming response from AI gateway");
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "حدث خطأ غير متوقع" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
