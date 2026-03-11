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

    useEffect(() => {
        if (session?.user?.id) {
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        setLoading(true);
        if(!session?.user?.id) return;
        const res = await getTeacherProfile(session.user.id);
        if (res.success && res.data) {
             setProfile(res.data);
        } else {
             setError(res.error || "Failed to load profile.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-2 pb-6 border-b border-slate-200">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <UserCircle className="w-3 h-3" />
                    Account Properties
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Faculty Profile</h1>
                <p className="text-slate-500 font-medium">
                    View your authenticated account details and employment records. Contact your Administrator if any data is incorrect.
                </p>
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
                     {/* ID Card */}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center col-span-1 md:col-span-1"
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

                     {/* Details Overview */}
                     <motion.div 
                         initial={{ opacity: 0, y: 20 }} 
                         animate={{ opacity: 1, y: 0 }} 
                         transition={{ delay: 0.1 }}
                         className="col-span-1 md:col-span-2 space-y-6"
                     >
                          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                               <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8">Personal Details</h3>

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
                                              <p className="text-md font-bold text-slate-700">{new Date(profile.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                                         </div>
                                    </div>
                                    
                                     {/* Base Salary Hidden or Displayed based on preference. Just showing for completeness per schema */}
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
                          </div>
                     </motion.div>
                </div>
            ))}
        </div>
    );
}
