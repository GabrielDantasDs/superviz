import ListRepository from "../database/repositories/list";
import { SQLiteResult } from "../types";

export default class ListController {
  private listRepository: ListRepository;

  constructor() {
    this.listRepository = new ListRepository();
  }

  create = async (req: any, res: any) => {
    try {
      const list: SQLiteResult = await this.listRepository.createList(req.body.title, req.body.position, req.body.id_project);
      return res.status(200).json(list);
    } catch (error) {
      console.error('Erro ao criar a lista:', error);
      return res.status(500).json("Houve um erro ao criar a lista.");
    }
  };

//   update = async (req: any, res: any) => {
//     try {
//       const list: SQLiteResult = await this.listRepository.updateList(req.body.title, req.body.id_list);
//       return res.status(200).json("Sucesso");
//     } catch (error) {
//       console.error('Erro ao atualizar a lista:', error);
//       return res.status(500).json("Houve um erro ao editar a lista.");
//     }
//   };

  getAll = async (req: any, res: any) => {
    try {
      const lists: SQLiteResult[] = await this.listRepository.getLists(req.body.id_project);
      return res.status(200).json(lists);
    } catch (error) {
      console.error('Erro ao obter as listas:', error);
      return res.status(404).json("Nehuma lista encontrada");
    }
  };

  rename = async (req: any, res: any) => {
    try {
      const list: SQLiteResult = await this.listRepository.renameList(req.params.id, req.body.title);
      return res.status(200).json(list);
    } catch (error) {
      console.error('Erro ao renomear a lista:', error);
      return res.status(404).json("Nenhum lista encontrada");
    }
  };

  reorder = async (req: any, res: any) => {
    try {
      await this.listRepository.reorderLists(req.body);
      return res.status(200).json("Sucesso");
    } catch (error) {
      console.error('Erro ao reordenar as listas:', error);
      return res.status(500).json("Erro interno ao reordenar as listas");
    }
  };

  remove = async (req: any, res: any) => {
    try {
      await this.listRepository.removeList(req.params.id);
      return res.status(200).json("Sucesso");
    } catch (error) {
      console.error('Erro ao reordenar as listas', error);
      return res.status(500).json("Erro interno ao remover a lista");
    }
  }
}