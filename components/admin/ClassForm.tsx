"use client";

import React, { useState } from "react";
import { Loader2, Plus, Trash2, BookOpen, Users } from "lucide-react";

interface ClassFormProps {
    initialData?: {
        id: string;
        name: string;
        sections: { id?: string; name: string }[];
        subjects: { id?: string; name: string }[];
    } | null;
    onSubmit: (data: any) => Promise<void>;
}

export default function ClassForm({ initialData, onSubmit }: ClassFormProps) {
    const [loading, setLoading] = useState(false);
    
    const [name, setName] = useState(initialData?.name || "");
    const [sections, setSections] = useState<{ id?: string; name: string }[]>(
        initialData?.sections?.length ? initialData.sections : [{ name: "A" }]
    );
    const [subjects, setSubjects] = useState<{ id?: string; name: string }[]>(
        initialData?.subjects?.length ? initialData.subjects : [{ name: "English" }]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Filter out empty entries
        const filteredSections = sections.filter(s => s.name.trim() !== "");
        const filteredSubjects = subjects.filter(s => s.name.trim() !== "");

        if (!name.trim()) return alert("Class name is required.");
        if (filteredSections.length === 0) return alert("At least one section is required.");
        if (filteredSubjects.length === 0) return alert("At least one subject is required.");

        setLoading(true);
        try {
            await onSubmit({
                name,
                sections: filteredSections,
                subjects: filteredSubjects
            });
        } finally {
            setLoading(false);
        }
    };

    const handleArrayChange = (
        index: number, 
        value: string, 
        setter: React.Dispatch<React.SetStateAction<any[]>>,
        array: any[]
    ) => {
        const newArray = [...array];
        newArray[index].name = value;
        setter(newArray);
    };

    const addArrayItem = (setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        setter(prev => [...prev, { name: "" }]);
    };

    const removeArrayItem = (index: number, setter: React.Dispatch<React.SetStateAction<any[]>>, array: any[]) => {
        if (array.length <= 1) return; // Prevent removing last item
        const newArray = array.filter((_, i) => i !== index);
        setter(newArray);
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white";
    const labelClasses = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
                <label className={labelClasses}>Class Name</label>
                <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClasses}
                    placeholder="e.g. Class 10 or Grade X"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sections Manager */}
                <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-slate-700">Sections</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => addArrayItem(setSections)}
                            className="text-xs font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded border border-primary/20 transition-colors"
                        >
                            + Add
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {sections.map((section, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    required
                                    value={section.name}
                                    onChange={(e) => handleArrayChange(index, e.target.value, setSections, sections)}
                                    className={inputClasses}
                                    placeholder="e.g. A"
                                />
                                <button
                                    type="button"
                                    disabled={sections.length <= 1}
                                    onClick={() => removeArrayItem(index, setSections, sections)}
                                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subjects Manager */}
                <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-bold text-slate-700">Subjects</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => addArrayItem(setSubjects)}
                            className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded border border-blue-200 transition-colors"
                        >
                            + Add
                        </button>
                    </div>
                    
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {subjects.map((subject, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    required
                                    value={subject.name}
                                    onChange={(e) => handleArrayChange(index, e.target.value, setSubjects, subjects)}
                                    className={inputClasses}
                                    placeholder="e.g. Mathematics"
                                />
                                <button
                                    type="button"
                                    disabled={subjects.length <= 1}
                                    onClick={() => removeArrayItem(index, setSubjects, subjects)}
                                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        initialData ? "Update Configuration" : "Create Class & Setup Curriculum"
                    )}
                </button>
            </div>
        </form>
    );
}
