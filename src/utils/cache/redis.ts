import { createClient } from 'redis';
import logger from '../logging/logger';

const redisClient = createClient();

redisClient.on('error', (err) => {
    logger.error(`Redis error: ${err}`);
})

export default redisClient;