"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getAdminDashboardData() {
    try {
        const [
            totalStudents,
            totalTeachers,
            activeClasses,
            recentUsers,
        ] = await Promise.all([
            prisma.user.count({ where: { role: Role.STUDENT } }),
            prisma.user.count({ where: { role: Role.TEACHER } }),
            prisma.class.count({
                where: {
                    academicYear: {
                        isCurrent: true,
                    },
                },
            }),
            prisma.user.findMany({
                where: {
                    role: {
                        in: [Role.STUDENT, Role.TEACHER]
                    }
                },
                select: {
                    id: true,
                    name: true,
                    role: true,
                    email: true,
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
            })
        ]);


        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);


        const recentStudents = await prisma.user.findMany({
            where: {
                role: Role.STUDENT,
                createdAt: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                createdAt: true
            }
        });


        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const orderedTrendData: { name: string, year: number, month: number, newStudents: number, students: number }[] = [];

        let cumulativeStudents = await prisma.user.count({
            where: {
                role: Role.STUDENT,
                createdAt: {
                    lt: sixMonthsAgo
                }
            }
        });

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            orderedTrendData.push({
                name: monthNames[date.getMonth()],
                year: date.getFullYear(),
                month: date.getMonth(),
                newStudents: 0,
                students: 0
            });
        }


        recentStudents.forEach(student => {
            const studentMonth = student.createdAt.getMonth();
            const studentYear = student.createdAt.getFullYear();

            const trendEntry = orderedTrendData.find(t => t.month === studentMonth && t.year === studentYear);
            if (trendEntry) {
                trendEntry.newStudents++;
            }
        });


        orderedTrendData.forEach(entry => {
            cumulativeStudents += entry.newStudents;
            entry.students = cumulativeStudents;
        });


        const finalTrendData = orderedTrendData.map(entry => ({
            name: entry.name,
            students: entry.students
        }));

        return {
            success: true,
            data: {
                stats: {
                    totalStudents,
                    totalTeachers,
                    activeClasses,
                    attendanceRate: "94%",
                },
                recentUsers: recentUsers.map(u => ({
                    id: u.id,
                    name: u.name,
                    role: u.role,
                    email: u.email,
                    date: u.createdAt.toISOString()
                })),
                enrollmentTrends: orderedTrendData
            },
        };
    } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
        return {
            success: false,
            error: "Failed to fetch dashboard statistics",
        };
    }
}
