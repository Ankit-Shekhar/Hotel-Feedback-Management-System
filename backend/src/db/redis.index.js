import { createClient } from "redis";

let redisClient = null;

const connectRedis = async () => {
	try {
		const hasRedisUrl = Boolean(process.env.REDIS_URL);
		const hasSocketConfig = Boolean(process.env.REDIS_HOST);

		if (!hasRedisUrl && !hasSocketConfig) {
			console.warn("Redis config not found. Continuing without Redis cache backend.");
			return null;
		}

		//if REDIS_URL is present we can directly use that single URI
		const redisConfig = process.env.REDIS_URL
			? {
				url: process.env.REDIS_URL
			}
			: {
				username: process.env.REDIS_USERNAME || "default",
				password: process.env.REDIS_PASSWORD,
				socket: {
					host: process.env.REDIS_HOST,
					port: Number(process.env.REDIS_PORT || 6379)
				}
			};

		//if connection is already open we return that same instance, no need to reconnect
		if (redisClient?.isOpen) {
			return redisClient;
		}

		redisClient = createClient(redisConfig);

		redisClient.on("error", (error) => {
			console.log(`Redis connection Failed: ${error}`);
		});

		await redisClient.connect();
		console.log("Redis connected successfully!");

		return redisClient;
	} catch (error) {
		console.warn(`Redis connection failed. Continuing without Redis cache backend: ${error?.message || error}`);
		redisClient = null;
		return null;
	}
};

export const getRedisClient = () => redisClient;
export default connectRedis;
