import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Teacher Portal test data...');

  const currentYear = await prisma.academicYear.findFirst({
    where: { isCurrent: true }
  });

  if (!currentYear) {
    console.error('No current academic year found!');
    return;
  }

  const class1 = await prisma.class.findFirst({
    where: { name: '1', academicYearId: currentYear.id },
    include: { sections: true, subjects: true }
  });

  if (!class1 || class1.sections.length === 0 || class1.subjects.length === 0) {
    console.error('Class 1, section, or subjects missing.');
    return;
  }
  const sectionA = class1.sections.find(s => s.name === 'A');
  const mathSubject = class1.subjects.find(s => s.name === 'Mathematics') || class1.subjects[0];
  if (!sectionA || !mathSubject) return;



  const hash = await bcrypt.hash('faculty123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'faculty@test.edu' },
    update: {},
    create: {
      role: 'TEACHER',
      name: 'Dr. Jane Smith',
      email: 'faculty@test.edu',
      passwordHash: hash,
    }
  });

  const teacher = await prisma.teacher.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      qualification: 'Ph.D. in Computer Science',
      salary: 5000.00,
      joiningDate: new Date('2020-08-15')
    }
  });


  await prisma.teacherAssignment.upsert({
    where: { id: 'test-assignment-1' },
    update: {},
    create: {
      id: 'test-assignment-1',
      teacherId: teacher.id,
      subjectId: mathSubject.id,
      classId: class1.id,
      sectionId: sectionA.id,
      academicYearId: currentYear.id
    }
  });

  console.log('Seeded Faculty member and assignment for testing.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
