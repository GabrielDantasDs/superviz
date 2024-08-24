import Database from "../database";
import List from "../../entities/list";

export default class ListRepository {
  private db: Database;
  private lastID: Promise<Number> | number;

  constructor() {
    this.db = Database.getInstance();
    this.lastID = this.db.getLastInsertId();
  }

  async getList(listId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().get(
        `SELECT * FROM lists WHERE id = ?`,
        [listId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async getLists(projectId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().all(
        `SELECT * FROM lists WHERE id_project = ? ORDER BY position ASC`,
        [projectId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async renameList(listId: number, title: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().run(
        `UPDATE lists SET title = ? WHERE id = ?`,
        [title, listId],
        async (err) => {
          if (err) reject(err);
          else {
            this.db.getConnection().get(
              `SELECT * FROM lists WHERE id = ?`,
              [listId],
              (err, row) => {
                if (err) reject(err);
                else resolve(row);
              }
            );
          }
        }
      );
    });
  }

  async createList(title: string, position: number, projectId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().run(
        `INSERT INTO lists (title, position, id_project) VALUES (?, ?, ?)`,
        [title, position, projectId],
        async (err) => {
          if (err) reject(err);
          else {
            const lastID = await this.db.getLastInsertId();
            this.db.getConnection().get(
              `SELECT * FROM lists WHERE id = ?`,
              lastID,
              (err, row) => {
                if (err) reject(err);
                else resolve(row);
              }
            );
          }
        }
      );
    });
  }

  async reorderLists(lists: List[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().serialize(() => {
        lists.forEach((list: List) => {
          this.db.getConnection().run(
            `UPDATE lists SET position = ? WHERE id = ?`,
            [list.position, list.id],
            (err) => {
              if (err) reject(err);
            }
          );
        });
        resolve(true);
      });
    });
  }

  async removeList(listId: Number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().serialize(() => {
        this.db.getConnection().run(
          `DELETE FROM lists where id = ?`, [listId], (err) => {
            if (err) reject(err);
            else resolve(true);
          }
        )
      })
    })
  }
}