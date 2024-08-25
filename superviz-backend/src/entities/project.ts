import Card from "./card";
import CardActivity from "./cardActivity";
import List from "./list";


export default class Project {
    public name: string;
    public lists?: List[] = [];
    public cards: Card[] = [];
    public cards_activities?: CardActivity[] = [];
    public id?: number|string;

    constructor(name: string, lists?: List[], cards_activities?: CardActivity[]) {
        this.name = name
        this.lists = lists;
        this.cards_activities = cards_activities;
    }

    addCard(card: Card) {
        this.cards.push(card);
    }

    setLists(lists: List[]) {
        this.lists = lists; 
    }

    setId(id:number|string) {
        this.id = id;
    }

    toBlob(): Buffer {
        const projectData = {
          id: this.id,
          name: this.name,
          lists: this.lists,
          cards_activities: this.cards_activities
        };
    
        // Converte o objeto em uma string JSON
        const jsonString = JSON.stringify(projectData);
    
        // Converte a string JSON em um Buffer (BLOB)
        return Buffer.from(jsonString);
      }
}