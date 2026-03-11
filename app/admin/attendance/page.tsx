"use client";

import React, { useState, useEffect } from "react";
import { CalendarCheck, Users, Search, Save, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getAttendanceFilters, getAttendanceData, bulkMarkAttendance } from "@/app/actions/attendance-actions";
import { useSession } from "next-auth/react";

export default function AdminAttendancePage() {
    const { data: session } = useSession();
    
    // Filters and Metadata State
    const [loadingFilters, setLoadingFilters] = useState(true);
    const [classes, setClasses] = useState<any[]>([]);
    const [academicYear, setAcademicYear] = useState<any>(null);
    
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [selectedSectionId, setSelectedSectionId] = useState<string>("");

    // Attendance Data State
    const [loadingData, setLoadingData] = useState(false);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [attendanceMap, setAttendanceMap] = useState<Record<string, "PRESENT" | "ABSENT">>({});
    const [saving, setSaving] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState("");

    // Load Initial Filters (Classes/Sections)
    useEffect(() => {
        const fetchFilters = async () => {
             const res = await getAttendanceFilters();
             if (res.success) {
                 setClasses(res.data || []);
                 setAcademicYear(res.academicYear);
             }
             setLoadingFilters(false);
        };
        fetchFilters();
    }, []);

    // Load Attendance Data when filters are fully selected
    useEffect(() => {
        if (selectedDate && selectedClassId && selectedSectionId) {
            fetchAttendance();
        } else {
            setEnrollments([]);
            setAttendanceMap({});
        }
    }, [selectedDate, selectedClassId, selectedSectionId]);

    const fetchAttendance = async () => {
        setLoadingData(true);
        const res = await getAttendanceData(selectedDate, selectedClassId, selectedSectionId);
        if (res.success) {
            const data = res.data || [];
            setEnrollments(data);
            
            // Build the initial attendance map based on existing records or default everyone to PRESENT
            const initialMap: Record<string, "PRESENT" | "ABSENT"> = {};
            data.forEach((enr: any) => {
                 if (enr.attendance && enr.attendance.length > 0) {
                     initialMap[enr.id] = enr.attendance[0].status;
                 } else {
                     initialMap[enr.id] = "PRESENT"; // Default assuming most are present
                 }
            });
            setAttendanceMap(initialMap);
        }
        setLoadingData(false);
    };

    const toggleAttendance = (enrollmentId: string, status: "PRESENT" | "ABSENT") => {
        setAttendanceMap(prev => ({
            ...prev,
            [enrollmentId]: status
        }));
    };

    const markAll = (status: "PRESENT" | "ABSENT") => {
         const newMap: Record<string, "PRESENT" | "ABSENT"> = {};
         enrollments.forEach(enr => {
             newMap[enr.id] = status;
         });
         setAttendanceMap(newMap);
    };

    const handleSave = async () => {
        if (!session?.user?.id) return alert("You must be logged in to save attendance.");
        
        setSaving(true);
        const records = Object.keys(attendanceMap).map(enrollmentId => ({
            enrollmentId,
            status: attendanceMap[enrollmentId]
        }));

        const result = await bulkMarkAttendance(records, selectedDate, session.user.id);
        
        if (result.success) {
            alert("Attendance successfully saved!");
            fetchAttendance(); // Refresh to ensure UI matches DB exactly
        } else {
            alert(result.error || "Failed to save attendance.");
        }
        setSaving(false);
    };

    const activeClass = classes.find(c => c.id === selectedClassId);
    
    // Derived Stats
    const totalStudents = enrollments.length;
    const presentCount = Object.values(attendanceMap).filter(s => s === "PRESENT").length;
    const absentCount = Object.values(attendanceMap).filter(s => s === "ABSENT").length;
    const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    // Filtered by local search
    const filteredEnrollments = enrollments.filter(enr => 
        enr.student.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        enr.student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                        Attendance <span className="text-primary italic">Tracker</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Record and manage daily student attendance.</p>
                </div>
                {academicYear && (
                    <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-slate-600">Session: {academicYear.yearLabel}</span>
                    </div>
                )}
            </div>

            {/* Config & Filters */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                {loadingFilters ? (
                    <div className="flex items-center justify-center py-4 gap-3 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-bold uppercase tracking-widest text-xs">Loading Configurations...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Date Filter */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Select Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-slate-700 bg-slate-50"
                            />
                        </div>
                        {/* Class Filter */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Select Class</label>
                            <select
                                value={selectedClassId}
                                onChange={(e) => {
                                    setSelectedClassId(e.target.value);
                                    setSelectedSectionId(""); // Reset section when class changes
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-slate-700 bg-slate-50 cursor-pointer appearance-none"
                            >
                                <option value="" className="text-slate-400">-- Choose Class --</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>Class {cls.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Section Filter */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Select Section</label>
                            <select
                                value={selectedSectionId}
                                onChange={(e) => setSelectedSectionId(e.target.value)}
                                disabled={!selectedClassId || !activeClass?.sections?.length}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-slate-700 disabled:bg-slate-100 disabled:opacity-50 cursor-pointer appearance-none"
                            >
                                <option value="">-- Choose Section --</option>
                                {activeClass?.sections?.map((sec: any) => (
                                    <option key={sec.id} value={sec.id}>Section {sec.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            {selectedDate && selectedClassId && selectedSectionId ? (
                <>
                    {/* Live Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Enrolled</span>
                            <span className="text-3xl font-black text-slate-800">{totalStudents}</span>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-[100px] flex items-start justify-end p-3 pointer-events-none">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Present</span>
                            <span className="text-3xl font-black text-emerald-600">{presentCount}</span>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-center relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-[100px] flex items-start justify-end p-3 pointer-events-none">
                                <XCircle className="w-5 h-5 text-rose-500" />
                            </div>
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">Absent</span>
                            <span className="text-3xl font-black text-rose-600">{absentCount}</span>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-primary p-5 rounded-2xl shadow-lg shadow-primary/20 flex flex-col justify-center text-white">
                            <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Turnout</span>
                            <span className="text-3xl font-black">{attendancePercentage}%</span>
                        </motion.div>
                    </div>

                    {/* Roster & Controls */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* Toolbar */}
                        <div className="p-4 md:p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Find student by name or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => markAll("PRESENT")}
                                    className="px-4 py-2 text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                                >
                                    Mark All Present
                                </button>
                                <button
                                    onClick={() => markAll("ABSENT")}
                                    className="px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                                >
                                    Mark All Absent
                                </button>
                            </div>
                        </div>

                        {/* Roster List */}
                        {loadingData ? (
                            <div className="py-24 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Roster...</p>
                            </div>
                        ) : filteredEnrollments.length === 0 ? (
                            <div className="py-24 flex flex-col items-center justify-center gap-4">
                                <Users className="w-12 h-12 text-slate-200" />
                                <p className="text-slate-400 font-bold text-sm">No students currently enrolled in this section.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {filteredEnrollments.map((enr, idx) => {
                                    const status = attendanceMap[enr.id];
                                    const isPresent = status === "PRESENT";
                                    return (
                                        <motion.div 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            transition={{ delay: Math.min(idx * 0.02, 0.5) }} // Cap delay
                                            key={enr.id} 
                                            className={`p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${isPresent ? 'hover:bg-emerald-50/30' : 'hover:bg-rose-50/30'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-sm ring-2 ring-white shadow-sm overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${enr.student.user.name}`} alt="avatar" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-sm">{enr.student.user.name}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Roll: {enr.rollNumber}</span>
                                                        <span className="text-xs text-slate-400">{enr.student.admissionNumber}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Toggle Switch */}
                                            <div className="flex items-center bg-slate-100/80 p-1 rounded-xl w-full md:w-auto mt-2 md:mt-0">
                                                <button
                                                    onClick={() => toggleAttendance(enr.id, "PRESENT")}
                                                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${isPresent ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    <CheckCircle2 className="w-4 h-4" /> Present
                                                </button>
                                                <button
                                                    onClick={() => toggleAttendance(enr.id, "ABSENT")}
                                                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${!isPresent ? 'bg-white text-rose-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    <XCircle className="w-4 h-4" /> Absent
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                        
                        {/* Save Action Footer */}
                        {filteredEnrollments.length > 0 && (
                             <div className="p-4 md:p-6 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                                 <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none"
                                 >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Attendance Log</>}
                                 </button>
                             </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                        <CalendarCheck className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">Select a class to begin</h3>
                        <p className="text-slate-400 max-w-sm font-medium">Please choose a date, class, and section from the filters above to load the student roster and record attendance.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
