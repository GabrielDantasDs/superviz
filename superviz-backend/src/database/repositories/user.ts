import User from "../../entities/user";
import Database from "../database";

export default class UserRepository {
	private db: Database;

	constructor() {
		this.db = Database.getInstance();
	}

	get(userId: Number): Promise<any>  { 
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.get(`SELECT * FROM users where id `, [userId], (err, row) => {
					if (err) reject(err);
					else resolve(row);
				});
		});
	}

	getByEmail(email: string): Promise<any>  {
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.get(`SELECT * FROM users where email = ? `, [email], (err, row) => {
					if (err) reject(err);
					else resolve(row);
				});
		});
	}

	create(user: User) {
		return new Promise((resolve, reject) => {
			this.db.getConnection().serialize(() => {
				this.db
					.getConnection()
					.run(
						`INSERT INTO users (name, email, password, admin, id_company, jwt_token, jwt_token_expiration) values (?, ?, ?, ?, ?, ?, ?)`,[user.name, user.email, user.password, user.admin, user.id_company, user.getJWTSecret(), user.jwt_token_expiration],
						async (err) => {
							if (err) reject(err);
							else {
								this.db.getConnection().get(`SELECT * FROM users where id = ?`,[await this.db.getLastInsertId()],(err, row) => {
                                    if (err) reject(err);
                                    else resolve(row);
                                });
							}
						}
					);
			});
		});
	}

	getAllByCompany(id_company: number|string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.getConnection().all(
				`SELECT * FROM users where id_company = ?`, [id_company], (err, rows) => {
					if (err) reject(err);
					else resolve(rows);
				}
			)
		})
	}
}
