import { useState } from "react";
import { Users, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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

const departments = ["Engineering", "Product", "Design", "Marketing", "Sales", "HR", "Finance"];

export function JobsPipeline() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [open, setOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
  });

  const handleCreateJob = () => {
    if (!newJob.title.trim() || !newJob.department) {
      toast.error("Please fill in all fields");
      return;
    }

    const job: Job = {
      id: (jobs.length + 1).toString(),
      title: newJob.title.trim(),
      department: newJob.department,
      candidates: 0,
      daysOpen: 0,
      status: "active",
    };

    setJobs([job, ...jobs]);
    setNewJob({ title: "", department: "" });
    setOpen(false);
    toast.success("Job created successfully!");
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/50 animate-slide-up">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Active Jobs</h3>
          <p className="text-sm text-muted-foreground mt-1">Monitor your open positions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior React Developer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newJob.department}
                  onValueChange={(value) => setNewJob({ ...newJob, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateJob} className="w-full">
                Create Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="divide-y divide-border">
        {jobs.map((job, index) => (
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
