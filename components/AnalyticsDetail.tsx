"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight } from "lucide-react";

const analyticsFeatures = [
  "Real-time attendance tracking with automated parent alerts.",
  "Comprehensive gradebook with weighted GPA calculations.",
  "Behavioral tracking and intervention management tools.",
  "Automated report card generation in multiple formats.",
];

export default function AnalyticsDetail() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-3xl"></div>
            <div className="relative rounded-3xl border border-border shadow-2xl overflow-hidden bg-white">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" 
                alt="Analytics Dashboard" 
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
              Reporting & Insights
            </div>
            <h2 className="text-4xl font-extrabold text-foreground mb-8">
              Make Data-Driven Decisions with Confidence
            </h2>
            
            <div className="space-y-6 mb-10">
              {analyticsFeatures.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="mt-1 bg-primary/10 p-1 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-lg text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
