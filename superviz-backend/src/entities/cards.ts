
class Card {
    private name: string;
    private tasks: Task[] = [];

    constructor(name: string) {
        this.name = name
    }

    addTask(task: Task) {
        this.tasks.push(task);
    }
}