import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.upsert({
        where: { email: "admin@school.com" },
        update: {},
        create: {
            role: Role.ADMIN,
            email: "admin@school.com",
            passwordHash: hashedPassword,
            isActive: true,
        },
    });

    console.log("✅ Admin ready");

    const teacherPassword = await bcrypt.hash("teacher123", 10);

    const teacherUser = await prisma.user.upsert({
        where: { email: "teacher1@school.com" },
        update: {},
        create: {
            role: Role.TEACHER,
            email: "teacher1@school.com",
            passwordHash: teacherPassword,
            isActive: true,
        },
    });

    await prisma.teacher.upsert({
        where: { userId: teacherUser.id },
        update: {},
        create: {
            userId: teacherUser.id,
            qualification: "B.Ed",
            salary: 30000,
            joiningDate: new Date(),
        },
    });

    console.log("✅ Test Teacher ready");

    const studentPassword = await bcrypt.hash("student123", 10);

    const studentUser = await prisma.user.upsert({
        where: { admissionNumber: "STU001" },
        update: {},
        create: {
            role: Role.STUDENT,
            admissionNumber: "STU001",
            passwordHash: studentPassword,
            isActive: true,
        },
    });

    const student = await prisma.student.upsert({
        where: { admissionNumber: "STU001" },
        update: {},
        create: {
            userId: studentUser.id,
            admissionNumber: "STU001",
            fatherName: "Father Name",
            motherName: "Mother Name",
            phone: "9999999999",
            address: "Sample Address",
            dateOfBirth: new Date("2015-01-01"),
        },
    });

    const currentYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true },
    });
    const class1 = await prisma.class.findFirst({
        where: {
            name: "1",
            academicYearId: currentYear?.id,
        },
    });

    const sectionA = await prisma.section.findFirst({
        where: {
            name: "A",
            classId: class1?.id,
        },
    });

    await prisma.enrollment.upsert({
        where: {
            studentId_academicYearId: {
                studentId: student.id,
                academicYearId: currentYear!.id,
            },
        },
        update: {},
        create: {
            studentId: student.id,
            classId: class1!.id,
            sectionId: sectionA!.id,
            academicYearId: currentYear!.id,
            rollNumber: 1,
        },
    });

    console.log("✅ Test Student ready");

    await prisma.academicYear.updateMany({
        data: { isCurrent: false },
    });

    const academicYear = await prisma.academicYear.upsert({
        where: { yearLabel: "2025-2026" },
        update: {
            isCurrent: true,
        },
        create: {
            yearLabel: "2025-2026",
            isCurrent: true,
        },
    });

    console.log("✅ Academic Year ready");


    for (let i = 1; i <= 10; i++) {
        await prisma.class.upsert({
            where: {
                name_academicYearId: {
                    name: `${i}`,
                    academicYearId: academicYear.id,
                },
            },
            update: {},
            create: {
                name: `${i}`,
                academicYearId: academicYear.id,
            },
        });
    }

    console.log("✅ Classes 1–10 ready");


    const classes = await prisma.class.findMany({
        where: { academicYearId: academicYear.id },
    });

    for (const cls of classes) {
        for (const sectionName of ["A", "B"]) {
            await prisma.section.upsert({
                where: {
                    name_classId: {
                        name: sectionName,
                        classId: cls.id,
                    },
                },
                update: {},
                create: {
                    name: sectionName,
                    classId: cls.id,
                },
            });
        }
    }

    console.log("✅ Sections A & B ready");

    console.log("🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
