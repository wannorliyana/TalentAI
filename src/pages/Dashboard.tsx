import { Users, Briefcase, TrendingUp, Clock } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentCandidates } from "@/components/dashboard/RecentCandidates";
import { JobsPipeline } from "@/components/dashboard/JobsPipeline";
import { AIInsights } from "@/components/dashboard/AIInsights";

export function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your recruitment.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Candidates"
          value="1,284"
          change={{ value: 12, label: "vs last month" }}
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="Active Jobs"
          value="24"
          change={{ value: 8, label: "vs last month" }}
          icon={Briefcase}
          variant="success"
        />
        <StatsCard
          title="Hire Rate"
          value="68%"
          change={{ value: 5, label: "vs last month" }}
          icon={TrendingUp}
          variant="warning"
        />
        <StatsCard
          title="Avg. Time to Hire"
          value="18 days"
          change={{ value: -12, label: "vs last month" }}
          icon={Clock}
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentCandidates />
          <JobsPipeline />
        </div>
        <div>
          <AIInsights />
        </div>
      </div>
    </div>
  );
}
