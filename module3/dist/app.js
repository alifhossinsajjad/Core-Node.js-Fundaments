import express, {} from "express";
import cors from "cors";
import { todosRouter } from "./app/ToDos/todos.routes.js";
const app = express();
app.use(express.json());
const userRouter = express.Router();
app.use("/todos", todosRouter);
app.use("/users", userRouter);
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Welcome to the ToDo App!");
});
export default app;
// Trigger nodemon restart
