"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getStudentClasses } from "@/app/actions/student-dashboard-actions";
import {
    BookOpen,
    UserCircle,
    GraduationCap,
    CalendarDays,
    AlertCircle,
    Loader2,
    ChevronRight,
    FileText,
    Sparkles
} from "lucide-react";

export default function StudentClassesPage() {
    const { data: session } = useSession();
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchClasses();
        }
    }, [session]);

    const fetchClasses = async () => {
        setLoading(true);
        if (!session?.user?.id) return;
        const res = await getStudentClasses(session.user.id);
        if (res.success && res.data) {
            setClasses(res.data);
        } else {
            setError(res.error || "Failed to load classes.");
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                    <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
                </div>
                <p className="text-sm font-bold text-slate-400 animate-pulse">Loading your classes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 p-6 rounded-3xl flex items-center gap-4 text-rose-700 border border-rose-200 max-w-2xl mx-auto mt-12 shadow-sm">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                    <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-1">Unable to load classes</h3>
                    <p className="text-sm font-medium opacity-80">{error}</p>
                </div>
            </motion.div>
        );
    }

    const colorPalette = [
        "from-blue-500 to-blue-600 shadow-blue-500/20 text-blue-50 bg-blue-50 text-blue-600",
        "from-indigo-500 to-indigo-600 shadow-indigo-500/20 text-indigo-50 bg-indigo-50 text-indigo-600",
        "from-emerald-500 to-emerald-600 shadow-emerald-500/20 text-emerald-50 bg-emerald-50 text-emerald-600",
        "from-purple-500 to-purple-600 shadow-purple-500/20 text-purple-50 bg-purple-50 text-purple-600",
        "from-rose-500 to-rose-600 shadow-rose-500/20 text-rose-50 bg-rose-50 text-rose-600",
        "from-amber-500 to-amber-600 shadow-amber-500/20 text-amber-50 bg-amber-50 text-amber-600"
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200"
            >
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" /> Active Semester
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">My Classes</h1>
                    <p className="text-slate-500 font-medium text-lg max-w-xl">
                        Your assigned subjects and faculty for the current academic year.
                    </p>
                </div>

                <div className="bg-white px-6 py-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="bg-slate-50 p-3 rounded-2xl text-slate-700 border border-slate-100">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Total Enrolled</p>
                        <p className="text-3xl font-black text-[#0F172A] leading-none">{classes.length} <span className="text-base font-bold text-slate-400">Subjects</span></p>
                    </div>
                </div>
            </motion.div>

            {classes.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
                >
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">No Classes Found</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">You are not currently assigned to any subjects for this academic year. Please contact your administrator.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {classes.map((cls, idx) => {
                            const theme = colorPalette[idx % colorPalette.length].split(' ');
                            const bgGradient = `${theme[0]} ${theme[1]}`;
                            const shadow = theme[2];
                            const textLight = theme[3];
                            const bgLight = theme[4];
                            const textDark = theme[5];

                            const mockScore = 80 + (cls.subject.id.length % 18);
                            const hasHomework = cls.activeAssignmentsCount > 0;

                            return (
                                <motion.div
                                    key={cls.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group flex flex-col relative"
                                >

                                    <div className={`p-8 bg-gradient-to-br ${bgGradient} relative overflow-hidden isolate`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none"></div>

                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <div className={`p-3.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-sm border border-white/20 text-white`}>
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div className="text-right">
                                                <div className="inline-block px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-white/90 mb-1.5 border border-white/10">
                                                    Current Average
                                                </div>
                                                <p className="text-3xl font-black text-white group-hover:scale-110 origin-right transition-transform duration-500">{mockScore}%</p>
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-black text-white tracking-tight line-clamp-1 mb-2 drop-shadow-sm">{cls.subject.name}</h3>
                                            <div className={`flex items-center gap-1.5 text-xs font-bold ${textLight} uppercase tracking-wider`}>
                                                <CalendarDays className="w-3.5 h-3.5" /> Full Academic Year
                                            </div>
                                        </div>
                                    </div>


                                    <div className="p-8 flex-1 flex flex-col relative bg-white">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Instructed By</p>
                                            <div className="flex items-center gap-4 group/teacher">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-sm group-hover/teacher:shadow-md transition-shadow">
                                                    {cls.teacher.user.name ? (
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cls.teacher.user.name}`} alt="avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserCircle className="w-full h-full text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold text-slate-800 group-hover/teacher:text-primary transition-colors">{cls.teacher.user.name}</p>
                                                    <p className="text-sm font-medium text-slate-500">{cls.teacher.user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-5 border-t border-slate-100 flex justify-between items-center text-sm font-bold">
                                            {hasHomework ? (
                                                <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>{cls.activeAssignmentsCount} Due</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                                                    <FileText className="w-4 h-4 relative -top-px" />
                                                    <span>No pending tasks</span>
                                                </div>
                                            )}
                                        </div>


                                        <Link
                                            href="/student/assignments"
                                            className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 text-white font-bold opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            View Assignments <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
