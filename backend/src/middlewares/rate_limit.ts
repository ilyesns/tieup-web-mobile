// import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis'; // Optional, if using Redis
// import { createClient } from 'redis'; // Optional, if using Redis

// // Optional: Initialize Redis client if using RedisStore
// const redisClient = createClient({ legacyMode: true });
// redisClient.connect().catch(console.error);

// // Rate limit middleware for click updates
// const clickUpdateRateLimit = rateLimit({
//   store: new RedisStore({
//     expiry: 60, // Key expiry in seconds
//   }),
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` per endpoint
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

// // Rate limit middleware for impression updates
// const impressionUpdateRateLimit = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` per endpoint
//   // You can omit the store option if not using Redis, it will use memory store by default
// });
