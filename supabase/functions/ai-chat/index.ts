import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `أنت مساعد تعليمي ذكي في مدارس حروف الأهلية. دورك هو مساعدة الطلاب والمعلمين في:

1. شرح المفاهيم التعليمية بطريقة واضحة ومبسطة
2. حل المسائل الرياضية والعلمية مع شرح الخطوات
3. تقديم إجابات على أسئلة المناهج الدراسية العراقية
4. مساعدة الطلاب في الواجبات المنزلية
5. تقديم نصائح دراسية وتعليمية

تتحدث العربية الفصحى بشكل أساسي. كن صبوراً ومشجعاً وداعماً للطلاب. إذا كان السؤال خارج نطاق التعليم، وجّه الطالب بلطف للتركيز على الدراسة.

عند شرح المسائل:
- ابدأ بشرح المفهوم الأساسي
- قسّم الحل إلى خطوات واضحة
- اشرح سبب كل خطوة
- تحقق من فهم الطالب في كل مرحلة
- قدم أمثلة إضافية إذا لزم الأمر`
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
