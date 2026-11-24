import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import { rateLimiter } from "./middlewares/rateLimiter.middleware.js";


const app = express();

const normalizeOrigin = (value) => value?.trim().replace(/\/+$/, "");

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());

// app.use -> .use is used to deal with Middlewares and Configurations.
app.use(cors({
    origin: (origin, callback) => {
        const normalizedOrigin = normalizeOrigin(origin);

        if (!origin || allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

//configuring the limit of Json that can be accepted. This data comes from user filled forms. Form data comes as json
app.use(express.json({
    limit: "16kb"
}));

//with extended we can send nested objects in the request body, not highly used. This config tells express that data may also come from url, so handle that as well : mostly this data comes because of the GET request.
app.use(express.urlencoded({extended: true, limit: "16kb"}));

//used to store static files like images, css, js, etc. within my local server in public named file, used while dealing with multer and Cloudinary file uploads
app.use(express.static("public"));

//cookie parser is used to read imp cookies from users browser and update them as well, basically performing CRUD ops over the users cookies
app.use(cookieParser());
app.use(rateLimiter);



//routes import
import hotelRouter from './routes/hotel.routes.js'
import feedbackRouter from './routes/feedback.routes.js'
import adminRouter from './routes/admin.routes.js'
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

//before when we satrted the course we had all the routes and their controllers in a single file only, but now since we have separated routes and controllers into different files, we have to import the routes here in app.js as middlewares.
//as now we have separated routes and controllers, so we have to import the routes as Middlewares, and so we use "app.use()"
//when the "users" endpoint will be hitted the control will be passed to "userRouter" and it will take us to "user.route.js"

app.use("/api/hotels", hotelRouter)
app.use("/api/feedback", feedbackRouter)
app.use("/api/admin", adminRouter)
app.get("/api/health", (req, res) => {
    return res.status(200).json({ success: true, message: "Server is healthy" });
});

//keep error middleware at last so it can handle errors from all routes
app.use(errorMiddleware)

export { app }