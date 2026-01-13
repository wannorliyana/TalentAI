import { useState, useEffect } from "react";
import { Search, Bell, Briefcase, Users, Brain, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";

const searchItems = {
  jobs: [
    { id: "1", title: "Senior React Developer", department: "Engineering" },
    { id: "2", title: "Product Manager", department: "Product" },
    { id: "3", title: "UX/UI Designer", department: "Design" },
    { id: "4", title: "DevOps Engineer", department: "Engineering" },
  ],
  candidates: [
    { id: "1", name: "Sarah Chen", role: "Senior Developer" },
    { id: "2", name: "Michael Park", role: "Product Designer" },
    { id: "3", name: "Emily Johnson", role: "Marketing Specialist" },
    { id: "4", name: "David Kim", role: "Data Analyst" },
  ],
  pages: [
    { id: "dashboard", title: "Dashboard", path: "/", icon: BarChart3 },
    { id: "jobs", title: "Jobs", path: "/jobs", icon: Briefcase },
    { id: "candidates", title: "Candidates", path: "/candidates", icon: Users },
    { id: "screening", title: "AI Screening", path: "/screening", icon: Brain },
  ],
};

export function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Search */}
      <div className="relative w-96">
        <button
          onClick={() => setOpen(true)}
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm text-muted-foreground text-left focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all hover:bg-accent"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          Search candidates, jobs, or insights...
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-xs text-muted-foreground bg-muted font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search candidates, jobs, or pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {searchItems.pages.map((page) => (
              <CommandItem
                key={page.id}
                onSelect={() => handleSelect(page.path)}
                className="cursor-pointer"
              >
                <page.icon className="mr-2 h-4 w-4" />
                {page.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Jobs">
            {searchItems.jobs.map((job) => (
              <CommandItem
                key={job.id}
                onSelect={() => handleSelect("/jobs")}
                className="cursor-pointer"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                <span>{job.title}</span>
                <span className="ml-2 text-muted-foreground text-xs">{job.department}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Candidates">
            {searchItems.candidates.map((candidate) => (
              <CommandItem
                key={candidate.id}
                onSelect={() => handleSelect("/candidates")}
                className="cursor-pointer"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>{candidate.name}</span>
                <span className="ml-2 text-muted-foreground text-xs">{candidate.role}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        
        <div className="h-8 w-px bg-border" />
        
        <div className="flex items-center gap-3 cursor-pointer hover:bg-accent rounded-lg px-2 py-1.5 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">John Doe</p>
            <p className="text-xs text-muted-foreground">HR Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}