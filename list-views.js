const prisma = require('./src/lib/prisma');

async function listViews() {
    try {
        const views = await prisma.$queryRaw`SELECT table_name FROM information_schema.views WHERE table_schema = 'public'`;
        console.log('Database Views:', JSON.stringify(views, null, 2));
    } catch (e) {
        console.error('Error listing views:', e);
    } finally {
        await prisma.$disconnect();
    }
}

listViews();
