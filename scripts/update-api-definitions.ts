import * as fs from "fs";
import * as path from "path";
import { triggerAsyncId } from "async_hooks";

const apiDir = path.join(__dirname, "../api/src/");

const swaggerDefinition: {
    swagger: "2.0",
    info: {
        title: string;
        version: string;
        description: string;
        license: {
            name: string;
            url: string;
        },
        contact: {
            name: string;
            url: string;
        }
    },
    servers: { url: string; }[],
    paths: {
        [path: string]: {
            [method: string]: {
                description: string;
                consumes: "application/json";
                produces: "application/json";
                parameters?: {
                    in: "path" | "body";
                    name: string;
                    type: string;
                    required: boolean;
                    description: string;
                }[],
                responses: {
                    [code: number]: {
                        description: string;
                    }
                }
            }
        }
    };
    definitions: {
        [name: string]: {
            type: "object",
            required: string[];
            properties: {
                [name: string]: {
                    type: "number" | "string" | "object" | {
                        $ref: string;
                    };
                    format?: string;
                    enum?: string[];
                } | {
                    type: "array";
                    items: {
                        type: "number" | "string" | "object";
                    } | {
                        $ref: string;
                    };
                };
            }
        }
    },
    responses: {},
    parameters: {},
    securityDefinitions: {},
    tags: any[],
} = {
    swagger: "2.0",
    info: {
        title: "SchoolSquirrel API Documentation",
        version: "1.0.0",
        description: "This is the documentation for the SchoolSquirrel API.",
        license: {
            name: "MIT",
            url: "https://github.com/SchoolSquirrel/SchoolSquirrel/blob/master/LICENSE"
        },
        contact: {
            name: "Hannes Rüger",
            url: "https://github.com/hrueger"
        }
    },
    servers: [
        {
            url: "http://localhost:3000/api/"
        }
    ],
    paths: {},
    definitions: {},
    responses: {},
    parameters: {},
    securityDefinitions: {},
    tags: [],
};

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
            const withComment = new RegExp("\\/\\*\\*\\s*\\n([^\\*]|(\\*(?!\\/)))*\\*\\/(\\r\\n|\\r|\\n)(\\s*?)" + functionRegex, "m").exec(content);
            
            const additionalData = {
                description: "ToDo",
                responses: {
                    200: {
                        description: "OK"
                    },
                    400: {
                        description: "Missing parameters or fields",
                        schema: {
                            $ref: "#/definitions/Error"
                        },
                    },
                    401: {
                        description: "Unauthorized (either no JWT Token or the action is not allowed)",
                        schema: {
                            $ref: "#/definitions/Error"
                        },
                    }
                }
            };

            if (withComment) {
                const r = /\* @api(\w*?) (.*?)(\r\n|\r|\n)/g;
                let result;

                while (result = r.exec(withComment[0])) {
                    if (result && result[1] && result[2]) {
                        // console.log(result[1], result[2]);
                        if (result[1] == "Description") {
                            additionalData.description = result[2];
                        } else if (result[1] == "Response") {
                            const r = /(\d{3}) \| (.*?) \| (\w*)(\[\])?/.exec(result[2]);
                            // [code, description, response, isArray];
                            if (r) {
                                additionalData.responses[r[1]] = {
                                    description: r[2],
                                    schema: r[4] == "[]" ? {
                                        type: "array",
                                        items: {
                                            $ref: `#/definitions/${r[3]}`,
                                        }
                                    } : {
                                        $ref: `#/definitions/${r[3]}`,
                                    },
                                };
                            }
                        }
                    }
                }
            }
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
                params = params.map((p) => ({
                    in: "path",
                    name: p,
                    type: "ToDo",
                    required: true,
                    description: "ToDo",
                }));
                if (!swaggerDefinition.paths[path]) {
                    swaggerDefinition.paths[path] = {};
                }
                swaggerDefinition.paths[path][f.method] = {
                    ...additionalData,
                    consumes: "application/json",
                    produces: "application/json",
                };
                if (params.length > 0) {
                    swaggerDefinition.paths[path][f.method].parameters = params;
                }
            } else {
                console.log(f.functionName, "of", controller, "not found");
                process.exit(1);
            }
            
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
                    type: any;
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
            swaggerDefinition.definitions[className] = {
                type: "object",
                required: Object.entries(properties).filter((p) => p[1].required).map((p) => p[0]),
                properties: {},
            };
            for (const p of Object.entries(properties)) {
                let type = p[1].type;
                if (enums[type]) {
                    swaggerDefinition.definitions[className].properties[p[0]] = {
                        type: "string",
                        enum: enums[type],
                    };
                } else if (type.startsWith("Record")) {
                    swaggerDefinition.definitions[className].properties[p[0]] = {
                        type: "object",
                    }
                } else if (type.endsWith("[]")) {
                    if (type.startsWith("any")) {
                        swaggerDefinition.definitions[className].properties[p[0]] = {
                            type: "array",
                            items: {
                                type: "object",
                            },
                        };
                    } else {
                        swaggerDefinition.definitions[className].properties[p[0]] = {
                            type: "array",
                            items: {
                                $ref: `#/definitions/${type.replace("[]", "")}`,
                            }
                        }
                    }
                } else if (type == "Date") {
                    swaggerDefinition.definitions[className].properties[p[0]] = {
                        type: "string",
                        format: "date"
                    };
                } else if (type.indexOf(" | ") !== -1) {
                    swaggerDefinition.definitions[className].properties[p[0]] = {
                        type: "string",
                        enum: type.replace(/ \| /g, ",").replace(/\"/g, "").split(","),
                    };
                } else if (type[0] == type[0].toUpperCase()) {
                    swaggerDefinition.definitions[className].properties[p[0]] = {
                        type: {
                            $ref: `#/definitions/${type}`,
                        },
                    };
                } else {
                    swaggerDefinition.definitions[className].properties[p[0]] = {
                        type,
                    };
                }
            }
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
generateModelDefinitions();
fs.writeFileSync(path.join(__dirname, "../docs/docs/developers/swagger.json"), JSON.stringify(swaggerDefinition, undefined, 4));