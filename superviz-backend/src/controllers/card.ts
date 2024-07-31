import Database from "../database/queries";
import Card from "../entities/card";
import Task from "../entities/task";

export default class CardController {
    public db: Database;

    constructor() {
        this.db = new Database();
    }

    addTask = (req:any, res: any) => {
        const task = new Task(req.body.title);

        this.db.newTask(req.body.id_card, task);

        return res.status(200).json("Sucesso");
    }

    addTag = async (req: any, res: any) => {
        try {
            const tag = await this.db.getTag(req.body.id_tag);

            if (tag) {
                if (tag.hasOwnProperty('id')) 
                    this.db.addTagToCard(req.body.id_card, (tag as {id:number, title: string}).id);
                return res.status(200).json('Sucesso');
            } else {
                return res.status(404).json('Tag não encontrada');
            }
        } catch (err) {
            console.error('Erro ao buscar tag:', err);
            return res.status(500).json('Erro interno ao buscar tag');
        }
    };

    moveCard = async (req: any, res: any) => {
        try {

            const list = await this.db.getList(req.body.id_list);

            if (list) {
                const card = await this.db.moveCard(req.body.id_card, req.body.id_list);
            } else {
                return res.status(404).json("Lista ou card não encontrada(o)")
            }
        } catch (err) {

        }
    };

    create = async (req:any, res: any) => {
        const card = new Card(req.body.title, req.body.content);

        try {
            const response = await this.db.newCard(req.body.id_project, req.body.id_list, card);

            return res.status(200).json(response);
        } catch (err) {
            return res.status(404).json(JSON.stringify(err));
        }
    }
}