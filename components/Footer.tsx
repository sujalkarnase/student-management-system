"use client";

import Link from "next/link";
import { GraduationCap, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">Smart School</span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
              The modern SIS platform designed for progressive educational institutions.
              Streamlining operations so you can focus on student outcomes.
            </p>

          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Smart School SIS. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
