import * as fs from "fs";
import * as path from "path";

const apiDir = path.join(__dirname, "../../api/src/");
const indexContent = fs.readFileSync(path.join(apiDir, "routes/index.ts")).toString();

const ROUTER_REGEX = /routes.use\("(.*?)", (.*?)\);/g;
const ROUTES_NO_MIDDLEWARES_REGEX = /router\.((get)|(post)|(delete))\("(.*?)", (\w*?)Controller.(.*?)\);/g;
const ROUTES_MIDDLEWARES_REGEX = /router\.((get)|(post)|(delete))\("(.*?)", \[(.*?)\], (\w*?)Controller.(.*?)\);/g;
const ROUTES_REGEX = /\nrouter\.((get)|(post)|(delete))\("(.*?)", (.*?)Controller.(.*?)\);/g;
const MIDDLEWARES_REGEX = /\[(.*?)\], /g;
const PATH_PARAM_REGEX_SLASH = /:(.*?)(\/)/g;
const PATH_PARAM_REGEX_DOT = /:(.*?)(\.)/g;
const PATH_PARAM_REGEX_END = /:(.*?)($)/g;
const PATH_PARAM_TYPE_REGEX = /\((.*?)\)/g;
const PATH_PARAM_STAR_REGEX = /{([^{]*)\*}/g;

const routeFiles = indexContent.match(ROUTER_REGEX);
const prefixes = {};
const controllerFunctionProperties: {
    [controllerName: string]: {
        functionName: string,
        method: string,
        path: string,
        middlewares: string[],
    }[];
} = {};

for (const routeFile of routeFiles) {
    resetRegexes();
    const [_, path, filename] = ROUTER_REGEX.exec(routeFile);
    prefixes[filename] = path;
}

for (const filename of Object.keys(prefixes)) {
    resetRegexes();
    const content = fs.readFileSync(path.join(apiDir, "routes/", `${filename}.ts`)).toString();
    const routes = content.match(ROUTES_REGEX);
    for (const route of routes) {
        resetRegexes();
        let method, path, middlewares, controllerName, functionName, _, _2, _3, _4;
        if (route.match(MIDDLEWARES_REGEX)) {
            [_, method, _2, _3, _4, path, middlewares, controllerName, functionName] = ROUTES_MIDDLEWARES_REGEX.exec(route);
            middlewares = middlewares.split(", ");
        } else {
            [_, method, _2, _3, _4, path, controllerName, functionName] = ROUTES_NO_MIDDLEWARES_REGEX.exec(route);
            middlewares = [];
        }
        const controller = `${controllerName}Controller`;
        if (!controllerFunctionProperties[controller]) {
            controllerFunctionProperties[controller] = [];
        }
        controllerFunctionProperties[controller].push({
            functionName,
            method,
            path: `${prefixes[filename]}${path}`,
            middlewares,
        });
    }
}

for (const controller of Object.keys(controllerFunctionProperties)) {
    const controllerFilename = path.join(apiDir, "controllers", `${controller}.ts`);
    let content = fs.readFileSync(controllerFilename).toString();
    for (const f of controllerFunctionProperties[controller]) {
        resetRegexes();
        const found = new RegExp(`public static (async )?${f.functionName}\\(`, "g").exec(content);
        if (found) {
            console.log(f.path);
            let path = f.path;
            path = path.replace(PATH_PARAM_REGEX_SLASH, "{$1}/");
            path = path.replace(PATH_PARAM_REGEX_DOT, "{$1}.");
            path = path.replace(PATH_PARAM_REGEX_END, "{$1}");
            path = path.replace(PATH_PARAM_TYPE_REGEX, "");
            path = path.replace(PATH_PARAM_STAR_REGEX, "{$1}");
            content = content.slice(0, found.index) + `/**
    * @swagger
    *
    * ${path}:
    *   ${f.method}:
    *     description: ToDo
    *     consumes: application/json
    *     produces: application/json
    *     parameters:
    *       - ToDo
    *     responses:
    *       200:
    *         description: login
    */
    ` + content.slice(found.index);
        } else {
            console.log(f.functionName, "of", controller, "not found");
            process.exit(1);
        }
        fs.writeFileSync(controllerFilename, content);
    }
}

function resetRegexes() {
    ROUTER_REGEX.lastIndex = 0;
    ROUTES_NO_MIDDLEWARES_REGEX.lastIndex = 0; 
    ROUTES_REGEX.lastIndex = 0;
    MIDDLEWARES_REGEX.lastIndex = 0;
    ROUTES_MIDDLEWARES_REGEX.lastIndex = 0;
    PATH_PARAM_REGEX_SLASH.lastIndex = 0;
    PATH_PARAM_REGEX_DOT.lastIndex = 0;
    PATH_PARAM_REGEX_END.lastIndex = 0;
    PATH_PARAM_TYPE_REGEX.lastIndex = 0;
    PATH_PARAM_STAR_REGEX.lastIndex = 0;
}