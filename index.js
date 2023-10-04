import express from "express";
import router from "./routes/api.js";
import cors from "cors";
const app = express();
app.use(cors());

app.use(express.json());
app.use("/api" , router);

app.listen(3000,()=>
{
    console.log("Server started at port ", 3000);
});