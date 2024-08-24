

export default class Sprint {
    private title: string;
    public start_at: Date = new Date();
    public ended_at?: Date;

    constructor(title: string) {
        this.title = title;
    }

    getTitle() {
        return this.title;
    }
}