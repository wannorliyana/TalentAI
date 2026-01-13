import { useState } from "react";
import { Sparkles, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Brain, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScreeningResult {
  id: string;
  name: string;
  role: string;
  overallScore: number;
  categories: {
    skills: number;
    experience: number;
    education: number;
    cultural: number;
  };
  strengths: string[];
  concerns: string[];
  recommendation: "strong" | "consider" | "pass";
}

const mockResults: ScreeningResult[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    overallScore: 94,
    categories: { skills: 96, experience: 92, education: 90, cultural: 95 },
    strengths: ["8+ years React experience", "Led teams of 5+", "Strong TypeScript skills"],
    concerns: ["No GraphQL experience"],
    recommendation: "strong",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Product Manager",
    overallScore: 78,
    categories: { skills: 82, experience: 75, education: 80, cultural: 78 },
    strengths: ["Agile certified", "B2B SaaS background", "Data-driven approach"],
    concerns: ["Limited startup experience", "No technical background"],
    recommendation: "consider",
  },
];

const recommendationStyles = {
  strong: { bg: "bg-success/10", text: "text-success", label: "Strong Match", icon: CheckCircle2 },
  consider: { bg: "bg-warning/10", text: "text-warning", label: "Consider", icon: AlertCircle },
  pass: { bg: "bg-destructive/10", text: "text-destructive", label: "Not Recommended", icon: AlertCircle },
};

export function AIScreening() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = () => {
    setUploadedFiles(["resume_sarah_chen.pdf", "resume_marcus_johnson.pdf"]);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">AI Screening</h1>
        <p className="text-muted-foreground mt-1">Let AI analyze resumes and match candidates to your requirements.</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-soft">
          <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-card-foreground mb-2">Smart Analysis</h3>
          <p className="text-sm text-muted-foreground">AI extracts skills, experience, and qualifications from resumes automatically.</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-soft">
          <div className="p-3 rounded-xl bg-success/10 w-fit mb-4">
            <Target className="h-6 w-6 text-success" />
          </div>
          <h3 className="font-semibold text-card-foreground mb-2">Job Matching</h3>
          <p className="text-sm text-muted-foreground">Get match scores based on your specific job requirements and company culture.</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-soft">
          <div className="p-3 rounded-xl bg-warning/10 w-fit mb-4">
            <Zap className="h-6 w-6 text-warning" />
          </div>
          <h3 className="font-semibold text-card-foreground mb-2">Instant Insights</h3>
          <p className="text-sm text-muted-foreground">Receive actionable recommendations within seconds, not hours.</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden animate-slide-up">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Upload Resumes</h3>
          <p className="text-sm text-muted-foreground mt-1">Upload PDF or DOCX files to analyze</p>
        </div>
        <div className="p-6">
          <div
            onClick={handleFileUpload}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group"
          >
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="font-medium text-card-foreground mb-1">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground">Supports PDF, DOCX up to 10MB each</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-card-foreground flex-1">{file}</span>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
              ))}
              <Button
                onClick={handleAnalyze}
                variant="glow"
                size="lg"
                className="w-full mt-4"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {!isAnalyzing && uploadedFiles.length > 0 && (
        <div className="space-y-4 animate-slide-up">
          <h3 className="text-lg font-semibold text-foreground">Screening Results</h3>
          {mockResults.map((result, index) => {
            const rec = recommendationStyles[result.recommendation];
            const RecIcon = rec.icon;
            return (
              <div
                key={result.id}
                className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Left: Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-card-foreground">{result.name}</h4>
                          <p className="text-muted-foreground">{result.role}</p>
                        </div>
                        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", rec.bg)}>
                          <RecIcon className={cn("h-4 w-4", rec.text)} />
                          <span className={cn("text-sm font-medium", rec.text)}>{rec.label}</span>
                        </div>
                      </div>

                      {/* Score Bars */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {Object.entries(result.categories).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground capitalize">{key}</span>
                              <span className="font-medium text-card-foreground">{value}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  value >= 90 ? "bg-success" : value >= 80 ? "bg-primary" : "bg-warning"
                                )}
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Overall Score */}
                    <div className="flex flex-col items-center justify-center p-6 bg-accent/50 rounded-xl min-w-[140px]">
                      <span className="text-sm text-muted-foreground mb-2">Overall Score</span>
                      <span className={cn(
                        "text-4xl font-bold",
                        result.overallScore >= 90 ? "text-success" :
                        result.overallScore >= 80 ? "text-primary" : "text-warning"
                      )}>
                        {result.overallScore}
                      </span>
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                  </div>

                  {/* Strengths & Concerns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                    <div>
                      <h5 className="text-sm font-medium text-success mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Strengths
                      </h5>
                      <ul className="space-y-1">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-warning mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Areas of Concern
                      </h5>
                      <ul className="space-y-1">
                        {result.concerns.map((c, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
