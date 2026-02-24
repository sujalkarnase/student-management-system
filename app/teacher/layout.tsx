"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    GraduationCap,
    Bell,
    ChevronRight,
    Loader2
} from "lucide-react";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/teacher" },
    { icon: BookOpen, label: "My Classes", href: "/teacher/classes" },
    { icon: Users, label: "Students", href: "/teacher/students" },
    { icon: BookOpen, label: "Assignments", href: "/teacher/assignments" },
    { icon: Settings, label: "Settings", href: "/teacher/settings" },
];

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <div className="min-h-screen flex bg-[#F8FAFC]">
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 shadow-sm z-50">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-md shadow-primary/20">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#0F172A]">SMS</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {menuItems.map((item, idx) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-[#0F172A]"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-slate-50 hover:text-rose-600 rounded-xl transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 pl-72">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                        <span>SMS</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#0F172A]">Teacher Dashboard</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                {status === "loading" ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                                        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-bold text-[#0F172A]">{session?.user?.name || "Teacher"}</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Faculty Member</p>
                                    </>
                                )}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                                {session?.user?.name ? (
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Users className="w-5 h-5 text-slate-300" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {children}
                </main>

                <footer className="p-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-white border-t border-slate-100 mt-auto">
                    © 2026 SMS. All rights reserved. Version 1.0.0-beta
                </footer>
            </div>
        </div>
    );
}