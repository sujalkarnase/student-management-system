"use client";

import React, { useState, useEffect } from "react";
import { Loader2, BookOpen, GraduationCap, X, Plus, Trash2 } from "lucide-react";
import { getAssignmentData, assignTeacher, getTeacherAssignments, removeAssignment } from "@/app/actions/teacher-actions";

interface TeacherAssignmentFormProps {
    teacherId: string;
    teacherName: string;
}

export default function TeacherAssignmentForm({ teacherId, teacherName }: TeacherAssignmentFormProps) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState<{ academicYear: any; classes: any[] } | null>(null);
    const [assignments, setAssignments] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        classId: "",
        sectionId: "",
        subjectId: "",
    });

    useEffect(() => {
        fetchData();
        fetchAssignments();
    }, [teacherId]);

    const fetchData = async () => {
        const result = await getAssignmentData();
        if (result.success && result.data) setData(result.data);
        setLoading(false);
    };

    const fetchAssignments = async () => {
        const result = await getTeacherAssignments(teacherId);
        if (result.success) setAssignments(result.data || []);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === "classId" ? { sectionId: "", subjectId: "" } : {})
        }));
    };

    const handleAssign = async () => {
        if (!formData.classId || !formData.sectionId || !formData.subjectId) return;

        setSubmitting(true);
        const result = await assignTeacher({
            teacherId,
            ...formData,
            academicYearId: data?.academicYear.id
        });

        if (result.success) {
            setFormData({ classId: "", sectionId: "", subjectId: "" });
            fetchAssignments();
        } else {
            alert(result.error || "Assignment failed");
        }
        setSubmitting(false);
    };

    const handleRemove = async (id: string) => {
        if (confirm("Remove this assignment?")) {
            const result = await removeAssignment(id);
            if (result.success) fetchAssignments();
        }
    };

    if (loading) return (
        <div className="py-12 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading assignment data...</p>
        </div>
    );

    const selectedClass = data?.classes.find(c => c.id === formData.classId);

    return (
        <div className="space-y-8">
            {/* New Assignment Form */}
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Plus className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-slate-700">New Assignment</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Class</label>
                        <select
                            name="classId"
                            value={formData.classId}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
                        >
                            <option value="">Select Class</option>
                            {data?.classes.map(cls => (
                                <option key={cls.id} value={cls.id}>Class {cls.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Section</label>
                        <select
                            name="sectionId"
                            value={formData.sectionId}
                            onChange={handleChange}
                            disabled={!formData.classId}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Section</option>
                            {selectedClass?.sections.map((sec: any) => (
                                <option key={sec.id} value={sec.id}>Section {sec.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Subject</label>
                        <select
                            name="subjectId"
                            value={formData.subjectId}
                            onChange={handleChange}
                            disabled={!formData.classId}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Subject</option>
                            {selectedClass?.subjects.map((sub: any) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleAssign}
                    disabled={submitting || !formData.subjectId || !formData.sectionId}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none"
                >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Assign to {teacherName}</>}
                </button>
            </div>

            {/* Current Assignments List */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Active Assignments</span>
                </div>

                {assignments.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400 font-medium">
                        No subjects assigned yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {assignments.map((asgn) => (
                            <div key={asgn.id} className="group bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">{asgn.subject.name}</div>
                                        <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
                                            <span>Class {asgn.class.name}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span>Section {asgn.section.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(asgn.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
