

export default class Meeting {
    private title: string;
    public init_date: Date = new Date();
    public end_date?: Date;

    constructor(title: string) {
        this.title = title;
    }

    getTitle() {
        return this.title;
    }
}