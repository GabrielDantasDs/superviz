import Company from "../../entities/company";
import User from "../../entities/user";
import Database from "../database";

export default class CompanyRepository {
	private db: Database;

	constructor() {
		this.db = Database.getInstance();
	}

	get(companyId: Number): Promise<any>{
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.get(`SELECT * FROM companies where id `, [companyId], (err, row) => {
					if (err) reject(err);
					else resolve(row);
				});
		});
	}

	getByCode(companyCode: string): Promise<any>{
		return new Promise((resolve, reject) => {
			this.db
				.getConnection()
				.get(`SELECT * FROM companies where code `, [companyCode], (err, row) => {
					if (err) reject(err);
					else resolve(row);
				});
		});
	}

	create(company: Company): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.getConnection().serialize(() => {
				this.db
					.getConnection()
					.run(
						`INSERT INTO companies (name, code) values (?, ?)`,[company.name, company.code],
						async (err) => {
							if (err) reject(err);
							else {
								this.db.getConnection().get(`SELECT * FROM companies where id = ?`,[await this.db.getLastInsertId()],(err, row) => {
                                    if (err) reject(err);
                                    else resolve(row);
                                });
							}
						}
					);
			});
		});
	}
}
