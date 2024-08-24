export default class Participant {
	public name: string;
	public email: string;
	public host: boolean = false;
	public id_sprint: number;

	constructor(title: string, email: string, id_sprint: number, host: boolean = false) {
		this.name = title;
		this.email = email;
		this.id_sprint = id_sprint;
		this.host = host;
	}

	setHost() {
		this.host = true;
	}
}
