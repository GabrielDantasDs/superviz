export interface Task {
	id: number;
	title: string;
	completed: boolean;
}

// Define o tipo para o card
export interface Card {
	id: number | string,
	index?: number;
	title: string;
	content: string;
	tags: Tag[];
	tasks: Task[];
}

export interface List {
	id: number | string,
	index:number,
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

export interface Project { 
	id?: string | number,
	name: string
}

export interface Meeting { 
	id?: string | number,
	title: string
}