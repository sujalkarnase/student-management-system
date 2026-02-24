"use client";

import Link from "next/link";
import { GraduationCap, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">SMS</span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
              The modern SIS platform designed for progressive educational institutions. 
              Streamlining operations so you can focus on student outcomes.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-all">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors text-sm">Features</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Solutions</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Pricing</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Updates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">News</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Docs</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">API Rules</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SMS SIS. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
