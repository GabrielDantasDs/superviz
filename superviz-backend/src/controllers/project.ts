import ProjectRepository from "../database/repositories/project";
import CardRepository from "../database/repositories/card";
import ListRepository from "../database/repositories/list";
import TaskRepository from "../database/repositories/task";
import TagRepository from "../database/repositories/tag";
import Project from "../entities/project";
import Card from "../entities/card";
import { SQLiteResult } from "../types";
import CardActivityRepository from "../database/repositories/cardActivty";

export default class ProjectController {
  private projectRepository: ProjectRepository;
  private cardRepository: CardRepository;
  private listRepository: ListRepository;
  private taskRepository: TaskRepository;
  private tagRepository: TagRepository;
  private cardActivitiesRepository: CardActivityRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.cardRepository = new CardRepository();
    this.listRepository = new ListRepository();
    this.taskRepository = new TaskRepository();
    this.tagRepository = new TagRepository();
    this.cardActivitiesRepository = new CardActivityRepository();
  }

  store = async (req: any, res: any) => {
    try {
      const project = new Project(req.body.name);
      const response: SQLiteResult = await this.projectRepository.newProject(project);
      return res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao criar o projeto:', error);
      return res.status(500).json('Erro interno ao criar o projeto');
    }
  };

  addCard = async (req: any, res: any) => {
    try {
      const card = new Card(req.body.title, req.body.index, req.body.content);
      await this.cardRepository.newCard(req.body.id_project, req.body.id_list, card);
      return res.status(200).json("Sucesso");
    } catch (error) {
      console.error('Erro ao criar o card:', error);
      return res.status(500).json('Erro interno ao criar o card');
    }
  };

  get = async (req: any, res: any) => {
    try {
      const project: SQLiteResult = await this.projectRepository.getProject(req.params.id);
      const cards: SQLiteResult[] = await this.cardRepository.getCards(project.id);
      const lists: SQLiteResult[] = await this.listRepository.getLists(project.id);
      const cards_activities: SQLiteResult[] = await this.cardActivitiesRepository.getCardActivityBySprint(project.id);

      const _cards = await Promise.all(
        cards.map(async (card: SQLiteResult) => {
          const tasks: SQLiteResult[] = await this.taskRepository.getTasks(card.id);
          const tags: SQLiteResult[] = await this.tagRepository.getTags(card.id);
          return { id:card.id, title: card.title, content: card.content, position:card.position, id_list: card.id_list, id_user: card.id_user, tasks, tags };
        })
      );

      lists.forEach((list) => {
        list.cards = _cards.filter((card) => card.id_list === list.id);
        list.cards = list.cards.sort((a: Card, b: Card) => a.position > b.position ? 1 : -1);
      });

      project.lists = lists;
      project.cards_activities = cards_activities;
      return res.status(200).json(project);
    } catch (error) {
      console.error('Erro ao buscar o projeto:', error);
      return res.status(500).json('Erro interno ao buscar o projeto');
    }
  };

  getAll = async (req: any, res: any) => {
    try {
      const response: SQLiteResult[] = await this.projectRepository.getProjects();

      return res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao buscar os projetos:', error);
      return res.status(500).json('Erro interno ao buscar os projetos');
    }
  };
}