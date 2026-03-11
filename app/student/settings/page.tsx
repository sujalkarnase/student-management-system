"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { getStudentProfile, updateStudentPassword } from "@/app/actions/student-dashboard-actions";
import { 
    UserCircle, 
    AlertCircle,
    Loader2,
    Mail,
    BadgeCheck,
    Hash,
    ShieldCheck,
    LockKeyhole,
    Phone,
    MapPin,
    Calendar,
    Settings,
    UserCog
} from "lucide-react";

export default function StudentSettingsPage() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<"overview" | "security">("overview");
    const [securityForm, setSecurityForm] = useState({ current: "", new: "", confirm: "" });
    const [savingSecurity, setSavingSecurity] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        setLoading(true);
        if(!session?.user?.id) return;
        const res = await getStudentProfile(session.user.id);
        if (res.success && res.data) {
             setProfile(res.data);
        } else {
             setError(res.error || "Failed to load profile.");
        }
        setLoading(false);
    };

    const handleUpdateSecurity = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        if (securityForm.new !== securityForm.confirm) return;
        
        setSavingSecurity(true);
        const res = await updateStudentPassword(session!.user!.id, { current: securityForm.current, new: securityForm.new });
        
        if (res.success) {
            setSuccessMessage("Password updated securely!");
            setSecurityForm({ current: "", new: "", confirm: "" });
            setTimeout(() => {
                setSuccessMessage(null);
                setActiveTab("overview");
            }, 2000);
        } else {
            alert(res.error);
        }
        setSavingSecurity(false);
    };

    const inputClasses = "w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 placeholder:font-medium";
    const labelClasses = "block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2.5 px-1";

    if (loading) {
         return (
             <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                 <div className="relative">
                     <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                     <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
                 </div>
                 <p className="text-sm font-bold text-slate-400 animate-pulse">Loading profile...</p>
             </div>
         );
    }

    if (error) {
         return (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 p-6 rounded-3xl flex items-center gap-4 text-rose-700 border border-rose-200 max-w-2xl mx-auto mt-12 shadow-sm">
                 <div className="bg-white p-3 rounded-2xl shadow-sm">
                     <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                 </div>
                 <div>
                     <h3 className="font-bold text-lg mb-1">Unable to load profile</h3>
                     <p className="text-sm font-medium opacity-80">{error}</p>
                 </div>
             </motion.div>
         );
    }

    if (!profile) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-16">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200"
            >
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                        <Settings className="w-3.5 h-3.5" /> Configuration
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 font-medium text-lg max-w-xl">
                        Manage your personal details, secure your portal, and view your enrollment status.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Card (Left Column) */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-4"
                >
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center sticky top-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                        
                        <div className="w-32 h-32 rounded-[2rem] bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden mb-6 relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            {profile.user.name ? (
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user.name}`} alt="avatar" className="w-full h-full object-cover bg-slate-50" />
                            ) : (
                                <UserCircle className="w-16 h-16 text-slate-300" />
                            )}
                        </div>
                        
                        <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight relative z-10">{profile.user.name}</h2>
                        
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full mb-8 relative z-10 border border-emerald-100 shadow-sm">
                            <BadgeCheck className="w-4 h-4" /> Active Student
                        </div>
                        
                        <div className="space-y-4 w-full relative z-10 bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                            <div className="w-full flex justify-between items-center pb-3 border-b border-slate-200">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Level</span>
                                <span className="text-sm font-black text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">Student</span>
                            </div>
                            <div className="w-full flex justify-between items-center py-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile ID</span>
                                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-200/50 px-2 py-1 rounded-md max-w-[120px] truncate" title={profile.id}>{profile.id}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Settings Area (Right Column) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Tabs */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex gap-2 overflow-x-auto scrollbar-hide w-fit"
                    >
                        {[
                            { id: "overview", label: "Overview", icon: UserCog },
                            { id: "security", label: "Security & Password", icon: ShieldCheck }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                                    activeTab === tab.id 
                                    ? "bg-slate-800 text-white shadow-md transform scale-100" 
                                    : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 scale-95 hover:scale-100"
                                }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-300' : 'text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </motion.div>

                    {/* Content Area */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/30 min-h-[500px] overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            {activeTab === "overview" && (
                                <motion.div 
                                    key="overview"
                                    initial={{ opacity: 0, x: 20 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Personal Details</h3>
                                        <p className="text-sm font-medium text-slate-500">Your contact information and institutional records.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                                <Mail className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</p>
                                                <p className="text-base font-black text-slate-700 truncate">{profile.user.email || "Not specified"}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                                                <Hash className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Admission / Roll No</p>
                                                <p className="text-base font-black text-slate-700 truncate">{profile.admissionNumber}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                                <Phone className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</p>
                                                <p className="text-base font-black text-slate-700 truncate">{profile.phone || "Not specified"}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                                <Calendar className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date of Birth</p>
                                                <p className="text-base font-black text-slate-700 truncate">
                                                    {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'}) : "Not specified"}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="sm:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                                                <MapPin className="w-6 h-6 text-rose-600" />
                                            </div>
                                            <div className="overflow-hidden w-full">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Home Address</p>
                                                <p className="text-base font-black text-slate-700 truncate">{profile.address || "Not specified"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
                                        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
                                        <p className="text-sm font-medium text-blue-800 leading-relaxed">
                                            <strong className="font-bold">Need to update these details?</strong> Personal details such as Name, DOB, and Address are managed by your institution's administrators. Please contact the main office to request modifications to your permanent records.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "security" && (
                                <motion.div 
                                    key="security"
                                    initial={{ opacity: 0, x: 20 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="max-w-xl mx-auto space-y-8"
                                >
                                    <div className="text-center space-y-3 mb-10">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <LockKeyhole className="w-8 h-8 text-slate-600" />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 tracking-tight">Change Password</h3>
                                        <p className="text-base font-medium text-slate-500">Ensure your account is using a secure, original password.</p>
                                    </div>
                                    
                                    {successMessage && (
                                        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
                                            <BadgeCheck className="w-5 h-5 text-emerald-600" />
                                            <p className="font-bold text-sm tracking-wide">{successMessage}</p>
                                        </motion.div>
                                    )}

                                    <form onSubmit={handleUpdateSecurity} className="space-y-8">
                                        <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 space-y-6">
                                            <div>
                                                <label className={labelClasses}>Current Password</label>
                                                <input 
                                                    type="password"
                                                    required 
                                                    value={securityForm.current} 
                                                    onChange={e => setSecurityForm({...securityForm, current: e.target.value})} 
                                                    className={inputClasses} 
                                                    placeholder="Enter your old password"
                                                />
                                            </div>
                                            
                                            <div className="h-px w-full bg-slate-200 my-6 relative">
                                                <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-slate-50 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Credentials</div>
                                            </div>

                                            <div>
                                                <label className={labelClasses}>New Password</label>
                                                <input 
                                                    type="password"
                                                    required 
                                                    minLength={6}
                                                    value={securityForm.new} 
                                                    onChange={e => setSecurityForm({...securityForm, new: e.target.value})} 
                                                    className={inputClasses} 
                                                    placeholder="Must be at least 6 characters"
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Confirm New Password</label>
                                                <div className="relative">
                                                    <input 
                                                        type="password"
                                                        required 
                                                        minLength={6}
                                                        value={securityForm.confirm} 
                                                        onChange={e => setSecurityForm({...securityForm, confirm: e.target.value})} 
                                                        className={inputClasses} 
                                                        placeholder="Retype your new password"
                                                        style={{ 
                                                            borderColor: securityForm.new && securityForm.confirm && securityForm.new !== securityForm.confirm ? '#f43f5e' : 
                                                                        securityForm.new && securityForm.confirm && securityForm.new === securityForm.confirm ? '#10b981' : '' 
                                                        }}
                                                    />
                                                </div>
                                                {securityForm.new && securityForm.confirm && securityForm.new !== securityForm.confirm && (
                                                    <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="text-xs font-bold text-rose-500 mt-3 flex items-center gap-1.5 px-2">
                                                        <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                                                    </motion.p>
                                                )}
                                                {securityForm.new && securityForm.confirm && securityForm.new === securityForm.confirm && (
                                                    <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="text-xs font-bold text-emerald-500 mt-3 flex items-center gap-1.5 px-2">
                                                        <BadgeCheck className="w-3.5 h-3.5" /> Passwords match
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <button 
                                                type="submit" 
                                                disabled={savingSecurity || (securityForm.new !== securityForm.confirm) || !securityForm.current || !securityForm.new}
                                                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-300 hover:shadow-md hover:scale-[0.99] transition-all duration-300 flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm uppercase tracking-wider"
                                            >
                                                {savingSecurity ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                    <><ShieldCheck className="w-5 h-5" /> Secure Account</>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
