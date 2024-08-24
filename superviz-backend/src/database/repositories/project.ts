import Database from "../database";
import Project from "../../entities/project";

export default class ProjectRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async newProject(project: Project): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().run(
        `INSERT INTO projects (name) VALUES (?)`,
        [project.name],
        async (err) => {
          if (err) reject(err);
          else {
            try {
              const lastId = await this.db.getLastInsertId();
              const row = await this.getProject(lastId);
              resolve(row);
            } catch (error) {
              reject(error);
            }
          }
        }
      );
    });
  }

  async getProject(projectId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().get(
        `SELECT * FROM projects WHERE id = ?`,
        [projectId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async getProjects(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().all(
        `SELECT * FROM projects`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // ... rest of the class remains the same
}