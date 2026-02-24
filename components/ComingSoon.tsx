"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, LucideIcon } from "lucide-react";

interface ComingSoonProps {
    title: string;
    description: string;
    icon: LucideIcon;
    featureName: string;
}

export default function ComingSoon({ title, description, icon: Icon, featureName }: ComingSoonProps) {
    return (
        <div className="max-w-7xl mx-auto">
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white rounded-[2rem] p-12 overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between min-h-[500px]"
            >
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full">Coming Soon</span>
                        <span className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-widest pl-2">
                            <Sparkles className="w-3 h-3" /> {featureName} Preview
                        </span>
                    </div>

                    <h1 className="text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
                        {title}
                    </h1>

                    <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-xl">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 group">
                            Get Early Access
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="bg-white text-slate-600 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                            View Documentation
                        </button>
                    </div>
                </div>

                <div className="mt-12 md:mt-0 relative z-10 w-full md:w-[40%] aspect-square">
                    <div className="absolute inset-0 bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden shadow-inner">
                        <div className="p-8 space-y-6">
                            <div className="h-4 w-1/2 bg-slate-200/50 rounded-full animate-pulse"></div>
                            <div className="space-y-3 pt-4">
                                <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse"></div>
                                <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse delay-75"></div>
                                <div className="h-2 w-3/4 bg-slate-100 rounded-full animate-pulse delay-150"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-8">
                                <div className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
                                <div className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse delay-100"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 translate-y-[-50%]"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full blur-[80px] translate-x-[-30%] translate-y-[30%]"></div>
            </motion.section>
        </div>
    );
}
