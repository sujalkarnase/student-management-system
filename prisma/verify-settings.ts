import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Settings data...');


    const yearLabel = 'Test-Year-' + Math.floor(Math.random() * 1000);
    const newYear = await prisma.academicYear.create({
        data: {
            yearLabel: yearLabel,
            isCurrent: false
        }
    });
    console.log('Successfully created year:', newYear.yearLabel);


    await prisma.$transaction(async (tx) => {
        await tx.academicYear.updateMany({
            where: { isCurrent: true },
            data: { isCurrent: false }
        });

        await tx.academicYear.update({
            where: { id: newYear.id },
            data: { isCurrent: true }
        });
    });

    const checkActive = await prisma.academicYear.findFirst({
        where: { isCurrent: true }
    });

    if (checkActive?.id === newYear.id) {
        console.log('Successfully toggled active year!');
    } else {
        console.error('Failed to toggle active year!');
    }


    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (admin) {
        console.log('Successfully fetched admin profile:', admin.email);
    } else {
        console.error('No admin found.');
    }

    console.log('Settings Verification Script Finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
