"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Search, Calendar, Loader2, BookX, Trash2, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { getTeacherHomework, getTeacherClasses, createHomework, deleteHomework } from "@/app/actions/teacher-dashboard-actions";
import HomeworkForm from "@/components/teacher/HomeworkForm";

function TeacherAssignmentsContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialClassId = searchParams.get("class") || "";
    const initialSectionId = searchParams.get("section") || "";



    const [loading, setLoading] = useState(true);
    const [homework, setHomework] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);


    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState(initialClassId);
    const [selectedSection, setSelectedSection] = useState(initialSectionId);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            initData();
        }
    }, [session]);


    useEffect(() => {
        if (session?.user?.id && !loading && assignments.length > 0) {
            const cId = searchParams.get("class") || "";
            const sId = searchParams.get("section") || "";
            if (cId !== selectedClass || sId !== selectedSection) {
                setSelectedClass(cId);
                setSelectedSection(sId);
            }
        }
    }, [searchParams]);

    const initData = async () => {
        setLoading(true);
        if (!session?.user?.id) return;


        const classRes = await getTeacherClasses(session.user.id);
        if (classRes.success && classRes.data) {
            setAssignments(classRes.data);
        }


        const hwRes = await getTeacherHomework(session.user.id);
        if (hwRes.success && hwRes.data) {
            setHomework(hwRes.data);
        } else {
            setError(hwRes.error || "Failed to load homework.");
        }

        setLoading(false);
    };

    const handleCreateAssignment = async (data: any) => {
        const res = await createHomework(session!.user!.id, data);
        if (res.success) {
            setIsFormOpen(false);
            initData();
        } else {
            alert(res.error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this assignment? Students will no longer see it.")) return;

        setDeletingId(id);
        const res = await deleteHomework(id, session!.user!.id);
        if (res.success) {
            setHomework(homework.filter(h => h.id !== id));
        } else {
            alert(res.error);
        }
        setDeletingId(null);
    };

    const filteredHomework = homework.filter(hw => {
        const matchesSearch = hw.title.toLowerCase().includes(searchQuery.toLowerCase()) || hw.subject.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = selectedClass ? hw.classId === selectedClass : true;
        const matchesSection = selectedSection ? hw.sectionId === selectedSection : true;
        return matchesSearch && matchesClass && matchesSection;
    });

    const activeTasksCount = filteredHomework.filter(hw => new Date(hw.dueDate) >= new Date()).length;
    const pastDueCount = filteredHomework.filter(hw => new Date(hw.dueDate) < new Date()).length;


    const uniqueClasses = Array.from(new Set(assignments.map(a => JSON.stringify({ id: a.class.id, name: a.class.name }))))
        .map(str => JSON.parse(str));


    const availableSections = assignments
        .filter(a => a.classId === selectedClass)
        .map(a => ({ id: a.section.id, name: a.section.name }))
        .filter((value, index, self) => index === self.findIndex((t) => t.id === value.id));

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (selectedClass) params.set("class", selectedClass);
        if (selectedSection) params.set("section", selectedSection);
        router.push(`/teacher/assignments?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSelectedClass("");
        setSelectedSection("");
        setSearchQuery("");
        router.push(`/teacher/assignments`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <BookOpen className="w-3 h-3" />
                        Assignment Workflow
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Manage Homework</h1>
                    <p className="text-slate-500 font-medium max-w-2xl">
                        Publish tasks, set deadlines, and manage curriculum assignments for your classes.
                    </p>
                </div>

            </div>


            {!loading && !error && homework.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
                    {[
                        { label: "Total Assignments", value: filteredHomework.length, icon: BookOpen, color: "bg-blue-600", light: "bg-blue-50" },
                        { label: "Active Tasks", value: activeTasksCount, icon: Clock, color: "bg-emerald-500", light: "bg-emerald-50" },
                        { label: "Past Due", value: pastDueCount, icon: AlertCircle, color: "bg-amber-500", light: "bg-amber-50" },
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


            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative z-20">
                {loading && homework.length === 0 ? (
                    <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : (
                    <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full relative">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Search Tasks</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search by title or subject..."
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
                                    setSelectedSection("");
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
                                Filter
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
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(true)}
                                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/30 whitespace-nowrap h-[50px] ml-4"
                            >
                                <Plus className="w-5 h-5" />
                                New Task
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : error ? (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-700">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="font-bold">{error}</p>
                </div>
            ) : filteredHomework.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-[2rem] p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookX className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">No Assignments Found</h3>
                    <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
                        {searchQuery
                            ? "No homework matches your current search filters."
                            : "You haven't assigned any homework yet. Click 'New Task' to get started."}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-lg shadow-slate-200"
                        >
                            <Plus className="w-5 h-5" />
                            Create First Assignment
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredHomework.map((hw, idx) => {
                            const isPastDue = new Date(hw.dueDate) < new Date();

                            return (
                                <motion.div
                                    key={hw.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: 0.05 * idx }}
                                    className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                            <span>{hw.subject.name}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span>{hw.class.name} - {hw.section.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(hw.id)}
                                            disabled={deletingId === hw.id}
                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {deletingId === hw.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{hw.title}</h3>
                                    <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3">{hw.description}</p>

                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                                        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg ${isPastDue
                                            ? "bg-slate-50 text-slate-500"
                                            : "bg-amber-50 text-amber-600 border border-amber-100"
                                            }`}>
                                            <Calendar className="w-4 h-4" />
                                            Due: {new Date(hw.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {isPastDue ? "Closed" : "Active"}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {isFormOpen && (
                <HomeworkForm
                    assignments={assignments}
                    initialClassId={selectedClass}
                    initialSectionId={selectedSection}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleCreateAssignment}
                />
            )}
        </div>
    );
}

export default function TeacherAssignmentsPage() {
    return (
        <React.Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <TeacherAssignmentsContent />
        </React.Suspense>
    );
}
