"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-24 bg-zinc-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary/5 rounded-[40px] p-12 md:p-20 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 opacity-[0.03] -translate-y-1/4 translate-x-1/4">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/167/167707.png" 
              alt="School Icon" 
              className="w-96 h-96"
            />
          </div>

          <div className="relative z-10">
            <div className="flex justify-center gap-1 mb-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 fill-primary text-primary" />
              ))}
            </div>

            <blockquote className="text-2xl md:text-4xl font-bold text-primary leading-tight mb-12 italic">
              "SMS transformed our administrative efficiency by over 40% in just one semester. The parents love the mobile app, and teachers finally have their time back to focus on what matters: teaching."
            </blockquote>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 mb-4">
                <img 
                  src="https://i.pravatar.cc/150?u=sarah" 
                  alt="Dr. Sarah Jenkins" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">Dr. Sarah Jenkins</div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
                  Head of Saint Mary's Academy
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
