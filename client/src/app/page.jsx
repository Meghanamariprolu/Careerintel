import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Target, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
          <span className="text-xl font-bold tracking-tight text-neon-cyan">CareerIntel</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
          <Link href="/register">
            <Button size="sm" className="bg-neon-cyan text-black hover:bg-neon-cyan/80 font-bold">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-background/80">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-sm font-medium text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.1)]">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Career Roadmaps
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Navigate your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-deep-purple drop-shadow-sm">precision</span>.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate personalized, actionable learning roadmaps tailored to your skills, goals, and target role using advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base bg-deep-purple hover:bg-deep-purple/80 text-white shadow-[0_0_20px_rgba(112,0,255,0.3)] font-bold">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          <div className="space-y-4 p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <Target className="h-10 w-10 text-neon-cyan" />
            <h3 className="text-xl font-bold">Personalized Plans</h3>
            <p className="text-muted-foreground">Detailed week-by-week learning schedules customized to your precise time commitment and experience level.</p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <Compass className="h-10 w-10 text-deep-purple" />
            <h3 className="text-xl font-bold">Market Intelligence</h3>
            <p className="text-muted-foreground">Real-time insights on market demand, salary expectations, and future growth predictions for your chosen path.</p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <Sparkles className="h-10 w-10 text-neon-cyan" />
            <h3 className="text-xl font-bold">Actionable Steps</h3>
            <p className="text-muted-foreground">Clear milestones, recommended portfolio projects, and curated technical and soft skills to focus on.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
