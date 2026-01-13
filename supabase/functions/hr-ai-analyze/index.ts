import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HRAnalysisRequest {
  type: "ats_score" | "job_match" | "salary_predict" | "career_insight";
  resumeText?: string;
  jobDescription?: string;
  jobTitle?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  question?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, resumeText, jobDescription, jobTitle, location, experience, skills, question } = 
      await req.json() as HRAnalysisRequest;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "ats_score":
        systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze resumes for ATS compatibility and provide detailed scoring.
        
You MUST respond with valid JSON in this exact format:
{
  "overallScore": 85,
  "categories": {
    "formatting": { "score": 90, "feedback": "Good use of standard headings" },
    "keywords": { "score": 80, "feedback": "Missing some industry keywords" },
    "structure": { "score": 85, "feedback": "Clear chronological format" },
    "contact": { "score": 95, "feedback": "Complete contact information" }
  },
  "suggestions": ["Add quantifiable achievements", "Include more action verbs"],
  "missingKeywords": ["project management", "agile methodology"],
  "strengths": ["Strong technical skills section", "Clear experience timeline"]
}`;
        userPrompt = `Analyze this resume for ATS compatibility:\n\n${resumeText}`;
        break;

      case "job_match":
        systemPrompt = `You are an expert HR recruiter and job matching specialist. Analyze how well a candidate matches a job vacancy.
        
You MUST respond with valid JSON in this exact format:
{
  "matchScore": 85,
  "categories": {
    "skills": { "score": 90, "matched": ["React", "TypeScript"], "missing": ["GraphQL"] },
    "experience": { "score": 80, "feedback": "4 years vs 5 years required" },
    "education": { "score": 85, "feedback": "BS in Computer Science matches" },
    "culture": { "score": 88, "feedback": "Remote work experience aligns" }
  },
  "recommendation": "strong",
  "strengths": ["Strong frontend experience", "Leadership background"],
  "concerns": ["Slightly below experience requirement"],
  "interviewQuestions": ["Describe your GraphQL learning plan", "Tell us about team leadership"]
}
recommendation must be one of: "strong", "consider", "pass"`;
        userPrompt = `Match this resume to the job description:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;
        break;

      case "salary_predict":
        systemPrompt = `You are a compensation and salary analytics expert. Predict salary ranges based on role, location, experience, and skills.
        
You MUST respond with valid JSON in this exact format:
{
  "predictedSalary": {
    "min": 80000,
    "median": 95000,
    "max": 120000,
    "currency": "USD"
  },
  "factors": [
    { "factor": "Location (San Francisco)", "impact": "+15%", "reasoning": "High cost of living area" },
    { "factor": "5 years experience", "impact": "+10%", "reasoning": "Above entry level" },
    { "factor": "React expertise", "impact": "+5%", "reasoning": "In-demand skill" }
  ],
  "marketInsights": "The market for this role is competitive with high demand",
  "negotiationTips": ["Highlight your unique project experience", "Emphasize leadership skills"],
  "benefits": ["Health insurance", "Stock options", "Remote work flexibility"]
}`;
        userPrompt = `Predict salary for:
Job Title: ${jobTitle}
Location: ${location}
Experience: ${experience}
Skills: ${skills?.join(", ")}`;
        break;

      case "career_insight":
        systemPrompt = `You are an expert career counselor and HR advisor. Provide actionable career guidance, job market insights, and professional development advice.
        
Respond in a helpful, conversational manner. Be specific and practical with your advice.`;
        userPrompt = question || "How can I improve my career prospects?";
        break;

      default:
        throw new Error("Invalid analysis type");
    }

    const body: Record<string, unknown> = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    };

    // Use structured output for non-chat responses
    if (type !== "career_insight") {
      body.response_format = { type: "json_object" };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON for structured responses
    let result;
    if (type === "career_insight") {
      result = { response: content };
    } else {
      try {
        result = JSON.parse(content);
      } catch {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```json?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[1]);
        } else {
          result = { rawResponse: content };
        }
      }
    }

    return new Response(JSON.stringify({ type, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("HR AI analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
