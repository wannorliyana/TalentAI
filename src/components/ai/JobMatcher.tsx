import { useState } from "react";
import { Briefcase, Users, CheckCircle2, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useHRAI, JobMatchResult } from "@/hooks/useHRAI";
import { cn } from "@/lib/utils";

const recommendationStyles = {
  strong: { bg: "bg-success/10", text: "text-success", label: "Strong Match" },
  consider: { bg: "bg-warning/10", text: "text-warning", label: "Consider" },
  pass: { bg: "bg-destructive/10", text: "text-destructive", label: "Not Recommended" },
};

export function JobMatcher() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const { isLoading, matchJob } = useHRAI();

  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    const matchResult = await matchJob(resumeText, jobDescription);
    if (matchResult) setResult(matchResult);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">CV to Job Matcher</h3>
              <p className="text-sm text-muted-foreground">Match candidates to job vacancies with AI</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">
                Resume / CV Text
              </label>
              <Textarea
                placeholder="Paste the candidate's resume content..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[180px] resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">
                Job Description
              </label>
              <Textarea
                placeholder="Paste the job description..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[180px] resize-none"
              />
            </div>
          </div>
          <Button
            onClick={handleMatch}
            disabled={isLoading || !resumeText.trim() || !jobDescription.trim()}
            className="w-full"
            variant="glow"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Matching...
              </>
            ) : (
              <>
                <Briefcase className="h-4 w-4" />
                Match CV to Job
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Match Score & Recommendation */}
          <div className="bg-card rounded-xl border border-border/50 shadow-soft p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className={cn("text-5xl font-bold", getScoreColor(result.matchScore))}>
                    {result.matchScore}
                  </span>
                  <span className="text-xl text-muted-foreground">%</span>
                  <p className="text-sm text-muted-foreground mt-1">Match Score</p>
                </div>
              </div>
              <div className={cn(
                "px-6 py-3 rounded-xl text-center",
                recommendationStyles[result.recommendation].bg
              )}>
                <span className={cn(
                  "text-lg font-semibold",
                  recommendationStyles[result.recommendation].text
                )}>
                  {recommendationStyles[result.recommendation].label}
                </span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
              <h4 className="font-semibold text-card-foreground mb-3">Skills Match</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Score</span>
                <span className={cn("font-bold", getScoreColor(result.categories.skills.score))}>
                  {result.categories.skills.score}%
                </span>
              </div>
              <div className="space-y-2 mt-3">
                <div>
                  <span className="text-xs text-success font-medium">Matched:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.categories.skills.matched.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-success/10 text-success text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-warning font-medium">Missing:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.categories.skills.missing.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-warning/10 text-warning text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {["experience", "education", "culture"].map((cat) => (
              <div key={cat} className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
                <h4 className="font-semibold text-card-foreground capitalize mb-3">{cat}</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Score</span>
                  <span className={cn("font-bold", getScoreColor(result.categories[cat as keyof typeof result.categories].score))}>
                    {result.categories[cat as keyof typeof result.categories].score}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {(result.categories[cat as keyof typeof result.categories] as { feedback: string }).feedback}
                </p>
              </div>
            ))}
          </div>

          {/* Strengths & Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
              <h4 className="font-semibold text-success flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4" />
                Candidate Strengths
              </h4>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
              <h4 className="font-semibold text-warning flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4" />
                Areas of Concern
              </h4>
              <ul className="space-y-2">
                {result.concerns.map((c, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interview Questions */}
          <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
            <h4 className="font-semibold text-primary flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4" />
              Suggested Interview Questions
            </h4>
            <ul className="space-y-2">
              {result.interviewQuestions.map((q, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary font-medium">{i + 1}.</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
