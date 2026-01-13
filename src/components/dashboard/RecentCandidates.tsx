import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Candidate {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "new" | "screening" | "interview" | "offer" | "rejected";
  matchScore: number;
}

const statusConfig = {
  new: { label: "New", className: "bg-secondary text-secondary-foreground" },
  screening: { label: "Screening", className: "bg-primary/10 text-primary" },
  interview: { label: "Interview", className: "bg-warning/10 text-warning" },
  offer: { label: "Offer", className: "bg-success/10 text-success" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
};

const mockCandidates: Candidate[] = [
  { id: "1", name: "Sarah Chen", role: "Senior Frontend Developer", status: "interview", matchScore: 94 },
  { id: "2", name: "Marcus Johnson", role: "Product Manager", status: "screening", matchScore: 87 },
  { id: "3", name: "Elena Rodriguez", role: "UX Designer", status: "new", matchScore: 91 },
  { id: "4", name: "James Kim", role: "Backend Engineer", status: "offer", matchScore: 96 },
  { id: "5", name: "Priya Sharma", role: "Data Scientist", status: "interview", matchScore: 89 },
];

export function RecentCandidates() {
  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/50 animate-slide-up">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Candidates</h3>
        <p className="text-sm text-muted-foreground mt-1">Latest applications with AI match scores</p>
      </div>
      <div className="divide-y divide-border">
        {mockCandidates.map((candidate, index) => {
          const status = statusConfig[candidate.status];
          return (
            <div
              key={candidate.id}
              className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={candidate.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {candidate.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground truncate">{candidate.name}</p>
                <p className="text-sm text-muted-foreground truncate">{candidate.role}</p>
              </div>
              <Badge className={cn("font-medium", status.className)} variant="secondary">
                {status.label}
              </Badge>
              <div className="text-right">
                <p className={cn(
                  "text-sm font-semibold",
                  candidate.matchScore >= 90 ? "text-success" : 
                  candidate.matchScore >= 80 ? "text-primary" : "text-muted-foreground"
                )}>
                  {candidate.matchScore}%
                </p>
                <p className="text-xs text-muted-foreground">Match</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-border">
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all candidates →
        </button>
      </div>
    </div>
  );
}
