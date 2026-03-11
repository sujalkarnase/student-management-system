"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAttendanceFilters() {
    try {
        const academicYear = await prisma.academicYear.findFirst({
            where: { isCurrent: true }
        });

        if (!academicYear) return { success: false, error: "No active academic year found." };

        const classes = await prisma.class.findMany({
            where: { academicYearId: academicYear.id },
            include: {
                sections: true
            },
            orderBy: { name: 'asc' }
        });

        return { success: true, data: classes, academicYear };
    } catch (error) {
        console.error("Failed to fetch attendance filters:", error);
        return { success: false, error: "Failed to fetch filters." };
    }
}

export async function getAttendanceData(dateStr: string, classId: string, sectionId: string) {
    try {
        const date = new Date(dateStr);
        // Normalize date to start of day for accurate comparison if needed
        date.setUTCHours(0, 0, 0, 0);

        const enrollments = await prisma.enrollment.findMany({
            where: {
                classId,
                sectionId,
                status: "ACTIVE"
            },
            include: {
                student: {
                    include: {
                        user: true
                    }
                },
                attendance: {
                    where: {
                        date: date
                    }
                }
            },
            orderBy: {
                rollNumber: 'asc'
            }
        });

        return { success: true, data: enrollments };
    } catch (error) {
        console.error("Failed to fetch attendance data:", error);
        return { success: false, error: "Failed to fetch attendance records." };
    }
}

export async function bulkMarkAttendance(records: { enrollmentId: string, status: "PRESENT" | "ABSENT" }[], dateStr: string, adminId: string) {
    try {
        const date = new Date(dateStr);
        date.setUTCHours(0, 0, 0, 0);

        await prisma.$transaction(async (tx) => {
            for (const record of records) {
                // Upsert logic: if attendance exists for that day, update it, else create it.
                await tx.attendance.upsert({
                    where: {
                        enrollmentId_date: {
                            enrollmentId: record.enrollmentId,
                            date: date
                        }
                    },
                    update: {
                        status: record.status,
                        markedById: adminId
                    },
                    create: {
                        enrollmentId: record.enrollmentId,
                        date: date,
                        status: record.status,
                        markedById: adminId
                    }
                });
            }
        });

        revalidatePath("/admin/attendance");
        return { success: true, message: "Attendance saved successfully." };
    } catch (error) {
        console.error("Failed to save attendance:", error);
        return { success: false, error: "Failed to save attendance." };
    }
}
