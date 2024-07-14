import sqlite3 from "sqlite3";
import Project from "../entities/project";
import Card from "../entities/card";
import Task from "../entities/task";
import Tag from "../entities/tag";
import Participant from "../entities/participant";

export default class Database {
	//Adicionar try em todos os métodos
	newProject(project: Project) {
		const db = new sqlite3.Database("database.sqlite");

		db.serialize(() => {
			db.run(`CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);

			db.run(`INSERT INTO projects (name) VALUES (?)`, project.name);
		});

		db.close();

		return true;
	}

	newCard(projectId: number, card: Card) {
		const db = new sqlite3.Database("database.sqlite");

		db.serialize(() => {
			db.run(`CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_project INTEGER NOT NULL REFERENCES projects(id),
            title TEXT NOT NULL,
			content TEXT,
			list TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);

			db.run(
				`INSERT INTO cards (id_project, title, content) VALUES (?, ?, ?)`,
				projectId,
				card.title
			);
		});

		db.close();

		return true;
	}

	newTask(cardId: number, task: Task) {
		const db = new sqlite3.Database("database.sqlite");

		db.serialize(() => {
			db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_card INTEGER NOT NULL REFERENCES projects(id),
            title TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);

			db.run(
				`INSERT INTO tasks (id_card, title) VALUES (?, ?)`,
				cardId,
				task.title
			);
		});

		db.close();

		return true;
	}

	newTag(tag: Tag) {
		const db = new sqlite3.Database("database.sqlite");

		db.serialize(() => {
			db.run(`CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL)`);

			db.run(
				`INSERT INTO tags (title) VALUES (?)`,
				tag.title
			);
		});

		db.close();

		return true;
	}

	newParticipant(participant: Participant) {
		const db = new sqlite3.Database("database.sqlite");
		let _participant = {};

		db.serialize(() => {
			db.run(`CREATE TABLE IF NOT EXISTS participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL)`);

			db.run(
				`INSERT INTO participants (name) VALUES (?)`,
				participant.name
			);

			 _participant = new Promise((resolve, reject) => {
				db.get(`SELECT * FROM participants order by id DESC`, (err, row) => {
					
					if (err) {
						reject(err);
					} else {
						resolve(row); // Retorna diretamente o resultado da consulta
					}
				});
			});
		});

		db.close();

		return _participant;
	}

	getTag(tagId: number) {
		const db = new sqlite3.Database("database.sqlite");

        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM tags WHERE id = ?`, tagId, (err, row) => {
                db.close();
                
                if (err) {
                    reject(err);
                } else {
                    resolve(row); // Retorna diretamente o resultado da consulta
                }
            });
        });
	}

	getProject(projectId: number) {
		const db = new sqlite3.Database("database.sqlite");

        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM projects WHERE id = ?`, projectId, (err, row) => {
                db.close();
                
                if (err) {
                    reject(err);
                } else {
                    resolve(row); // Retorna diretamente o resultado da consulta
                }
            });
        });
	}

	getCards(projectId: number) {
		const db = new sqlite3.Database("database.sqlite");

        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM cards WHERE id_project = ?`, projectId, (err, rows) => {
                db.close();
                
                if (err) {
                    reject(err);
                } else {
                    resolve(rows); // Retorna diretamente o resultado da consulta
                }
            });
        });
	}

	getTasks(cardId: number) {
		const db = new sqlite3.Database("database.sqlite");

        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM tasks WHERE id_card = ?`, cardId, (err, rows) => {
                db.close();
                
                if (err) {
                    reject(err);
                } else {
                    resolve(rows); // Retorna diretamente o resultado da consulta
                }
            });
        });
	}

	getTags(cardId: number) {
		const db = new sqlite3.Database("database.sqlite");

        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM tags INNER JOIN card_tags on card_tags.id_tag = tags.id WHERE card_tags.id_card = ?`, cardId, (err, rows) => {
                db.close();
                
                if (err) {
                    reject(err);
                } else {
                    resolve(rows); // Retorna diretamente o resultado da consulta
                }
            });
        });
	}

	addTagToCard(cardId: number, tagId: number) {
		const db = new sqlite3.Database("database.sqlite");

		db.serialize(() => {
			db.run(`CREATE TABLE IF NOT EXISTS card_tags (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				id_tag INTEGER NOT NULL REFERENCES tags(id),
				id_card INTEGER NOT NULL REFERENCES cards(id))`);

			db.run(
				`INSERT INTO card_tags (id_tag, id_card) VALUES (?, ?)`, tagId, cardId
			);
		});

		db.close();

		return true;
	}

	setTaskCompleted(taskId: number, completed: boolean) {
		const db = new sqlite3.Database("database.sqlite");

		db.serialize(() => {
			db.run(
				`UPDATE tasks SET completed = ? where id = ?`,
				completed,
				taskId
			);
		});

		db.close();

		return true;
	}
}
