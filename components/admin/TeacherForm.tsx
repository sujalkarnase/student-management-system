"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface TeacherFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
}

export default function TeacherForm({ initialData, onSubmit }: TeacherFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.user?.name || "",
        email: initialData?.user?.email || "",
        employeeId: initialData?.user?.admissionNumber || "",
        password: "",
        qualification: initialData?.qualification || "",
        salary: initialData?.salary?.toString() || "",
        joiningDate: initialData?.joiningDate ? new Date(initialData.joiningDate).toISOString().split('T')[0] : "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white";
    const labelClasses = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className={labelClasses}>Full Name</label>
                    <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="Dr. John Smith"
                    />
                </div>

                <div>
                    <label className={labelClasses}>Employee ID</label>
                    <input
                        required
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="EMP001"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Email (Optional)</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="john.smith@school.com"
                    />
                </div>

                {!initialData && (
                    <div className="md:col-span-2">
                        <label className={labelClasses}>Initial Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="••••••••"
                        />
                    </div>
                )}

                <div>
                    <label className={labelClasses}>Qualification</label>
                    <input
                        required
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="M.Sc. Physics, B.Ed."
                    />
                </div>
                <div>
                    <label className={labelClasses}>Monthly Salary</label>
                    <input
                        required
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="50000"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Joining Date</label>
                    <input
                        required
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="pt-4">
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        initialData ? "Update Teacher Profile" : "Register Teacher"
                    )}
                </button>
            </div>
        </form>
    );
}
