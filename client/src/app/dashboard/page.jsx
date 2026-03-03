"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Compass, FileText, Loader2, ArrowRight, Trash2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default function DashboardPage() {
    const { user } = useAuth()

    const [roadmaps, setRoadmaps] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        function fetchRoadmaps() {
            try {
                const savedRoadmaps = JSON.parse(localStorage.getItem('careerintel_roadmaps') || '[]');
                // Filter roadmaps belonging to the current user (if user is logged in)
                const userRoadmaps = savedRoadmaps.filter(r => r.userId === user?.id);
                setRoadmaps(userRoadmaps);
            } catch (error) {
                console.error("Error fetching roadmaps", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (user?.id) {
            fetchRoadmaps();
        } else {
            setIsLoading(false);
        }
    }, [user?.id]);

    const handleDelete = (id, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!confirm("Are you sure you want to delete this roadmap?")) return;

        try {
            const allRoadmaps = JSON.parse(localStorage.getItem('careerintel_roadmaps') || '[]');
            const updatedRoadmaps = allRoadmaps.filter(r => r._id !== id);
            localStorage.setItem('careerintel_roadmaps', JSON.stringify(updatedRoadmaps));

            setRoadmaps((prevRoadmaps) => prevRoadmaps.filter((r) => r._id !== id));
        } catch (error) {
            console.error("Error deleting roadmap:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-deep-purple drop-shadow-sm">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back, {user?.name}. Here are your career intelligence insights.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-neon-cyan/10 via-deep-purple/10 to-neon-cyan/5 border-neon-cyan/20 shadow-[0_0_15px_rgba(0,243,255,0.05)]">
                    <CardHeader>
                        <CardTitle>AI Career Intelligence</CardTitle>
                        <CardDescription>Generate a highly personalized roadmap tailored to your skills and goals.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center py-6">
                        <Compass className="h-20 w-20 text-neon-cyan opacity-80 drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]" />
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/generate" className="w-full">
                            <Button className="w-full bg-deep-purple hover:bg-deep-purple/80 text-white shadow-[0_0_20px_rgba(112,0,255,0.3)] transition-all duration-300">
                                Generate New Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                {isLoading ? (
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : roadmaps.length === 0 ? (
                    <Card className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mb-4 opacity-50" />
                        <p>You haven't generated any roadmaps yet.</p>
                        <p className="text-sm">Click "Generate New Roadmap" to get started.</p>
                    </Card>
                ) : (
                    roadmaps.map((roadmap) => (
                        <Card key={roadmap._id} className="group hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all duration-300 relative bg-slate-900/40 backdrop-blur-md">
                            <div className="absolute top-4 right-4 z-10">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDelete(roadmap._id, e);
                                    }}
                                    title="Delete Roadmap"
                                >
                                    <Trash2 className="h-4 w-4 pointer-events-none" />
                                </Button>
                            </div>
                            <CardHeader>
                                <CardTitle className="truncate pr-8">{roadmap.careerTitle}</CardTitle>
                                <CardDescription className="line-clamp-2">{roadmap.careerSummary}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Link href={`/dashboard/roadmap/${roadmap._id}`} className="w-full">
                                    <Button variant="outline" className="w-full border-neon-cyan/30 group-hover:bg-neon-cyan group-hover:text-black transition-all duration-500 font-bold">
                                        View Roadmap
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
