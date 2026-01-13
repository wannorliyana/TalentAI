import { useState } from "react";
import { DollarSign, TrendingUp, Lightbulb, Loader2, MapPin, Briefcase, Clock, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHRAI, SalaryPrediction } from "@/hooks/useHRAI";
import { cn } from "@/lib/utils";

export function SalaryPredictor() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [result, setResult] = useState<SalaryPrediction | null>(null);
  const { isLoading, predictSalary } = useHRAI();

  const handlePredict = async () => {
    if (!jobTitle.trim()) return;
    const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    const prediction = await predictSalary(jobTitle, location, experience, skills);
    if (prediction) setResult(prediction);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Salary Predictor</h3>
              <p className="text-sm text-muted-foreground">Get AI-powered salary estimates based on market data</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Job Title *
              </label>
              <Input
                placeholder="e.g., Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </label>
              <Input
                placeholder="e.g., San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Years of Experience
              </label>
              <Input
                placeholder="e.g., 5 years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                Key Skills (comma-separated)
              </label>
              <Input
                placeholder="e.g., React, TypeScript, Node.js"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handlePredict}
            disabled={isLoading || !jobTitle.trim()}
            className="w-full"
            variant="glow"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Predict Salary
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Salary Range */}
          <div className="bg-card rounded-xl border border-border/50 shadow-soft p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Predicted Salary Range</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Minimum</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {formatCurrency(result.predictedSalary.min, result.predictedSalary.currency)}
                </p>
              </div>
              <div className="text-center bg-primary/10 px-8 py-4 rounded-xl">
                <p className="text-sm text-primary font-medium mb-1">Median</p>
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(result.predictedSalary.median, result.predictedSalary.currency)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Maximum</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(result.predictedSalary.max, result.predictedSalary.currency)}
                </p>
              </div>
            </div>

            {/* Visual Range Bar */}
            <div className="mt-6 relative">
              <div className="h-3 rounded-full bg-gradient-to-r from-muted via-primary to-success" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Entry Level</span>
                <span>Market Rate</span>
                <span>Top Tier</span>
              </div>
            </div>
          </div>

          {/* Salary Factors */}
          <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
            <h4 className="font-semibold text-card-foreground mb-4">Salary Impact Factors</h4>
            <div className="space-y-3">
              {result.factors.map((factor, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-bold",
                    factor.impact.startsWith("+") ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                  )}>
                    {factor.impact}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{factor.factor}</p>
                    <p className="text-sm text-muted-foreground">{factor.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
            <h4 className="font-semibold text-card-foreground flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              Market Insights
            </h4>
            <p className="text-muted-foreground">{result.marketInsights}</p>
          </div>

          {/* Negotiation Tips & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
              <h4 className="font-semibold text-card-foreground flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-warning" />
                Negotiation Tips
              </h4>
              <ul className="space-y-2">
                {result.negotiationTips.map((tip, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {tip}</li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border/50 shadow-soft p-5">
              <h4 className="font-semibold text-card-foreground mb-3">Expected Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {result.benefits.map((benefit, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
