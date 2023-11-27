const Scheduler = require('../../../src/core/scheduler/scheduler'); // update with your actual path

process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_PORT = 5432;
process.env.DATABASE_NAME = 'backenddb';
process.env.DATABASE_USERNAME = 'postgres';
process.env.DATABASE_PASSWORD = 'postgres';

const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scheduler = new Scheduler({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    database: process.env.DATABASE_NAME || 'backenddb',
    user: process.env.DATABASE_USERNAME || 'dev',
    password: process.env.DATABASE_PASSWORD || 'localdev',
    ssl: false,
});

scheduler.start();

process.on('message', async (message) => {
    if (message.type === 'start') {
        const jobNumber = message.jobNumber;
        const jobHandler = async () => {
            await sleep(1000);
            process.send({ called: true });
            console.log(`TEST JOB ${jobNumber}`);
        };

        scheduler.job({
            name: 'TEST',
            singleton: true,
            handler: jobHandler,
        }).schedule('* * * * * *', { key: jobNumber }, { singletonKey: 'TEST' });
    }
});

setTimeout(() => {
    process.exit(0);
}, 1000 * 60 * 2);