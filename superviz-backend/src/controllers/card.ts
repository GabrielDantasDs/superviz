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
        return res.status(500).json('Erro interno ao criar tarefa');
      }
    };
  
    addTag = async (req: any, res: any) => {
      try {
        const tag = await this.tagRepository.getTag(req.body.id_tag);
        if (tag) {
          if (tag.hasOwnProperty('id')) {
            await this.tagRepository.addTagToCard(req.body.id_card, tag.id);
            return res.status(200).json('Sucesso');
          } else {
            return res.status(404).json('Tag não encontrada');
          }
        } else {
          return res.status(404).json('Tag não encontrada');
        }
      } catch (err) {
        console.error('Erro ao buscar tag:', err);
        return res.status(500).json('Erro interno ao buscar tag');
      }
    };
  
    // move = async (req: any, res: any) => {
    //   try {
    //     const list = await this.listRepository.getList(req.body.id_list);
    //     if (list) {
    //       await this.cardRepository.moveCard(req.params.id, req.body.id_list, req.body.position);
    //       return res.status(200).json("Sucesso");
    //     } else {
    //       return res.status(404).json("Lista ou card não encontrada(o)");
    //     }
    //   } catch (err) {
    //     console.error('Erro ao mover o card:', err);
    //     return res.status(500).json("Erro interno ao mover o card");
    //   }
    // };
  
    create = async (req: any, res: any) => {
      try {
        const card = new Card(req.body.title, req.body.position, req.body.content);
        const response: SQLiteResult = await this.cardRepository.newCard(req.body.id_project, req.body.id_list, card);
        return res.status(200).json(response);
      } catch (err) {
        console.error('Erro ao criar o card:', err);
        return res.status(500).json("Erro interno ao criar o card");
      }
    };
  
    update = async (req: any, res: any) => {
      try {
        let card = new Card(req.body.title, req.body.position, req.body.content, req.body.tasks);

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
        console.error('Erro ao atualizar o card:', err);
        return res.status(500).json("Erro interno ao atualizar o card");
      }
    };
  
    reorder = async (req: any, res: any) => {
      try {
        await this.cardRepository.reorderCards(req.body);
        return res.status(200).json("Sucesso");
      } catch (err) {
        console.error('Erro ao reordenar os cards:', err);
        return res.status(500).json("Erro interno ao reordenar os cards");
      }
    };
  }