import dotenv from "dotenv"
import connectDb from "./db/mongo.index.js";
import connectRedis from "./db/redis.index.js";
import { app } from "./app.js";
import { Admin } from "./models/admin.model.js";

dotenv.config({
    path: './.env'
});

const seedDefaultAdmin = async () => {
    const shouldSeed = process.env.SEED_DEFAULT_ADMIN === "true";

    if (!shouldSeed) {
        return;
    }

    const username = process.env.DEFAULT_ADMIN_USERNAME;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;

    if (!username || !password) {
        console.warn("SEED_DEFAULT_ADMIN is true, but DEFAULT_ADMIN_USERNAME or DEFAULT_ADMIN_PASSWORD is missing. Skipping admin seed.");
        return;
    }

    const admin = await Admin.findOne({ username: username.trim() });

    if (!admin) {
        await Admin.create({
            username: username.trim(),
            password
        });
        console.log("Default admin seeded from environment variables.");
    }
};

connectDb()
//application is starting to listen using the Database
.then(async () => {
    await seedDefaultAdmin();
    await connectRedis();
})
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((error) => {
    console.error(`Database connection failed: ${error}`);
});
