import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  type: "trend" | "alert" | "suggestion";
  title: string;
  description: string;
}

const mockInsights: Insight[] = [
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
      <div className="divide-y divide-border">
        {mockInsights.map((insight, index) => {
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
        <button className="w-full py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all">
          Run AI Analysis
        </button>
      </div>
    </div>
  );
}
