# Trudi scheduler

## Example usage

```javascript
const scheduler = new Scheduler({
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || 5432,
    database: process.env.DATABASE_NAME || 'backenddb',
    user: process.env.DATABASE_USERNAME || 'dev',
    password: process.env.DATABASE_PASSWORD || 'localdev',
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
});

const job = scheduler
  .job({
    name: "SOME_JOB_NAME",
    handler: async () => {
      console.log("Job running");
    },
  })
  .schedule("*/15 * * * *", {
    tz: "Etc/UTC",
    singletonKey: "UNIQUE",
  });
```

## Dynamic job scheduling

```javascript
const job = scheduler.job({
  name: "SOME_JOB_NAME",
  handler: async () => {
    console.log("Job running");
  },
});

// sending new job
job.send(
  { dataKey: 1 },
  {
    startAfter: new Date("2021-01-01T00:00:00.000Z"),
    singletonKey: "UNIQUE_KEY",
  }
);

job.cancel({ singletonKey: "UNIQUE_KEY" });
```

## Cancel job remotely

```javascript
const job = scheduler.job({
  name: "SOME_JOB_NAME",
});

job.cancel({ singletonKey: "UNIQUE_KEY" });
```