"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import ScenarioSimulator from "@/components/tools/ScenarioSimulator"

export default function ScenarioSimulatorPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 px-4 md:px-6 pb-20">
            {/* Header section with back button and title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                <Link href="/dashboard" className="w-fit">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-light">
                        Real-World Scenario Simulator
                    </h1>
                </div>
            </div>

            <p className="text-muted-foreground max-w-3xl text-sm md:text-base leading-relaxed">
                Step into high-stakes professional situations. Practice negotiations, conflict resolution, and technical leadership with our AI-driven culture simulator.
            </p>

            <ScenarioSimulator />
        </div>
    )
}
