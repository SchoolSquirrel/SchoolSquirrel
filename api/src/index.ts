import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as i18n from "i18n";
import * as path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { createAdminUser1574018391679 } from "./migration/1574018391679-createAdminUser";
import routes from "./routes";
import { toInt } from "./utils/utils";
import { envOptions, globals } from "./globals";
import * as fs from "fs";
import { getConfig, setConfig } from "./utils/config";
import ConfigController from "./controllers/ConfigController";
import { Grade } from "./entity/Grade";

// write env to config file
if (!fs.existsSync(globals.configPath)) {
    fs.writeFileSync(globals.configPath, JSON.stringify({}));
}
const config = getConfig();
for (const key of Object.keys(envOptions)) {
    if (config[key] == undefined) {
        if (config.key !== process.env[key]) {
            config[key] = process.env[key];
        } else {
            config[key] = envOptions[key];
        }
    }
}
setConfig(config);

// Setup i18n
i18n.configure({
    // tslint:disable-next-line: no-bitwise
    defaultLocale: config.DEFAULT_LANGUAGE,
    directory: path.join(__dirname, "../assets/i18n"),
    objectNotation: true,
});

// Connects to the Database -> then starts the express
createConnection({
    charset: "utf8mb4",
    cli: {
        entitiesDir: "src/entity",
        migrationsDir: "src/migration",
        subscribersDir: "src/subscriber",
    },
    database: config.DB_NAME,
    // List all entities here
    entities: [
        User,
        Grade,
    ],
    host: config.DB_HOST,
    logging: false,
    // List all migrations here
    migrations: [createAdminUser1574018391679],
    migrationsRun: true,
    password: config.DB_PASSWORD,
    port: toInt(config.DB_PORT),
    synchronize: true,
    type: "mysql",
    username: config.DB_USER,
})
    .then(async (connection) => {

        // Fix problems with UTF8 chars
        await connection.query("SET NAMES utf8mb4;");
        // In case entities have changed, sync the database
        await connection.synchronize();
        // Run migrations, see https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
        // tslint:disable-next-line: no-console
        console.log("Migrations: ", await connection.runMigrations());
        // Create a new express application instance
        const app = express();

        // we can get it in controllers using req.app.locals.config
        app.locals.config = config;

        // Call midlewares
        // This sets up secure rules for CORS, see https://developer.mozilla.org/de/docs/Web/HTTP/CORS
        app.use(cors());
        // This secures the app with some http headers
        app.use(helmet());
        // This transforms the incoming JSON body into objects
        app.use(bodyParser.json());

        // Set all routes from routes folder
        app.use("/api", routes);
        // Set route for config.json
        app.use("/config.json", ConfigController.config);
        app.use("/", express.static("/app/dist/frontend"));

        let port = 80;
        if (process.env.NODE_ENV == "development") {
            port = 3000;
        }
        // That starts the server on the given port
        app.listen(port, () => {
            // tslint:disable-next-line: no-console
            console.log(`Server started on port ${port}!`);
        });
    })
    // If an error happens, print it on the console
    // tslint:disable-next-line: no-console
    .catch((error) => console.log(error));
