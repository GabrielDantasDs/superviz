import Database from "../database/queries";
import Card from "../entities/card";
import Participant from "../entities/participant";
import Project from "../entities/project";

export default class ParticipantController {
    public db: Database;

    constructor() {
        this.db = new Database();
    }

    get = async (req: any, res: any) => {
        try {
            const participant = new Participant(req.body.name, req.body.email, req.body.id_sprint, req.body.host);

            const response: any = await this.db.newParticipant(participant);

            if (response) {
                return res.status(200).json(response);
            } else {
                return res.status(404).json('Participante não encontrada');
            }
        } catch (err) {
            console.error('Erro ao buscar Participante:', err);
            return res.status(500).json('Erro interno ao buscar Participante');
        }
    }
}