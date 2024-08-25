import Database from "../database";
import Card from "../../entities/card";

export default class CardRepository {
	private db: Database;

	constructor() {
		this.db = Database.getInstance();
	}

	async newCard(projectId: number, listId: number, card: Card): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.getConnection().serialize(async () => {
				try {
					await this.updateCardPositions(listId);
					await this.insertCard(projectId, listId, card);
					const lastId = await this.db.getLastInsertId();
					const newCard = await this.getCard(lastId);
					resolve(newCard);
				} catch (error) {
					reject(error);
				}
			});
		});
	}

	private updateCardPositions(listId: number): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.run(
					`UPDATE cards SET position = position + 1 WHERE id_list = ?`,
					[listId],
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);
		});
	}

	private insertCard(
		projectId: number,
		listId: number,
		card: Card
	): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.run(
					`INSERT INTO cards (id_project, title, position, content, id_list) VALUES (?, ?, ?, ?, ?)`,
					[
						projectId,
						card.title,
						card.position,
						card.content,
						listId,
					],
					(err) => {
						if (err) reject(err);
						else resolve();
					}
				);
		});
	}

	async getCard(cardId: number): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.get(
					`SELECT * FROM cards WHERE id = ?`,
					[cardId],
					(err, row) => {
						if (err) reject(err);
						else resolve(row);
					}
				);
		});
	}

	async getCards(projectId: number): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.all(
					`SELECT * FROM cards WHERE id_project = ?`,
					[projectId],
					(err, rows) => {
						if (err) reject(err);
						else resolve(rows);
					}
				);
		});
	}

	async updateCard(cardId: Number, card: Card): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.getConnection().serialize(() => {
				this.db
					.getConnection()
					.run(
						`UPDATE cards set title = ?,content = ?, id_user = ? where id = ?`,
						[card.title, card.content, card.id_user, cardId],
						async (err) => {
							if (err) reject(err);
							else {
								this.db
									.getConnection()
									.get(
										`SELECT * FROM cards where id = ?`,
										[cardId],
										(err, row) => {
											if (err) reject(err);
											else resolve(row);
										}
									);
							}
						}
					);
			});
		});
	}

	reorderCards(cards: Card[]) {
		return new Promise((resolve, reject) => {
			this.db.getConnection().serialize(() => {
				cards.forEach((card: Card) => {
					this.db
						.getConnection()
						.run(
							`UPDATE cards SET position = ? and id_list = ? where id = ?`,
							[card.position, card.id, card.id_list],
							(err) => {
								if (err) {
									reject(err);
								}
							}
						);
				});

				resolve(true);
			});
		});
	}

	asignUser(
		id_card: string | number,
		id_user: string | number
	): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.run(
					`UPDATE cards SET id_user = ? where id = ?`,
					[id_user, id_card],
					(err) => {
						if (err) {
							reject(err);
						} else resolve(true);
					}
				);
		});
	}

	delete(id_card: string | number): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.run(`DELETE FROM cards where id = ?`, [id_card], (err) => {
					if (err) {
						reject(err);
					} else resolve(true);
				});
		});
	}
}
