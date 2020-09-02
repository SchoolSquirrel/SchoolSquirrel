import * as fs from "fs";
import * as path from "path";

const apiDir = path.join(__dirname, "../api/src/");

let allDefinitions = "/**\n* @swagger";

function generateEndpointDefinitions() {
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
    const paths: {
        [key: string]: string[];
    } = {};
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
        // let a = 0;
        for (const f of controllerFunctionProperties[controller]) {
            resetRegexes();
            const functionRegex = `public static (async )?${f.functionName}\\(`;
            const withComment = new RegExp(`/\\*\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/\n(.*?)${functionRegex}`, "gm").exec(content);
            if (withComment) {
                // console.log("Found");
            } else {
                const withoutComment = new RegExp(functionRegex, "g").exec(content);
                if (withoutComment) {
                    let path = f.path;
                    path = path.replace(PATH_PARAM_REGEX_SLASH, "{$1}/");
                    path = path.replace(PATH_PARAM_REGEX_DOT, "{$1}.");
                    path = path.replace(PATH_PARAM_REGEX_END, "{$1}");
                    path = path.replace(PATH_PARAM_TYPE_REGEX, "");
                    path = path.replace(PATH_PARAM_STAR_REGEX, "{$1}");
                    let params = [];
                    let param;
                    const r = /{(.*?)}/g;
                    while (param = r.exec(path)) {
                        params.push(param[1]);
                    }
                    params = params.map((p) => `*       - in: path
*         name: ${p}
*         type: ToDo # integer or string
*         required: true
*         description: ToDo`);
                    const paramsYaml = params.join("\n");
                    if (!paths[path]) {
                        paths[path] = [];
                    }
                    paths[path].push(`
*   ${f.method}:
*     description: ToDo
*     consumes: application/json
*     produces: application/json
${params.length > 0 ? `*     parameters:\n${paramsYaml}\n` : ""}*     responses:
*       200:
*         description: OK
*       400:
*         description: Missing parameters or fields
*       401:
*         description: Unauthorized (either no JWT Token or the action is not allowed)`);
                } else {
                    console.log(f.functionName, "of", controller, "not found");
                    process.exit(1);
                }
            }
        }
    }
    for (const [path, methods] of Object.entries(paths)) {
        allDefinitions += `
*
* ${path}:`;
        for (const method of methods) {
            allDefinitions += method;
        }
    }
}

function generateModelDefinitions() {
    const entityDirectory = path.join(__dirname, "../api/src/entity");
    const entityFiles = fs.readdirSync(entityDirectory);

    const enums: {
        [name: string]: string[];
    } = {};

    for (const entityFile of entityFiles) {
        let content = getContent(entityFile);
        const result = new RegExp(`export enum (.*?) {`).exec(content);
            if (result && result[1]) {
            const className = getClassName(result);
            const r = /(\w*?) ?= ?"(\w*?)"/g;
            let property;
            while (property = r.exec(content)) {
                if (property && property[2]) {
                    if (!enums[className]) {
                        enums[className] = [];
                    }
                    enums[className].push(property[2]);
                }
            }
        }
    }
    for (const entityFile of entityFiles) {
        const entityPath = path.join(entityDirectory, entityFile);
        let content = getContent(entityFile);
        const result = new RegExp(`export class (.*?) {`).exec(content);
        if (result && result[1]) {
            const className = getClassName(result);
                const properties: {
                [propertyName: string]: {
                    type: string;
                    required: boolean;
                };
            } = {};
            let property;
            const r = /public (.*?): (.*?);/g
            while (property = r.exec(content)) {
                if (property && property[1] && property[2]) {
                    properties[property[1].replace("?", "")] = {
                        type: property[2],
                        required: !property[1].endsWith("?"),
                    };
                }
            }
            allDefinitions += `
*
*   ${className}:
*     type: object
*     required:
${Object.entries(properties).filter((p) => p[1].required).map((p) => `*       - ${p[0]}`).join("\n")}
*     properties:
${Object.entries(properties).map((p) => {
    let type = p[1].type;
    let extra;
    if (enums[type]) {
        extra = `enum: [${enums[type].join(", ")}]`;
        type = "string";
    } else if (type.startsWith("Record")) {
        type = "object";
    } else if (type.endsWith("[]")) {
        const item = type.startsWith("any") ? "type: object" : `$ref: '#/definitions/${type.replace("[]", "")}'`;
        type = `array\n*         items:\n*           ${item}`;
    } else if (type == "Date") {
        type = "string\n*         format: date";
    } else if (type.indexOf(" | ") !== -1) {
        type = `string\n*         enum: [${type.replace(/ \| /g, ", ").replace(/\"/g, "")}]`;
    } else if (type[0] == type[0].toUpperCase()) {
        type = `\n*           $ref: '#/definitions/${type}'`;
    }
    return `*       ${p[0]}:\n*         type:${type.startsWith("\n") ? "" : " "}${type}${extra ? `\n*         ${extra}`: ""}`;
}).join("\n")}
*`;
        }
    }
    function getContent(entityFile: string) {
        const entityPath = path.join(entityDirectory, entityFile);
        let content = fs.readFileSync(entityPath).toString();
        return content;
    }

    function getClassName(result: RegExpExecArray) {
        return result[1].indexOf(" ") ? result[1].split(" ").shift() : result[1];
    }
}

generateEndpointDefinitions();
allDefinitions += `
* definitions:`;
generateModelDefinitions();

allDefinitions += "/";

fs.writeFileSync("allDefinitions.ts", allDefinitions);