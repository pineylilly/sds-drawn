import { createClient } from "redis";


const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

console.log(process.env.REDIS_HOST);

const redisClient = createClient({
    url : url,
});

redisClient.on("error", (error) => {
    console.error(error);
});

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

if (!redisClient.isOpen){
    redisClient.connect();
}

export default redisClient;