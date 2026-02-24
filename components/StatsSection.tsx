"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Active Students", value: "1.2M+" },
  { label: "Countries", value: "45+" },
  { label: "Retention Rate", value: "99.2%" },
  { label: "Support Score", value: "4.9/5" },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-white border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
