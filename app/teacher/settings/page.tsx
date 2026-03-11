"use client";

import React, { useState, useEffect } from "react";
import { UserCircle, BadgeCheck, Mail, CalendarDays, Wallet, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { getTeacherProfile } from "@/app/actions/teacher-dashboard-actions";

export default function TeacherSettingsPage() {
    const { data: session } = useSession();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<"overview" | "edit" | "security">("overview");


    const [editForm, setEditForm] = useState({ name: "", email: "", qualification: "" });
    const [savingProfile, setSavingProfile] = useState(false);


    const [securityForm, setSecurityForm] = useState({ current: "", new: "", confirm: "" });
    const [savingSecurity, setSavingSecurity] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        setLoading(true);
        if (!session?.user?.id) return;
        const res = await getTeacherProfile(session.user.id);
        if (res.success && res.data) {
            setProfile(res.data);
            setEditForm({
                name: res.data.user.name || "",
                email: res.data.user.email || "",
                qualification: res.data.qualification || ""
            });
        } else {
            setError(res.error || "Failed to load profile.");
        }
        setLoading(false);
    };


    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        const { updateTeacherProfile } = await import("@/app/actions/teacher-dashboard-actions");
        const res = await updateTeacherProfile(session!.user!.id, editForm);

        if (res.success) {
            alert("Profile updated successfully!");
            fetchProfile();
            setActiveTab("overview");
        } else {
            alert(res.error);
        }
        setSavingProfile(false);
    };

    const handleUpdateSecurity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (securityForm.new !== securityForm.confirm) {
            alert("New passwords do not match.");
            return;
        }

        setSavingSecurity(true);
        const { updateTeacherPassword } = await import("@/app/actions/teacher-dashboard-actions");
        const res = await updateTeacherPassword(session!.user!.id, { current: securityForm.current, new: securityForm.new });

        if (res.success) {
            alert("Password updated securely!");
            setSecurityForm({ current: "", new: "", confirm: "" });
            setActiveTab("overview");
        } else {
            alert(res.error);
        }
        setSavingSecurity(false);
    };


    const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium bg-slate-50 focus:bg-white";
    const labelClasses = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1";

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">

            <div className="space-y-2 pb-6 border-b border-slate-200">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <UserCircle className="w-3 h-3" />
                    Account Properties
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Faculty Profile</h1>
                <p className="text-slate-500 font-medium">
                    Manage your authenticated account details, employment records, and security preferences.
                </p>
            </div>


            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: "overview", label: "Overview" },
                    { id: "edit", label: "Edit Profile" },
                    { id: "security", label: "Security & Password" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                            ? "bg-slate-800 text-white shadow-lg shadow-slate-200"
                            : "bg-white text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : error ? (
                <div className="bg-rose-50 p-6 rounded-2xl flex items-center gap-4 text-rose-700 border border-rose-200">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            ) : (!profile ? null : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center col-span-1 h-fit sticky top-6"
                    >
                        <div className="w-32 h-32 rounded-full bg-slate-50 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden mb-6 relative">
                            {profile.user.name ? (
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user.name}`} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle className="w-16 h-16 text-slate-300" />
                            )}
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-full"></div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-1">{profile.user.name}</h2>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-6">
                            <BadgeCheck className="w-3 h-3" /> Active User
                        </div>

                        <div className="space-y-4 w-full">
                            <div className="w-full flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase">System Role</span>
                                <span className="text-sm font-black text-slate-700">Teacher</span>
                            </div>
                            <div className="w-full flex justify-between items-center py-3">
                                <span className="text-xs font-bold text-slate-400 uppercase">Profile ID</span>
                                <span className="text-xs font-mono text-slate-500 truncate w-32" title={profile.id}>{profile.id}</span>
                            </div>
                        </div>
                    </motion.div>


                    <div className="col-span-1 md:col-span-2 relative">
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden min-h-[400px]">

                            {activeTab === "overview" && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Personal Details</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                                <Mail className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                                                <p className="text-md font-bold text-slate-700">{profile.user.email || "Not specified"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                                                <BadgeCheck className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Qualifications</p>
                                                <p className="text-md font-bold text-slate-700">{profile.qualification}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                                <CalendarDays className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Joining Date</p>
                                                <p className="text-md font-bold text-slate-700">{new Date(profile.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>

                                        {profile.salary && (
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                                    <Wallet className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Base Salary (Mo)</p>
                                                    <p className="text-md font-bold text-slate-700">${Number(profile.salary).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "edit" && (
                                <motion.div
                                    key="edit"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8">Edit Information</h3>
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div>
                                            <label className={labelClasses}>Full Name</label>
                                            <input
                                                required
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={editForm.email}
                                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Qualifications</label>
                                            <input
                                                required
                                                value={editForm.qualification}
                                                onChange={e => setEditForm({ ...editForm, qualification: e.target.value })}
                                                className={inputClasses}
                                            />
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <button
                                                type="submit"
                                                disabled={savingProfile}
                                                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                                            >
                                                {savingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === "security" && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Change Password</h3>
                                    <p className="text-sm font-medium text-slate-500 mb-8">Ensure your account is using a long, random password to stay secure.</p>

                                    <form onSubmit={handleUpdateSecurity} className="space-y-6">
                                        <div>
                                            <label className={labelClasses}>Current Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={securityForm.current}
                                                onChange={e => setSecurityForm({ ...securityForm, current: e.target.value })}
                                                className={inputClasses}
                                            />
                                        </div>

                                        <div className="h-px w-full bg-slate-100 my-4"></div>

                                        <div>
                                            <label className={labelClasses}>New Password</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={securityForm.new}
                                                onChange={e => setSecurityForm({ ...securityForm, new: e.target.value })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Confirm New Password</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={securityForm.confirm}
                                                onChange={e => setSecurityForm({ ...securityForm, confirm: e.target.value })}
                                                className={inputClasses}
                                                style={{ borderColor: securityForm.new && securityForm.confirm && securityForm.new !== securityForm.confirm ? '#f43f5e' : '' }}
                                            />
                                            {securityForm.new && securityForm.confirm && securityForm.new !== securityForm.confirm && (
                                                <p className="text-xs font-bold text-rose-500 mt-2 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> Passwords do not match
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <button
                                                type="submit"
                                                disabled={savingSecurity || (securityForm.new !== securityForm.confirm)}
                                                className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-700 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                                            >
                                                {savingSecurity ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
