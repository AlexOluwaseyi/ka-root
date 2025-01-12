// const MongoClient = require("mongodb").MongoClient;
import mongodb from "mongodb";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

// import { MongoClientOptions } from "mongodb";
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("mydb");
const users = db.collection("users");

await users.insertOne({ name: "John", age: 30 });
const user = await users.findOne({ name: "John" });
