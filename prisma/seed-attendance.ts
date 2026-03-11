import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Attendance test data...');

  const currentYear = await prisma.academicYear.findFirst({
    where: { isCurrent: true }
  });

  if (!currentYear) {
    console.error('No current academic year found. Seed basic data first.');
    return;
  }


  const class1 = await prisma.class.findFirst({
    where: { name: '1', academicYearId: currentYear.id },
    include: { sections: true }
  });

  if (!class1 || class1.sections.length === 0) {
    console.error('Class 1 or its sections not found. Run seed-classes.ts first.');
    return;
  }

  const sectionA = class1.sections.find(s => s.name === 'A');
  if (!sectionA) return;


  await prisma.enrollment.deleteMany({
    where: {
      student: {
        admissionNumber: { in: ['ADM-999', 'ADM-1000'] }
      }
    }
  });



  const hash = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'student99@test.com' },
    update: {},
    create: {
      role: 'STUDENT',
      name: 'John Test Attendance',
      email: 'student99@test.com',
      admissionNumber: 'ADM-999',
      passwordHash: hash,
    }
  });

  const student1 = await prisma.student.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      admissionNumber: 'ADM-999',
      fatherName: 'Father',
      motherName: 'Mother',
      phone: '1234567890',
      address: 'Test Address',
      dateOfBirth: new Date('2015-01-01')
    }
  });


  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      classId: class1.id,
      sectionId: sectionA.id,
      academicYearId: currentYear.id,
      rollNumber: 99
    }
  });



  const user2 = await prisma.user.upsert({
    where: { email: 'student100@test.com' },
    update: {},
    create: {
      role: 'STUDENT',
      name: 'Alice Test Attendance',
      email: 'student100@test.com',
      admissionNumber: 'ADM-1000',
      passwordHash: hash,
    }
  });

  const student2 = await prisma.student.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      admissionNumber: 'ADM-1000',
      fatherName: 'Father2',
      motherName: 'Mother2',
      phone: '0987654321',
      address: 'Test Address 2',
      dateOfBirth: new Date('2015-02-02')
    }
  });


  await prisma.enrollment.create({
    data: {
      studentId: student2.id,
      classId: class1.id,
      sectionId: sectionA.id,
      academicYearId: currentYear.id,
      rollNumber: 100
    }
  });

  console.log('Seeded Students and Enrollments for Attendance testing.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
