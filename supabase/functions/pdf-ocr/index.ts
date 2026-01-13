import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OCRRequest {
  pdfBase64: string;
  filename?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64, filename } = await req.json() as OCRRequest;

    if (!pdfBase64) {
      throw new Error("PDF data is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Use Gemini's vision capabilities to extract text from the PDF
    // We send the PDF as a base64 image/document for OCR processing
    const systemPrompt = `You are an expert OCR (Optical Character Recognition) system. Your task is to extract ALL text content from the provided PDF document image.

Instructions:
- Extract every piece of text visible in the document
- Preserve the structure and formatting as much as possible (sections, bullet points, etc.)
- Include headers, contact information, job titles, company names, dates, skills, education details
- If the document appears to be a resume/CV, organize the text in a logical resume format
- Do NOT add any commentary or analysis - just extract the raw text
- If text is unclear, make your best attempt to read it
- Return ONLY the extracted text, nothing else`;

    const userContent = [
      {
        type: "text",
        text: `Extract all text from this PDF document${filename ? ` (${filename})` : ""}. Return only the extracted text content.`
      },
      {
        type: "image_url",
        image_url: {
          url: `data:application/pdf;base64,${pdfBase64}`
        }
      }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("OCR processing failed");
    }

    const data = await response.json();
    const extractedText = data.choices?.[0]?.message?.content;

    if (!extractedText) {
      throw new Error("No text could be extracted from the PDF");
    }

    console.log(`OCR extracted ${extractedText.length} characters from PDF`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        text: extractedText,
        characterCount: extractedText.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("PDF OCR error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "OCR failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
