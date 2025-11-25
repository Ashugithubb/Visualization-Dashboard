import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Insight from "./models/Insight.js";

dotenv.config();

const seedData = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // 2. Read JSON file
    const rawData = fs.readFileSync("./data/jsondata.json", "utf-8");
    const jsonData = JSON.parse(rawData);

    // 3. Clear existing data (optional)
    await Insight.deleteMany({});
    console.log("Old Data Removed");

    // 4. Insert new data
    await Insight.insertMany(jsonData);
    console.log("Data Imported Successfully");

    process.exit(); // Exit the script
  } catch (err) {
    console.error("Seeding Error:", err);
    process.exit(1);
  }
};

seedData();
