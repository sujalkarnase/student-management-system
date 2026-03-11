"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getClasses() {
    try {
        const academicYear = await prisma.academicYear.findFirst({
            where: { isCurrent: true }
        });

        if (!academicYear) {
            return { success: false, error: "No active academic year found." };
        }

        const classes = await prisma.class.findMany({
            where: { academicYearId: academicYear.id },
            include: {
                sections: true,
                subjects: true,
                _count: {
                    select: {
                        enrollments: {
                            where: { status: "ACTIVE" }
                        }
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return { success: true, data: classes, academicYear };
    } catch (error) {
        console.error("Failed to fetch classes:", error);
        return { success: false, error: "Failed to fetch classes." };
    }
}

export async function createClass(data: {
    name: string;
    sections: { name: string }[];
    subjects: { name: string }[];
}) {
    try {
        const academicYear = await prisma.academicYear.findFirst({
            where: { isCurrent: true }
        });

        if (!academicYear) {
            return { success: false, error: "No active academic year found." };
        }

        const result = await prisma.$transaction(async (tx) => {
            // Create Class
            const newClass = await tx.class.create({
                data: {
                    name: data.name,
                    academicYearId: academicYear.id,
                }
            });

            // Create related Sections if provided
            if (data.sections && data.sections.length > 0) {
                await tx.section.createMany({
                    data: data.sections.map(sec => ({
                        name: sec.name,
                        classId: newClass.id
                    }))
                });
            }

            // Create related Subjects if provided
            if (data.subjects && data.subjects.length > 0) {
                await tx.subject.createMany({
                    data: data.subjects.map(sub => ({
                        name: sub.name,
                        classId: newClass.id
                    }))
                });
            }

            return newClass;
        });

        revalidatePath("/admin/classes");
        return { success: true, data: result };

    } catch (error: any) {
        console.error("Failed to create class:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "A class with this name already exists for the current academic year." };
        }
        return { success: false, error: "Failed to create class." };
    }
}

export async function updateClass(id: string, data: {
    name: string;
    sections: { id?: string; name: string }[];
    subjects: { id?: string; name: string }[];
}) {
    try {
        await prisma.$transaction(async (tx) => {
            // Update Class name
            await tx.class.update({
                where: { id },
                data: { name: data.name }
            });

            // Handle Sections (Delete, Update, Create)
            const currentSections = await tx.section.findMany({ where: { classId: id } });
            const incomingSectionIds = data.sections.map(s => s.id).filter(id => id);
            
            // Delete missing sections (Only if safe - no enrollments)
            const sectionsToDelete = currentSections.filter(s => !incomingSectionIds.includes(s.id));
            if (sectionsToDelete.length > 0) {
                 await tx.section.deleteMany({
                     where: { id: { in: sectionsToDelete.map(s => s.id) } }
                 });
            }

            // Create/Update incoming sections
            for (const section of data.sections) {
                if (section.id) {
                    await tx.section.update({
                        where: { id: section.id },
                        data: { name: section.name }
                    });
                } else {
                    await tx.section.create({
                        data: { name: section.name, classId: id }
                    });
                }
            }

            // Handle Subjects (Delete, Update, Create)
            const currentSubjects = await tx.subject.findMany({ where: { classId: id } });
            const incomingSubjectIds = data.subjects.map(s => s.id).filter(id => id);
            
            // Delete missing subjects
            const subjectsToDelete = currentSubjects.filter(s => !incomingSubjectIds.includes(s.id));
            if (subjectsToDelete.length > 0) {
                 await tx.subject.deleteMany({
                     where: { id: { in: subjectsToDelete.map(s => s.id) } }
                 });
            }

            // Create/Update incoming subjects
            for (const subject of data.subjects) {
                if (subject.id) {
                    await tx.subject.update({
                        where: { id: subject.id },
                        data: { name: subject.name }
                    });
                } else {
                    await tx.subject.create({
                        data: { name: subject.name, classId: id }
                    });
                }
            }
        });

        revalidatePath("/admin/classes");
        return { success: true };
    } catch (error: any) {
         console.error("Failed to update class:", error);
         if (error.code === 'P2003') { // Foreign key constraint (trying to delete section with active students)
            return { success: false, error: "Cannot delete section/subject. It is currently in use." };
         }
         return { success: false, error: "Failed to update class." };
    }
}

export async function deleteClass(id: string) {
    try {
        // Deleting a class usually requires cascading deletes or checking for enrollments first.
        // Prisma will throw error P2003 if we try to delete a class with active enrollments/assignments
        await prisma.$transaction(async (tx) => {
             await tx.section.deleteMany({ where: { classId: id } });
             await tx.subject.deleteMany({ where: { classId: id } });
             await tx.class.delete({ where: { id } });
        });

        revalidatePath("/admin/classes");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete class:", error);
        if (error.code === 'P2003') {
             return { success: false, error: "Cannot delete this class. There are active students or teachers assigned to it." };
        }
        return { success: false, error: "Failed to delete class." };
    }
}
