"use client";

import React from "react";
import { motion } from "framer-motion";
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
    CheckCircle2
} from "lucide-react";

export default function StudentDashboard() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Hero Banner Section */}
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
                        Your Learning Journey, <span className="text-primary italic">Simplified.</span>
                    </h1>

                    <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-lg">
                        Welcome to the new EduConnect Student Portal. Track your grades, manage upcoming assignments, and access course resources all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 group">
                            View My Courses
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="bg-white text-slate-600 border border-slate-200 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                            Download Schedule
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-12 md:mt-0 relative z-10 w-full md:w-[45%] h-full flex items-center justify-center">
                    <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8">
                        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                            <BookOpen className="w-12 h-12 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-medium text-sm text-center">Interactive course viewer coming soon...</p>

                        {/* Interactive status floating card */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-4"
                        >
                            <div className="bg-emerald-50 p-2 rounded-xl">
                                <GraduationCap className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                <p className="text-sm font-bold text-[#0F172A]">94% GPA Potential</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full blur-[60px] -translate-x-1/4 translate-y-1/4"></div>
            </motion.section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Classes Card */}
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
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Coming Soon</span>
                    </div>

                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative pl-10 flex items-center justify-between group">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-blue-500 z-10 group-hover:scale-110 transition-transform"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/3 bg-slate-100 rounded-full animate-pulse"></div>
                                    <div className="h-2 w-1/2 bg-slate-50 rounded-full"></div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{10 + i}:00 AM</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Grades Overview Card */}
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
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Coming Soon</span>
                    </div>

                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="text-4xl font-extrabold text-[#0F172A]">A-</span>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cumulative GPA</p>
                        </div>
                        <div className="text-right">
                            <span className="text-emerald-500 font-bold text-sm">+4% from last month</span>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Top 15% of class</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { name: "Advanced Mathematics", score: 92, color: "bg-blue-500" },
                            { name: "World History", score: 88, color: "bg-indigo-400" },
                            { name: "Computer Science", score: 95, color: "bg-emerald-500" }
                        ].map((subject, idx) => (
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
                                        className={`h-full ${subject.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Assignments Due Card */}
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
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Coming Soon</span>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: "Lab Report: Chemical Bonds", due: "Today, 11:59 PM", color: "bg-rose-500" },
                            { title: "History Essay: Industrial Revolution", due: "Tomorrow, 5:00 PM", color: "bg-amber-400" },
                            { title: "Algebra Set #14", due: "Oct 24, 2023", color: "bg-slate-200" }
                        ].map((task, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer group">
                                <div className={`w-2 h-2 rounded-full ${task.color}`}></div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-primary transition-colors">{task.title}</h4>
                                    <p className="text-xs text-slate-400">{task.due}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Resource Library Card */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-teal-50 p-3 rounded-2xl text-teal-600">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A]">Resource Library</h2>
                                <p className="text-sm text-slate-400">Quick access to study materials and links</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Coming Soon</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center gap-3 aspect-video group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                                <div className="bg-white p-2 rounded-xl border border-slate-200 text-slate-400 group-hover:text-primary group-hover:border-primary/20 transition-all">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="h-1.5 w-1/2 bg-slate-200/50 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>

            {/* Notification System Coming Soon */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="bg-slate-50/50 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-100 mt-8"
            >
                <div className="bg-white w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                    <Bell className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-4">Notifications System</h3>
                <p className="text-slate-500 max-w-lg mx-auto mb-8">
                    Stay tuned! We're building a comprehensive notification system to keep you informed about grade releases, schedule changes, and school announcements.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="bg-white border border-slate-100 px-4 py-2 rounded-full">Push Alerts</span>
                    <span className="bg-white border border-slate-100 px-4 py-2 rounded-full">Email Digests</span>
                    <span className="bg-white border border-slate-100 px-4 py-2 rounded-full">SMS Opt-in</span>
                </div>
            </motion.section>
        </div>
    );
}