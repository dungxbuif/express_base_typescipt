const scheduler = require('../../../src/core/scheduler/index');
const path = require('path');
const { fork } = require('child_process');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startJobInProcess = (script, message) => {
    return new Promise((resolve, reject) => {
        const child = fork(script);
        child.on('message', (data) => {
            if (data.called) {
                mockedHandler();
            }
            resolve();
        });
        child.on('error', reject);
        child.send(message);
    });
};

describe('Scheduler', () => {

    beforeEach(async () => {
        await scheduler.boss.clearStorage();
        await scheduler.boss.deleteAllQueues();
        await sleep(1000);
    });

    afterAll(async () => {
        await scheduler.stop({ destroy: true, graceful: true });
        await sleep(1000);
    });

    it('should be defined', () => {
        expect(scheduler).toBeDefined();
    });

    it('should have start method', () => {
        expect(scheduler.start).toBeDefined();
    });

    it('should have stop method', () => {
        expect(scheduler.stop).toBeDefined();
    });

    it('should have getSchedules method', async () => {
        expect(scheduler.getSchedules).toBeDefined();

        const schedule = await scheduler.getSchedules();
        expect(schedule).toBeDefined();
        expect(schedule.length).toBe(0);
    });

    it('should create scheduled job', async () => {
        const mockedHandler = jest.fn();
        const job = scheduler.job({
            name: 'TEST',
            handler: () => {
                mockedHandler();
                console.log('TEST');
            },
        });

        job.schedule('* * * * * *', null, { singletonKey: 'TEST' });

        await sleep(1000 * 60 * 3);

        expect(mockedHandler).toBeCalledTimes(3);

        await job.unSchedule();
    }, 1000 * 60 * 4);

    it('should handle multiple job', async () => {
        const mockedHandler = jest.fn();
        const job1 = scheduler.job({
            name: 'TEST',
            handler: () => {
                mockedHandler();
                console.log('TEST JOB 1');
            },
        });

        const job2 = scheduler.job({
            name: 'TEST',
            handler: () => {
                mockedHandler();
                console.log('TEST JOB 2');
            },
        });

        await sleep(1000);

        job1.send({ data: 'TEST' });
        job2.send({ data: 'TEST' });

        await sleep(10000);
        expect(mockedHandler).toBeCalledTimes(2);

    }, 1000 * 30);

    it('should handle multiple job with single key', async () => {
        const mockedHandler = jest.fn();

        const schedule = await scheduler.getSchedules();
        expect(schedule.length).toBe(0);

        const job1 = scheduler.job({
            name: 'TEST',
            handler: () => {
                mockedHandler();
                console.log('TEST JOB 1');
            },
        });

        const job2 = scheduler.job({
            name: 'TEST',
            handler: () => {
                mockedHandler();
                console.log('TEST JOB 2');
            },
        });

        job2.send({ data: 'TEST' }, { singletonKey: 'TEST' });

        await sleep(30000);
        expect(mockedHandler).toBeCalledTimes(1);

    }, 1000 * 60 * 1);

    it('should handle multiple job remotely', async () => {
        const mockedHandler = jest.fn();

        const schedule = await scheduler.getSchedules();
        expect(schedule.length).toBe(0);

        const job1 = scheduler.job({
            name: 'TEST',
            handler: async () => {
                await sleep(10000);
                mockedHandler();
                console.log('TEST JOB 1');
            },
        });

        const remoteJob = scheduler.job({
            name: 'TEST',
        });

        remoteJob.send({ data: 'TEST' }, { singletonKey: 'TEST' });
        remoteJob.send({ data: 'TEST2' }, { singletonKey: 'TEST' });

        await sleep(30000);
        expect(mockedHandler).toBeCalledTimes(1);
    });

    it.only("should handle multiple scheduled job", async () => {
        const mockedHandler = jest.fn();

        const handlerScript = path.join(__dirname, 'handlerScript.js');

        // Start the two processes
        await Promise.all([
            startJobInProcess(handlerScript, { type: 'start', jobNumber: 1 }),
            startJobInProcess(handlerScript, { type: 'start', jobNumber: 2 })
        ]);

        await sleep(1000 * 60 * 3);

        expect(mockedHandler).toBeCalledTimes(1);
    }, 1000 * 61 * 3);
});