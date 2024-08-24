
import { SQLiteResult } from "../types";
import CardActivityRepository from "../database/repositories/cardActivty";
import CardActivity from "../entities/cardActivity";

export default class CardActivityController {
    private cardActivityRepository: CardActivityRepository;
  
    constructor() {
      this.cardActivityRepository = new CardActivityRepository();
    }
  
    create = async (req: any, res: any) => {
      try {
        const card_activity = new CardActivity(req.body.source_position, req.body.destination_position, req.body.id_card, req.body.source_list_id, req.body.destination_list_id);
        const response: SQLiteResult = await this.cardActivityRepository.newCardActivity(card_activity);
        return res.status(200).json(response);
      } catch (err) {
        console.error('Erro ao criar o card:', err);
        return res.status(500).json("Erro interno ao criar o card");
      }
    };

    get = async (req: any, res: any) => {
      try {
        const response: SQLiteResult = await this.cardActivityRepository.getCardActivity(req.params.id);
        return res.status(200).json(response);
      } catch (err) {
        console.error('Erro ao criar o card:', err);
        return res.status(500).json("Erro interno ao criar o card");
      }
    }

    getAllByCard = async (req: any, res: any) => {
      try {
        const response: SQLiteResult = await this.cardActivityRepository.getCardActivityByCard(req.params.id);
        return res.status(200).json(response);
      } catch (err) {
        console.error('Erro ao criar o card:', err);
        return res.status(500).json("Erro interno ao criar o card");
      }
    }

    getAllByProject = async (req: any, res: any) => {
      try {
        const response: SQLiteResult = await this.cardActivityRepository.getCardActivityByProject(req.params.id);
        return res.status(200).json(response);
      } catch (err) {
        console.error('Erro ao criar o card:', err);
        return res.status(500).json("Erro interno ao criar o card");
      }
    }
  }