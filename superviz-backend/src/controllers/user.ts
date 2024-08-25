import { error } from "console";
import UserRepository from "../database/repositories/user";
import User from "../entities/user";
import CompanyRepository from "../database/repositories/comapany";
import Company from "../entities/company";
import { SQLiteResult } from "../types";
import { checkHash, createCode, hashPassword } from "../utils";
import jwt from "jsonwebtoken";

export default class UserController {
	private userRepository: UserRepository;
	private companyRepository: CompanyRepository;

	constructor() {
		this.userRepository = new UserRepository();
		this.companyRepository = new CompanyRepository();
	}

	async get(req: any, res: any) {
		try {
			const response = await this.userRepository.get(req.params.id);
			if (response) {
				return res.status(200).json(response);
			}
		} catch (err) {
			return res.status(404).json(`User not found - ${err}`);
		}
	}

	create = async (req: any, res: any) => {
		let company: SQLiteResult;
		try {
			if (req.body.companyCode != "") {
				company = await this.companyRepository.getByCode(
					req.body.comapanyCode
				);
			} else if (
				req.body.company &&
				req.body.company.hasOwnProperty("name")
			) {
				const companyObj = new Company(
					req.body.company.name,
					createCode()
				);
				company = await this.companyRepository.create(companyObj);
			} else {
				throw error("Company not found");
			}

			if (req.body.user) {
				const password = await hashPassword(req.body.user.password);
				const user = new User(
					req.body.user.name,
					req.body.user.email,
					password,
					req.body.user.admin,
					company.id
				);
				const jwt_token = jwt.sign(
					{ data: user },
					process.env.JWT_SECRET ?? "aytyt",
					{ expiresIn: "730h" }
				);

				user.setJWTSecret(jwt_token);

				const response = await this.userRepository.create(user);
				if (response) {
					return res.status(200).json(response);
				}
			} else {
				throw error("Invalid user infos");
			}
		} catch (err) {
			return res.status(422).json(`error - ${err}`);
		}
	};

	auth = async (req: any, res: any) => {
		try {
			if (req.body.email && req.body.password) {
				const response: SQLiteResult =
					await this.userRepository.getByEmail(req.body.email);

				if (response) {
					const user = new User(
						response.name,
						response.email,
						response.password,
						response.admin,
						response.id_company
					);

					if (checkHash(response.password, req.body.password)) {
						const jwt_token = jwt.sign(
							{ data: user },
							process.env.JWT_SECRET ?? "aytyt",
							{ expiresIn: "730h" }
						);

						user.setJWTSecret(jwt_token);

						return res.status(200).json(response);
					} else return res.status(422).json(`error - Invalid credentials`);
				}

				return res.status(422).json(`error - Invalid credentials`);
			} else {
				return res.status(422).json(`error - Invalid credentials`);
			}
		} catch (err) {
				return res.status(422).json(`error - Invalid credentials`);
		}
	};

	getAllByCompany = async (req:any, res:any) => {
		try {
			const response = await this.userRepository.getAllByCompany(req.params.id);

			if (response) {
				return res.status(200).json(response);
			}

			return res.status(404).json(`error - Not found`);
		} catch (err) {
			return res.status(404).json(`error - Not found`);
		}
	}
}
