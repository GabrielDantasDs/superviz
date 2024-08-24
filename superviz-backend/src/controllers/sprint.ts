import SprintRepository from "../database/repositories/sprint";
import Sprint from "../entities/sprint";
import { SQLiteResult } from "../types";

export default class SprintController {
  private sprintRepository: SprintRepository;

  constructor() {
    this.sprintRepository = new SprintRepository();
  }

  create = async (req: any, res: any) => {
    try {
      const sprint = new Sprint(req.body.title);
      const response = await this.sprintRepository.createSprint(sprint, req.body.id_project);

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json("Houve um erro ao criar a sprint.");
    }
  };

  close = async (req: any, res: any) => {
    try {
      const response = await this.sprintRepository.closeSprint(req.params.id);
      if (response) {
        return res.status(200).json("Sucesso");
      } else {
        return res.status(500).json("Houve um erro ao fechar a sprint.");
      }
    } catch (error) {
      return res.status(500).json("Houve um erro ao fechar a sprint.");
    }
  };

  getAll = async (req: any, res: any) => {
    try {
      const response: SQLiteResult[] = await this.sprintRepository.getSprints();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json("Houve um erro ao obter as sprints.");
    }
  };

  get = async (req: any, res: any) => {
    try {
      const response: SQLiteResult = await this.sprintRepository.getSprint(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json("Houve um erro ao obter a sprint.");
    }
  };
}