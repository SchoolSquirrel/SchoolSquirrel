import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";

let urls: string[] = [];
let foundFiles: string[] = [];
let missingFiles: {
    docsFile: string,
    docsAttribute: string,
    htmlFile: string,
}[] = [];
const files = glob.sync("../SchoolSquirrel/src/app/**/*.html");

for (const file of files) {
    const content = fs.readFileSync(file).toString();
    const docsAttributes = content.match(/ docs=".+?"| docs='.+?'/g);
    if (docsAttributes && Array.isArray(docsAttributes)) {
        for (const docsAttribute of docsAttributes) {
            urls.push(docsAttribute.substring(" docs='".length, docsAttribute.length - 1));
        }
    }
}
console.log(`File scanning done, ${urls.length} reference${urls.length == 1 ? "" : "s"} to the documentation found.`);

urls = (urls as any).flatMap((u: string) => {
    if (u.indexOf("userrole") !== -1) {
        return [
            u.replace("userrole", "students"),
            u.replace("userrole", "teachers"),
            u.replace("userrole", "admins"),
        ];
    }
    return u;
});

for (let url of urls) {
    const hashtagPosition = url.indexOf("#");
    if (hashtagPosition !== -1) {
        url = url.substring(0, hashtagPosition);
    }
    const file = path.join(__dirname, "../docs/docs/", url + ".md");
    console.log(file);
    if (fs.existsSync(file)) {
        foundFiles.push(file);
    } else {
        missingFiles.push({
            docsAttribute: url,
            docsFile: file,
            htmlFile: undefined,
        });
    }
}

console.log(`${foundFiles.length} required documentation pages found.`);
console.log(`${missingFiles.length} required documentation NOT pages found.`);

if (missingFiles.length > 0) {
    process.exit(1);
}