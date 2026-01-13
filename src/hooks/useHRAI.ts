import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ATSResult {
  overallScore: number;
  categories: {
    formatting: { score: number; feedback: string };
    keywords: { score: number; feedback: string };
    structure: { score: number; feedback: string };
    contact: { score: number; feedback: string };
  };
  suggestions: string[];
  missingKeywords: string[];
  strengths: string[];
}

export interface JobMatchResult {
  matchScore: number;
  categories: {
    skills: { score: number; matched: string[]; missing: string[] };
    experience: { score: number; feedback: string };
    education: { score: number; feedback: string };
    culture: { score: number; feedback: string };
  };
  recommendation: "strong" | "consider" | "pass";
  strengths: string[];
  concerns: string[];
  interviewQuestions: string[];
}

export interface SalaryPrediction {
  predictedSalary: {
    min: number;
    median: number;
    max: number;
    currency: string;
  };
  factors: Array<{ factor: string; impact: string; reasoning: string }>;
  marketInsights: string;
  negotiationTips: string[];
  benefits: string[];
}

export function useHRAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeATS = async (resumeText: string): Promise<ATSResult | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("hr-ai-analyze", {
        body: { type: "ats_score", resumeText },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      return data.result as ATSResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : "ATS analysis failed";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const matchJob = async (resumeText: string, jobDescription: string): Promise<JobMatchResult | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("hr-ai-analyze", {
        body: { type: "job_match", resumeText, jobDescription },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      return data.result as JobMatchResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Job matching failed";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const predictSalary = async (
    jobTitle: string,
    location: string,
    experience: string,
    skills: string[]
  ): Promise<SalaryPrediction | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("hr-ai-analyze", {
        body: { type: "salary_predict", jobTitle, location, experience, skills },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      return data.result as SalaryPrediction;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Salary prediction failed";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const askCareerInsight = async (question: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("hr-ai-analyze", {
        body: { type: "career_insight", question },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      return data.result?.response as string;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Career insight failed";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    analyzeATS,
    matchJob,
    predictSalary,
    askCareerInsight,
  };
}
