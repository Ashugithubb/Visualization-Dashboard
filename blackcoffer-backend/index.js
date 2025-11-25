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



app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
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