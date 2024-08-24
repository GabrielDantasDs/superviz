import Database from "../database";
import Sprint from "../../entities/sprint";

export default class SprintRepository {
  private db: Database;
  private lastID: Promise<Number> | number;

  constructor() {
    this.db = Database.getInstance();
    this.lastID = this.db.getLastInsertId();
  }

  async createSprint(sprint: Sprint, projectId: number): Promise<any> {

    return new Promise((resolve, reject) => {
      this.db.getConnection().run(
        `INSERT INTO sprints (title, id_project) VALUES (?, ?)`,
        [sprint.getTitle(), projectId],
        async (err) => {
          if (err) reject(err);
          else {
            const lastID = await this.db.getLastInsertId();
            this.db.getConnection().get(
              `SELECT * FROM sprints WHERE id = ?`,
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

  async getSprints(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().all(
        `SELECT * FROM sprints`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getSprint(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().get(
        `SELECT * FROM sprints WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async closeSprint(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().run(
        `UPDATE sprints SET closed_at = ? WHERE id = ?`,
        [new Date(), id],
        (err) => {
          if (err) reject(false);
          else resolve(true);
        }
      );
    });
  }
}