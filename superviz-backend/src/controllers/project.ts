import Database from "../database/queries";
import Card from "../entities/card";
import Project from "../entities/project";

export default class ProjectController {
    public db: Database;

    constructor() {
        this.db = new Database();
    }

    store = (req:any, res:any) => {
        const project = new Project(req.body.name);

        this.db.newProject(project);

        return res.status(200).json("Sucesso");
    }

    addCard = (req:any, res: any) => {
        const card = new Card(req.body.title, req.body.content);

        this.db.newCard(req.body.id_project, req.body.id_list, card);

        return res.status(200).json("Sucesso");
    }

    get = async (req: any, res: any) => {
        try {
            const project: any = await this.db.getProject(req.params.id);
            const cards: any = await this.db.getCards(project.id);
            const lists: any = await this.db.getLists(project.id);

            const _cards = await Promise.all(cards.map(async (card: any) => {
                const tasks: any = await this.db.getTasks(card.id);
                const tags: any = await this.db.getTags(card.id);

                card.tasks = tasks;
                card.tags = tags;

                return card;
            }))

            lists.map((list: any) => {
                list.cards = [];
                
                _cards.map((card) => {
                    if (card.id_list == list.id) {
                        list.cards.push(card);
                    }
                });
            });


            project.lists = lists;

            if (project) {
                return res.status(200).json(project);
            } else {
                return res.status(404).json('Projeto não encontrada');
            }
        } catch (err) {
            console.error('Erro ao buscar projeto:', err);
            return res.status(500).json('Erro interno ao buscar projeto');
        }
    }

    getAll = async (req:any, res:any) => {
        try {
            const response = await this.db.getProjects()
            return res.status(200).json(response)
        } catch (err) {
            return res.status(404).json("Projetos não encontrados");
        }
    }
}