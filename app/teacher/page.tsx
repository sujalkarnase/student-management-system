"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, BarChart3, Calendar, BookOpen, Clock, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { getTeacherDashboardData } from "@/app/actions/teacher-dashboard-actions";
import Link from "next/link";

export default function TeacherDashboard() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        stats: { totalClasses: number };
        upcomingHomework: any[];
        assignedClasses: any[];
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchDashboardData();
        }
    }, [session]);

    const fetchDashboardData = async () => {
        setLoading(true);
        if (!session?.user?.id) return;
        const res = await getTeacherDashboardData(session.user.id);
        if (res.success && res.stats) {
            setData({
                stats: res.stats,
                upcomingHomework: res.upcomingHomework || [],
                assignedClasses: res.assignedClasses || []
            });
        } else {
            setError(res.error || "Failed to load dashboard data.");
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compiling Dashboard Overview...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 border border-rose-200 p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
                <AlertCircle className="w-12 h-12 text-rose-500" />
                <p className="text-xl font-bold text-rose-700">{error}</p>
            </div>
        );
    }

    const unqiueSubjectsCount = new Set(data?.assignedClasses.map(ac => ac.subject.name)).size || 0;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-12">

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white rounded-[2rem] p-8 md:p-10 overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-start justify-between gap-6"
            >
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                            <Sparkles className="w-3 h-3" /> Teacher Portal
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4 tracking-tight">
                        Welcome back, Professor!
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium">
                        Here is an overview of your active classes, assigned subjects, and upcoming homework deadlines for the current academic session.
                    </p>
                </div>

                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 translate-y-[-50%] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full blur-[80px] translate-x-[-30%] translate-y-[30%] pointer-events-none"></div>
            </motion.section>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Assigned Classes", value: data?.stats?.totalClasses || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500", light: "bg-blue-50" },
                    { title: "Active Subjects", value: unqiueSubjectsCount, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500", light: "bg-emerald-50" },
                    { title: "Upcoming Deadlines", value: data?.upcomingHomework.length || 0, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500", light: "bg-amber-50" },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow"
                    >
                        <div className={`${stat.bg} p-4 rounded-2xl text-white shadow-lg`}>
                            <stat.icon className={`w-6 h-6`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Your Classes</h2>
                        <Link href="/teacher/classes" className="text-sm font-bold text-primary hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data?.assignedClasses.slice(0, 4).map((ac, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-lg shrink-0">
                                    {ac.class.name}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-1">{ac.subject.name}</h4>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded">Sec {ac.section.name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data?.assignedClasses.length === 0 && (
                            <div className="col-span-2 p-8 text-center text-slate-400 font-medium">You have not been assigned to any classes yet.</div>
                        )}
                    </div>
                </div>


                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Deadlines</h2>
                        <Link href="/teacher/assignments" className="text-sm font-bold text-primary hover:underline">Manage</Link>
                    </div>
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-2">
                        {data?.upcomingHomework.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                                <p className="text-sm text-slate-500 font-medium">No upcoming homework deadlines. You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {data?.upcomingHomework.map((hw, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{hw.title}</h4>
                                            <span className="text-[10px] font-bold px-2 py-1 bg-rose-50 text-rose-600 rounded-lg whitespace-nowrap">
                                                {new Date(hw.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                                            <span>{hw.subject.name} • Class {hw.class.name} {hw.section.name}</span>
                                            <Clock className="w-3 h-3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { CheckCircle2 } from "lucide-react";