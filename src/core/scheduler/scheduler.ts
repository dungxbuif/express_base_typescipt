import PgBoss from 'pg-boss';
const CRON_JOB_CHECK_INTERVAL = process.env.CRON_JOB_CHECK_INTERVAL || 60;

class Scheduler {
   /**
    * @param {PgBoss.ConnectionOptions} options
    * @memberof Scheduler
    * */
   private boss: PgBoss;
   constructor(options) {
      console.log('PgBoss init');
      this.boss = new PgBoss(options.connectionString || options);
   }

   job(options) {
      return new Job(this.boss, options);
   }

   /**
    * @param {string} name
    * @param {PgBoss.WorkOptions} options
    * @param {*} options.cron
    * @param {*} options.data
    * @param {*} options.options
    * @param {Function} handler
    * @returns {Promise<PgBoss.Job>}
    * @memberof Scheduler
    * */
   schedule(options) {
      const { data, cron, options: jobOpts = {} } = options;
      console.log('PgBoss schedule', options);
      const job = this.job(options);
      const jobOptions = {
         ...jobOpts,
      };

      if (options.singleton) {
         jobOptions.singletonKey = options.singletonKey || options.name;
      }

      return job.schedule(cron, data, jobOptions);
   }

   async start(options) {
      this.boss.start(options);
   }

   /**
    *
    * @param {PgBoss.StopOptions} options
    * @returns
    */
   stop(options) {
      return this.boss.stop(options);
   }

   getSchedules() {
      return this.boss.getSchedules();
   }
}

class Job {
   /**
    *
    * @param {PgBoss} boss
    * @param {*} options
    * @param {Function} options.handler
    * @param {string} options.name
    */
   constructor(boss, options) {
      this.boss = boss;
      this.singleton = options.singleton || false;
      this.handler = options.handler;
      this.name = options.name || handler.name;
      this.options = options;
   }

   /**
    * @param {PgBoss.WorkOptions} options
    * @returns {Promise<PgBoss.Job>}
    * @memberof Job
    * */
   async start(
      options = { newJobCheckIntervalSeconds: CRON_JOB_CHECK_INTERVAL }
   ) {
      console.log('PgBoss start', { name: this.name, options });
      const onCompletedFn = this.onCompleted.bind(this);
      this.boss.onComplete(this.name, onCompletedFn);

      const handlerFn = this.runHandler.bind(this);
      const job = await this.boss.work(this.name, options, handlerFn);

      if (typeof this.options.onInit === 'function') {
         console.log('PgBoss onInit', { name: this.name });
         this.options.onInit(this);
      }
      console.log('PgBoss started', { name: this.name });
      return job;
   }

   offWork() {
      return this.boss.offWork(this.name);
   }

   /**
    *
    * @param {*} data
    * @param {PgBoss.SendOptions} options
    * @returns {Promise<PgBoss.Job>}
    */
   send(data, options) {
      console.log('PgBoss send', options);
      const name = this.name;
      const job = this.boss.send(name, data, options);
      return job;
   }

   /**
    * @param {string} id
    * @param {PgBoss.CancelOptions} options
    * @returns {Promise<PgBoss.Job>}
    * @memberof Job
    * */
   async cancel(key) {
      console.log('PgBoss cancel', key);
      const jobs = await this.fetch(
         {
            state: 'created',
            singletonKey: key,
         },
         999
      );

      console.log(
         'PgBoss cancel jobs',
         jobs.map(({ id }) => id)
      );
      return Promise.all(jobs.map((job) => this.boss.cancel(job.id)));
   }

   /**
    * @param {string} id
    * @returns {Promise<PgBoss.Job>}
    * @memberof Job
    * */
   cancelId(id) {
      console.log('PgBoss cancelId', { id });
      return this.boss.cancel(id);
   }

   /**
    *
    * @param {string} cron
    * @param {*} data
    * @param {PgBoss.ScheduleOptions} option
    * @returns {Promise<PgBoss.Job>}
    */
   async schedule(cron, data, option) {
      const name = this.name;
      console.log('PgBoss schedule', { name, cron, data, option });
      const job = await this.boss.schedule(name, cron, data, option);
      return job;
   }

   /**
    * unschedule job
    * @returns {Promise<PgBoss.Job>}
    * @memberof Job
    */
   async unSchedule() {
      console.log('PgBoss unSchedule', { name: this.name });
      const job = await this.boss.unschedule(this.name);
      return job;
   }

   /**
    * @param {number} batchSize
    * @param {PgBoss.FetchOptions} options
    * @returns {Promise<PgBoss.Job[]>}
    * @memberof Job
    * */
   async fetch(options = {}, batchSize = 1) {
      console.log('PgBoss fetch', { name: this.name, options });

      let whereStatement = `WHERE "name" = '${this.name}'`;
      if (options.state) {
         whereStatement += ` AND "state" = '${options.state}'`;
      }
      if (options.singletonKey) {
         whereStatement += ` AND "singletonkey" = '${options.singletonKey}'`;
      }

      const jobs = await this.boss.db.executeSql(
         `SELECT * FROM "pgboss"."job" ${whereStatement} LIMIT ${batchSize};`
      );
      return jobs.rows || [];
   }

   onCompleted(job) {
      console.log('Job completed', job);
   }

   /**
    * private function to run handler
    * @private
    * @memberof Job
    */
   async runHandler(...args) {
      try {
         const handler = this.handler;
         if (typeof handler !== 'function')
            throw new Error('Handler is not a function');

         console.log('Running handler', this.name);
         await handler(...args);
         console.log('Finished running handler', this.name);

         if (typeof this.options.onComplete === 'function') {
            this.options.onComplete();
         }
      } catch (e) {
         console.log('Error running handler', e);
         logger.error(e);

         if (typeof this.options.onError === 'function') {
            this.options.onError(e);
         }
      }
   }
}

export default Scheduler;
