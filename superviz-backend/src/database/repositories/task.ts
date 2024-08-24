import Database from "../database";
import Task from "../../entities/task";

export default class TaskRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async newTask(cardId: number, task: Task): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().run(
        `INSERT INTO tasks (id_card, title) VALUES (?, ?)`,
        [cardId, task.title],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  async getTasks(cardId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().all(
        `SELECT * FROM tasks WHERE id_card = ?`,
        [cardId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async setTaskCompleted(taskId: number, completed: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().run(
        `UPDATE tasks SET completed = ? WHERE id = ?`,
        [completed, taskId],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }
}