import Card from "./card";


export default class Project {
    public name: string;
    public cards: Card[] = [];

    constructor(name: string) {
        this.name = name
    }

    addCard(card: Card) {
        this.cards.push(card);
    }
}