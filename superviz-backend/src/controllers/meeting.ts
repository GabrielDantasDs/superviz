import Database from "../database/queries";
import Meeting from "../entities/meeting";

export default class MeetingController {
    public db: Database;

    constructor() {
        this.db = new Database();
    }

    create = async (req:any, res:any) => {
        const meeting = new Meeting(req.body.title);
        const response = await this.db.createMeeting(meeting, req.body.id_project);

        if (response) {
            return res.status(200).json(response)
        } else {
            return res.status(500).json("Houve um erro ao criar a lista.");
        }
    }

    close = async (req:any, res:any) => {
        const response = await this.db.closeMeeting(req.params.id);

        if (response) {
            return res.status(200).json("Sucesso")
        } else {
            return res.status(500).json("Houve um erro ao criar a lista.");
        }
    }

    getAll = async (req: any, res: any) => {
        const response = await this.db.getMeetings();

        if (response) {
            return res.status(200).json(response)
        } else {
            return res.status(500).json("Houve um erro ao criar a lista.");
        }
    }

    get = async (req: any, res: any) => {
        const response = await this.db.getMeeting(req.params.id);

        if (response) {
            return res.status(200).json(response)
        } else {
            return res.status(500).json("Houve um erro ao criar a lista.");
        }
    }
}