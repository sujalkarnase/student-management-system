"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Users, Plus, MoreHorizontal, Edit2, Trash2, GraduationCap, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getClasses, createClass, updateClass, deleteClass } from "@/app/actions/class-actions";
import Modal from "@/components/ui/Modal";
import ClassForm from "@/components/admin/ClassForm";

export default function AdminClassesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [academicYear, setAcademicYear] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        const result = await getClasses();
        if (result.success) {
            setClasses(result.data || []);
            setAcademicYear(result.academicYear);
        }
        setLoading(false);
    };

    const handleCreateOrUpdate = async (formData: any) => {
        let result;
        if (selectedClass) {
            result = await updateClass(selectedClass.id, formData);
        } else {
            result = await createClass(formData);
        }

        if (result.success) {
            setIsModalOpen(false);
            setSelectedClass(null);
            fetchClasses();
        } else {
            alert(result.error || "Something went wrong");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete Class ${name}? This assumes no students are currently active in it.`)) {
            const result = await deleteClass(id);
            if (result.success) {
                fetchClasses();
            } else {
                alert(result.error || "Failed to delete class");
            }
        }
    };

    const openCreateModal = () => {
        setSelectedClass(null);
        setIsModalOpen(true);
    };

    const openEditModal = (cls: any) => {
        setSelectedClass(cls);
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.subjects.some((s: any) => s.name.toLowerCase().includes(search.toLowerCase()))
    );

    const totalSections = classes.reduce((acc, c) => acc + c.sections.length, 0);
    const totalSubjectsUnique = new Set(classes.flatMap(c => c.subjects.map((s: any) => s.name.toLowerCase()))).size;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                        Curriculum <span className="text-primary italic">Manager</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Design classes, assign sections, and manage subjects.</p>
                </div>
                <div className="flex items-center gap-4">
                    {academicYear && (
                        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-sm font-bold text-slate-600">Session: {academicYear.yearLabel}</span>
                        </div>
                    )}
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <span className="hidden sm:inline">Add Class</span>
                    </button>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Classes", value: classes.length, icon: GraduationCap, color: "bg-blue-500" },
                    { label: "Total Sections", value: totalSections, icon: Users, color: "bg-emerald-500" },
                    { label: "Unique Subjects", value: totalSubjectsUnique, icon: BookOpen, color: "bg-amber-500" },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>


            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search classes or subjects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-600 shadow-sm"
                    />
                </div>
            </div>


            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-slate-100 border-dashed">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Loading Curriculum...</p>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-slate-100 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold text-lg">No classes found.</p>
                    <button onClick={openCreateModal} className="text-primary font-bold hover:underline">Create your first class</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((cls, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            key={cls.id}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all p-6 relative group overflow-hidden"
                        >

                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                        Class {cls.name}
                                    </h3>
                                    <div className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {cls._count?.enrollments || 0} Active Students
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === cls.id ? null : cls.id)}
                                        className="p-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                                    >
                                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                    </button>
                                    <AnimatePresence>
                                        {activeMenu === cls.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-20"
                                                >
                                                    <button
                                                        onClick={() => openEditModal(cls)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all"
                                                    >
                                                        <Edit2 className="w-4 h-4" /> Edit Config
                                                    </button>
                                                    <div className="h-px bg-slate-50 my-1" />
                                                    <button
                                                        onClick={() => handleDelete(cls.id, cls.name)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete Class
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="space-y-4">

                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Sections
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cls.sections.map((sec: any) => (
                                            <span key={sec.id} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200/50">
                                                Sec {sec.name}
                                            </span>
                                        ))}
                                        {cls.sections.length === 0 && <span className="text-xs text-slate-400 italic">None</span>}
                                    </div>
                                </div>


                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" /> Subjects Curriculum
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cls.subjects.map((sub: any) => (
                                            <span key={sub.id} className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-lg border border-blue-100/50">
                                                {sub.name}
                                            </span>
                                        ))}
                                        {cls.subjects.length === 0 && <span className="text-xs text-slate-400 italic">None</span>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}


            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedClass(null); }}
                title={selectedClass ? `Edit Config: Class ${selectedClass.name}` : "Create Master Class"}
            >
                <ClassForm
                    initialData={selectedClass}
                    onSubmit={handleCreateOrUpdate}
                />
            </Modal>
        </div>
    );
}
