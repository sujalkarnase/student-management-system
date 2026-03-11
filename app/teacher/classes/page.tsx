"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, CalendarDays, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { getTeacherClasses } from "@/app/actions/teacher-dashboard-actions";
import Link from "next/link";

export default function TeacherClassesPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchClasses();
        }
    }, [session]);

    const fetchClasses = async () => {
        setLoading(true);
        if (!session?.user?.id) return;
        const res = await getTeacherClasses(session.user.id);
        if (res.success && res.data) {
            setClasses(res.data);
        } else {
            setError(res.error || "Failed to load classes.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <BookOpen className="w-3 h-3" />
                        My Schedule
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Active Classes</h1>
                    <p className="text-slate-500 font-medium">A complete list of sections and subjects you are currently assigned to teach.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : error ? (
                <div className="bg-rose-50 p-6 rounded-2xl flex items-center gap-4 text-rose-700 border border-rose-200">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            ) : classes.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <CalendarDays className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Assignments Yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto">You have not been assigned to teach any classes for the current academic session. Please contact the administrator.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((assignment, idx) => {
                        const getSubjectColors = (subjectName: string) => {
                            const name = subjectName.toLowerCase();
                            if (name.includes('math')) return { bg: 'bg-blue-600', shadow: 'shadow-blue-500/30', lightTheme: 'bg-blue-50', hover: 'group-hover:bg-blue-100', text: 'text-blue-600' };
                            if (name.includes('science')) return { bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/30', lightTheme: 'bg-emerald-50', hover: 'group-hover:bg-emerald-100', text: 'text-emerald-500' };
                            if (name.includes('english') || name.includes('lang')) return { bg: 'bg-violet-500', shadow: 'shadow-violet-500/30', lightTheme: 'bg-violet-50', hover: 'group-hover:bg-violet-100', text: 'text-violet-500' };
                            if (name.includes('history') || name.includes('social')) return { bg: 'bg-amber-500', shadow: 'shadow-amber-500/30', lightTheme: 'bg-amber-50', hover: 'group-hover:bg-amber-100', text: 'text-amber-500' };
                            return { bg: 'bg-slate-800', shadow: 'shadow-slate-500/30', lightTheme: 'bg-slate-100', hover: 'group-hover:bg-slate-200', text: 'text-slate-800' };
                        };
                        const colors = getSubjectColors(assignment.subject.name);
                        const studentCount = assignment.section?._count?.enrollments || 0;

                        return (
                            <motion.div
                                key={assignment.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.05 * idx }}
                                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative flex flex-col h-full"
                            >

                                <div className={`absolute -top-6 -right-6 w-32 h-32 ${colors.lightTheme} rounded-full blur-2xl ${colors.hover} transition-colors pointer-events-none`}></div>

                                <div className="relative z-10 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-lg ${colors.shadow} group-hover:scale-110 transition-transform`}>
                                            {assignment.class.name}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] items-center gap-1 font-bold text-slate-400 uppercase tracking-widest mb-1 flex">
                                                <Users className="w-3 h-3" /> Students
                                            </span>
                                            <span className="text-xl text-slate-800 font-black">{studentCount}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Area</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section {assignment.section.name}</p>
                                            </div>
                                            <h3 className={`text-xl font-black ${colors.text}`}>{assignment.subject.name}</h3>
                                        </div>


                                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50">
                                            <Link href={`/teacher/attendance?class=${assignment.classId}&section=${assignment.sectionId}`} className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                                                <CalendarDays className="w-4 h-4 text-slate-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Attendance</span>
                                            </Link>
                                            <Link href={`/teacher/assignments?class=${assignment.classId}&section=${assignment.sectionId}`} className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                                                <BookOpen className="w-4 h-4 text-slate-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Homework</span>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-auto">
                                        <Link
                                            href={`/teacher/students?class=${assignment.classId}&section=${assignment.sectionId}`}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white hover:bg-primary rounded-xl font-bold transition-colors shadow-lg shadow-slate-200 hover:shadow-primary/20"
                                        >
                                            <Users className="w-4 h-4" />
                                            View Class Roster
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
