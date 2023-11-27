'use strict';
const PgBoss = require('pg-boss');
const env = process.env.TRUDI_ENV || 'sandbox';
const dbConfig = {
   host: process.env.DATABASE_HOST || 'localhost',
   port: process.env.DATABASE_PORT || 5432,
   database: process.env.DATABASE_NAME,
   user: process.env.DATABASE_USERNAME,
   password: process.env.DATABASE_PASSWORD,
};
const boss = new PgBoss(dbConfig);

boss.on('error', (error: Error) => {
   throw error;
});

module.exports = boss;
