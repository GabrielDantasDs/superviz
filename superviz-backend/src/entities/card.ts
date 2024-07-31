import Tag from "./tag";
import Task from "./task";

export default class Card {
    public title: string;
    public content?: string;
    public tasks: Task[] = [];
    public tags: Tag[] = [];

    constructor(title: string, content?: string) {
        this.title = title;
        this.content = content;
    }

    addTask(task: Task) {
        this.tasks.push(task);
    }

    addTag(tag: Tag) {
        this.tags.push(tag)
    }

    addContent(content: string) {
        this.content = content;
    }
}