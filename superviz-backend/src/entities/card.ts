import Tag from "./tag";
import Task from "./task";

export default class Card {
    public title: string;
    public tasks: Task[] = [];
    public tags: Tag[] = [];
    public list: string = "BACKLOG";

    constructor(title: string) {
        this.title = title
    }

    addTask(task: Task) {
        this.tasks.push(task);
    }

    addTag(tag: Tag) {
        this.tags.push(tag)
    }
}