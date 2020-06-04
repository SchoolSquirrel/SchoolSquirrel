import { Request, Response } from "express";

class ConfigController {
    public static config = async (req: Request, res: Response) => {
        res.send(JSON.stringify({
            version: require("../../package.json").version,
            apiUrl: "/api"
        }));
    }
}

export default ConfigController;
