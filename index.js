import express from "express";
import bodyparser from "body-parser";
import router from "./routes/route.js";
import { connect } from "./database/connection.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
const app = express();
dotenv.config();

connect();

app.use(express.static("public"));
app.use(express.json());
app.set("views", "htmlfiles");
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

app.listen(process.env.PORT || 8080);
