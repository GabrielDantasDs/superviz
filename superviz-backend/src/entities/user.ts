export default class User {
    readonly name: String;
    readonly email: String;
    readonly password: String;
    readonly admin: Number = 0;
    readonly id_company: Number | String;
    readonly jwt_token_expiration: number = 730 * 60;
    protected jwt_token: string;

    constructor (name: String, email: String, password: String, admin: Boolean, id_company: Number | String) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.admin = admin ? 1 : 0;
        this.id_company = id_company;
        this.jwt_token = "";
    }

    setJWTSecret(secret: string) {
        this.jwt_token = secret;
    }

    getJWTSecret() {
        return this.jwt_token;
    }
}