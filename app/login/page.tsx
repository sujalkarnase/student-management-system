"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BarChart3,
  Calendar,
  BookOpen,
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Monitor student performance with intuitive data visualizations and reporting tools.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "Automated timetable generation and faculty resource management system.",
  },
  {
    icon: BookOpen,
    title: "Digital Library",
    desc: "Centralized access to course materials, research journals, and academic archives.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Records",
    desc: "Enterprise-grade encryption for all institutional data and student privacy.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your ID and password.");
        setLoading(false);
      } else {
        const session = await getSession();
        const role = (session?.user as any)?.role;

        if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "TEACHER") {
          router.push("/teacher");
        } else if (role === "STUDENT") {
          router.push("/student");
        } else {
          router.push("/");
        }

        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white font-sans overflow-hidden">
      <section className="hidden lg:flex w-[60%] bg-[#F1F5F9] p-12 flex-col justify-between relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 translate-x-1/2 translate-y-[-10%]">
          <Globe className="w-[800px] h-[800px] text-blue-200" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-2 mb-auto group">
            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">SMS</span>
          </Link>

          <div className="max-w-xl mb-auto">
            <h1 className="text-6xl font-extrabold text-[#0F172A] leading-tight mb-8">
              Elevating Academic <br />
              <span className="text-primary italic">Excellence.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              The unified portal for students, faculty, and administration. Seamlessly manage courses, track progress, and foster collaborative learning environments.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 max-w-2xl mt-auto">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-snug">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-sm mt-12">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-600">System Online: v4.2.0</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-600">Global Availability</span>
          </div>
        </div>
      </section>

      <section className="flex-1 flex flex-col p-8 md:p-12 lg:p-20 justify-center items-center bg-white overflow-y-auto h-full">
        <div className="w-full max-w-sm">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Please enter your institutional credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Authentication</h3>
                <p className="text-xs text-slate-400">Sign in to your specific portal</p>
              </div>
              <div className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Secure Portal
              </div>
            </div>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex gap-3 text-rose-600 text-sm font-medium"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Institutional ID / Email</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="STU-2024-001 or name@school.edu"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">Password</label>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign In to Portal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>

            <div className="mt-8 pt-8 border-t border-slate-50 flex gap-3 text-[10px] text-slate-400 leading-relaxed italic">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>By signing in, you agree to our <Link href="#" className="font-bold underline text-slate-600">Acceptable Use Policy</Link> and acknowledge our privacy guidelines.</span>
            </div>
          </form>

          <div className="flex justify-center gap-6 text-sm font-medium text-slate-400 my-8">
            <Link href="#" className="hover:text-slate-600 transition-colors">Help Center</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
          </div>
          <div className="flex justify-center items-center gap-2 text-xs font-bold text-slate-400 tracking-wide uppercase">
            <Globe className="w-4 h-4" /> Accessibility
          </div>
        </div>

        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center mt-auto pt-8">
          © 2024 SMS Educational Systems Ltd. All rights reserved.
        </p>
      </section>
    </div>
  );
}
