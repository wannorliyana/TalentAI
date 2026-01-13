import { useState } from "react";
import { Search, Filter, MoreHorizontal, Mail, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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

export function Candidates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || candidate.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", "new", "screening", "interview", "offer", "hired"];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground mt-1">Review and manage your candidate pipeline.</p>
        </div>
        <Button variant="glow" size="lg">
          <Sparkles className="h-4 w-4" />
          AI Screen All
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 animate-slide-up">
        <div className="flex flex-col sm:flex-row gap-4">
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
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
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
    </div>
  );
}
