"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function getStudents(search?: string) {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: Role.STUDENT,
                isActive: true,
                ...(search ? {
                    // Type bypass due to Prisma client sync issue in environment
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { admissionNumber: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ] as any
                } : {})
            } as any,
            include: {
                student: {
                    include: {
                        enrollments: {
                            include: {
                                class: true,
                                section: true,
                                academicYear: true,
                            },
                            where: {
                                academicYear: {
                                    isCurrent: true
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                name: 'asc'
            } as any
        });

        // Transform into Student-centric objects for the UI
        const students = users
            .filter(u => u.student) // Ensure they have a student record
            .map(u => ({
                ...u.student,
                user: u
            }));

        return { success: true, data: students };
    } catch (error) {
        console.error("Failed to fetch students:", error);
        return { success: false, error: "Failed to fetch students" };
    }
}

export async function createStudent(formData: any) {
    try {
        const {
            name,
            email,
            admissionNumber,
            password,
            fatherName,
            motherName,
            phone,
            address,
            dateOfBirth,
            enrollmentData, // Optional enrollment data
        } = formData;

        const hashedPassword = await bcrypt.hash(password || "student123", 10);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email: email || null,
                    admissionNumber,
                    passwordHash: hashedPassword,
                    role: Role.STUDENT,
                } as any,
            });

            const student = await tx.student.create({
                data: {
                    userId: user.id,
                    admissionNumber,
                    fatherName,
                    motherName,
                    phone,
                    address,
                    dateOfBirth: new Date(dateOfBirth),
                },
            });

            // If enrollment data is provided, create enrollment record
            if (enrollmentData && enrollmentData.classId && enrollmentData.sectionId) {
                await tx.enrollment.create({
                    data: {
                        studentId: student.id,
                        classId: enrollmentData.classId,
                        sectionId: enrollmentData.sectionId,
                        academicYearId: enrollmentData.academicYearId,
                        rollNumber: enrollmentData.rollNumber,
                        status: 'ACTIVE'
                    }
                });
            }

            return student;
        });

        revalidatePath("/admin/students");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to create student:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Admission number or email already exists" };
        }
        return { success: false, error: "Failed to create student" };
    }
}

export async function updateStudent(id: string, formData: any) {
    try {
        const {
            name,
            email,
            admissionNumber,
            fatherName,
            motherName,
            phone,
            address,
            dateOfBirth,
            enrollmentData, // Optional enrollment data for update
        } = formData;

        await prisma.$transaction(async (tx) => {
            const student = await tx.student.findUnique({
                where: { id },
                include: { user: true }
            });

            if (!student) throw new Error("Student not found");

            await tx.user.update({
                where: { id: student.userId } as any,
                data: {
                    name,
                    email: email || null,
                    admissionNumber,
                } as any,
            });

            await tx.student.update({
                where: { id },
                data: {
                    admissionNumber,
                    fatherName,
                    motherName,
                    phone,
                    address,
                    dateOfBirth: new Date(dateOfBirth),
                },
            });

            // Handle enrollment update if data provided
            if (enrollmentData && enrollmentData.classId && enrollmentData.sectionId) {
                await tx.enrollment.upsert({
                    where: {
                        studentId_academicYearId: {
                            studentId: id,
                            academicYearId: enrollmentData.academicYearId
                        }
                    },
                    update: {
                        classId: enrollmentData.classId,
                        sectionId: enrollmentData.sectionId,
                        rollNumber: enrollmentData.rollNumber,
                        status: 'ACTIVE'
                    },
                    create: {
                        studentId: id,
                        classId: enrollmentData.classId,
                        sectionId: enrollmentData.sectionId,
                        academicYearId: enrollmentData.academicYearId,
                        rollNumber: enrollmentData.rollNumber,
                        status: 'ACTIVE'
                    }
                });
            }
        });

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error) {
        console.error("Failed to update student:", error);
        return { success: false, error: "Failed to update student" };
    }
}

export async function deleteStudent(id: string) {
    try {
        const student = await prisma.student.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!student) throw new Error("Student not found");

        await prisma.user.update({
            where: { id: student.userId } as any,
            data: { isActive: false } as any
        });

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete student:", error);
        return { success: false, error: "Failed to delete student" };
    }
}

export async function getEnrollmentData() {
    try {
        const academicYear = await prisma.academicYear.findFirst({
            where: { isCurrent: true }
        });

        if (!academicYear) {
            return { success: false, error: "No current academic year found" };
        }

        const classes = await prisma.class.findMany({
            where: { academicYearId: academicYear.id },
            include: {
                sections: true
            }
        });

        return {
            success: true,
            data: {
                academicYear,
                classes
            }
        };
    } catch (error) {
        console.error("Failed to fetch enrollment data:", error);
        return { success: false, error: "Failed to fetch enrollment data" };
    }
}

export async function enrollStudent(studentId: string, classId: string, sectionId: string, academicYearId: string, rollNumber: number) {
    try {
        const enrollment = await prisma.enrollment.upsert({
            where: {
                studentId_academicYearId: {
                    studentId,
                    academicYearId
                }
            },
            update: {
                classId,
                sectionId,
                rollNumber,
                status: 'ACTIVE'
            },
            create: {
                studentId,
                classId,
                sectionId,
                academicYearId,
                rollNumber,
                status: 'ACTIVE'
            }
        });

        revalidatePath("/admin/students");
        return { success: true, data: enrollment };
    } catch (error: any) {
        console.error("Failed to enroll student:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Roll number already assigned in this class and section" };
        }
        return { success: false, error: "Failed to enroll student" };
    }
}

