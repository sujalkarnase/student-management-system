"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

// ------------------------------------------------------------------
// Academic Year Management
// ------------------------------------------------------------------

export async function getAcademicYears() {
    try {
        const years = await prisma.academicYear.findMany({
            orderBy: {
                yearLabel: 'desc'
            }
        });
        return { success: true, data: years };
    } catch (error) {
        console.error("Failed to fetch academic years:", error);
        return { success: false, error: "Failed to fetch academic years." };
    }
}

export async function createAcademicYear(yearLabel: string) {
    try {
        if (!yearLabel || yearLabel.trim() === "") {
             return { success: false, error: "Year label is required." };
        }

        const newYear = await prisma.academicYear.create({
            data: {
                yearLabel: yearLabel.trim(),
                isCurrent: false, // Default to false, must activate explicitly
            }
        });

        revalidatePath("/admin/settings");
        // Also revalidate layout to refresh the session badge globally if needed
        revalidatePath("/admin", "layout"); 
        
        return { success: true, data: newYear };
    } catch (error: any) {
        console.error("Failed to create academic year:", error);
         if (error.code === 'P2002') {
            return { success: false, error: "This academic year already exists." };
        }
        return { success: false, error: "Failed to create academic year." };
    }
}

export async function setActiveAcademicYear(id: string) {
    try {
        await prisma.$transaction(async (tx) => {
            // Unset current active year
            await tx.academicYear.updateMany({
                where: { isCurrent: true },
                data: { isCurrent: false }
            });

            // Set new active year
            await tx.academicYear.update({
                where: { id },
                data: { isCurrent: true }
            });
        });

        revalidatePath("/admin/settings");
        revalidatePath("/admin", "layout"); // Update the badge everywhere!
        
        return { success: true, message: "Active Session updated successfully." };
    } catch (error) {
        console.error("Failed to set active academic year:", error);
        return { success: false, error: "Failed to set active academic year." };
    }
}


// ------------------------------------------------------------------
// Profile Management
// ------------------------------------------------------------------

export async function getAdminProfile(userId: string) {
     try {
        const admin = await prisma.user.findUnique({
            where: { id: userId, role: "ADMIN" },
            select: { id: true, name: true, email: true }
        });
        
        if (!admin) return { success: false, error: "Admin not found." };
        
        return { success: true, data: admin };
    } catch (error) {
        console.error("Failed to fetch admin profile:", error);
        return { success: false, error: "Failed to fetch profile." };
    }
}

export async function updateAdminProfile(
    userId: string, 
    data: { name: string; email: string; currentPassword?: string; newPassword?: string }
) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { success: false, error: "User not found." };

        let updateData: any = {
             name: data.name,
             email: data.email
        };

        // If they want to change password, verify old and hash new
        if (data.newPassword && data.currentPassword) {
             const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
             if (!isValid) {
                 return { success: false, error: "Incorrect current password." };
             }
             updateData.passwordHash = await bcrypt.hash(data.newPassword, 10);
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return { success: true, message: "Profile updated successfully." };

    } catch (error: any) {
        console.error("Failed to update profile:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Email is already in use by another account." };
        }
        return { success: false, error: "Failed to update profile." };
    }
}
