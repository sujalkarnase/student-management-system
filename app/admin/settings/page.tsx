"use client";

import React, { useState, useEffect } from "react";
import { Settings, CalendarClock, ShieldCheck, Plus, Save, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { getAcademicYears, createAcademicYear, setActiveAcademicYear, getAdminProfile, updateAdminProfile } from "@/app/actions/settings-actions";

export default function AdminSettingsPage() {
    const { data: session } = useSession();
    
    // Academic Year State
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [newYearLabel, setNewYearLabel] = useState("");
    const [loadingYears, setLoadingYears] = useState(true);
    const [creatingYear, setCreatingYear] = useState(false);
    const [activatingYear, setActivatingYear] = useState<string | null>(null);

    // Profile State
    const [profile, setProfile] = useState<{name: string, email: string}>({ name: "", email: "" });
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchYears();
            fetchProfile();
        }
    }, [session]);

    const fetchYears = async () => {
        setLoadingYears(true);
        const res = await getAcademicYears();
        if (res.success) setAcademicYears(res.data || []);
        setLoadingYears(false);
    };

    const fetchProfile = async () => {
        if (!session?.user?.id) return;
        setLoadingProfile(true);
        const res = await getAdminProfile(session.user.id);
        if (res.success && res.data) {
             setProfile({ name: res.data.name, email: res.data.email || "" });
        }
        setLoadingProfile(false);
    };

    // --- Year Handlers ---
    const handleCreateYear = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreatingYear(true);
        const res = await createAcademicYear(newYearLabel);
        if (res.success) {
            setNewYearLabel("");
            fetchYears();
        } else {
            alert(res.error);
        }
        setCreatingYear(false);
    };

    const handleActivateYear = async (id: string) => {
        setActivatingYear(id);
        const res = await setActiveAcademicYear(id);
        if (res.success) {
             fetchYears();
             // Optional: force a hard reload so the top layout badge updates instantly
             window.location.reload(); 
        } else {
             alert(res.error);
        }
        setActivatingYear(null);
    };

    // --- Profile Handlers ---
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        if (passwords.new || passwords.confirm) {
             if (!passwords.current) return alert("Current password is required to set a new password.");
             if (passwords.new !== passwords.confirm) return alert("New passwords do not match.");
        }

        setSavingProfile(true);
        const res = await updateAdminProfile(session.user.id, {
            name: profile.name,
            email: profile.email,
            currentPassword: passwords.current,
            newPassword: passwords.new
        });

        if (res.success) {
            alert("Profile updated successfully!");
            setPasswords({ current: "", new: "", confirm: "" });
        } else {
            alert(res.error);
        }
        setSavingProfile(false);
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-slate-700 bg-slate-50";

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    System <span className="text-primary italic">Settings</span>
                </h1>
                <p className="text-slate-500 font-medium">Configure global application parameters and security credentials.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Global Preferences - Academic Year */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full flex items-start justify-end p-6 pointer-events-none transition-colors group-hover:bg-primary/10">
                            <CalendarClock className="w-8 h-8 text-primary" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Academic Session</h2>
                        <p className="text-sm text-slate-500 mb-8 max-w-[80%]">
                            Manage the active academic year. This global setting immediately changes the data context (Classes, Students, Attendance) for the entire platform.
                        </p>

                        {/* Create New Year */}
                        <form onSubmit={handleCreateYear} className="flex gap-2 mb-8">
                            <input
                                required
                                value={newYearLabel}
                                onChange={(e) => setNewYearLabel(e.target.value)}
                                placeholder="e.g. 2024-2025"
                                className={inputClasses}
                            />
                            <button
                                disabled={creatingYear}
                                type="submit"
                                className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {creatingYear ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Plus className="w-5 h-5"/> Add Year</>}
                            </button>
                        </form>

                        {/* Year List */}
                        <div className="space-y-3">
                            {loadingYears ? (
                                 <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                            ) : academicYears.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No academic years found.</p>
                            ) : (
                                academicYears.map((year) => (
                                    <div key={year.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${year.isCurrent ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                                        <div className="flex items-center gap-3">
                                            {year.isCurrent ? (
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <CalendarClock className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className={`font-bold ${year.isCurrent ? 'text-emerald-800' : 'text-slate-700'}`}>{year.yearLabel}</h4>
                                                {year.isCurrent && <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Currently Active</span>}
                                            </div>
                                        </div>
                                        
                                        {!year.isCurrent && (
                                            <button
                                                onClick={() => handleActivateYear(year.id)}
                                                disabled={activatingYear === year.id}
                                                className="px-4 py-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                {activatingYear === year.id ? "Activating..." : "Set Active"}
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Profile Settings */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
                     <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full flex items-start justify-end p-6 pointer-events-none transition-colors group-hover:bg-rose-100">
                            <ShieldCheck className="w-8 h-8 text-rose-500" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Admin Security</h2>
                        <p className="text-sm text-slate-500 mb-8 max-w-[80%]">
                            Update your administrative credentials, display email, and secure password.
                        </p>

                        {loadingProfile ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-rose-500" /></div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Display Name</label>
                                        <input required value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className={inputClasses} placeholder="Admin Name"/>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                        <input required type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className={inputClasses} placeholder="admin@school.edu"/>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 space-y-4">
                                     <h3 className="text-sm font-bold text-slate-800">Change Password (Optional)</h3>
                                     <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Current Password</label>
                                        <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className={inputClasses} placeholder="Enter to authorize changes"/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">New Password</label>
                                            <input type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className={inputClasses} placeholder="New secret"/>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm New</label>
                                            <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className={inputClasses} placeholder="Retype new secret"/>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={savingProfile}
                                    type="submit"
                                    className="w-full bg-slate-800 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {savingProfile ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Save className="w-5 h-5"/> Securely Save Changes</>}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
