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
        async function fetchAdminData() {
            try {
                const [metricsRes, usersRes] = await Promise.all([
                    fetch("http://localhost:5000/api/admin/metrics", { credentials: "include" }),
                    fetch("http://localhost:5000/api/admin/users", { credentials: "include" })
                ])

                if (!metricsRes.ok || !usersRes.ok) throw new Error("Failed to fetch admin data")

                setMetrics(await metricsRes.json())
                setUsersList(await usersRes.json())
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
                <Loader2 className="h-10 w-10 animate-spin text-destructive" />
            </div>
        )
    }

    if (errorMsg) {
        return <div className="text-destructive font-bold p-6">Error: {errorMsg}</div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
                <p className="text-muted-foreground mt-2">Monitor core system performance and user growth.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.totalUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Roadmaps</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.totalRoadmaps}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Activity (7d)</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{metrics?.recentRoadmaps} <span className="text-xs font-normal text-muted-foreground">roadmaps generated</span></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg API Response Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(metrics?.avgResponseTime || 0)} <span className="text-xs font-normal text-muted-foreground">ms</span></div>
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
                                        <tr key={u._id} className="border-b border-border hover:bg-muted/50 last:border-0">
                                            <td className="px-6 py-4 font-medium text-foreground">{u.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
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
