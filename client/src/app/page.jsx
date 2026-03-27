"use client";
import Link from"next/link";
import { ArrowRight, Sparkles, Target, Compass, TrendingUp, ShieldCheck, Zap, Users, Star, BarChart3, Globe, Linkedin, Github, MessageSquare, School } from"lucide-react";
import { Button } from"@/components/ui/Button";
import { Logo } from"@/components/ui/Logo";
import { MarqueeCards } from"@/components/MarqueeCards";

const features = [
  {
    icon: Target,
    color:"text-purple-400",
    bg:"bg-purple-500/10",
    title:"Personalized Roadmaps",
    desc:"AI-generated week-by-week plans tailored precisely to your skills, goals, and available time commitment.",
  },
  {
    icon: TrendingUp,
    color:"text-cyan-400",
    bg:"bg-cyan-500/10",
    title:"Market Intelligence",
    desc:"Real-time demand signals, salary benchmarks, and growth predictions for your chosen career path.",
  },
  {
    icon: BarChart3,
    color:"text-indigo-400",
    bg:"bg-indigo-500/10",
    title:"Skill Gap Analysis",
    desc:"Know exactly which skills you're missing and get a precise action plan to close the gap efficiently.",
  },
  {
    icon: ShieldCheck,
    color:"text-green-400",
    bg:"bg-green-500/10",
    title:"Resume Enhancement",
    desc:"ATS-optimized resume tailored to specific job descriptions using advanced NLP techniques.",
  },
  {
    icon: Zap,
    color:"text-orange-400",
    bg:"bg-orange-500/10",
    title:"AI Career Coach",
    desc:"Personalized mentor personas that give contextual guidance based on your exact profile and goals.",
  },
  {
    icon: Users,
    color:"text-pink-400",
    bg:"bg-pink-500/10",
    title:"Community Network",
    desc:"Connect with peers, find accountability partners, and learn from senior engineers in your field.",
  },
];

const stats = [
  { value:"50K+", label:"Career Roadmaps Generated" },
  { value:"93%", label:"User Satisfaction Rate" },
  { value:"12+", label:"AI Career Tools" },
  { value:"2.4x", label:"Faster Job Placement" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A] text-white font-sans">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-12 py-2 flex items-center justify-between bg-blue-950 border-b border-blue-900/50">
        <Link href="/" className="flex items-center">
          <Logo scale="sm" />
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-white/90">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#stats" className="hover:text-white transition-colors">Results</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors hidden sm:block">
            Sign in
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 rounded-lg shadow-lg shadow-purple-900/30 transition-all">
              Get Started Free
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 pb-28 overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs   mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Advanced AI — Built for ambitious techies
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold  mb-6 leading-tight">
              Navigate Your Career{""}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
                with Precision.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed">
              CareerIntel is your AI-powered command center. Generate personalized learning roadmaps,
              close skill gaps, ace interviews, and land your dream tech role — faster than ever before.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-13 px-8 text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl shadow-purple-900/40 rounded-xl transition-all hover:scale-105">
                  Start Free — No Credit Card <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-13 px-8 text-base border-white/15 text-white/80 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>

            <p className="text-white/35 text-xs mt-6">Join 50,000+ engineers already building with CareerIntel</p>
          </div>
        </section>

        {/* Stats Bar */}
        <section id="stats" className="border-y border-white/5 bg-white/2 py-10 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/90 text-xs   mb-5">
                <Star className="h-3 w-3 text-purple-400" /> Full Platform
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Everything you need to{""}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  accelerate your career
                </span>
              </h2>
              <p className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto">
                12 AI-powered tools working in sync to map your skills, close gaps, and get you hired faster.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => (
                <div
                  key={feature.title} className="group p-6 rounded-2xl border border-white/6 bg-white/3 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300 cursor-default"
                >
                  <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

            <MarqueeCards title="Strategic Ecosystems" subtitle="Master Your Presence Across Platforms"
                icon={Globe} iconColor="text-blue-400"
                items={[
                    { name: 'LinkedIn', description: 'The professional gold standard. Network with recruiters and showcase your career growth.', icon: Linkedin, label: 'Network', href: 'https://linkedin.com', gradient: 'from-blue-600 to-blue-800' },
                    { name: 'GitHub', description: 'Host your code, contribute to open source, and build your developer identity.', icon: Github, label: 'Portfolio', href: 'https://github.com', gradient: 'from-slate-700 to-slate-900' },
                    { name: 'Discord', description: 'Connect with peers in real-time. Join communities, share labs, and find study buddies.', icon: MessageSquare, label: 'Community', href: 'https://discord.com', gradient: 'from-indigo-500 to-indigo-700' },
                    { name: 'Polywork', description: 'Showcase what you do and who you work with. The next generation of professional profiles.', icon: Globe, label: 'Modern CV', href: 'https://polywork.com', gradient: 'from-purple-500 to-indigo-700' },
                    { name: 'Coursera', description: 'Free courses from top universities. Master data science, business, and tech skills.', icon: School, label: 'University', href: 'https://coursera.org', gradient: 'from-blue-500 to-indigo-600' },
                ]}
            />

        {/* CTA Banner */}
        <section className="py-16 px-4 sm:px-6 mx-4 sm:mx-8 lg:mx-12 mb-16 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 border border-purple-500/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent pointer-events-none" />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build your career strategy?
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-8">
              Get your personalized AI career roadmap in under 2 minutes. Free to start.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-12 px-10 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl shadow-xl transition-all hover:scale-105">
                Get Your Free Roadmap <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
          <Logo scale="sm" />
          <p className="text-white/35 text-sm">© 2025 CareerIntel. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/70">
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link href="/help-center" className="hover:text-white/70 transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
