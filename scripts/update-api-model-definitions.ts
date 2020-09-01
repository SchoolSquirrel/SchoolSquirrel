import * as fs from "fs";
import * as path from "path";

const entityDirectory = path.join(__dirname, "../api/src/entity");
const entityFiles = fs.readdirSync(entityDirectory);

for (const entityFile of entityFiles) {
    const entityPath = path.join(entityDirectory, entityFile);
    let content = fs.readFileSync(entityPath).toString();
    const result = new RegExp(`export class (.*?) {`).exec(content);
    if (result && result[1]) {
        const className = result[1].indexOf(" ") ? result[1].split(" ").shift() : result[1];
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
        const oldDefinition = content.match(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\n\n/);
        const definition = `/**
* @swagger
*
* definitions:
*   ${className}:
*     type: object
*     required:
${Object.entries(properties).filter((p) => p[1].required).map((p) => `*       - ${p[0]}`).join("\n")}
*     properties:
${Object.entries(properties).map((p) => {
    let type = p[1].type;
    if (type.endsWith("[]")) {
        const item = type.startsWith("any") ? "type: object" : `$ref: '#/definitions/${type.replace("[]", "")}'`;
        type = `array\n*         items:\n*           ${item}`;
    } else if (type == "Date") {
        type = "string\n*         format: date";
    } else if (type[0] == type[0].toUpperCase()) {
        type = `\n*           $ref: '#/definitions/${type}'`;
    } else if (type.indexOf(" | ") !== -1) {
        type = `string\n*         enum: [${type.replace(/ \| /g, ", ").replace(/\"/g, "")}]`;
    }
    return `*       ${p[0]}:\n*         type:${type.startsWith("\n") ? "" : " "}${type}`;
}).join("\n")}
*/

`;
        if (oldDefinition && oldDefinition[0] == definition) {
            console.log(`${className} has not been changed!`);
        } else {
            if (oldDefinition) {
                console.log(`${className} has been changed, the new comment is now ABOVE the old one. Please merge them.`)
            }
            fs.writeFileSync(entityPath, definition + content);
        }
    }
}
