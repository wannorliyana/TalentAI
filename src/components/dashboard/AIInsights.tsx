import { useState } from "react";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Insight {
  id: string;
  type: "trend" | "alert" | "suggestion";
  title: string;
  description: string;
}

const defaultInsights: Insight[] = [
  {
    id: "1",
    type: "trend",
    title: "High-quality candidate surge",
    description: "45% increase in qualified applicants for engineering roles this week.",
  },
  {
    id: "2",
    type: "alert",
    title: "Position needs attention",
    description: "Product Manager role has been open for 21 days with declining applications.",
  },
  {
    id: "3",
    type: "suggestion",
    title: "Optimize job description",
    description: "Adding salary range could increase applications by up to 30%.",
  },
];

const typeConfig = {
  trend: {
    icon: TrendingUp,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  alert: {
    icon: AlertCircle,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  suggestion: {
    icon: Lightbulb,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
};

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>(defaultInsights);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    toast.info("Running AI analysis...");

    try {
      const { data, error } = await supabase.functions.invoke("hr-ai-analyze", {
        body: {
          type: "dashboard_insights",
          dashboardData: {
            totalCandidates: 48,
            activeJobs: 12,
            interviewsScheduled: 8,
            recentActivity: [
              "5 new applications today",
              "3 interviews completed",
              "2 offers extended",
            ],
          },
        },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (error.message?.includes("402")) {
          toast.error("Usage limit reached. Please add credits.");
        } else {
          throw error;
        }
        return;
      }

      if (data?.result?.insights) {
        const newInsights: Insight[] = data.result.insights.map(
          (insight: { type: string; title: string; description: string }, index: number) => ({
            id: `ai-${index}`,
            type: insight.type as "trend" | "alert" | "suggestion",
            title: insight.title,
            description: insight.description,
          })
        );
        setInsights(newInsights);
        setSummary(data.result.summary || null);
        toast.success("AI analysis complete!");
      }
    } catch (error) {
      console.error("AI analysis error:", error);
      toast.error("Failed to run AI analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden animate-slide-up">
      <div className="p-6 border-b border-border gradient-primary">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-foreground/20">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-foreground">AI Insights</h3>
            <p className="text-sm text-primary-foreground/80">Powered by intelligent analysis</p>
          </div>
        </div>
      </div>

      {summary && (
        <div className="p-4 bg-accent/30 border-b border-border">
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
      )}

      <div className="divide-y divide-border">
        {insights.map((insight, index) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <div
              key={insight.id}
              className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-3">
                <div className={cn("p-2 rounded-lg shrink-0 h-fit", config.iconBg)}>
                  <Icon className={cn("h-4 w-4", config.iconColor)} />
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-border bg-accent/30">
        <button
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className="w-full py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Run AI Analysis"
          )}
        </button>
      </div>
    </div>
  );
}
