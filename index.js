import express  from "express";
import cors from "cors"
import authRouter from "./routes/user.js";
import connectToDb from "./db-connect/mongoose.js";


const app = express()

await connectToDb();
const corsOptions = {
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', };
app.use(cors(corsOptions))
app.use(express.json());
app.use("/api",authRouter);


app.listen(4444, () => {
    console.log("run complete");
  })

