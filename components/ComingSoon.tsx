"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, Sparkles } from "lucide-react";

interface ComingSoonProps {
    title: string;
    icon: LucideIcon;
    description: string;
}

export default function ComingSoon({ title, icon: Icon, description }: ComingSoonProps) {
    return (
        <div className="max-w-4xl mx-auto py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] p-12 text-center border-2 border-dashed border-slate-100 shadow-xl shadow-slate-200/20"
            >
                <div className="bg-primary/5 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 relative">
                    <Icon className="w-10 h-10 text-primary" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-2 -right-2 bg-white p-2 rounded-xl shadow-sm border border-slate-100"
                    >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                    </motion.div>
                </div>

                <h1 className="text-3xl font-extrabold text-[#0F172A] mb-4">{title}</h1>
                <p className="text-slate-500 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                    {description}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                    <span className="bg-slate-50 border border-slate-100 px-6 py-2.5 rounded-2xl">Advanced Analytics</span>
                    <span className="bg-slate-50 border border-slate-100 px-6 py-2.5 rounded-2xl">Real-time Sync</span>
                    <span className="bg-slate-50 border border-slate-100 px-6 py-2.5 rounded-2xl">API Access</span>
                </div>
            </motion.div>
        </div>
    );
}
