// require('dotenv').config({path: './.env'}); // Load's environment variables from .env file and makes them available everywhere required in the application. :: "As early as possible import the dotenv file and configure it"
//import syntax for dotenv is an experimental feature, so to use that we have to configure it in package.json as ""dev": "nodemon -r dotenv/config --experimental-json-modules src/main.js""

import dotenv from "dotenv"
import connectDb from "./db/mongo.index.js";
import connectRedis from "./db/redis.index.js";
import { app } from "./app.js";
import { Admin } from "./models/admin.model.js";

dotenv.config({
    path: './.env'
});

const seedDefaultAdmin = async () => {
    const admin = await Admin.findOne({ username: "admin" });

    if (!admin) {
        await Admin.create({
            username: "admin",
            password: "admin123"
        });
        console.log("Default admin seeded: admin / admin123");
        return;
    }

    admin.password = "admin123";
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
