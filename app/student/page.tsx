"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { getStudentDashboardData } from "@/app/actions/student-dashboard-actions";
import {
    BookOpen,
    Calendar,
    ChevronRight,
    Sparkles,
    Clock,
    GraduationCap,
    FileText,
    Download,
    Bell,
    CheckCircle2,
    Loader2
} from "lucide-react";

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchData();
        }
    }, [session]);

    const fetchData = async () => {
        setLoading(true);
        if (!session?.user?.id) return;
        const res = await getStudentDashboardData(session.user.id);
        if (res.success && res.data) {
            setData(res.data);
        } else {
            setError(res.error || "Failed to load dashboard.");
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return <div className="p-12 text-center text-rose-500 font-bold">{error}</div>;
    }

    if (!data) return null;

    const { student, enrollment, recentHomework, upcomingClasses, attendancePercentage, fauxGrades } = data;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white rounded-[2rem] p-8 md:p-12 overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between min-h-[360px]"
            >
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">New Semester Updates</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
                        Welcome back, <span className="text-primary italic">{student.user.name.split(' ')[0]}.</span>
                    </h1>

                    <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-lg">
                        Welcome to the new EduConnect Student Portal. Track your grades, manage upcoming assignments, and access course resources all in one place.
                    </p>


                </div>

                <div className="mt-12 md:mt-0 relative z-10 w-full md:w-[45%] h-full flex items-center justify-center">
                    <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-[2rem] border border-slate-200 flex flex-col items-center justify-center p-8 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 mb-4 z-10 border border-slate-100"
                        >
                            <GraduationCap className="w-16 h-16 text-primary" />
                        </motion.div>

                    </div>
                </div>

                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full blur-[60px] -translate-x-1/4 translate-y-1/4"></div>
            </motion.section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-2xl text-blue-500">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A]">Upcoming Classes</h2>
                                <p className="text-sm text-slate-400">Your schedule for the next 48 hours</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {upcomingClasses.length === 0 ? (
                            <p className="text-sm text-slate-400 pl-4">No classes scheduled.</p>
                        ) : upcomingClasses.map((ac: any, idx: number) => (
                            <div key={ac.id} className="relative pl-10 flex items-center justify-between group">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-blue-500 z-10 group-hover:scale-110 transition-transform"></div>
                                <div className="flex-1 space-y-1">
                                    <h4 className="text-sm font-bold text-slate-800">{ac.subject.name}</h4>
                                    <p className="text-xs text-slate-500">{ac.teacher.user.name}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Per {idx + 1}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-500">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A]">Grades Overview</h2>
                                <p className="text-sm text-slate-400">Semester-to-date performance tracking</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="text-4xl font-extrabold text-[#0F172A]">{attendancePercentage}%</span>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Term Attendance</p>
                        </div>
                        <div className="text-right">
                            <span className="text-emerald-500 font-bold text-sm">Excellent</span>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Standing</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {fauxGrades.length === 0 ? (
                            <p className="text-sm text-slate-400">No grades recorded yet.</p>
                        ) : fauxGrades.slice(0, 3).map((subject: any, idx: number) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span className="text-slate-500">{subject.name}</span>
                                    <span className="text-[#0F172A]">{subject.score}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${subject.score}%` }}
                                        transition={{ delay: 0.5 + (idx * 0.1), duration: 0.8 }}
                                        className={`h-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-indigo-400' : 'bg-emerald-500'} rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-rose-50 p-3 rounded-2xl text-rose-500">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A]">Assignments Due</h2>
                                <p className="text-sm text-slate-400">Pending tasks and upcoming deadlines</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {recentHomework.length === 0 ? (
                            <div className="text-center py-6 text-sm text-slate-400">No upcoming assignments.</div>
                        ) : recentHomework.map((task: any, idx: number) => (
                            <div key={task.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer group">
                                <div className={`w-2 h-2 rounded-full ${idx % 2 === 0 ? 'bg-rose-500' : 'bg-amber-400'}`}></div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-primary transition-colors line-clamp-1">{task.title}</h4>
                                    <p className="text-xs text-slate-400">{task.subject.name} • {new Date(task.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    );
}