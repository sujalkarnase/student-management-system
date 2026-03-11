"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper simply gets the current active academic year
async function getActiveYear() {
    return prisma.academicYear.findFirst({ where: { isCurrent: true } });
}

// ------------------------------------------------------------------
// Teacher Specific Actions
// ------------------------------------------------------------------

export async function getTeacherProfile(userId: string) {
    try {
        const teacher = await prisma.teacher.findUnique({
             where: { userId },
             include: { user: true }
        });
        if (!teacher) return { success: false, error: "Teacher profile not found." };
        
        // Sanitize Decimal to Number for Client Component serialization
        const sanitizedTeacher = {
             ...teacher,
             salary: teacher.salary ? Number(teacher.salary) : 0
        };

        return { success: true, data: sanitizedTeacher };
    } catch (error) {
         console.error("Failed to fetch teacher profile:", error);
        return { success: false, error: "Failed to fetch profile." };
    }
}

export async function updateTeacherProfile(userId: string, data: { name: string; email: string; qualification: string }) {
    try {
        const teacher = await prisma.teacher.findUnique({ where: { userId }, include: { user: true } });
        if (!teacher) return { success: false, error: "Teacher profile not found." };
        
        // Ensure email isn't taken by someone else
        if (data.email !== teacher.user.email) {
             const existing = await prisma.user.findUnique({ where: { email: data.email } });
             if (existing) return { success: false, error: "Email is already in use by another account." };
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { name: data.name, email: data.email }
            }),
            prisma.teacher.update({
                where: { userId },
                data: { qualification: data.qualification }
            })
        ]);

        revalidatePath("/teacher/settings");
        revalidatePath("/teacher");
        return { success: true, message: "Profile updated successfully." };
    } catch (error) {
        console.error("Failed to update teacher profile:", error);
        return { success: false, error: "Failed to update profile." };
    }
}

// Ensure you have bcrypt imported at top of file, or dynamic import it here
export async function updateTeacherPassword(userId: string, data: { current: string; new: string }) {
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
        revalidatePath("/teacher/settings");
        return { success: true, message: "Password updated successfully." };
    } catch (error) {
         console.error("Failed to update password:", error);
         return { success: false, error: "Failed to secure new password." };
    }
}

export async function getTeacherDashboardData(userId: string) {
    try {
        const activeYear = await getActiveYear();
        if (!activeYear) return { success: false, error: "No active academic year found." };

        const teacher = await prisma.teacher.findUnique({ where: { userId } });
        if (!teacher) return { success: false, error: "Teacher not found." };

        // Get total unique classes assigned this year
        const classIdsMap = await prisma.teacherAssignment.groupBy({
             by: ['classId'],
             where: { teacherId: teacher.id, academicYearId: activeYear.id }
        });
        const totalClasses = classIdsMap.length;

        // Get total active assignments (homework coming due)
        const assignmentsData = await prisma.homework.findMany({
             where: { teacherId: teacher.id, academicYearId: activeYear.id, dueDate: { gte: new Date() } },
             orderBy: { dueDate: 'asc' },
             take: 5,
             include: { class: true, subject: true }
        });

        // Get assignments directly (class, section, subject mappings)
        const classesData = await prisma.teacherAssignment.findMany({
            where: { teacherId: teacher.id, academicYearId: activeYear.id },
            include: { class: true, section: true, subject: true }
        });

        return { success: true, stats: { totalClasses }, upcomingHomework: assignmentsData, assignedClasses: classesData };

    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        return { success: false, error: "Failed to load dashboard data." };
    }
}

export async function getTeacherClasses(userId: string) {
    try {
        const activeYear = await getActiveYear();
        if (!activeYear) return { success: false, error: "No active academic year found." };

        const teacher = await prisma.teacher.findUnique({ where: { userId } });
        if (!teacher) return { success: false, error: "Teacher not found." };

        const assignments = await prisma.teacherAssignment.findMany({
            where: { teacherId: teacher.id, academicYearId: activeYear.id },
            include: {
                class: true,
                section: {
                    include: {
                        _count: {
                            select: {
                                enrollments: {
                                    where: { status: 'ACTIVE' }
                                }
                            }
                        }
                    }
                },
                subject: true,
                academicYear: true
            },
            orderBy: [
                { class: { name: 'asc' } },
                { section: { name: 'asc' } }
            ]
        });

        return { success: true, data: assignments };
    } catch (error) {
        console.error("Failed to fetch teacher classes:", error);
        return { success: false, error: "Failed to fetch assigned classes." };
    }
}

export async function getTeacherStudents(userId: string, classId?: string, sectionId?: string) {
    try {
        const activeYear = await getActiveYear();
        if (!activeYear) return { success: false, error: "No active academic year found." };

        const teacher = await prisma.teacher.findUnique({ where: { userId } });
        if (!teacher) return { success: false, error: "Teacher not found." };

        // 1. Verify the teacher explicitly requested a class/section OR get all assigned class/sections
        let allowedSections: string[] = [];

        if (classId && sectionId) {
             const assignmentCheck = await prisma.teacherAssignment.findFirst({
                 where: { teacherId: teacher.id, classId, sectionId, academicYearId: activeYear.id }
             });
             if (!assignmentCheck) return { success: false, error: "You are not assigned to this class and section." };
             allowedSections.push(sectionId);
        } else {
             const assignments = await prisma.teacherAssignment.findMany({
                 where: { teacherId: teacher.id, academicYearId: activeYear.id },
                 select: { sectionId: true }
             });
             allowedSections = assignments.map(a => a.sectionId);
        }

        if (allowedSections.length === 0) return { success: true, data: [] }; // No classes assigned

        // 2. Fetch the students enrolled in those allowed sections
        const enrollments = await prisma.enrollment.findMany({
            where: {
                academicYearId: activeYear.id,
                sectionId: { in: allowedSections },
                status: "ACTIVE"
            },
            include: {
                student: { include: { user: true } },
                class: true,
                section: true,
                attendance: { select: { status: true } }
            },
            orderBy: [
                 { class: { name: 'asc'} },
                 { section: { name: 'asc'} },
                 { rollNumber: 'asc' }
            ]
        });

        return { success: true, data: enrollments };
    } catch (error) {
         console.error("Failed to fetch teacher students:", error);
         return { success: false, error: "Failed to fetch student roster." };
    }
}


// --- Homework/Assignment Management ---

export async function getTeacherHomework(userId: string) {
    try {
         const activeYear = await getActiveYear();
         if (!activeYear) return { success: false, error: "No active academic year found." };

         const teacher = await prisma.teacher.findUnique({ where: { userId } });
         if (!teacher) return { success: false, error: "Teacher not found." };

         const homework = await prisma.homework.findMany({
             where: { teacherId: teacher.id, academicYearId: activeYear.id },
             include: {
                 class: true,
                 section: true,
                 subject: true
             },
             orderBy: { dueDate: 'desc' }
         });

         return { success: true, data: homework };
    } catch (error) {
         console.error("Failed to fetch teacher homework:", error);
         return { success: false, error: "Failed to fetch assignments." };
    }
}

export async function createHomework(userId: string, data: {
    title: string;
    description: string;
    dueDate: string;
    assignmentId: string; // The teacherAssignment ID to link to class/section/subject
}) {
     try {
         const activeYear = await getActiveYear();
         if (!activeYear) return { success: false, error: "No active academic year found." };

         const teacher = await prisma.teacher.findUnique({ where: { userId } });
         if (!teacher) return { success: false, error: "Teacher not found." };

         // 1. Validate the assignment link belongs to this teacher and this year
         const assignmentData = await prisma.teacherAssignment.findUnique({
             where: { id: data.assignmentId }
         });

         if (!assignmentData || assignmentData.teacherId !== teacher.id || assignmentData.academicYearId !== activeYear.id) {
             return { success: false, error: "Invalid class assignment mapping." };
         }

         // 2. Create the homework
         await prisma.homework.create({
             data: {
                 teacherId: teacher.id,
                 academicYearId: activeYear.id,
                 classId: assignmentData.classId,
                 sectionId: assignmentData.sectionId,
                 subjectId: assignmentData.subjectId,
                 title: data.title,
                 description: data.description,
                 dueDate: new Date(data.dueDate)
             }
         });

         revalidatePath("/teacher/assignments");
         revalidatePath("/teacher"); // dashboard

         return { success: true, message: "Assignment created successfully." };
     } catch(error) {
         console.error("Failed to create homework:", error);
         return { success: false, error: "Failed to publish assignment." };
     }
}

export async function deleteHomework(id: string, userId: string) {
     try {
         const teacher = await prisma.teacher.findUnique({ where: { userId } });
         if (!teacher) return { success: false, error: "Teacher not found." };

         // Verify ownership before deleting
         const hwCheck = await prisma.homework.findUnique({ where: { id } });
         if (!hwCheck || hwCheck.teacherId !== teacher.id) {
             return { success: false, error: "Not authorized to delete this assignment." };
         }

         await prisma.homework.delete({ where: { id } });

         revalidatePath("/teacher/assignments");
         revalidatePath("/teacher");

         return { success: true };
     } catch (error) {
         console.error("Failed to delete homework:", error);
         return { success: false, error: "Failed to delete assignment." };
     }
}
