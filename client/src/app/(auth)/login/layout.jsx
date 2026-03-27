// Server component — only exports metadata; no"use client" directive
export const metadata = {
    title:"Sign In",
    description:"Sign in to your CareerIntel account and access your AI-powered career roadmaps, skill gap analysis, and career coaching tools.",
};

export default function LoginLayout({ children }) {
    return children;
}
