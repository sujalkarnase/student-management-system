"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">SMS</span>
          </div>


          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
