export default class Participant {
	public name: string;
	public email: string;
	public host: boolean = false;
	public id_meeting: number;

	constructor(title: string, email: string, id_meeting: number, host: boolean = false) {
		this.name = title;
		this.email = email;
		this.id_meeting = id_meeting;
		this.host = host;
	}

	setHost() {
		this.host = true;
	}
}
