"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getActiveYear() {
    return prisma.academicYear.findFirst({ where: { isCurrent: true } });
}

export async function getStudentDashboardData(userId: string) {
    try {
        const activeYear = await getActiveYear();
        if (!activeYear) return { success: false, error: "No active academic year." };

        const student = await prisma.student.findUnique({
             where: { userId },
             include: { user: true }
        });

        if (!student) return { success: false, error: "Student profile not found." };

        // 1. Get Active Enrollment
        const enrollment = await prisma.enrollment.findUnique({
             where: {
                 studentId_academicYearId: {
                     studentId: student.id,
                     academicYearId: activeYear.id
                 }
             },
             include: {
                 class: true,
                 section: true
             }
        });

        if (!enrollment || enrollment.status !== "ACTIVE") {
             return { success: false, error: "No active enrollment found for this year." };
        }

        // 2. Get Upcoming Homework (Assignments Due)
        const recentHomework = await prisma.homework.findMany({
             where: {
                 classId: enrollment.classId,
                 sectionId: enrollment.sectionId,
                 academicYearId: activeYear.id,
                 dueDate: { gte: new Date() } // Future or today
             },
             orderBy: { dueDate: 'asc' },
             take: 5,
             include: {
                 subject: true,
                 teacher: { include: { user: true } }
             }
        });

        // 3. Get Upcoming Classes (Rough schedule representation using TeacherAssignments for their section)
        const upcomingClasses = await prisma.teacherAssignment.findMany({
             where: {
                  classId: enrollment.classId,
                  sectionId: enrollment.sectionId,
                  academicYearId: activeYear.id
             },
             include: {
                  subject: true,
                  teacher: { include: { user: true } }
             },
             take: 4
        });

        // 4. Get Attendance Data (Calculate percentage)
        const attendanceRecords = await prisma.attendance.findMany({
            where: {
                 enrollmentId: enrollment.id
            }
        });

        let attendancePercentage = 100;
        if (attendanceRecords.length > 0) {
            const presentCount = attendanceRecords.filter(r => r.status === "PRESENT").length;
            attendancePercentage = Math.round((presentCount / attendanceRecords.length) * 100);
        }

        // 5. Get Subject Enrollments/Grades placeholders (Schema does not have full Gradebook yet)
        const subjects = await prisma.subject.findMany({
             where: { classId: enrollment.classId }
        });

        // Map faux grades for the UI until a real gradebook schema is established
        const fauxGrades = subjects.map(s => {
             // Generate a deterministic but random-looking score based on subject ID length so it's consistent
             const fauxScore = 80 + (s.id.length % 18); 
             return {
                 name: s.name,
                 score: fauxScore
             }
        });

        return {
             success: true,
             data: {
                 student,
                 enrollment,
                 recentHomework,
                 upcomingClasses,
                 attendancePercentage,
                 fauxGrades
             }
        };

    } catch (error) {
         console.error("Failed to fetch student dashboard data:", error);
         return { success: false, error: "Failed to load dashboard." };
    }
}

export async function getStudentClasses(userId: string) {
    try {
        const activeYear = await getActiveYear();
        if (!activeYear) return { success: false, error: "No active academic year." };

        const student = await prisma.student.findUnique({
             where: { userId }
        });

        if (!student) return { success: false, error: "Student profile not found." };

        const enrollment = await prisma.enrollment.findUnique({
             where: {
                 studentId_academicYearId: {
                     studentId: student.id,
                     academicYearId: activeYear.id
                 }
             }
        });

        if (!enrollment || enrollment.status !== "ACTIVE") {
             return { success: false, error: "No active enrollment." };
        }

        // Fetch teachers assigned to this specific class+section
        const classes = await prisma.teacherAssignment.findMany({
             where: {
                  classId: enrollment.classId,
                  sectionId: enrollment.sectionId,
                  academicYearId: activeYear.id
             },
             include: {
                  subject: true,
                  teacher: { include: { user: true } }
             }
        });

        // Fetch pending homework for the student's enrollment
        const pendingHomework = await prisma.homework.findMany({
             where: {
                  classId: enrollment.classId,
                  sectionId: enrollment.sectionId,
                  academicYearId: activeYear.id,
                  dueDate: { gte: new Date() }
             }
        });

        const classesWithExtra = classes.map(c => {
             return {
                 ...c,
                 activeAssignmentsCount: pendingHomework.filter(h => h.subjectId === c.subjectId).length
             };
        });

        return { success: true, data: classesWithExtra };
    } catch (error) {
         console.error("Failed to fetch student classes:", error);
         return { success: false, error: "Failed to load classes." };
    }
}

export async function getStudentAssignments(userId: string) {
    try {
        const activeYear = await getActiveYear();
        if (!activeYear) return { success: false, error: "No active academic year." };

        const student = await prisma.student.findUnique({
             where: { userId }
        });

        if (!student) return { success: false, error: "Student profile not found." };

        const enrollment = await prisma.enrollment.findUnique({
             where: {
                 studentId_academicYearId: {
                     studentId: student.id,
                     academicYearId: activeYear.id
                 }
             }
        });

        if (!enrollment || enrollment.status !== "ACTIVE") {
             return { success: false, error: "No active enrollment." };
        }

        const assignments = await prisma.homework.findMany({
             where: {
                  classId: enrollment.classId,
                  sectionId: enrollment.sectionId,
                  academicYearId: activeYear.id
             },
             include: {
                  subject: true,
                  teacher: { include: { user: true } }
             },
             orderBy: { dueDate: 'asc' }
        });

        return { success: true, data: assignments };
    } catch (error) {
         console.error("Failed to fetch student assignments:", error);
         return { success: false, error: "Failed to load assignments." };
    }
}

// ------------------------------------------------------------------
// Student Settings Actions
// ------------------------------------------------------------------

export async function getStudentProfile(userId: string) {
    try {
        const student = await prisma.student.findUnique({
             where: { userId },
             include: { user: true }
        });
        if (!student) return { success: false, error: "Student profile not found." };
        return { success: true, data: student };
    } catch (error) {
         console.error("Failed to fetch student profile:", error);
        return { success: false, error: "Failed to fetch profile." };
    }
}

export async function updateStudentPassword(userId: string, data: { current: string; new: string }) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { success: false, error: "User not found." };

        const bcrypt = await import("bcrypt");
        const isMatch = await bcrypt.compare(data.current, user.passwordHash);
        
        if (!isMatch) {
            return { success: false, error: "Current password is incorrect." };
        }

        const hashedNewPassword = await bcrypt.hash(data.new, 10);
        await prisma.user.update({
             where: { id: userId },
             data: { passwordHash: hashedNewPassword }
        });

        // revalidate isn't strictly necessary as we don't display the password hash, but good practice
        revalidatePath("/student/settings");
        return { success: true, message: "Password updated successfully." };
    } catch (error) {
         console.error("Failed to update student password:", error);
         return { success: false, error: "Failed to secure new password." };
    }
}
