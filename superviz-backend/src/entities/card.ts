import Tag from "./tag";
import Task from "./task";

export default class Card {
    public id?: number|string;
    public id_list?: number|string;
    public title: string;
    public position: number;
    public content?: string;
    public tasks: Task[] = [];
    public tags: Tag[] = [];

    constructor(title: string, position: number, content?: string, tasks?: Task[]) {
        this.title = title;
        this.position = position;
        this.content = content;
        this.tasks = tasks ?? [];
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