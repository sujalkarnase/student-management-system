"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export async function getTeachers(search: string = "") {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: Role.TEACHER,
                isActive: true,
                ...(search ? {
                    // Type bypass due to Prisma client sync issue in environment
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { admissionNumber: { contains: search, mode: 'insensitive' } }
                    ] as any
                } : {})
            } as any,
            include: {
                teacher: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Transform into Teacher-centric objects
        const teachers = users
            .filter(u => u.teacher)
            .map(u => ({
                ...u.teacher,
                user: u
            }));

        return { success: true, data: teachers };
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        return { success: false, error: "Failed to fetch teachers" };
    }
}

export async function createTeacher(formData: any) {
    try {
        const {
            name,
            email,
            employeeId,
            password,
            qualification,
            salary,
            joiningDate,
        } = formData;

        const hashedPassword = await bcrypt.hash(password || "teacher123", 10);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email: email || null,
                    admissionNumber: employeeId,
                    passwordHash: hashedPassword,
                    role: Role.TEACHER,
                },
            });

            const teacher = await tx.teacher.create({
                data: {
                    userId: user.id,
                    qualification,
                    salary: parseFloat(salary),
                    joiningDate: new Date(joiningDate),
                },
            });

            return teacher;
        });

        revalidatePath("/admin/teachers");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to create teacher:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Employee ID or Email already exists" };
        }
        return { success: false, error: "Failed to create teacher" };
    }
}

export async function updateTeacher(id: string, formData: any) {
    try {
        const {
            name,
            email,
            employeeId,
            qualification,
            salary,
            joiningDate,
        } = formData;

        await prisma.$transaction(async (tx) => {
            const teacher = await tx.teacher.findUnique({
                where: { id },
                include: { user: true }
            });

            if (!teacher) throw new Error("Teacher not found");

            await tx.user.update({
                where: { id: teacher.userId },
                data: {
                    name,
                    email: email || null,
                    admissionNumber: employeeId,
                },
            });

            await tx.teacher.update({
                where: { id },
                data: {
                    qualification,
                    salary: parseFloat(salary),
                    joiningDate: new Date(joiningDate),
                },
            });
        });

        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error) {
        console.error("Failed to update teacher:", error);
        return { success: false, error: "Failed to update teacher" };
    }
}

export async function deleteTeacher(id: string) {
    try {
        const teacher = await prisma.teacher.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!teacher) throw new Error("Teacher not found");

        await prisma.user.update({
            where: { id: teacher.userId },
            data: { isActive: false }
        });

        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete teacher:", error);
        return { success: false, error: "Failed to delete teacher" };
    }
}

export async function getAssignmentData() {
    try {
        const academicYear = await prisma.academicYear.findFirst({
            where: { isCurrent: true }
        });

        if (!academicYear) throw new Error("No current academic year found");

        const classes = await prisma.class.findMany({
            where: { academicYearId: academicYear.id },
            include: {
                sections: true,
                subjects: true
            }
        });

        return { success: true, data: { academicYear, classes } };
    } catch (error) {
        console.error("Failed to fetch assignment data:", error);
        return { success: false, error: "Failed to fetch assignment data" };
    }
}

export async function assignTeacher(data: any) {
    try {
        const assignment = await prisma.teacherAssignment.create({
            data: {
                teacherId: data.teacherId,
                subjectId: data.subjectId,
                classId: data.classId,
                sectionId: data.sectionId,
                academicYearId: data.academicYearId
            }
        });

        revalidatePath("/admin/teachers");
        return { success: true, data: assignment };
    } catch (error) {
        console.error("Failed to assign teacher:", error);
        return { success: false, error: "Failed to assign teacher" };
    }
}

export async function getTeacherAssignments(teacherId: string) {
    try {
        const assignments = await prisma.teacherAssignment.findMany({
            where: { teacherId },
            include: {
                subject: true,
                class: true,
                section: true,
                academicYear: true
            }
        });
        return { success: true, data: assignments };
    } catch (error) {
        console.error("Failed to fetch assignments:", error);
        return { success: false, error: "Failed to fetch assignments" };
    }
}

export async function removeAssignment(id: string) {
    try {
        await prisma.teacherAssignment.delete({
            where: { id }
        });
        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error) {
        console.error("Failed to remove assignment:", error);
        return { success: false, error: "Failed to remove assignment" };
    }
}
