import * as fs from "fs";
import * as path from "path";

const entityDirectory = path.join(__dirname, "../../api/src/entity");
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
        content = content.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, "");
        content = `/**
* @swagger
*
* definitions:
*   ${className}:
*     type: object
*     required:
${Object.entries(properties).filter((p) => p[1].required).map((p) => `*       - ${p[0]}`).join("\n")}
*     properties:
${Object.entries(properties).map((p) => `*       - ${p[0]}:\n*         type: ${p[1].type}`).join("\n")}
*/

` + content;
        fs.writeFileSync(entityPath, content);
    }
}
