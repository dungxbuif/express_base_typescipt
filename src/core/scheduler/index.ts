const logger = require('@trulet/logger');
const Scheduler = require('./scheduler');

logger.info('SCHEDULER_INIT');

const DATABASE_SSL = process.env.DATABASE_SSL ? true : process.env.TRUDI_ENV !== 'sandbox';
const INTERVAL_CHECK = process.env.CRON_JOB_CHECK_INTERVAL || 60;

const scheduler = new Scheduler({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  database: process.env.DATABASE_NAME || 'backenddb',
  user: process.env.DATABASE_USERNAME || 'dev',
  password: process.env.DATABASE_PASSWORD || 'localdev',
  cronWorkerIntervalSeconds: INTERVAL_CHECK,
  ssl: DATABASE_SSL ? {
    require: true,
    rejectUnauthorized: false,
  } : false,
  max: 3 // maximum connection pool size
});

logger.info('SCHEDULER_START');
scheduler.start();

module.exports = scheduler;
