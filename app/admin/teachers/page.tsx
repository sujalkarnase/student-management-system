"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    UserPlus,
    GraduationCap,
    DollarSign,
    MoreHorizontal,
    Edit2,
    Trash2,
    Eye,
    ChevronRight,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getTeachers, createTeacher, updateTeacher, deleteTeacher, getAssignmentData, assignTeacher, getTeacherAssignments, removeAssignment } from "@/app/actions/teacher-actions";
import Modal from "@/components/ui/Modal";
import TeacherForm from "@/components/admin/TeacherForm";
import TeacherAssignmentForm from "@/components/admin/TeacherAssignmentForm";

export default function AdminTeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        fetchTeachers();
    }, [search]);

    const fetchTeachers = async () => {
        setLoading(true);
        const result = await getTeachers(search);
        if (result.success) {
            setTeachers(result.data || []);
        }
        setLoading(false);
    };

    const handleCreateOrUpdate = async (formData: any) => {
        let result;
        if (selectedTeacher) {
            result = await updateTeacher(selectedTeacher.id, formData);
        } else {
            result = await createTeacher(formData);
        }

        if (result.success) {
            setIsModalOpen(false);
            setSelectedTeacher(null);
            fetchTeachers();
        } else {
            alert(result.error || "Something went wrong");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to deactivate this teacher?")) {
            const result = await deleteTeacher(id);
            if (result.success) {
                fetchTeachers();
            } else {
                alert(result.error || "Failed to deactivate");
            }
        }
    };

    const openCreateModal = () => {
        setSelectedTeacher(null);
        setIsModalOpen(true);
    };

    const openEditModal = (teacher: any) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const openAssignmentModal = (teacher: any) => {
        setSelectedTeacher(teacher);
        setIsAssignmentModalOpen(true);
        setActiveMenu(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                        Teachers <span className="text-primary italic">Directory</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Manage your faculty, qualifications, and payroll.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Register Teacher
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Faculty", value: teachers.length, icon: GraduationCap, color: "bg-blue-500" },
                    { label: "Active Staff", value: teachers.filter(t => t.user.isActive).length, icon: UserPlus, color: "bg-emerald-500" },
                    { label: "Avg. Salary", value: "₹ " + (teachers.reduce((acc, t) => acc + Number(t.salary), 0) / (teachers.length || 1)).toFixed(0), icon: DollarSign, color: "bg-amber-500" },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4"
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

            {/* Filters & Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                {/* Table Header / Search */}
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-600"
                        />
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Teacher</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID & Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Qualification</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Salary</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching Directory...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No teachers found in the directory.
                                    </td>
                                </tr>
                            ) : (
                                teachers.map((teacher) => (
                                    <motion.tr
                                        layout
                                        key={teacher.id}
                                        className="hover:bg-slate-50/80 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.user.name}`}
                                                        alt={teacher.user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{teacher.user.name}</div>
                                                    <div className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full inline-block">TEACHER</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                                    <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">ID</span>
                                                    {teacher.user.admissionNumber || "N/A"}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Mail className="w-3 h-3" />
                                                    {teacher.user.email || "No Email"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-600 truncate max-w-[200px]">
                                                {teacher.qualification}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                Certified Professional
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-black text-slate-800 flex items-center gap-1">
                                                ₹ {Number(teacher.salary).toLocaleString()}
                                                <span className="text-[10px] font-bold text-slate-400">/mo</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                <Calendar className="w-3 h-3 text-emerald-500" />
                                                Joined {new Date(teacher.joiningDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === teacher.id ? null : teacher.id)}
                                                className="p-2 hover:bg-white rounded-xl transition-all hover:shadow-md border border-transparent hover:border-slate-100"
                                            >
                                                <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                            </button>

                                            <AnimatePresence>
                                                {activeMenu === teacher.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() => setActiveMenu(null)}
                                                        />
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-20 overflow-hidden"
                                                        >
                                                            <button
                                                                onClick={() => openEditModal(teacher)}
                                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                                Edit Profile
                                                            </button>
                                                            <button
                                                                onClick={() => openAssignmentModal(teacher)}
                                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                Assignments
                                                            </button>
                                                            <div className="h-px bg-slate-50 my-1" />
                                                            <button
                                                                onClick={() => handleDelete(teacher.id)}
                                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Deactivate
                                                            </button>
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedTeacher(null); }}
                title={selectedTeacher ? "Edit Teacher Profile" : "Register New Teacher"}
            >
                <TeacherForm
                    initialData={selectedTeacher}
                    onSubmit={handleCreateOrUpdate}
                />
            </Modal>

            {/* Assignment Modal */}
            <Modal
                isOpen={isAssignmentModalOpen}
                onClose={() => { setIsAssignmentModalOpen(false); setSelectedTeacher(null); }}
                title="Teacher Assignments"
            >
                {selectedTeacher && (
                    <TeacherAssignmentForm
                        teacherId={selectedTeacher.id}
                        teacherName={selectedTeacher.user.name}
                    />
                )}
            </Modal>
        </div>
    );
}
