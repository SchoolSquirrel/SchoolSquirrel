/* eslint-disable no-use-before-define */
// file deepcode ignore NoRateLimitingForExpensiveWebOperation: see index.ts
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as archiver from "archiver";
import * as minio from "minio";
import * as http from "http";
import * as stream from "stream";
import * as fs from "fs";
import { join } from "path";
import * as v from "validator";
import { Buckets } from "../entity/Buckets";
import { listObjects, METADATA_SUFFIX } from "../utils/storage";
import { Course } from "../entity/Course";
import { randomString } from "../utils/random";
import { User } from "../entity/User";
import { isTeacher } from "../utils/roles";

interface FileItem {/*
    dev: number,
    mode: number,
    nlink: number,
    uid: number,
    gid: number,
    rdev: number,
    blksize: number,
    ino: number,
    size: number,
    blocks: number,
    atimeMs: number,
    mtimeMs: number,
    ctimeMs: number,
    birthtimeMs: number,
    atime: Date,
    mtime: Date,
    ctime: Date,
    birthtime: Date,
    name: string,
    isFile: false,
    dateModified: Date,
    dateCreated: Date,
    filterPath: string,
    type: string,
    permission: any,
    hasChild: boolean, */
    name: string,
    size: string,
    isFile: boolean,
    dateModified: Date,
    dateCreated: Date,
    type: string,
    filterPath: string,
    permission: any,
    hasChild: boolean,
}

interface FileList {
    cwd: FileItem,
    files: FileItem[],
}

enum DocumentStatus {
    BEING_EDITED = 1,
    READY_TO_SAVE = 2,
    SAVING_ERROR = 3,
    CLOSED_WITHOUT_CHANGES = 4,
    BEING_EDITED_BUT_SAVED = 6,
    FORCE_SAVE_ERROR = 7,
}

interface FileMetdata {
    modified: Date,
    // created: Date,
    authorId: number,
    editKey?: string,
    protected?: boolean, // if yes, only author can edit
}

class FileController {
    public static getBucketName(req: Request): Buckets {
        if (req.params.bucket == "course") {
            return Buckets.COURSE_FILES;
        } if (req.params.bucket == "assignments") {
            return Buckets.ASSIGNMENTS;
        } if (req.params.bucket == "chat") {
            return Buckets.CHAT_FILES;
        }
        return undefined;
    }
    public static async listFiles(req: Request, res: Response): Promise<void> {
        const { itemId } = req.params;
        if (typeof itemId !== "string") {
            res.status(400);
            return;
        }
        const items = await listObjects(req.app.locals.minio as minio.Client, FileController.getBucketName(req), `/${itemId}`, true);
        FileController.minioObjectsToFiles(items, itemId);
        res.send(items);
    }

    public static async handleUpload(req: Request, res: Response): Promise<void> {
        // if (req.body.action === "save") {
        const { itemId } = req.params;
        if (!v.isUUID(itemId)) {
            res.status(404).send({ message: "Item nicht gefunden!" });
            return;
        }
        const { path } = req.body;
        if (typeof path !== "string") {
            res.status(404).send({ message: "Pfad nicht gefunden!" });
            return;
        }
        for (const file of req.files as Express.Multer.File[]) {
            let completePath = `${itemId}${path}${file.originalname}`;
            completePath = await FileController
                .fixPathForAssignmentSubmissions(req, res, completePath);
            await (req.app.locals.minio as minio.Client)
                .putObject(FileController.getBucketName(req), completePath, file.buffer);
            await FileController.setFileMetadata(req, FileController
                .getBucketName(req), completePath, {
                modified: new Date(),
                authorId: res.locals.jwtPayload.userId,
            });
        }
        if (req.body.action) {
            res.send("Success");
        } else {
            let folder = `${itemId}${req.body.path}`;
            folder = await FileController.fixPathForAssignmentSubmissions(req, res, folder);
            res.send(await listObjects(req.app.locals.minio,
                FileController.getBucketName(req), folder));
        }
        // } else {
        //     res.status(500).send("Unknown action");
        // }
    }

    public static async deleteFile(req: Request, res: Response): Promise<void> {
        const filePath = `${req.params.itemId}/${req.params.path}${req.params["0"]}`;
        await (req.app.locals.minio as minio.Client)
            .removeObject(FileController.getBucketName(req), filePath);
        await (req.app.locals.minio as minio.Client)
            .removeObject(FileController.getBucketName(req), `${filePath}${METADATA_SUFFIX}`);
        res.send({ success: true });
    }

    public static async newFile(req: Request, res: Response): Promise<void> {
        const { itemId, path } = req.params;
        const rest = req.params[0];
        if (!(typeof itemId === "string" && typeof path === "string" && typeof rest === "string")) {
            res.status(400);
            return;
        }
        let filePath = `${itemId}/${path}${rest}`;
        filePath = await FileController.fixPathForAssignmentSubmissions(req, res, filePath);
        const fileExtension = filePath.split(".").pop();
        let fileData = Buffer.from("");
        const template = join(__dirname, `../../assets/resources/templates/empty.${fileExtension}`);
        if (fs.existsSync(template)) {
            fileData = fs.readFileSync(template);
        }
        (req.app.locals.minio as minio.Client)
            .putObject(FileController.getBucketName(req), filePath, fileData).then(async () => {
                await FileController.setFileMetadata(req,
                    FileController.getBucketName(req), filePath, {
                        modified: new Date(),
                        authorId: res.locals.jwtPayload.userId,
                    });
                let folder = `${req.params.itemId}/${req.params.path}${req.params["0"]}`;
                folder = await FileController.fixPathForAssignmentSubmissions(req, res, folder);
                const parts = folder.split("/");
                parts.pop();
                res.send(await listObjects(req.app.locals.minio,
                    FileController.getBucketName(req), `${parts.join("/")}/`));
            }, (e) => {
                res.status(500).send({ message: e });
            });
    }

    public static async handleServe(req: Request, res: Response): Promise<void> {
        let path = `/${req.params.itemId}${req.query.path}`;
        path = await FileController.fixPathForAssignmentWorksheets(req, res, path);
        path = await FileController.fixPathForAssignmentSubmissions(req, res, path);
        try {
            (await (req.app.locals.minio as minio.Client)
                .getObject(FileController.getBucketName(req), path)).pipe(res);
        } catch {
            res.status(400).send("Error");
        }
    }

    public static async getFile(req: Request, res: Response): Promise<void> {
        try {
            let filePath = `${req.params.itemId}/${req.params.path}${req.params["0"]}`;
            if (req.params.path == "worksheets") {
                filePath = await FileController
                    .fixPathForAssignmentWorksheets(req, res, filePath, true);
            } else {
                filePath = await FileController.fixPathForAssignmentSubmissions(req, res, filePath);
            }
            res.setHeader("Content-disposition", "attachment");
            res.type(req.params[0]);
            (await (req.app.locals.minio as minio.Client)
                .getObject(FileController.getBucketName(req), filePath)).pipe(res);
        } catch {
            res.status(400).send("Error");
        }
    }

    public static async handleSave(req: Request, res: Response): Promise<void> {
        const { status, url } = req.body;
        if (typeof status !== "number") {
            res.status(400);
            return;
        }
        if (typeof url !== "string" || !url.startsWith(res.app.locals.config.ONLYOFFICE_URL)) {
            res.status(400);
            return;
        }
        if (status == DocumentStatus.BEING_EDITED) {
            res.json({ error: 0 });
        } else if (status == DocumentStatus.READY_TO_SAVE) {
            http.get(url, async (response) => {
                let path = `${req.params.itemId}${req.query.path}`;
                path = await FileController.fixPathForAssignmentWorksheets(req, res, path);
                path = await FileController.fixPathForAssignmentSubmissions(req, res, path);
                await (req.app.locals.minio as minio.Client)
                    .putObject(FileController.getBucketName(req), path, response);
                await FileController.generateNewEditKey(req,
                    FileController.getBucketName(req), path);
                res.json({ error: 0 });
            });
        } else {
            res.json({ error: `Unknown status:${status}` });
            // eslint-disable-next-line no-console
            console.log("Unknown status:", req.body);
        }
    }

    private static async fixPathForAssignmentWorksheets(req,
        res: Response, path: string, isWorksheet = false) {
        if (FileController.isAssignmentFile(req)
            && !await FileController.isDraftAssignmentFile(req.params.itemId,
                res.locals.jwtPayload.userId)
            && (isWorksheet || (req.query.path as string).startsWith("/worksheets/"))) {
            path = FileController.worksheetPathToSubmissionPath(path, res);
        }
        return path;
    }

    private static async fixPathForAssignmentSubmissions(req,
        res: Response, path: string) {
        if (FileController.isAssignmentFile(req)
            && !await FileController.isDraftAssignmentFile(req.params.itemId,
                res.locals.jwtPayload.userId)
            && !await isTeacher(res.locals.jwtPayload.userId)
            && path.indexOf("/submissions/") !== -1) {
            const parts = path.split("/");
            // check that no user id comes after /submissions/
            if (!v.isUUID(parts[parts.indexOf("submissions") + 1])) {
                path = path.replace("/submissions/", `/submissions/${res.locals.jwtPayload.userId}/`);
            }
        }
        return path;
    }

    public static async getEditKey(req: Request, res: Response): Promise<void> {
        let path = `${req.params.itemId}${req.query.path}`;
        let forceNewEditKey = false;
        if (FileController.isAssignmentFile(req)) {
            if ((req.query.path as string).startsWith("/worksheets/")) {
                // file is a worksheet
                if (await FileController
                    .isDraftAssignmentFile(req.params.itemId, res.locals.jwtPayload.userId)) {
                    // file is a DRAFT, allow direct editing
                } else {
                    // file is NOT a draft, create own copy for each student
                    const source = path;
                    path = `${req.params.itemId}${req.query.path}`;
                    path = await FileController.fixPathForAssignmentWorksheets(req, res, path);
                    const bucket = FileController.getBucketName(req);
                    try {
                        await (req.app.locals.minio as minio.Client)
                            .statObject(bucket, path);
                    } catch {
                        await FileController.copyObject(req, source, path);
                        await FileController.copyObject(req,
                            `${source}${METADATA_SUFFIX}`, `${path}${METADATA_SUFFIX}`);
                        forceNewEditKey = true;
                    }
                }
            } else if ((req.query.path as string).startsWith("/materials/")) {
                // file is a material
                if (await FileController
                    .isDraftAssignmentFile(req.params.itemId, res.locals.jwtPayload.userId)) {
                    // file is a DRAFT, allow editing
                } else {
                    // file is NOT a draft, don't allow editing
                    res.status(404).send({ message: "Diese Datei kann nicht bearbeitet werden! Du kannst sie nur ansehen.", redirectToViewMode: true });
                    return;
                }
            } else if ((req.query.path as string).startsWith("/submissions/")) {
                // file is a submission, allow editing
            } else {
                throw Error(`${req.query.path} neither starts with /worksheets not with /materials`);
            }
        }
        let editKey = (await FileController.getFileMetadata(req,
            FileController.getBucketName(req), path))?.editKey;
        if (!editKey || forceNewEditKey) {
            editKey = await FileController.generateNewEditKey(req,
                FileController.getBucketName(req), path);
        }
        res.send({ editKey });
    }

    private static worksheetPathToSubmissionPath(path: string, res: Response) {
        return path.replace("/worksheets/", `/submissions/${res.locals.jwtPayload.userId}/`);
    }

    private static async copyObject(req, source: string, dest: string) {
        const bucket = FileController.getBucketName(req);
        await (req.app.locals.minio as minio.Client)
            .putObject(bucket, dest, await (req.app.locals.minio as minio.Client)
                .getObject(bucket, source));
    }

    private static async isDraftAssignmentFile(assignmentId: string, userId: string | number) {
        return assignmentId == (await getRepository(User).findOne(userId, { relations: ["assignmentDraft"] })).assignmentDraft?.id;
    }

    private static isAssignmentFile(req) {
        return FileController.getBucketName(req) == Buckets.ASSIGNMENTS;
    }

    public static async handleDownload(req: Request, res: Response): Promise<void> {
        const minioClient = req.app.locals.minio as minio.Client;
        try {
            const info = JSON.parse(req.body.downloadInput);
            if (info.data.length == 1 && info.data[0].isFile) {
                // download the file directly
                res.contentType(info.data[0].name.split(".").pop());
                res.attachment(info.data[0].name);
                (await minioClient.getObject(FileController.getBucketName(req), `/${req.params.itemId}${info.path}${info.data[0].name}`)).pipe(res);
            } else {
                // create a zip file
                let archiveName;
                if (info.data.length == 1) {
                    // just one folder
                    archiveName = info.data[0].name;
                } else {
                    // multiple folders / files
                    archiveName = info.path == "/" ? await FileController.getCourseName(req) : info.path.slice(0, -1).split("/").pop();
                }
                res.contentType("zip");
                res.attachment(`${archiveName}.zip`);
                const archive = archiver("zip", {
                    gzip: true,
                    zlib: { level: 9 }, // Sets the compression level.
                });
                archive.pipe(res);
                for (const item of info.data) {
                    const s3FilePath = `/${req.params.itemId}${info.path}${item.name}`;
                    if (item.isFile) {
                        const fileData = (await minioClient
                            .getObject(FileController.getBucketName(req), s3FilePath));
                        archive.append(fileData, { name: item.name });
                    } else {
                        const children = await listObjects(minioClient,
                            FileController.getBucketName(req), s3FilePath, true);
                        for (const child of children) {
                            const fileData = (await minioClient
                                .getObject(FileController.getBucketName(req), child.name));
                            const filePath = `${info.data.length == 1 ? "" : info.data[0].name}${child.name.replace(s3FilePath, "/")}`;
                            archive.append(fileData, { name: filePath });
                        }
                    }
                }
                archive.finalize();
            }
        } catch {
            res.status(400).send("Error");
        }
    }

    private static async generateNewEditKey(req: Request, bucket: Buckets, path: string) {
        const editKey = randomString();
        await FileController.setFileMetadataKey(req, bucket, path, "editKey", editKey);
        return editKey;
    }

    private static minioObjectsToFiles(files: minio.BucketItem[], itemId: string) {
        for (const file of files as any[]) {
            file.path = (file.name as string).replace(`/${itemId}/`, "");
            file.modified = file.lastModified;
            delete file.name;
            delete file.modified;
            delete file.etag;
        }
    }

    private static async getCourseName(req): Promise<string> {
        return (await getRepository(Course).findOne(req.params.itemId)).name;
    }

    private static async setFileMetadata(req: Request, bucket: Buckets,
        path: string, metadata: FileMetdata) {
        await (req.app.locals.minio as minio.Client).putObject(bucket, trimLeadingSlashes(`${path}${METADATA_SUFFIX}`), JSON.stringify(metadata));
    }

    private static async setFileMetadataKey(req: Request, bucket: Buckets,
        path: string, key: string, value: any) {
        const metadata = await FileController.getFileMetadata(req, bucket, path);
        metadata[key] = value;
        await FileController.setFileMetadata(req, bucket, path, metadata);
    }

    private static async getFileMetadata(req: Request, bucket: Buckets,
        path: string): Promise<FileMetdata> {
        return JSON.parse(await streamToString((await (req.app.locals.minio as minio.Client).getObject(bucket, `${path}${METADATA_SUFFIX}`))) || "{}") as FileMetdata;
    }
}

export default FileController;

function streamToString(s: stream.Readable): Promise<string> {
    const chunks = [];
    return new Promise((resolve, reject) => {
        s.on("data", (chunk) => chunks.push(chunk));
        s.on("error", reject);
        s.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
}

function trimLeadingSlashes(s: string) {
    return s.replace(/^\/+/, "");
}
