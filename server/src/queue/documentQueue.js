import {Queue} from 'bullmq';
import {redisConnection} from '../db/redis.js';
export const documentQueue= new Queue('document-processing', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,

        backoff:{
            type: 'exponential',
            delay: 5000
        },

        removeOnComplete:{
            count: 100,
        },

        removeOnFail:{
            count: 500,
        },
    },
});