"use client"

import { useEffect, useState } from "react"
import { Users, FileText, Activity, Clock, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function AdminDashboardPage() {
    const [metrics, setMetrics] = useState(null)
    const [usersList, setUsersList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        function fetchAdminData() {
            try {
                const users = JSON.parse(localStorage.getItem('careerintel_all_users') || '[]');
                const roadmaps = JSON.parse(localStorage.getItem('careerintel_roadmaps') || '[]');

                // Calculate basic metrics from localStorage
                setMetrics({
                    totalUsers: users.length,
                    totalRoadmaps: roadmaps.length,
                    recentRoadmaps: roadmaps.filter(r => {
                        const date = new Date(r.createdAt);
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        return date > sevenDaysAgo;
                    }).length,
                    avgResponseTime: 120 // Static mock
                });

                setUsersList(users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                setErrorMsg(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAdminData()
    }, [])

    if (isLoading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-neon-cyan" />
            </div>
        )
    }

    if (errorMsg) {
        return <div className="text-destructive font-bold p-6">Error: {errorMsg}</div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-deep-purple">Platform Analytics</h1>
                <p className="text-slate-400 mt-2">Monitor core system performance and user growth.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-white/10 bg-slate-900/40 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-indigo-300">
                        <CardTitle className="text-sm font-bold">Total Users</CardTitle>
                        <Users className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{metrics?.totalUsers}</div>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-slate-900/40 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-indigo-300">
                        <CardTitle className="text-sm font-bold">Total Roadmaps</CardTitle>
                        <FileText className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{metrics?.totalRoadmaps}</div>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-slate-900/40 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-neon-cyan">
                        <CardTitle className="text-sm font-bold">Recent Activity (7d)</CardTitle>
                        <Activity className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">+{metrics?.recentRoadmaps} <span className="text-xs font-normal text-slate-400">generated</span></div>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-slate-900/40 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-deep-purple">
                        <CardTitle className="text-sm font-bold">Avg Response Time</CardTitle>
                        <Clock className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{Math.round(metrics?.avgResponseTime || 0)} <span className="text-xs font-normal text-slate-400">ms</span></div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">Recent Users</h2>
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Email</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                        <th className="px-6 py-4 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.slice(0, 10).map((u) => (
                                        <tr key={u.id || u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                                            <td className="px-6 py-4 text-slate-400">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-deep-purple/20 text-deep-purple border border-deep-purple/30' : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
