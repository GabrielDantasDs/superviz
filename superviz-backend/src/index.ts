import express from "express";
import bodyParser from "body-parser";
import projectRouter from "./routes/project";
import cardRouter from "./routes/card";
import taskRouter from "./routes/task";
import tagRouter from "./routes/tag";
import participantRouter from "./routes/participant";
import listRouter from "./routes/list";
import sprintRouter from "./routes/sprint";
import userRouter from "./routes/user";
import companyRouter from "./routes/company";
import cardActivityRouter from "./routes/cardActivity";
import * as fs from "fs";
import cors from "cors";
import Database from "./database/database";
import authenticateToken from "./middlewares/auth";

const boot = () => {
	const db = Database.getInstance();
	db.initializeTables();
};
const db_exist = fs.existsSync("database.sqlite");

if (!db_exist) {
	fs.writeFile("database.sqlite", "", (err) => {
		if (err) {
			console.error(err);
		}
	});
}

boot();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());

app.use(bodyParser.json());
app.use("/projects", authenticateToken, projectRouter);
app.use("/cards", authenticateToken, cardRouter);
app.use("/tasks", authenticateToken, taskRouter);
app.use("/tags", authenticateToken, tagRouter);
app.use("/participants", authenticateToken, participantRouter);
app.use("/lists", authenticateToken, listRouter);
app.use("/sprints", authenticateToken, sprintRouter); 
app.use("/users", userRouter);
app.use("/companies", authenticateToken, companyRouter);
app.use("/card-activities", authenticateToken, cardActivityRouter);

app.get("/", (req, res) => {
	res.send("Hello word");
});

app.listen(PORT, () => console.log(`Server is running on port:${PORT}`));
