import * as path from "path";

export const envOptions = {
    DB_NAME: "schoolSquirrel",
    DB_USER: "root",
    DB_PASSWORD: "",
    DB_HOST: "localhost",
    DB_PORT: 3306,
    JWT_SECRET: "ioauwielywiupe9",
    DEFAULT_LANGUAGE: "de",
    DEFAULT_PASSWORD: "SchoolSquirrel"
};


export const globals = {
    configPath: path.resolve("/app/config/config.json"),
}