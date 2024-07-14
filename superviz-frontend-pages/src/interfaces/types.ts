export interface Task {
	id: number;
	title: string;
	completed: boolean;
}

// Define o tipo para o card
export interface Card {
	title: string;
	content: string;
	tags: Tag[];
	tasks: Task[];
}

export interface List {
	header: Header;
	cards: Card[];
}

export interface Header {
	title: string;
}

export interface Tag {
	title: string
}

export interface Participant {
	id: string,
	name: string
}