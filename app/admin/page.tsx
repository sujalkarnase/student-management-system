"use client";

import React from "react";
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
    ArrowUpRight
} from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { label: "Total Students", value: "1,284", icon: UsersRound, color: "text-blue-500", bg: "bg-blue-50", trend: "+12%" },
        { label: "Total Teachers", value: "86", icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-50", trend: "+4%" },
        { label: "Active Classes", value: "42", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50", trend: "Stable" },
        { label: "Attendance Rate", value: "94%", icon: CalendarCheck, color: "text-rose-500", bg: "bg-rose-50", trend: "+2%" },
    ];

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
                            <ShieldCheck className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Admin Control Center</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
                        Manage Your Institution <span className="text-primary italic">Effectively.</span>
                    </h1>

                    <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-lg">
                        Welcome to the SMS Administrator Portal. Monitor academic performance, manage user accounts, and oversee institutional operations from a central hub.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 group">
                            Generate Reports
                            <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="bg-white text-slate-600 border border-slate-200 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                            System Logs
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-12 md:mt-0 relative z-10 w-full md:w-[45%] h-full flex items-center justify-center">
                    <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8">
                        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                            <TrendingUp className="w-12 h-12 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-medium text-sm text-center">Data Analytics Engine coming soon...</p>

                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-4"
                        >
                            <div className="bg-emerald-50 p-2 rounded-xl">
                                <Sparkles className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance</p>
                                <p className="text-sm font-bold text-[#0F172A]">System Healthy</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full blur-[60px] -translate-x-1/4 translate-y-1/4"></div>
            </motion.section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                    >
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
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A]">Recent Registrations</h2>
                                <p className="text-sm text-slate-400">Newly enrolled students and staff</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Coming Soon</span>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/3 bg-slate-200 rounded-full animate-pulse"></div>
                                    <div className="h-3 w-1/4 bg-slate-100 rounded-full animate-pulse"></div>
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
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A]">System Health</h2>
                                <p className="text-sm text-slate-400">Server status and background tasks</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Coming Soon</span>
                    </div>

                    <div className="space-y-6">
                        {[
                            { name: "Database", status: "Operational", color: "bg-emerald-500" },
                            { name: "File Storage", status: "Operational", color: "bg-emerald-500" },
                            { name: "Auth Service", status: "Operational", color: "bg-emerald-500" }
                        ].map((service, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${service.color}`}></div>
                                    <span className="text-sm font-bold text-slate-600">{service.name}</span>
                                </div>
                                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{service.status}</span>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    );
}