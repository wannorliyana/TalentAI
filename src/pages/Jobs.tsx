import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Users, Clock, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  salary: string;
  candidates: number;
  daysOpen: number;
  status: "active" | "urgent" | "paused" | "closed";
}

const mockJobs: Job[] = [
  { id: "1", title: "Senior React Developer", department: "Engineering", location: "San Francisco, CA", type: "full-time", salary: "$150k - $180k", candidates: 24, daysOpen: 12, status: "active" },
  { id: "2", title: "Product Manager", department: "Product", location: "New York, NY", type: "full-time", salary: "$130k - $160k", candidates: 18, daysOpen: 21, status: "urgent" },
  { id: "3", title: "UX/UI Designer", department: "Design", location: "Remote", type: "remote", salary: "$100k - $130k", candidates: 31, daysOpen: 8, status: "active" },
  { id: "4", title: "DevOps Engineer", department: "Engineering", location: "Austin, TX", type: "full-time", salary: "$140k - $170k", candidates: 9, daysOpen: 5, status: "active" },
  { id: "5", title: "Data Scientist", department: "Data", location: "Remote", type: "remote", salary: "$120k - $150k", candidates: 42, daysOpen: 14, status: "active" },
  { id: "6", title: "Marketing Manager", department: "Marketing", location: "Chicago, IL", type: "full-time", salary: "$90k - $110k", candidates: 15, daysOpen: 30, status: "paused" },
];

const statusStyles = {
  active: { bg: "bg-success/10", text: "text-success", label: "Active" },
  urgent: { bg: "bg-warning/10", text: "text-warning", label: "Urgent" },
  paused: { bg: "bg-muted", text: "text-muted-foreground", label: "Paused" },
  closed: { bg: "bg-secondary", text: "text-secondary-foreground", label: "Closed" },
};

const typeStyles = {
  "full-time": "bg-primary/10 text-primary",
  "part-time": "bg-secondary text-secondary-foreground",
  "contract": "bg-warning/10 text-warning",
  "remote": "bg-success/10 text-success",
};

const departments = ["Engineering", "Product", "Design", "Marketing", "Sales", "HR", "Finance", "Data"];
const locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Chicago, IL", "Remote"];
const jobTypes: Array<"full-time" | "part-time" | "contract" | "remote"> = ["full-time", "part-time", "contract", "remote"];

export function Jobs() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "" as Job["type"] | "",
    salary: "",
  });

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateJob = () => {
    if (!newJob.title.trim() || !newJob.department || !newJob.location || !newJob.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    const job: Job = {
      id: (jobs.length + 1).toString(),
      title: newJob.title.trim(),
      department: newJob.department,
      location: newJob.location,
      type: newJob.type as Job["type"],
      salary: newJob.salary || "Competitive",
      candidates: 0,
      daysOpen: 0,
      status: "active",
    };

    setJobs([job, ...jobs]);
    setNewJob({ title: "", department: "", location: "", type: "", salary: "" });
    setOpen(false);
    toast.success("Job created successfully!");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
          <p className="text-muted-foreground mt-1">Manage your open positions and job postings.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="glow" size="lg">
              <Plus className="h-4 w-4" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Senior React Developer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-department">Department *</Label>
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
              <div className="space-y-2">
                <Label htmlFor="job-location">Location *</Label>
                <Select
                  value={newJob.location}
                  onValueChange={(value) => setNewJob({ ...newJob, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-type">Job Type *</Label>
                <Select
                  value={newJob.type}
                  onValueChange={(value) => setNewJob({ ...newJob, type: value as Job["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-salary">Salary Range</Label>
                <Input
                  id="job-salary"
                  placeholder="e.g. $100k - $130k"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateJob} className="w-full">
                Create Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredJobs.map((job, index) => {
          const status = statusStyles[job.status];
          return (
            <div
              key={job.id}
              className="bg-card rounded-xl p-5 border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{job.department}</p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-accent transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={cn("text-xs", typeStyles[job.type])} variant="secondary">
                  {job.type}
                </Badge>
                <Badge className={cn("text-xs", status.bg, status.text)} variant="secondary">
                  {status.label}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{job.candidates} candidates</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{job.daysOpen}d</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
