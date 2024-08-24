import Database from "../database";
import Tag from "../../entities/tag";

export default class TagRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async newTag(tag: Tag): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().run(
        `INSERT INTO tags (title) VALUES (?)`,
        [tag.title],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  async getTag(tagId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().get(
        `SELECT * FROM tags WHERE id = ?`,
        [tagId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async getTags(cardId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().all(
        `SELECT * FROM tags INNER JOIN card_tags ON card_tags.id_tag = tags.id WHERE card_tags.id_card = ?`,
        [cardId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async addTagToCard(cardId: number, tagId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.getConnection().run(
        `INSERT INTO card_tags (id_tag, id_card) VALUES (?, ?)`,
        [tagId, cardId],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }
}