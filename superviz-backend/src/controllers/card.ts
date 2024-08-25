import CardRepository from "../database/repositories/card";
import TagRepository from "../database/repositories/tag";
import TaskRepository from "../database/repositories/task";
import ListRepository from "../database/repositories/list";
import Card from "../entities/card";
import Tag from "../entities/tag";
import Task from "../entities/task";
import { SQLiteResult } from "../types";

export default class CardController {
    private cardRepository: CardRepository;
    private tagRepository: TagRepository;
    private taskRepository: TaskRepository;
    private listRepository: ListRepository;
  
    constructor() {
      this.cardRepository = new CardRepository();
      this.tagRepository = new TagRepository();
      this.taskRepository = new TaskRepository();
      this.listRepository = new ListRepository();
    }
  
    addTask = async (req: any, res: any) => {
      try {
        const task = new Task(req.body.title);
        await this.taskRepository.newTask(req.body.id_card, task);
        return res.status(200).json("Sucesso");
      } catch (err) {
        console.error('Erro ao criar tarefa:', err);
        return res.status(500).json('Error');
      }
    };
  
    addTag = async (req: any, res: any) => {
      try {
        const tag = await this.tagRepository.getTag(req.body.id_tag);
        if (tag) {
          if (tag.hasOwnProperty('id')) {
            await this.tagRepository.addTagToCard(req.body.id_card, tag.id);
            return res.status(200).json('Success');
          } else {
            return res.status(404).json('Tag not found');
          }
        } else {
          return res.status(404).json('Tag not found');
        }
      } catch (err) {
        console.error('Erro ao buscar tag:', err);
        return res.status(500).json('Error');
      }
    };

  
    create = async (req: any, res: any) => {
      try {
        const card = new Card(req.body.title, req.body.position, req.body.content);
        const response: SQLiteResult = await this.cardRepository.newCard(req.body.id_project, req.body.id_list, card);
        return res.status(200).json(response);
      } catch (err) {

        return res.status(500).json("Erro");
      }
    };
  
    update = async (req: any, res: any) => {
      try {
        let card = new Card(req.body.title, req.body.position, req.body.content, req.body.tasks);

        if (req.body.id_user) {
          card.setUser(req.body.id_user);
        }

        const response: SQLiteResult = await this.cardRepository.updateCard(req.params.id, card);
        const tags: SQLiteResult[] = await this.tagRepository.getTags(req.params.id);
        const tasks: SQLiteResult[] = await this.taskRepository.getTasks(req.params.id);

        if (response) {
          card.tags = tags.map(t => new Tag(t.title));
          card.tasks = tasks.map(t => new Task(t.title, t.completed));
          response.tags = tags.map(t => new Tag(t.title));
          response.tasks = tasks.map(t => new Task(t.title, t.completed));
        }
  
        return res.status(200).json(response);
      } catch (err) {
        return res.status(500).json("Error");
      }
    };
  
    reorder = async (req: any, res: any) => {
      try {
        await this.cardRepository.reorderCards(req.body);
        return res.status(200).json("Success");
      } catch (err) {

        return res.status(500).json("Error");
      }
    };

    asignUser = async (req: any, res: any) => {
      try {
        const response = await this.cardRepository.asignUser(req.body.id_card, req.body.id_user);
        if (response) {
          const card = await this.cardRepository.getCard(req.body.id_card);
          console.log(card)
          if(card) {
            return res.status(200).json(card);
          }
        }
      } catch (err) {
        return res.status(422).json("Error on asign card")
      }
    }

    removeCard = async (req:any, res:any) => {
      try {
        const response = await this.cardRepository.delete(req.params.id);
        if (response) return res.status(200).json(true);
      } catch (err) {
        return res.status(422).json("Error on delete card")
      }
    }
  }