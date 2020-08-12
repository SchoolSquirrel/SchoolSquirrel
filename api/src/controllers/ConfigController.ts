import { Request, Response } from "express";

class ConfigController {
    public static config(req: Request, res: Response): void {
        res.send(JSON.stringify({
            // eslint-disable-next-line
            version: require("../../package.json").version,
            apiUrl: "/api",
        }));
    }
}

export default ConfigController;
