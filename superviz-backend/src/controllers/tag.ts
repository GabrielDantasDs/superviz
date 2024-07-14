import Database from "../database/queries";
import Tag from "../entities/tag";

export default class TagController {
    public db: Database;

    constructor() {
        this.db = new Database();
    }

    store = (req:any, res: any) => {
        const tag = new Tag(req.body.title);

        this.db.newTag(tag);

        return res.status(200).json("Sucesso");
    }
}