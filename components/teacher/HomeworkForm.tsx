"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Calendar, BookOpen, AlertCircle } from "lucide-react";

interface HomeworkFormProps {
    onClose: () => void;
    onSubmit: (data: { title: string; description: string; dueDate: string; assignmentId: string }) => Promise<void>;
    assignments: any[]; // The authorized assignments for this teacher
    initialClassId?: string;
    initialSectionId?: string;
}

export default function HomeworkForm({ onClose, onSubmit, assignments, initialClassId, initialSectionId }: HomeworkFormProps) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [selectedAssignmentId, setSelectedAssignmentId] = useState("");

    // Pre-fill the dropdown if opened from a pre-filtered view
    useEffect(() => {
         if (initialClassId && initialSectionId && assignments.length > 0) {
              const matchedAssignment = assignments.find(a => a.classId === initialClassId && a.sectionId === initialSectionId);
              if (matchedAssignment) {
                   setSelectedAssignmentId(matchedAssignment.id);
              }
         }
    }, [initialClassId, initialSectionId, assignments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit({ title, description, dueDate, assignmentId: selectedAssignmentId });
        setLoading(false);
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium bg-slate-50";
    const labelClasses = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1";

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div 
                className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex items-start gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Publish Assignment</h2>
                        <p className="text-sm font-medium text-slate-500">Create a new homework task for your students.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {assignments.length === 0 ? (
                         <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800">
                             <AlertCircle className="w-5 h-5 shrink-0" />
                             <p className="text-sm font-bold">You must be assigned to at least one class before publishing assignments.</p>
                         </div>
                    ) : (
                        <>
                            {/* Target Audience */}
                            <div>
                                <label className={labelClasses}>Select Class & Subject</label>
                                <select
                                    required
                                    value={selectedAssignmentId}
                                    onChange={(e) => setSelectedAssignmentId(e.target.value)}
                                    className={`${inputClasses} bg-white text-slate-700`}
                                >
                                    <option value="" disabled>Choose assigned section...</option>
                                    {assignments.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.subject.name} - Class {a.class.name} (Sec {a.section.name})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Assignment Title</label>
                                    <input
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Chapter 4 Practice Questions"
                                        className={inputClasses}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Description & Instructions</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Provide detailed instructions for the students..."
                                        className={`${inputClasses} resize-none`}
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Due Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={dueDate}
                                        min={new Date().toISOString().split('T')[0]} // Cannot be in past
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || assignments.length === 0}
                            className="flex-1 bg-primary text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Publish Now</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
