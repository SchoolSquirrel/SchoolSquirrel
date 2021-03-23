import { Request } from "express";
import { IResponse } from "../interfaces/IExpress";

class ConfigController {
    public static config(req: Request, res: IResponse): void {
        res.send(JSON.stringify({
            // eslint-disable-next-line
            version: require("../../package.json").version,
            apiUrl: "/api",
            onlyofficeUrl: res.app.locals.config.ONLYOFFICE_URL,
            jitsiMeetUrl: res.app.locals.config.JITSI_MEET_URL,
        }));
    }
}

export default ConfigController;
