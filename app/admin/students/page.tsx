"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    UsersRound,
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    ChevronDown,
    Loader2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap
} from "lucide-react";
import { getStudents, createStudent, updateStudent, deleteStudent, enrollStudent } from "@/app/actions/student-actions";
import Modal from "@/components/ui/Modal";
import StudentForm from "@/components/admin/StudentForm";

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const fetchStudents = async () => {
        setLoading(true);
        const result = await getStudents(search);
        if (result.success) {
            setStudents(result.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudents();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleCreateOrUpdate = async (formData: any) => {
        let result;
        if (selectedStudent) {
            result = await updateStudent(selectedStudent.id, formData);
        } else {
            result = await createStudent(formData);
        }

        if (result.success) {
            setIsModalOpen(false);
            setSelectedStudent(null);
            fetchStudents();
        } else {
            alert(result.error || "Something went wrong");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to deactivate this student?")) {
            const result = await deleteStudent(id);
            if (result.success) {
                fetchStudents();
            }
        }
    };

    const openEditModal = (student: any) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
                            <UsersRound className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#0F172A]">Student Management</h1>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Manage student profiles, enrollments, and academic data.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-11 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 w-full md:w-80 transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={() => { setSelectedStudent(null); setIsModalOpen(true); }}
                        className="bg-primary text-white p-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <span className="hidden sm:inline">Add Student</span>
                    </button>
                </div>
            </div>

            {/* Students Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Student Info</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Current Class</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Joined Date</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="w-10 h-10 animate-spin text-primary/20" />
                                            <p className="text-slate-400 font-medium animate-pulse">Retrieving student records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={student.id}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.user.name}`}
                                                        alt={student.user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-[#0F172A] group-hover:text-primary transition-colors">{student.user.name}</div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{student.admissionNumber}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {student.user.email || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {student.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            {student.enrollments?.[0] ? (
                                                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100">
                                                    <GraduationCap className="w-4 h-4" />
                                                    <span className="text-xs font-bold whitespace-nowrap">
                                                        Class {student.enrollments[0].class.name}-{student.enrollments[0].section.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-300 italic">Not Enrolled</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs text-[#0F172A] font-bold">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {new Date(student.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setActiveMenu(activeMenu === student.id ? null : student.id)}
                                                        className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-[#0F172A] transition-all"
                                                    >
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>

                                                    {activeMenu === student.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() => setActiveMenu(null)}
                                                            />
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-20 overflow-hidden">
                                                                <button
                                                                    onClick={() => openEditModal(student)}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                    Edit Profile
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setActiveMenu(null);
                                                                        // View profile logic here
                                                                    }}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#0F172A] rounded-xl transition-all"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    View Details
                                                                </button>
                                                                <div className="h-px bg-slate-50 my-2" />
                                                                <button
                                                                    onClick={() => {
                                                                        setActiveMenu(null);
                                                                        handleDelete(student.id);
                                                                    }}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Deactivate
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing {students.length} results
                    </p>
                    <div className="flex items-center gap-2">
                        <button disabled className="p-2 rounded-lg text-slate-300 cursor-not-allowed">
                            <ChevronDown className="w-5 h-5 rotate-90" />
                        </button>
                        <span className="text-xs font-bold text-[#0F172A]">Page 1</span>
                        <button disabled className="p-2 rounded-lg text-slate-300 cursor-not-allowed">
                            <ChevronDown className="w-5 h-5 -rotate-90" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Registration/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedStudent(null); }}
                title={selectedStudent ? "Edit Student Profile" : "New Student Registration"}
            >
                <StudentForm
                    initialData={selectedStudent}
                    onSubmit={handleCreateOrUpdate}
                />
            </Modal>
        </div>
    );
}

