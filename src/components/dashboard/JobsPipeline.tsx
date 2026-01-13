import { Briefcase, Users, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  title: string;
  department: string;
  candidates: number;
  daysOpen: number;
  status: "active" | "urgent" | "paused";
}

const mockJobs: Job[] = [
  { id: "1", title: "Senior React Developer", department: "Engineering", candidates: 24, daysOpen: 12, status: "active" },
  { id: "2", title: "Product Manager", department: "Product", candidates: 18, daysOpen: 21, status: "urgent" },
  { id: "3", title: "UX/UI Designer", department: "Design", candidates: 31, daysOpen: 8, status: "active" },
  { id: "4", title: "DevOps Engineer", department: "Engineering", candidates: 9, daysOpen: 5, status: "active" },
];

const statusStyles = {
  active: "bg-success/10 text-success",
  urgent: "bg-warning/10 text-warning",
  paused: "bg-muted text-muted-foreground",
};

export function JobsPipeline() {
  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/50 animate-slide-up">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Active Jobs</h3>
          <p className="text-sm text-muted-foreground mt-1">Monitor your open positions</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-soft">
          + New Job
        </button>
      </div>
      <div className="divide-y divide-border">
        {mockJobs.map((job, index) => (
          <div
            key={job.id}
            className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-card-foreground">{job.title}</h4>
                <p className="text-sm text-muted-foreground">{job.department}</p>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                statusStyles[job.status]
              )}>
                {job.status}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{job.candidates} candidates</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{job.daysOpen} days open</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all jobs →
        </button>
      </div>
    </div>
  );
}
