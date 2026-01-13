import { useState } from "react";
import { FileText, CheckCircle2, AlertTriangle, Loader2, Upload, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useHRAI, ATSResult } from "@/hooks/useHRAI";
import { cn } from "@/lib/utils";

export function ATSScoreChecker() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const { isLoading, analyzeATS } = useHRAI();

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    const atsResult = await analyzeATS(resumeText);
    if (atsResult) setResult(atsResult);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">ATS Resume Checker</h3>
              <p className="text-sm text-muted-foreground">Paste your resume text to analyze ATS compatibility</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <Textarea
            placeholder="Paste your resume content here... (Include all sections: contact info, experience, skills, education)"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || !resumeText.trim()}
            className="w-full"
            variant="glow"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="h-4 w-4" />
                Check ATS Score
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Overall Score */}
          <div className="bg-card rounded-xl border border-border/50 shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">ATS Compatibility Score</h3>
                <p className="text-sm text-muted-foreground">Based on formatting, keywords, and structure</p>
              </div>
              <div className="text-center">
                <span className={cn("text-5xl font-bold", getScoreColor(result.overallScore))}>
                  {result.overallScore}
                </span>
                <span className="text-xl text-muted-foreground">/100</span>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result.categories).map(([key, value]) => (
              <div key={key} className="bg-card rounded-xl border border-border/50 shadow-soft p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium capitalize text-card-foreground">{key}</span>
                  <span className={cn("font-bold", getScoreColor(value.score))}>{value.score}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", getScoreBg(value.score))}
                    style={{ width: `${value.score}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{value.feedback}</p>
              </div>
            ))}
          </div>

          {/* Strengths & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
              <h4 className="font-semibold text-success flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-success mt-1">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
              <h4 className="font-semibold text-primary flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4" />
                Suggestions
              </h4>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Missing Keywords */}
          {result.missingKeywords.length > 0 && (
            <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
              <h4 className="font-semibold text-warning flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4" />
                Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
