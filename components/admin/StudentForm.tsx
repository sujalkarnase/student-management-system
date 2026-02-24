"use client";

import React, { useState, useEffect } from "react";
import { Loader2, GraduationCap } from "lucide-react";
import { getEnrollmentData } from "@/app/actions/student-actions";

interface StudentFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
}

export default function StudentForm({ initialData, onSubmit }: StudentFormProps) {
    const [loading, setLoading] = useState(false);
    const [enrollmentLoading, setEnrollmentLoading] = useState(true);
    const [enrollmentData, setEnrollmentData] = useState<{ academicYear: any; classes: any[] } | null>(null);

    const [formData, setFormData] = useState({
        name: initialData?.user?.name || "",
        email: initialData?.user?.email || "",
        admissionNumber: initialData?.admissionNumber || "",
        password: "",
        fatherName: initialData?.fatherName || "",
        motherName: initialData?.motherName || "",
        phone: initialData?.phone || "",
        address: initialData?.address || "",
        dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : "",
        // Integrated enrollment fields
        classId: initialData?.enrollments?.[0]?.classId || "",
        sectionId: initialData?.enrollments?.[0]?.sectionId || "",
        rollNumber: initialData?.enrollments?.[0]?.rollNumber?.toString() || "",
    });

    useEffect(() => {
        const fetchEnrollment = async () => {
            const result = await getEnrollmentData();
            if (result.success && result.data) {
                setEnrollmentData(result.data);
            }
            setEnrollmentLoading(false);
        };
        fetchEnrollment();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === "classId" ? { sectionId: "" } : {})
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSubmit = { ...formData };
            if (formData.classId && formData.sectionId) {
                // @ts-ignore
                dataToSubmit.enrollmentData = {
                    classId: formData.classId,
                    sectionId: formData.sectionId,
                    rollNumber: parseInt(formData.rollNumber),
                    academicYearId: enrollmentData?.academicYear.id
                };
            }
            await onSubmit(dataToSubmit);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white";
    const labelClasses = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1";

    const selectedClass = enrollmentData?.classes.find(c => c.id === formData.classId);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Full Name</label>
                    <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Admission Number</label>
                    <input
                        required
                        name="admissionNumber"
                        value={formData.admissionNumber}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="STU001"
                    />
                </div>

                {/* Integrated Enrollment Fields Section */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="md:col-span-3 flex items-center gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-slate-700">Academic Placement</span>
                    </div>
                    {enrollmentLoading ? (
                        <div className="md:col-span-3 py-4 flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                            <span className="text-xs text-slate-400">Loading sessions...</span>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className={labelClasses}>Class</label>
                                <select
                                    name="classId"
                                    value={formData.classId}
                                    onChange={handleChange}
                                    className={inputClasses}
                                >
                                    <option value="">Select Class</option>
                                    {enrollmentData?.classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>Class {cls.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Section</label>
                                <select
                                    name="sectionId"
                                    value={formData.sectionId}
                                    onChange={handleChange}
                                    disabled={!formData.classId}
                                    className={inputClasses}
                                >
                                    <option value="">Select Section</option>
                                    {selectedClass?.sections.map((sec: any) => (
                                        <option key={sec.id} value={sec.id}>Section {sec.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Roll No.</label>
                                <input
                                    type="number"
                                    name="rollNumber"
                                    value={formData.rollNumber}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="e.g. 01"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div>
                    <label className={labelClasses}>Email (Optional)</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="john@example.com"
                    />
                </div>
                {!initialData && (
                    <div>
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
                    <label className={labelClasses}>Father's Name</label>
                    <input
                        required
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="Mr. Doe"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Mother's Name</label>
                    <input
                        required
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="Mrs. Doe"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Phone Number</label>
                    <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="+1 234 567 890"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Date of Birth</label>
                    <input
                        required
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={inputClasses}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClasses}>Address</label>
                    <textarea
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className={inputClasses}
                        placeholder="123 Education Lane..."
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
                        initialData ? "Update Student" : "Register Student"
                    )}
                </button>
            </div>
        </form>
    );
}
