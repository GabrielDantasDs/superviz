import Database from "../database/queries";

export default class ListController {
    public db: Database;

    constructor() {
        this.db = new Database();
    }

    create = async (req:any, res:any) => {
        const list = await this.db.createList(req.body.title, req.body.id_project);

        if (list) {
            return res.status(200).json(list)
        } else {
            return res.status(500).json("Houve um erro ao criar a lista.");
        }
    }

    update = async (req: any, res: any) => {
        const list = await this.db.updateList(req.body.title, res.body.id_list);

        if (list) {
            return res.status(200).json("Sucesso")
        } else {
            return res.status(500).json("Houve um erro ao editar a lista.");
        }
    }

    getAll = async (req: any, res: any) => {
        const lists = await this.db.getLists(req.body.id_project);

        if (lists) {
            return res.status(200).json(lists);
        } else {
            return res.status(404).json("Nehuma lista encontrada");
        }
    }
}