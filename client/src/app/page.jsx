import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Target, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary">CareerIntel</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-background/80">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Career Roadmaps
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Navigate your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">precision</span>.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate personalized, actionable learning roadmaps tailored to your skills, goals, and target role using advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          <div className="space-y-4 p-6 rounded-2xl border border-border bg-card/50">
            <Target className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-bold">Personalized Plans</h3>
            <p className="text-muted-foreground">Detailed week-by-week learning schedules customized to your precise time commitment and experience level.</p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl border border-border bg-card/50">
            <Compass className="h-10 w-10 text-indigo-400" />
            <h3 className="text-xl font-bold">Market Intelligence</h3>
            <p className="text-muted-foreground">Real-time insights on market demand, salary expectations, and future growth predictions for your chosen path.</p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl border border-border bg-card/50">
            <Sparkles className="h-10 w-10 text-yellow-400" />
            <h3 className="text-xl font-bold">Actionable Steps</h3>
            <p className="text-muted-foreground">Clear milestones, recommended portfolio projects, and curated technical and soft skills to focus on.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
