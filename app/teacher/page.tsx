"use client";

import { motion } from "framer-motion";
import {
    Users,
    BarChart3,
    Calendar,
    BookOpen,
    ChevronRight,
    ArrowRight,
    Sparkles
} from "lucide-react";

export default function TeacherDashboard() {
    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white rounded-[2rem] p-10 overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between"
            >
                <div className="relative z-10 max-w-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Coming Soon</span>
                        <span className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> v2.0 Preview
                        </span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-[#0F172A] leading-tight mb-4">
                        The future of classroom management.
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        We're building a smarter way for you to track attendance, manage assignments, and engage with your students. Get ready for a seamless educational experience.
                    </p>
                </div>

                <div className="mt-8 md:mt-0 relative z-10">
                    <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center gap-3 group">
                        Notify Teachers
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 text-center">
                        Join 1,200+ educators waiting
                    </p>
                </div>

                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 translate-y-[-50%]"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full blur-[80px] translate-x-[-30%] translate-y-[30%]"></div>
            </motion.section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    { icon: Users, title: "Class List & Management", color: "text-blue-500", bg: "bg-blue-50" },
                    { icon: BarChart3, title: "Attendance Analytics", color: "text-emerald-500", bg: "bg-emerald-50" },
                    { icon: BookOpen, title: "Assignment Workflow", color: "text-indigo-500", bg: "bg-indigo-50" },
                    { icon: Calendar, title: "Smart Academic Schedule", color: "text-amber-500", bg: "bg-amber-50" },
                ].map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx }}
                        className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg shadow-slate-100/50 group hover:border-primary/20 transition-all"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`${feature.bg} p-4 rounded-2xl`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upcoming</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            Access detailed student profiles, academic history, and collaborative tools for every class in your curriculum.
                        </p>

                        <div className="space-y-3">
                            <div className="h-2 w-full bg-slate-50 rounded-full animate-pulse"></div>
                            <div className="h-2 w-3/4 bg-slate-50 rounded-full animate-pulse delay-75"></div>
                            <div className="h-2 w-1/2 bg-slate-50 rounded-full animate-pulse delay-150"></div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Sparkles className="w-3 h-3 text-primary" />
                            This feature is currently in development
                        </div>
                    </motion.div>
                ))}
            </div>

            <section className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-[#0F172A]">Launch Roadmap</h2>
                    <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                        View detailed roadmap <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { step: 1, label: "Closed Beta", desc: "Starting for selected institutions in Q3 2024." },
                        { step: 2, label: "Mobile App Sync", desc: "Full cross-platform support for iOS and Android." },
                        { step: 3, label: "Global Launch", desc: "Full release available for all educators worldwide." },
                    ].map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-primary font-bold">
                                {item.step}
                            </div>
                            <div>
                                <p className="font-bold text-[#0F172A] mb-1">{item.label}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}