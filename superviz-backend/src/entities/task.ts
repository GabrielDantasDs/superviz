
export default class Task {
    public title: string;
    public completed: boolean = false;

    constructor(title: string, completed?: boolean) {
        this.title = title;
        this.completed = completed ?? false;
    }
}