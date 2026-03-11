"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    UsersRound,
    Briefcase,
    BookOpen,
    CalendarCheck,
    TrendingUp,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    BarChart3,
    ArrowUpRight,
    Loader2
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { getAdminDashboardData } from "./actions";

interface DashboardData {
    stats: {
        totalStudents: number;
        totalTeachers: number;
        activeClasses: number;
        attendanceRate: string;
    };
    recentUsers: {
        id: string;
        name: string;
        role: string;
        email: string | null;
        date: string;
    }[];
    enrollmentTrends: {
        name: string;
        students: number;
    }[];
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await getAdminDashboardData();
                if (response.success && response.data) {
                    setData(response.data as DashboardData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { label: "Total Students", value: data?.stats.totalStudents || 0, icon: UsersRound, color: "text-blue-500", bg: "bg-blue-50", trend: "+12%" },
        { label: "Total Teachers", value: data?.stats.totalTeachers || 0, icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-50", trend: "+4%" },
        { label: "Active Classes", value: data?.stats.activeClasses || 0, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50", trend: "Stable" },
        { label: "Attendance Rate", value: data?.stats.attendanceRate || "0%", icon: CalendarCheck, color: "text-rose-500", bg: "bg-rose-50", trend: "+2%" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-12 px-4 sm:px-6 lg:px-8">
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white rounded-[2rem] p-6 sm:p-8 md:p-12 overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row items-center justify-between min-h-[360px] gap-8 lg:gap-0"
            >
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Admin Control Center</span>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4 sm:mb-6">
                        Manage Your Institution <span className="text-primary italic">Effectively.</span>
                    </h1>

                    <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg">
                        Welcome to the Smart School Administrator Portal. Monitor academic performance, manage user accounts, and oversee institutional operations from a central hub.
                    </p>
                </div>

                <div className="relative z-10 w-full lg:w-[45%] xl:w-1/2 h-full flex items-center justify-center">
                    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] bg-slate-50 rounded-[2rem] border-2 border-slate-100 flex flex-col shadow-sm overflow-hidden p-4 sm:p-6 z-20 bg-white/60 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-[#0F172A]">Enrollment Trends</h3>
                                <p className="text-xs text-slate-400">Past 6 months</p>
                            </div>
                            <div className="bg-emerald-50 p-2 rounded-xl">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                        </div>

                        <div className="flex-1 w-full relative min-h-[250px] sm:min-h-[300px] lg:min-h-[200px]">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : data?.enrollmentTrends && data.enrollmentTrends.length > 0 ? (
                                <div className="absolute inset-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data.enrollmentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94A3B8', fontSize: 10 }}
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#94A3B8', fontSize: 10 }}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="students"
                                                stroke="#4F46E5"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#4F46E5' }}
                                                activeDot={{ r: 6, fill: '#4F46E5', strokeWidth: 0 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                    <p className="text-sm">No trend data available</p>
                                </div>
                            )}
                        </div>

                        {/* <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-4 z-30"
                        >
                            <div className="bg-emerald-50 p-2 rounded-xl">
                                <Sparkles className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance</p>
                                <p className="text-sm font-bold text-[#0F172A]">System Healthy</p>
                            </div>
                        </motion.div> */}
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full blur-[60px] -translate-x-1/4 translate-y-1/4"></div>
            </motion.section>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                    >
                        {loading && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.trend.includes("+") ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-[#0F172A]">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-2xl text-blue-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A]">Recent Registrations</h2>
                                <p className="text-sm text-slate-400">Newly enrolled students and staff</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 relative min-h-[160px]">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/3 bg-slate-200 rounded-full animate-pulse"></div>
                                        <div className="h-3 w-1/4 bg-slate-100 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            ))
                        ) : data?.recentUsers.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                <Users className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm font-medium">No recent registrations</p>
                            </div>
                        ) : (
                            data?.recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 transition-colors hover:bg-slate-50 group">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <p className="text-sm font-bold text-[#0F172A] truncate">{user.name}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${user.role === 'STUDENT' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs text-slate-500 truncate">{user.email || 'No email'}</p>
                                            <p className="text-xs text-slate-400 whitespace-nowrap">
                                                {new Date(user.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-500">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A]">System Health</h2>
                                <p className="text-sm text-slate-400">Server status and background tasks</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { name: "Database", status: "Operational", color: "bg-emerald-500" },
                            { name: "File Storage", status: "Operational", color: "bg-emerald-500" },
                            { name: "Auth Service", status: "Operational", color: "bg-emerald-500" }
                        ].map((service, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${service.color} animate-pulse`}></div>
                                    <span className="text-sm font-bold text-slate-600">{service.name}</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-md">{service.status}</span>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    );
}