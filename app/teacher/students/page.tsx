"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Users, Search, Loader2, UserCircle2, AlertCircle, CalendarClock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { getTeacherStudents, getTeacherClasses } from "@/app/actions/teacher-dashboard-actions";

function TeacherStudentsContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialClassId = searchParams.get("class") || "";
    const initialSectionId = searchParams.get("section") || "";

    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    
    // Filter State
    const [selectedClass, setSelectedClass] = useState(initialClassId);
    const [selectedSection, setSelectedSection] = useState(initialSectionId);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            initData();
        }
    }, [session]);

    // Handle URL param changes dynamically without full refetch if we already have assigning data mapped
    useEffect(() => {
         if (session?.user?.id && !loading && assignments.length > 0) {
             const cId = searchParams.get("class") || "";
             const sId = searchParams.get("section") || "";
             if (cId !== selectedClass || sId !== selectedSection) {
                 setSelectedClass(cId);
                 setSelectedSection(sId);
                 fetchStudents(cId, sId);
             }
         }
    }, [searchParams]);


    const initData = async () => {
        setLoading(true);
        if(!session?.user?.id) return;

        // Fetch their allowed classed first to build the filter dropdown
        const classRes = await getTeacherClasses(session.user.id);
        if (classRes.success && classRes.data) {
             setAssignments(classRes.data);
        }

        // Fetch students (all, or filtered if URL params provided)
        await fetchStudents(initialClassId, initialSectionId);
    };

    const fetchStudents = async (cId: string, sId: string) => {
         setLoading(true);
         setError(null);
         const res = await getTeacherStudents(session!.user!.id, cId || undefined, sId || undefined);
         if (res.success && res.data) {
             setStudents(res.data);
         } else {
             setError(res.error || "Failed to load student roster.");
             setStudents([]);
         }
         setLoading(false);
    };

    // Derived distinct classes for the dropdown
    const uniqueClasses = Array.from(new Set(assignments.map(a => JSON.stringify({ id: a.class.id, name: a.class.name }))))
        .map(str => JSON.parse(str));

    // Dynamic sections based on selected class
    const availableSections = assignments
        .filter(a => a.classId === selectedClass)
        .map(a => ({ id: a.section.id, name: a.section.name }))
        .filter((value, index, self) => index === self.findIndex((t) => t.id === value.id)); // distinct


    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Update URL to trigger refetch via effect
        const params = new URLSearchParams();
        if (selectedClass) params.set("class", selectedClass);
        if (selectedSection) params.set("section", selectedSection);
        router.push(`/teacher/students?${params.toString()}`);
    };

    const handleClearFilters = () => {
         setSelectedClass("");
         setSelectedSection("");
         setSearchQuery("");
         router.push(`/teacher/students`);
    };

    const filteredStudents = students.filter(enrollment => 
         enrollment.student.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         enrollment.student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate aggregated stats
    const totalStudents = students.length;
    const currentlyViewing = filteredStudents.length;

    // Calculate Average Attendance
    const calculateOverallAttendance = () => {
         if (filteredStudents.length === 0) return 0;
         let totalPresent = 0;
         let totalRecords = 0;

         filteredStudents.forEach(ent => {
             if (ent.attendance && ent.attendance.length > 0) {
                 totalRecords += ent.attendance.length;
                 totalPresent += ent.attendance.filter((a: any) => a.status === 'PRESENT').length;
             }
         });

         return totalRecords === 0 ? 0 : Math.round((totalPresent / totalRecords) * 100);
    };
    const avgAttendance = calculateOverallAttendance();


    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-2">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <Users className="w-3 h-3" />
                    Student Directory
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Assigned Students</h1>
                <p className="text-slate-500 font-medium max-w-2xl">
                    View active enrollments across all your taught sections. Use the filters to drill down into a specific class.
                </p>
            </div>

            {/* Dashboard Overview Cards */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
                     {[
                         { label: "Total Students", value: totalStudents, icon: Users, color: "bg-blue-600", light: "bg-blue-50" },
                         { label: "Showing Results", value: currentlyViewing, icon: Search, color: "bg-emerald-500", light: "bg-emerald-50" },
                         { label: "Avg Attendance", value: `${avgAttendance}%`, icon: CalendarClock, color: "bg-amber-500", light: "bg-amber-50" },
                     ].map((stat, i) => (
                         <div key={stat.label} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden group hover:shadow-xl transition-all">
                             <div className={`absolute -right-8 -top-8 w-32 h-32 ${stat.light} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none`}></div>
                             <div className={`w-14 h-14 rounded-2xl ${stat.color} text-white flex items-center justify-center shrink-0 shadow-lg relative z-10 group-hover:scale-110 transition-transform`}>
                                 <stat.icon className="w-6 h-6" />
                             </div>
                             <div className="relative z-10">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                 <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                             </div>
                         </div>
                     ))}
                </div>
            )}

            {/* Filter Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative z-20">
                 {loading && students.length === 0 && assignments.length === 0 ? (
                      <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                 ) : (
                      <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                           <div className="flex-1 w-full relative">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Search Roster</label>
                                <div className="relative">
                                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                     <input 
                                         value={searchQuery}
                                         onChange={e => setSearchQuery(e.target.value)}
                                         placeholder="Search by name or admission no..."
                                         className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                                     />
                                </div>
                           </div>

                           <div className="w-full md:w-48">
                               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Class</label>
                               <select 
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium bg-white"
                                    value={selectedClass}
                                    onChange={(e) => {
                                         setSelectedClass(e.target.value);
                                         setSelectedSection(""); // Reset section when class changes
                                    }}
                               >
                                    <option value="">All Classes</option>
                                    {uniqueClasses.map(c => <option key={c.id} value={c.id}>Class {c.name}</option>)}
                               </select>
                           </div>

                             <div className="w-full md:w-48">
                               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Section</label>
                               <select 
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium bg-white disabled:opacity-50"
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    disabled={!selectedClass}
                               >
                                    <option value="">All Sections</option>
                                    {availableSections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
                               </select>
                           </div>

                           <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                               <button 
                                   type="submit" 
                                   disabled={loading}
                                   className="flex-1 md:flex-none bg-slate-800 text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap hover:bg-slate-700 transition-colors disabled:opacity-50 flex justify-center items-center h-[50px]"
                               >
                                   {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Filter"}
                               </button>
                               {(selectedClass || selectedSection || searchQuery) && (
                                   <button 
                                        type="button" 
                                        disabled={loading}
                                        onClick={handleClearFilters}
                                        className="px-6 py-3 rounded-xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors h-[50px] whitespace-nowrap"
                                   >
                                        Clear
                                   </button>
                               )}
                           </div>
                      </form>
                 )}
            </div>

            {/* Error Message */}
            {error && (
                 <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-700">
                     <AlertCircle className="w-5 h-5 shrink-0" />
                     <p className="text-sm font-bold">{error}</p>
                 </div>
            )}

            {/* Data Table */}
            {!loading && !error && (
                 <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                      {filteredStudents.length === 0 ? (
                            <div className="p-16 text-center">
                                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No Students Found</h3>
                                <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
                            </div>
                      ) : (
                          <div className="overflow-x-auto">
                               <table className="w-full text-left border-collapse">
                                    <thead>
                                         <tr className="border-b border-slate-100">
                                              <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">Student Profile</th>
                                              <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">Admission No.</th>
                                              <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">Placement</th>
                                              <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 text-center">Enrolled</th>
                                         </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                         {filteredStudents.map((enrollment) => {
                                              const records = enrollment.attendance || [];
                                              const totalRecordCount = records.length;
                                              const presentCount = records.filter((a: any) => a.status === 'PRESENT').length;
                                              const attendancePercentage = totalRecordCount === 0 ? 0 : Math.round((presentCount / totalRecordCount) * 100);
                                              
                                              let attendanceColor = "bg-slate-200";
                                              let textColor = "text-slate-600";
                                              if (totalRecordCount > 0) {
                                                   if (attendancePercentage >= 85) { attendanceColor = "bg-emerald-500"; textColor = "text-emerald-600"; }
                                                   else if (attendancePercentage >= 75) { attendanceColor = "bg-amber-500"; textColor = "text-amber-600"; }
                                                   else { attendanceColor = "bg-rose-500"; textColor = "text-rose-600"; }
                                              }

                                              return (
                                                  <tr key={enrollment.id} className="hover:bg-slate-50/50 transition-colors group">
                                                      <td className="py-4 px-6">
                                                           <div className="flex items-center gap-3">
                                                               <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${enrollment.student.user.name}`} alt="avatar" />
                                                               </div>
                                                               <div>
                                                                    <p className="font-bold text-slate-800 group-hover:text-primary transition-colors">{enrollment.student.user.name}</p>
                                                                    <p className="text-xs text-slate-500">{enrollment.student.user.email || "No email"}</p>
                                                               </div>
                                                           </div>
                                                      </td>
                                                      <td className="py-4 px-6">
                                                           <span className="font-mono text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                                {enrollment.student.admissionNumber}
                                                           </span>
                                                      </td>
                                                      <td className="py-4 px-6">
                                                           <div>
                                                               <p className="font-bold text-slate-700 text-sm">Class {enrollment.class.name} • Sec {enrollment.section.name}</p>
                                                               <p className="text-xs text-slate-500 font-medium mt-0.5">Roll No: {enrollment.rollNumber}</p>
                                                           </div>
                                                      </td>
                                                      <td className="py-4 px-6">
                                                            <div className="w-full max-w-[120px] mx-auto">
                                                                <div className="flex justify-between items-end mb-1">
                                                                    <span className={`text-xs font-black ${totalRecordCount === 0 ? 'text-slate-400' : textColor}`}>
                                                                         {totalRecordCount === 0 ? 'N/A' : `${attendancePercentage}%`}
                                                                    </span>
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                                         {totalRecordCount} log(s)
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                                    <div 
                                                                         className={`h-full rounded-full transition-all duration-1000 ${attendanceColor}`} 
                                                                         style={{ width: `${totalRecordCount === 0 ? 0 : attendancePercentage}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                      </td>
                                                  </tr>
                                              );
                                         })}
                                    </tbody>
                               </table>
                          </div>
                      )}
                 </div>
            )}
        </div>
    );
}

export default function TeacherStudentsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <TeacherStudentsContent />
        </Suspense>
    );
}
