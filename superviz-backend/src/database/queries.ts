import sqlite3 from "sqlite3";
import Project from "../entities/project";
import Card from "../entities/card";
import Task from "../entities/task";
import Tag from "../entities/tag";
import Participant from "../entities/participant";
import Sprint from "../entities/sprint";
import List from "../entities/list";

export default class Database {
	//Adicionar try em todos os métodos
	newProject(project: Project) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.serialize(() => {
				db.run(`CREATE TABLE IF NOT EXISTS projects (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
	
				db.run(`INSERT INTO projects (name) VALUES (?)`, project.name);
	
				db.get(`SELECT * FROM projects order by id DESC limit 1`, ((err, row) => {
					if (err) {
						return reject(err);
					} else {
						return resolve(row);
					}
				}))
			});
		})
	}

	newCard(projectId: number, listId: number, card: Card) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.serialize(() => {
				db.run(`CREATE TABLE IF NOT EXISTS cards (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				id_project INTEGER NOT NULL REFERENCES projects(id),
				title TEXT NOT NULL,
				content TEXT,
				position INTEGER NOT NULL,
				id_list INTEGER NOT NULL REFERENCES lists(id),
				created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
				
				db.run(
					`UPDATE cards set position = position + 1 where id_list = ?`, listId
				);

				db.run(
					`INSERT INTO cards (id_project, title, position, content, id_list) VALUES (?, ?, ?, ?, ?)`,
					projectId,
					card.title,
					card.position,
					card.content,
					listId
				);

				db.get(`SELECT * FROM cards order by id DESC limit 1`, ((err, row) => {
					if (err) {
						return reject(err);
					} else {
						return resolve(row);
					}
				}))
			});
		});

		return true;
	}

	updateCard(cardId: number, card: Card) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.serialize(() => {
				db.run(
					`UPDATE cards set title = ?, content = ? where id = ?`,
					card.title,
					card.content,
					cardId
				);

				if (card.tasks.length > 0) {
					card.tasks.map(task => {

						db.run(`UPDATE tasks set completed = ? where id_card = ?`, [task.completed, cardId], ((err) => {
							if (err) {
								return reject(err);
							}
						}))
					});
				}

				db.get(`SELECT * FROM cards where id = ?`, cardId,((err, row) => {
					if (err) {
						return reject(err);
					} else {
						return resolve(row);
					}
				}))
			});
		})
	};

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

			db.run(`INSERT INTO tags (title) VALUES (?)`, tag.title);
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
            name TEXT NOT NULL,
			email TEXT NOT NULL,
			id_sprint INTEGER NOT NULL REFERENCES sprints(id),
			host INTEGER NOT NULL DEFAULT 0
			)`);

			db.run(
				`INSERT INTO participants (name, email, id_sprint, host) VALUES (?, ?, ?, ?)`,
				participant.name,
				participant.email,
				participant.id_sprint,
				participant.host
			);

			_participant = new Promise((resolve, reject) => {
				db.get(
					`SELECT * FROM participants order by id DESC`,
					(err, row) => {
						if (err) {
							reject(err);
						} else {
							resolve(row); // Retorna diretamente o resultado da consulta
						}
					}
				);
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
			db.get(
				`SELECT * FROM projects WHERE id = ?`,
				projectId,
				(err, row) => {
					db.close();

					if (err) {
						reject(err);
					} else {
						resolve(row); // Retorna diretamente o resultado da consulta
					}
				}
			);
		});
	}

	getProjects() {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.all(`SELECT * FROM projects`, (err, rows) => {
				db.close();

				if (err) {
					reject(err);
				} else {
					resolve(rows); // Retorna diretamente o resultado da consulta
				}
			});
		});
	}

	getCards(projectId: number) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.all(
				`SELECT * FROM cards WHERE id_project = ?`,
				projectId,
				(err, rows) => {
					db.close();

					if (err) {
						reject(err);
					} else {
						resolve(rows); // Retorna diretamente o resultado da consulta
					}
				}
			);
		});
	}

	getTasks(cardId: number) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.all(
				`SELECT * FROM tasks WHERE id_card = ?`,
				cardId,
				(err, rows) => {
					db.close();

					if (err) {
						reject(err);
					} else {
						resolve(rows); // Retorna diretamente o resultado da consulta
					}
				}
			);
		});
	}

	getTags(cardId: number) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.all(
				`SELECT * FROM tags INNER JOIN card_tags on card_tags.id_tag = tags.id WHERE card_tags.id_card = ?`,
				cardId,
				(err, rows) => {
					db.close();

					if (err) {
						reject(err);
					} else {
						resolve(rows); // Retorna diretamente o resultado da consulta
					}
				}
			);
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
				`INSERT INTO card_tags (id_tag, id_card) VALUES (?, ?)`,
				tagId,
				cardId
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

	getList(listId: number) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.get(`SELECT * FROM lists WHERE id = ?`, listId, (err, row) => {
				db.close();

				if (err) {
					reject(err);
				} else {
					resolve(row); // Retorna diretamente o resultado da consulta
				}
			});
		});
	}

	getLists(projectId: SVGAnimatedNumberList) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.all(
				`SELECT * FROM lists where id_project = ? order by position ASC`,
				projectId,
				(err, row) => {
					db.close();

					if (err) {
						reject(err);
					} else {
						resolve(row); // Retorna diretamente o resultado da consulta
					}
				}
			);
		});
	}

	renameList(listId: number, title: string) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.serialize(() => {
				db.run(`UPDATE lists set title = ? where id = ?`, [title, listId], (err) => {
					if (err) {
						reject(err);
					}
				}),
				db.get(`SELECT * from lists where id = ?`, listId, (err, row) => {
					if (err) {
						reject(err);
					} else {
						resolve(row);
					}
				})
			})
		})
	}

	moveCard(cardId: number, listId: number, position: number) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.run(
				`UPDATE cards SET id_list = ? and position = ? where id = ?`,
				[listId, position, cardId],
				(err) => {
					if (err) {
						reject(err);
					} else {
						resolve(true);
					}
				}
			);
		});
	}

	reorderLists(lists: List[]) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.serialize(() => {
				lists.forEach((list:List) => {
					db.run(
						`UPDATE lists SET position = ? where id = ?`,
						[list.position, list.id],
						(err) => {
							if (err) {
								reject(err);
							}
						}
					);
				})

				resolve(true);
			})
		});
	};

	reorderCards(cards: Card[]) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.serialize(() => {
				cards.forEach((card:Card) => {
					db.run(
						`UPDATE cards SET position = ? and id_list = ? where id = ?`,
						[card.position, card.id, card.id_list],
						(err) => {
							if (err) {
								reject(err);
							}
						}
					);
				})

				resolve(true);
			})
		});
	}

	createList(title: string, position:number, projectId: number) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.serialize(() => {
				db.run(
					`CREATE TABLE IF NOT EXISTS lists (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					title TEXT NOT NULL,
					position INTEGER NOT NULL,
					id_project INTEGER NOT NULL REFERENCES projects(id))`,
					(err) => {
						if (err) {
							reject(false);
						}

						db.run(
							`INSERT INTO lists (title, position, id_project) VALUES (?, ?, ?)`,
							[title, position, projectId],
							(err) => {
								if (err) {
									return reject(err); // Rejeita a Promise se houver erro
								} else {
									db.get(
										`SELECT * FROM LISTS ORDER BY ID DESC LIMIT 1`,
										(err, row) => {
											if (err) {
												return reject(err);
											} else {
												return resolve(row);
											}
										}
									);
								}
							}
						);
					}
				);
			});
		});
	}

	updateList(title: string, listId: number) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.run(
				`UPDATE lists set title = ? where id = ?`,
				[title, listId],
				(err) => {
					if (err) {
						reject(false);
					} else {
						resolve(true);
					}
				}
			);
		});
	}

	createSprint(sprint: Sprint, projectId: number) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.serialize(() => {
				db.run(
					`CREATE TABLE IF NOT EXISTS sprints (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					title TEXT NOT NULL,
					start_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
					ended_at TIMESTAMP,
					id_project INTEGER NOT NULL REFERENCES projects(id))`,
					(err) => {
						if (err) {
							reject(false);
						}

						db.run(
							`INSERT INTO sprints (title, id_project) VALUES (?, ?)`,
							[sprint.getTitle(), projectId],
							(err) => {
								if (err) {
									return reject(err); // Rejeita a Promise se houver erro
								}
								db.get(
									`SELECT * from sprints order by id DESC limit 1`,
									(err, row) => {
										if (err) {
											return reject(err);
										} else {
											return resolve(row);
										}
									}
								);
							}
						);
					}
				);
			});
		});
	}

	getSprints() {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.all(`SELECT * FROM sprints`, (err, rows) => {
				db.close();

				if (err) {
					reject(err);
				} else {
					resolve(rows); // Retorna diretamente o resultado da consulta
				}
			});
		});
	}

	getSprint(id: number) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.get(`SELECT * FROM sprints where id = ?`, id, (err, row) => {
				db.close();

				if (err) {
					reject(err);
				} else {
					resolve(row); // Retorna diretamente o resultado da consulta
				}
			});
		});
	}

	closeSprint(id: number) {
		const db = new sqlite3.Database("database.sqlite");

		return new Promise((resolve, reject) => {
			db.run(
				`UPDATE sprints set closed_at = ? where id = ?`,
				[new Date(), id],
				(err) => {
					if (err) {
						reject(false);
					} else {
						resolve(true);
					}
				}
			);
		});
	}
}
