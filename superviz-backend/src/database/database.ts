import sqlite3 from "sqlite3";
import { SQLiteResult } from "../types";

export default class Database {
	private static instance: Database;
	private db: sqlite3.Database;

	private constructor() {
		this.db = new sqlite3.Database("database.sqlite");
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	public getConnection(): sqlite3.Database {
		return this.db;
	}

	public getLastInsertId(): Promise<number> {
		return new Promise((resolve, reject) => {
			this.db.get<SQLiteResult>(
				"SELECT last_insert_rowid() as id",
				(err, row) => {
					if (err) reject(err);
					else if (row) resolve(row.id);
				}
			);
		});
	}

	public initializeTables(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				this.db.run(
					`CREATE TABLE IF NOT EXISTS companies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
		  code TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);

				this.db.run(
					`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
		  email TEXT NOT NULL UNIQUE,
		  admin INTEGER DEFAULT 0,
		  password TEXT NOT NULL,
		  jwt_token TEXT,
		  jwt_token_expiration TIMESTAMP,
		  id_company INTEGER NOT NULL REFERENCES companies(id),
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);

				this.db.run(
					`CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
		  id_company INTEGERNOT NULL REFERENCES companies(id),
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);

				this.db.run(
					`CREATE TABLE IF NOT EXISTS cards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          id_project INTEGER NOT NULL REFERENCES projects(id),
          title TEXT NOT NULL,
          content TEXT,
          position INTEGER NOT NULL,
          id_list INTEGER NOT NULL REFERENCES lists(id),
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);

				this.db.run(
					`CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          id_card INTEGER NOT NULL REFERENCES cards(id),
          title TEXT NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);

				this.db.run(
					`CREATE TABLE IF NOT EXISTS tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL)`,
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);

				this.db.run(
					`CREATE TABLE IF NOT EXISTS participants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          id_sprint INTEGER NOT NULL REFERENCES sprints(id),
          host INTEGER NOT NULL DEFAULT 0)`,
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);

				this.db.run(
					`CREATE TABLE IF NOT EXISTS lists (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          position INTEGER NOT NULL,
          id_project INTEGER NOT NULL REFERENCES projects(id))`,
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);

				this.db.run(
					`CREATE TABLE IF NOT EXISTS sprints (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          start_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          ended_at TIMESTAMP,
          id_project INTEGER NOT NULL REFERENCES projects(id),
			id_company INTEGERNOT NULL REFERENCES companies(id))
		  `,

					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);

				this.db.run(
					`CREATE TABLE IF NOT EXISTS card_tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          id_tag INTEGER NOT NULL REFERENCES tags(id),
          id_card INTEGER NOT NULL REFERENCES cards(id))`,
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);

				this.db.run(
					`CREATE TABLE IF NOT EXISTS card_activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
		  source_position INTEGER NOT NULL,
		  source_list_id INTEGER NOT NULL,
		  destination_position INTEGER NOT NULL,
		  destination_list_id INTEGER NOT NULL,
		  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          id_card INTEGER NOT NULL REFERENCES card(id))`,
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);
			});
		});
	}
}
