import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Classes data...');


  const currentYear = await prisma.academicYear.findFirst({
    where: { isCurrent: true }
  });

  if (!currentYear) {
    console.error('No current academic year found. Seed basic data first.');
    return;
  }


  const class1 = await prisma.class.upsert({
    where: { name_academicYearId: { name: '1', academicYearId: currentYear.id } },
    update: {},
    create: {
      name: '1',
      academicYearId: currentYear.id,
      sections: {
        create: [
          { name: 'A' },
          { name: 'B' }
        ]
      },
      subjects: {
        create: [
          { name: 'Mathematics' },
          { name: 'English' },
          { name: 'Science' }
        ]
      }
    }
  });

  console.log(`Created Class ${class1.name} with sections and subjects.`);


  const class2 = await prisma.class.upsert({
    where: { name_academicYearId: { name: '2', academicYearId: currentYear.id } },
    update: {},
    create: {
      name: '2',
      academicYearId: currentYear.id,
      sections: {
        create: [
          { name: 'A' }
        ]
      },
      subjects: {
        create: [
          { name: 'Mathematics' },
          { name: 'English' },
          { name: 'Environmental Studies' }
        ]
      }
    }
  });

  console.log(`Created Class ${class2.name} with sections and subjects.`);

  console.log('Class Seeding Complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
