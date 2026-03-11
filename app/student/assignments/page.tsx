"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { getStudentAssignments } from "@/app/actions/student-dashboard-actions";
import { 
    BookOpen, 
    Calendar, 
    Clock,
    AlertCircle,
    Loader2,
    CheckCircle2,
    FileText,
    Sparkles,
    CalendarClock
} from "lucide-react";

export default function StudentAssignmentsPage() {
    const { data: session } = useSession();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchAssignments();
        }
    }, [session]);

    const fetchAssignments = async () => {
        setLoading(true);
        if(!session?.user?.id) return;
        const res = await getStudentAssignments(session.user.id);
        if (res.success && res.data) {
             setAssignments(res.data);
        } else {
             setError(res.error || "Failed to load assignments.");
        }
        setLoading(false);
    };

    const getRelativeDateString = (dueDate: Date) => {
        const now = new Date();
        now.setHours(0,0,0,0);
        const due = new Date(dueDate);
        due.setHours(0,0,0,0);
        
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Due Today";
        if (diffDays === 1) return "Due Tomorrow";
        if (diffDays > 1) return `Due in ${diffDays} days`;
        if (diffDays === -1) return "1 day overdue";
        return `${Math.abs(diffDays)} days overdue`;
    };

    if (loading) {
         return (
             <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                 <div className="relative">
                     <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                     <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
                 </div>
                 <p className="text-sm font-bold text-slate-400 animate-pulse">Loading assignments...</p>
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
                     <h3 className="font-bold text-lg mb-1">Unable to load assignments</h3>
                     <p className="text-sm font-medium opacity-80">{error}</p>
                 </div>
             </motion.div>
         );
    }

    const now = new Date();
    const activeTasks = assignments.filter(a => new Date(a.dueDate) >= now);
    const pastDueTasks = assignments.filter(a => new Date(a.dueDate) < now);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200"
            >
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" /> Action Required
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">Assignments</h1>
                    <p className="text-slate-500 font-medium text-lg max-w-xl">
                        Your central hub for tracking active coursework and upcoming deadlines.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 p-3 rounded-2xl text-white">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Pending Tasks</p>
                            <p className="text-3xl font-black text-[#0F172A] leading-none">{activeTasks.length}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {assignments.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
                >
                    <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">You're all caught up!</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">There are no pending assignments or missed deadlines for your enrolled classes.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Active Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white">
                                <span className="font-bold text-base">{activeTasks.length}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pending & Upcoming</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">To-do List</p>
                            </div>
                        </div>
                        
                        {activeTasks.length === 0 ? (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center">
                                <p className="text-slate-500 font-medium">No pending tasks ahead.</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <AnimatePresence>
                                    {activeTasks.map((task, idx) => {
                                        const dateLabel = getRelativeDateString(task.dueDate);
                                        const isToday = dateLabel === "Due Today";
                                        
                                        return (
                                            <motion.div 
                                                key={task.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className={`bg-white p-7 rounded-[2.5rem] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                                                    isToday ? 'border-amber-200' : 'border-slate-100'
                                                }`}
                                            >
                                                {isToday && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>}
                                                
                                                <div className="flex justify-between items-start mb-5">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                                                        isToday ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
                                                    }`}>
                                                        <Clock className="w-3.5 h-3.5" /> 
                                                        {dateLabel}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                                                        <CalendarClock className="w-3.5 h-3.5" />
                                                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-primary transition-colors pr-4">{task.title}</h3>
                                                <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-2 leading-relaxed">{task.description}</p>
                                                
                                                <div className="flex items-center gap-4 pt-5 border-t border-slate-100">
                                                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 shadow-inner">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="text-sm font-black text-slate-700 block">{task.subject.name}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.teacher.user.name}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Past Due Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/20 flex items-center justify-center text-white opacity-90">
                                <span className="font-bold text-base">{pastDueTasks.length}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Past Due</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Missed Deadlines</p>
                            </div>
                        </div>
                        
                        {pastDueTasks.length === 0 ? (
                            <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[2rem] p-8 text-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                <p className="text-emerald-700 font-bold text-sm">Clean slate! No missed deadlines.</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <AnimatePresence>
                                    {pastDueTasks.map((task, idx) => {
                                        const dateLabel = getRelativeDateString(task.dueDate);
                                        
                                        return (
                                            <motion.div 
                                                key={task.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="bg-slate-50/50 p-7 rounded-[2.5rem] border border-rose-100 shadow-sm opacity-80 hover:opacity-100 hover:shadow-md transition-all group overflow-hidden relative"
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
                                                
                                                <div className="flex justify-between items-start mb-5 pl-2">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                        <AlertCircle className="w-3.5 h-3.5" /> 
                                                        {dateLabel}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500/70 bg-rose-50 px-3 py-1 rounded-full">
                                                        <CalendarClock className="w-3.5 h-3.5" />
                                                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-3 pl-2 line-through opacity-90">{task.title}</h3>
                                                <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-2 leading-relaxed pl-2">{task.description}</p>
                                                
                                                <div className="flex items-center gap-4 pt-5 border-t border-slate-200/60 pl-2">
                                                    <div className="p-2.5 bg-white rounded-xl text-slate-400 border border-slate-100">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="text-sm font-bold text-slate-600 block">{task.subject.name}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.teacher.user.name}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
