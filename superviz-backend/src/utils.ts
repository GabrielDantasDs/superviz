import bcrypt from "bcrypt";

export const createCode = () => {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return result;
};

export const hashPassword = async (plainTextPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainTextPassword, salt);
    return hash;
};

export const checkHash =  (hashPassword: string, plainTextPassword: string) => {
    const hash = bcrypt.compareSync(plainTextPassword, hashPassword);
    return hash;
}