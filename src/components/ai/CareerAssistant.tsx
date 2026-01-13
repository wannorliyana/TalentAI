import { useState } from "react";
import { MessageSquare, Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHRAI } from "@/hooks/useHRAI";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "How can I transition from developer to engineering manager?",
  "What skills should I learn for AI/ML career path?",
  "How to negotiate a higher salary in my next job?",
  "What certifications are valuable for data science?",
  "How to prepare for senior-level interviews?",
];

export function CareerAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { isLoading, askCareerInsight } = useHRAI();

  const handleSend = async (question?: string) => {
    const messageText = question || input.trim();
    if (!messageText) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const response = await askCareerInsight(messageText);
    if (response) {
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Chat Container */}
      <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-border gradient-primary">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-foreground/20">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">Career Insight Assistant</h3>
              <p className="text-sm text-primary-foreground/80">AI-powered career guidance</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-card-foreground mb-2">
                  How can I help with your career?
                </h4>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Ask me anything about career development, job transitions, skill building, or professional growth.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQuestions.map((question, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(question)}
                      className="text-left p-3 rounded-lg border border-border hover:bg-accent hover:border-primary/50 transition-all text-sm text-card-foreground"
                    >
                      <MessageSquare className="h-4 w-4 inline mr-2 text-primary" />
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="p-2 rounded-lg bg-primary/10 h-fit shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl p-4",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-card-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="p-2 rounded-lg bg-primary h-fit shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-accent rounded-xl p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-accent/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about career advice, skills, or job opportunities..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} variant="glow">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
