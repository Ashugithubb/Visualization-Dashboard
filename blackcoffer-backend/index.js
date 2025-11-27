import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import insightRoutes from "./routes/insightRoutes.js"
import statRoutes from "./routes/statRoutes.js";
import aggretaeRoutes from "./routes/aggregateRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());


connectDB();



// app.use(cors({
//     origin: process.env.CLIENT_API || "https://visualization-dashboard-2.vercel.app",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
// }));

app.use(cors({
    origin: function (origin, callback) {
        console.log("REQUEST ORIGIN:", origin);
        console.log("ENV CLIENT_URL:", process.env.CLIENT_URL);

        const allowed = [
            "http://localhost:3000",
            "https://visualization-dashboard-2.vercel.app"
        ];

        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Blocked by CORS"));
        }
    },
    credentials: true
}));


app.get("/", (req, res) => {
    res.send("Backend is running...");
});

app.listen(process.env.PORT, () =>
    console.log(`Server running on PORT ${process.env.PORT}`)
);

app.use("/api/insights", insightRoutes);
app.use("/api/insights", statRoutes);
app.use("/api/insights", aggretaeRoutes);