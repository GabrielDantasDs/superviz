export default class Company {
    readonly name: String;
    readonly code: String;

    constructor (name: String, code: String) {
        this.name = name;
        this.code = code;
    }
}