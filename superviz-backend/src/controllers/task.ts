import Database from "../database/queries";

export default class TaskController {
    public db: Database;

    constructor() {
        this.db = new Database();
    }

    setTaskCompleted = (req:any, res: any) => {
        this.db.setTaskCompleted(req.params.id, req.body.completed);

        return res.status(200).json("Sucesso");
    }
}