const bullmqConnection = {
  url: process.env.REDIS_URL,
  maxRetriesPerRequest: 0,
};

export default bullmqConnection;
