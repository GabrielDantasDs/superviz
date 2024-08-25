import Database from "../database";
import CardActivity from "../../entities/cardActivity";

export default class CardActivityRepository {
	private db: Database;

	constructor() {
		this.db = Database.getInstance();
	}

	async newCardActivity(cardActivity: CardActivity): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.getConnection().serialize(async () => {
				try {
                    this.db.getConnection().run(`INSERT INTO card_activities (id_card, id_user, id_sprint, source_position, source_list_id, destination_position, destination_list_id) VALUES(?, ?, ?, ?, ?, ?, ?)`, 
                        [cardActivity.id_card, cardActivity.id_user, cardActivity.id_sprint, cardActivity.source_position, cardActivity.source_list_id, cardActivity.destination_position, cardActivity.destination_list_id], (err) => {
                            if (err) reject(err);
                        });
					const lastId = await this.db.getLastInsertId();
					const newCard = await this.getCardActivity(lastId);
					resolve(newCard);
				} catch (error) {
					reject(error);
				}
			});
		});
	}

	async getCardActivity(cardActivityId: number): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.get(
					`SELECT * FROM card_activities WHERE id = ?`,
					[cardActivityId],
					(err, row) => {
						if (err) reject(err);
						else resolve(row);
					}
				);
		});
	}

	async getCardActivityByCard(cardId: number): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.get(
					`SELECT * FROM card_activities WHERE id_card = ?`,
					[cardId],
					(err, row) => {
						if (err) reject(err);
						else resolve(row);
					}
				);
		});
	}

	async getCardActivityBySprint(sprintId: number): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.getConnection().all(
				`SELECT * FROM card_activities where id_sprint = ?`,
				[sprintId],
				(err, rows) => {
					if (err) reject(err);
					else resolve(rows);
				}
			)
		})
	}
}
