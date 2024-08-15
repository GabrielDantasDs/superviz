import Card from "./card";


export default class List {
    public id?: number | string;
    public position?: number;
    private index: number = 0;
    private title: string;
    
    constructor(title: string) {
        this.title = title;
    }

    setIndex = (index: number) => {
        this.index = index;
    }
}