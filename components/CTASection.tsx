"use client";

import { motion } from "framer-motion";
import { Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-primary/20"
        >
          <div className="flex-1 p-12 md:p-20 text-primary-foreground">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-8 max-w-md">
              Ready to modernize your school management?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-sm">
              Join thousands of institutions that have upgraded to SMS. Get started today with a personalized walkthrough.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="bg-white text-primary px-8 py-4 rounded-xl text-lg font-bold hover:bg-zinc-100 transition-all shadow-lg">
                Know More
              </Link>
              <Link href="/login" className="bg-primary border border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary-foreground/10 transition-all">
                Get Started
              </Link>
            </div>
          </div>

          <div className="flex-1 bg-white/10 backdrop-blur-sm p-12 md:p-20 flex flex-col items-center justify-center text-center relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
            >
              <Globe className="w-96 h-96 text-white" />
            </motion.div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-7xl font-black text-white mb-2 leading-none">100%</div>
              <div className="px-4 py-1 rounded-full bg-white/20 text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Cloud Secured
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
