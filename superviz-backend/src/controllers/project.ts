import Database from "../database/queries";

export default class ProjectController {
    store(req:any, res:any) {
        const project = new Project(req.name);
        const db = new Database();

        db.newProject();
    }
}