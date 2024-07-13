

class Project {
    private name: string;
    private cards: Card[] = [];

    constructor(name: string) {
        this.name = name
    }

    addCard(card: Card) {
        this.cards.push(card);
    }
}