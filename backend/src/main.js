import dotenv from "dotenv"
import connectDb from "./db/mongo.index.js";
import connectRedis from "./db/redis.index.js";
import { app } from "./app.js";
import { Admin } from "./models/admin.model.js";

dotenv.config({
    path: './.env'
});

const seedDefaultAdmin = async () => {
    const username = "admin";
    const password = "admin123";

    const admin = await Admin.findOne({ username });

    if (!admin) {
        await Admin.create({
            username,
            password
        });
        console.log("Default admin seeded: admin / admin123");
        return;
    }

    admin.password = password;
    await admin.save();
    console.log("Default admin password reset to: admin / admin123");
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
