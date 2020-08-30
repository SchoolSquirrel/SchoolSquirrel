// file deepcode ignore DisablePoweredBy
// file deepcode ignore UseCsurfForExpress
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as rateLimit from "express-rate-limit";
import * as i18n from "i18n";
import * as path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as fs from "fs";
import * as minio from "minio";
import { getConfig } from "container-env";
import { User } from "./entity/User";
import { createAdminUser1574018391679 } from "./migration/1574018391679-createAdminUser";
import routes from "./routes";
import ConfigController from "./controllers/ConfigController";
import { Grade } from "./entity/Grade";
import { Course } from "./entity/Course";
import { Assignment } from "./entity/Assignment";
import { createGrades4684684684651 } from "./migration/4684684684651-createGrades";
import { Chat } from "./entity/Chat";
import { Message } from "./entity/Message";
import { Event } from "./entity/Event";
import { Buckets } from "./entity/Buckets";
import { AssignmentSubmission } from "./entity/AssignmentSubmission";
import { Device } from "./entity/Device";
import { getHolidays } from "./utils/holidays";

const config = getConfig(JSON.parse(fs.readFileSync(path.join(__dirname, "../../container-env.json")).toString()));

// Setup i18n
i18n.configure({
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
        Course,
        Assignment,
        AssignmentSubmission,
        Chat,
        Message,
        Event,
        Device,
    ],
    host: config.DB_HOST,
    logging: false,
    // List all migrations here
    migrations: [createAdminUser1574018391679, createGrades4684684684651],
    migrationsRun: true,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
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
        // eslint-disable-next-line no-console
        console.log("Migrations: ", await connection.runMigrations());
        // Create a new express application instance
        const app = express();

        // S3 Initialization
        const minioClient = new minio.Client({
            endPoint: config.MINIO_SERVER,
            port: config.MINIO_PORT,
            useSSL: config.MINIO_USESSL,
            accessKey: config.MINIO_ACCESSKEY,
            secretKey: config.MINIO_SECRETKEY,
        });

        for (const bucket of Object.values(Buckets)) {
            if (!await minioClient.bucketExists(bucket)) {
                await minioClient.makeBucket(bucket, "eu-1");
            }
        }

        // make config and minioClient available in the controllers using req.app.locals
        app.locals.config = config;
        app.locals.minio = minioClient;

        // load holiday data for the calendar
        app.locals.holidays = await getHolidays(config.COUNTRY_CODE, config.STATE_CODE);

        // Call midlewares
        // This sets up secure rules for CORS, see https://developer.mozilla.org/de/docs/Web/HTTP/CORS
        app.use(cors());
        // This secures the app with some http headers
        app.use(helmet());
        // This transforms the incoming JSON body into objects
        app.use(bodyParser.urlencoded({
            extended: true,
        }));
        app.use(bodyParser.json());

        // Limit requests to 2 per second (1200 per 10 min)
        app.use(rateLimit({
            max: 1200,
            windowMs: 1000 * 10 * 60,
        }));

        // Set all routes from routes folder
        app.use("/api", routes);
        // Set route for config.json
        app.use("/config.json", ConfigController.config);
        app.use("/", express.static("/app/dist/frontend"));
        app.use("*", express.static("/app/dist/frontend/index.html"));

        let port = 80;
        if (process.env.NODE_ENV == "development") {
            port = 3000;
        }
        // That starts the server on the given port
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server started on port ${port}!`);
        });
    })
    // If an error happens, print it on the console
    // eslint-disable-next-line no-console
    .catch((error) => console.log(error));
