"use client";

import { motion } from "framer-motion";
import { Users, BarChart3, Calendar, MessageSquare, ShieldCheck, Laptop } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student Records",
    description: "Unified 360-degree view of student data, from enrollment and medical records to behavior history.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: BarChart3,
    title: "Academic Analytics",
    description: "Automated gradebook calculations and real-time performance tracking with predictive insights.",
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Complex timetable generation that handles teacher availability, room constraints, and student tracks.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: MessageSquare,
    title: "Unified Communication",
    description: "Bridge the gap with instant messaging, newsletters, and automated SMS alerts for parents.",
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Security",
    description: "Enterprise-grade data protection that meets GDPR, FERPA, and regional educational standards.",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: Laptop,
    title: "Hybrid Learning",
    description: "Seamless integration with major LMS platforms and virtual classroom tools for remote education.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
            Core Features
          </div>
          <h2 className="text-4xl font-extrabold text-foreground mb-4">
            Everything You Need to Manage Excellence
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
