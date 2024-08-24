import CompanyRepository from "../database/repositories/comapany";
import Company from "../entities/company";
import { createCode } from "../utils";

export default class CompanyController {
	private companyRepository: CompanyRepository;

	constructor() {
		this.companyRepository = new CompanyRepository();
	}

	async get(req: any, res: any) {
		try {
			const response = await this.companyRepository.get(req.params.id);
			if (response) {
				return res.status(200).json(response);
			}
		} catch (err) {
			return res.status(404).json(`User not found - ${err}`);
		}
	}

	create = async (req: any, res: any) => {
		try {
			const company = new Company(req.body.name, createCode());
			const response = await this.companyRepository.create(company);
			if (response) {
				return res.status(200).json(response);
			}
		} catch (err) {
			return res.status(422).json(`error - ${err}`);
		}
	};
}
