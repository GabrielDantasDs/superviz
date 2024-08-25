import CardRepository from "../database/repositories/card";
import CardActivityRepository from "../database/repositories/cardActivty";
import ListRepository from "../database/repositories/list";
import ProjectRepository from "../database/repositories/project";
import SprintRepository from "../database/repositories/sprint";
import TagRepository from "../database/repositories/tag";
import TaskRepository from "../database/repositories/task";
import Card from "../entities/card";
import Project from "../entities/project";
import Sprint from "../entities/sprint";
import { SQLiteResult } from "../types";

export default class SprintController {
  private sprintRepository: SprintRepository;
  private projectRepository: ProjectRepository;
  private cardRepository: CardRepository;
  private listRepository: ListRepository;
  private taskRepository: TaskRepository;
  private tagRepository: TagRepository;
  private cardActivitiesRepository: CardActivityRepository;

  constructor() {
    this.sprintRepository = new SprintRepository();
    this.projectRepository = new ProjectRepository();
    this.cardRepository = new CardRepository();
    this.listRepository = new ListRepository();
    this.taskRepository = new TaskRepository();
    this.tagRepository = new TagRepository();
    this.cardActivitiesRepository = new CardActivityRepository();
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
      const sprint: SQLiteResult = await this.sprintRepository.getSprint(req.params.id)
      const project: SQLiteResult = await this.projectRepository.getProject(sprint.id_project);
      const cards: SQLiteResult[] = await this.cardRepository.getCards(project.id);
      const lists: SQLiteResult[] = await this.listRepository.getLists(project.id);
      const cards_activities: SQLiteResult[] = await this.cardActivitiesRepository.getCardActivityBySprint(req.params.id);

      const _cards = await Promise.all(
        cards.map(async (card: SQLiteResult) => {
          const tasks: SQLiteResult[] = [];
          const tags: SQLiteResult[] = [];
          return { id:card.id, title: card.title, content: card.content, position:card.position, id_list: card.id_list, id_user: card.id_user, tasks, tags };
        })
      );

      lists.forEach((list) => {
        list.cards = _cards.filter((card) => card.id_list === list.id);
        list.cards = list.cards.sort((a: Card, b: Card) => a.position > b.position ? 1 : -1);
      });

      project.lists = lists;
      project.cards_activities = cards_activities;
      
      const aux = new Project(project.name, project.lists, project.cards_activities);
      aux.setId(project.id);
      
      const data = aux.toBlob();

      const response = await this.sprintRepository.closeSprint(req.params.id, data);
      if (response) {
        return res.status(200).json("Sucesso");
      } else {
        return res.status(500).json("Houve um erro ao fechar a sprint.");
      }
    } catch (error) {
      console.log(error)
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

  getClosedSprint = async (req: any, res: any) => {
    try {
      const response = await this.sprintRepository.getClosedSprint(req.params.id);
      const sprint = await this.sprintRepository.getSprint(req.params.id)
      const jsonString = response.data.toString('utf8');
      const parsed = JSON.parse(jsonString);
      
      return res.status(200).json(parsed);
    } catch (error) {
      console.log(error)
      return res.status(500).json("Houve um erro ao obter a sprint.");
    }
  }

  getClosedSprints = async (req: any, res: any) => {
    try {
      console.log('teste')
      const response: SQLiteResult[] = await this.sprintRepository.getClosedsprints();
      console.log('teste')
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json("Houve um erro ao obter as sprints.");
    }
  }
}