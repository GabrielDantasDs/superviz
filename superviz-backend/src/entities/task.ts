
export default class Task {
    public title: string;
    public completed: boolean = false;

    constructor(title: string) {
        this.title = title
    }
}