import { useState } from "react";
import { Search, MoreHorizontal, Mail, Phone, Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  avatar?: string;
  status: "new" | "screening" | "interview" | "offer" | "hired" | "rejected";
  matchScore: number;
  appliedDate: string;
  skills: string[];
}

interface ScreeningResult {
  candidateId: string;
  candidateName: string;
  overallScore: number;
  recommendation: "strong" | "consider" | "pass";
  strengths: string[];
  concerns: string[];
  summary: string;
  nextSteps: string[];
  cultureFit: number;
  technicalFit: number;
}

const mockCandidates: Candidate[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@email.com", phone: "+1 (555) 123-4567", role: "Senior Frontend Developer", experience: "8 years", status: "interview", matchScore: 94, appliedDate: "2 days ago", skills: ["React", "TypeScript", "Node.js"] },
  { id: "2", name: "Marcus Johnson", email: "marcus.j@email.com", phone: "+1 (555) 234-5678", role: "Product Manager", experience: "6 years", status: "screening", matchScore: 87, appliedDate: "3 days ago", skills: ["Agile", "Roadmapping", "Analytics"] },
  { id: "3", name: "Elena Rodriguez", email: "elena.r@email.com", phone: "+1 (555) 345-6789", role: "UX Designer", experience: "5 years", status: "new", matchScore: 91, appliedDate: "1 day ago", skills: ["Figma", "User Research", "Prototyping"] },
  { id: "4", name: "James Kim", email: "james.kim@email.com", phone: "+1 (555) 456-7890", role: "Backend Engineer", experience: "7 years", status: "offer", matchScore: 96, appliedDate: "5 days ago", skills: ["Python", "AWS", "PostgreSQL"] },
  { id: "5", name: "Priya Sharma", email: "priya.s@email.com", phone: "+1 (555) 567-8901", role: "Data Scientist", experience: "4 years", status: "interview", matchScore: 89, appliedDate: "4 days ago", skills: ["Python", "ML", "TensorFlow"] },
  { id: "6", name: "David Thompson", email: "david.t@email.com", phone: "+1 (555) 678-9012", role: "DevOps Engineer", experience: "6 years", status: "hired", matchScore: 92, appliedDate: "1 week ago", skills: ["Kubernetes", "Docker", "CI/CD"] },
];

const statusConfig = {
  new: { label: "New", className: "bg-secondary text-secondary-foreground" },
  screening: { label: "Screening", className: "bg-primary/10 text-primary" },
  interview: { label: "Interview", className: "bg-warning/10 text-warning" },
  offer: { label: "Offer Sent", className: "bg-success/10 text-success" },
  hired: { label: "Hired", className: "bg-success text-success-foreground" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
};

const recommendationConfig = {
  strong: { label: "Strong Hire", className: "bg-success text-success-foreground" },
  consider: { label: "Consider", className: "bg-warning text-warning-foreground" },
  pass: { label: "Pass", className: "bg-destructive text-destructive-foreground" },
};

export function Candidates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningProgress, setScreeningProgress] = useState(0);
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || candidate.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", "new", "screening", "interview", "offer", "hired"];

  const handleScreenAll = async () => {
    setIsScreening(true);
    setScreeningProgress(0);
    setScreeningResults([]);

    const results: ScreeningResult[] = [];
    const candidatesToScreen = filteredCandidates.filter(c => c.status === "new" || c.status === "screening");
    
    if (candidatesToScreen.length === 0) {
      toast.info("No candidates to screen", {
        description: "Only candidates with 'New' or 'Screening' status will be analyzed."
      });
      setIsScreening(false);
      return;
    }

    toast.info(`Screening ${candidatesToScreen.length} candidates...`);

    for (let i = 0; i < candidatesToScreen.length; i++) {
      const candidate = candidatesToScreen[i];
      
      try {
        const { data, error } = await supabase.functions.invoke('hr-ai-analyze', {
          body: {
            type: "screen_candidate",
            candidateName: candidate.name,
            candidateRole: candidate.role,
            experience: candidate.experience,
            skills: candidate.skills,
          }
        });

        if (error) throw error;

        const result = data.result;
        results.push({
          candidateId: candidate.id,
          candidateName: candidate.name,
          overallScore: result.overallScore || 75,
          recommendation: result.recommendation || "consider",
          strengths: result.strengths || [],
          concerns: result.concerns || [],
          summary: result.summary || "Analysis completed.",
          nextSteps: result.nextSteps || [],
          cultureFit: result.cultureFit || 80,
          technicalFit: result.technicalFit || 80,
        });
      } catch (error: any) {
        console.error(`Error screening ${candidate.name}:`, error);
        if (error.message?.includes("429") || error.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
          break;
        }
        if (error.message?.includes("402") || error.status === 402) {
          toast.error("AI credits exhausted. Please add more credits.");
          break;
        }
      }

      setScreeningProgress(((i + 1) / candidatesToScreen.length) * 100);
      // Small delay between requests to avoid rate limiting
      if (i < candidatesToScreen.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setScreeningResults(results);
    setIsScreening(false);
    
    if (results.length > 0) {
      setShowResults(true);
      toast.success(`Screened ${results.length} candidates!`);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground mt-1">Review and manage your candidate pipeline.</p>
        </div>
        <Button 
          variant="glow" 
          size="lg" 
          onClick={handleScreenAll}
          disabled={isScreening}
        >
          {isScreening ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Screening...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              AI Screen All
            </>
          )}
        </Button>
      </div>

      {/* Screening Progress */}
      {isScreening && (
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">AI Screening in progress...</span>
            <span className="text-sm text-muted-foreground">{Math.round(screeningProgress)}%</span>
          </div>
          <Progress value={screeningProgress} className="h-2" />
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 animate-slide-up">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status === "all" ? null : status)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                (selectedStatus === status || (status === "all" && !selectedStatus))
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden animate-slide-up">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Candidate</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">AI Match</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Applied</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Skills</th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCandidates.map((candidate, index) => {
                const status = statusConfig[candidate.status];
                return (
                  <tr
                    key={candidate.id}
                    className="hover:bg-accent/50 transition-colors"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {candidate.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-card-foreground">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.experience} exp.</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-card-foreground">{candidate.role}</p>
                    </td>
                    <td className="p-4">
                      <Badge className={cn("font-medium", status.className)} variant="secondary">
                        {status.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              candidate.matchScore >= 90 ? "bg-success" :
                              candidate.matchScore >= 80 ? "bg-primary" : "bg-warning"
                            )}
                            style={{ width: `${candidate.matchScore}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-sm font-semibold",
                          candidate.matchScore >= 90 ? "text-success" :
                          candidate.matchScore >= 80 ? "text-primary" : "text-warning"
                        )}>
                          {candidate.matchScore}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-muted-foreground">{candidate.appliedDate}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {candidate.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{candidate.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screening Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Screening Results
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4">
              {screeningResults.map((result) => (
                <div
                  key={result.candidateId}
                  className="bg-muted/30 rounded-xl p-4 border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{result.candidateName}</h4>
                      <p className="text-sm text-muted-foreground">{result.summary}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={recommendationConfig[result.recommendation].className}>
                        {recommendationConfig[result.recommendation].label}
                      </Badge>
                      <span className="text-lg font-bold text-primary">{result.overallScore}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Technical Fit</p>
                      <div className="flex items-center gap-2">
                        <Progress value={result.technicalFit} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{result.technicalFit}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Culture Fit</p>
                      <div className="flex items-center gap-2">
                        <Progress value={result.cultureFit} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{result.cultureFit}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-success mb-1">Strengths</p>
                      <ul className="space-y-1">
                        {result.strengths.slice(0, 3).map((s, i) => (
                          <li key={i} className="text-muted-foreground">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-warning mb-1">Concerns</p>
                      <ul className="space-y-1">
                        {result.concerns.slice(0, 3).map((c, i) => (
                          <li key={i} className="text-muted-foreground">• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {result.nextSteps.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="font-medium text-foreground mb-1">Recommended Next Steps</p>
                      <div className="flex flex-wrap gap-2">
                        {result.nextSteps.map((step, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {step}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}