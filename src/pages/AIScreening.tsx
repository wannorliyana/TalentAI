import { FileText, Users, DollarSign, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ATSScoreChecker } from "@/components/ai/ATSScoreChecker";
import { JobMatcher } from "@/components/ai/JobMatcher";
import { SalaryPredictor } from "@/components/ai/SalaryPredictor";
import { CareerAssistant } from "@/components/ai/CareerAssistant";

export function AIScreening() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">AI Recruitment Suite</h1>
        <p className="text-muted-foreground mt-1">
          Powered by LLMs for intelligent resume analysis, job matching, salary prediction, and career insights.
        </p>
      </div>

      {/* Feature Tabs */}
      <Tabs defaultValue="ats" className="animate-slide-up">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="ats" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">ATS Checker</span>
          </TabsTrigger>
          <TabsTrigger value="match" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Job Match</span>
          </TabsTrigger>
          <TabsTrigger value="salary" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Salary</span>
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Career AI</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ats">
          <ATSScoreChecker />
        </TabsContent>

        <TabsContent value="match">
          <JobMatcher />
        </TabsContent>

        <TabsContent value="salary">
          <SalaryPredictor />
        </TabsContent>

        <TabsContent value="career">
          <CareerAssistant />
        </TabsContent>
      </Tabs>
    </div>
  );
}
