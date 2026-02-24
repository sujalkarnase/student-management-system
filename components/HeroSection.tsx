"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              Next-Gen SIS Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-6">
              Empowering Minds, <br />
              <span className="text-primary italic">Streamlining Schools.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
              The all-in-one student management system designed to automate administrative tasks, engage parents, and drive student success with real-time analytics.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/login" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2 hover:translate-y-[-2px] transition-all shadow-xl shadow-primary/20">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="bg-white text-foreground border border-border px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2 hover:bg-muted/50 transition-all">
                Know More <Play className="w-5 h-5 fill-current" />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-muted flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-foreground">Trusted by 2,500+</span>
                <span className="text-muted-foreground ml-1">schools worldwide</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl border border-border bg-white shadow-2xl overflow-hidden relative z-10">
              <img 
                src="/image.png" 
                alt="Dashboard Preview" 
                className="w-full h-auto"
              />
            </div>

            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-12 top-1/2 z-20 bg-white p-4 rounded-2xl shadow-xl border border-border flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Attendance</div>
                <div className="text-lg font-bold text-foreground">98.4% Today</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-8 top-1/4 z-20 bg-white p-4 rounded-2xl shadow-xl border border-border max-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Recent Notice</span>
              </div>
              <p className="text-sm font-bold text-foreground leading-tight">Parent Meeting scheduled for... </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
