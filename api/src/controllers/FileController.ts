import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Course } from "../entity/Course";
import * as archiver from "archiver";
import { listObjects } from "../utils/storage";
import { Buckets } from "../entity/Buckets";
import * as minio from "minio";

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
    hasChild: boolean,*/
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

class FileController {
    public static handle = async (req: Request, res: Response) => {
        if (req.body.action == "read") {
            const items = await listObjects(req.app.locals.minio as minio.Client, Buckets.COURSE_FILES, `/${req.params.courseId}${req.body.path}`);
            for (const item of items as any[]) {
                if (item.etag) {
                    // file
                    item.isFile = true;
                    item.hasChild = false;
                    item.name = item.name.split("/").pop();
                    item.type = item.name.split(".").pop();
                } else {
                    // folder
                    item.isFile = false;
                    item.hasChild = true;
                    const path = item.prefix.split("/");
                    path.pop();
                    item.name = path.pop();
                    item.type = "";
                }
            }
            res.send({
                cwd: {
                    dateCreated: new Date(),
                    dateModified: new Date(),
                    name: req.body.path == "/" ? await FileController.getCourseName(req) : "",
                    hasChild: items.length > 0,
                },
                files: items as any,
            } as FileList)
        } else {
            res.status(500).send("Unknown action");
        }
    }

    public static handleUpload = async (req: Request, res: Response) => {
        if (req.body.action === "save") {
            for (const file of req.files as Express.Multer.File[]) {
                await (req.app.locals.minio as minio.Client).putObject(Buckets.COURSE_FILES, `${req.params.courseId}${req.body.path}${file.originalname}`, file.buffer);
            }
            res.send("Success");
        } else {
            res.status(500).send("Unknown action");
        }
    }

    public static handleServe = async (req: Request, res: Response) => {
        try {
            (await (req.app.locals.minio as minio.Client).getObject(Buckets.COURSE_FILES, `/${req.params.courseId}${req.query.path}`)).pipe(res);
        } catch {
            res.status(400).send("Error");
        }
    }

    public static handleDownload = async (req: Request, res: Response) => {
        const minioClient = req.app.locals.minio as minio.Client;
        try {
            const info = JSON.parse(req.body.downloadInput);
            if (info.data.length == 1 && info.data[0].isFile) {
                // download the file directly
                res.contentType(info.data[0].name.split(".").pop());
                res.attachment(info.data[0].name);
                (await minioClient.getObject(Buckets.COURSE_FILES, `/${req.params.courseId}${info.path}${info.data[0].name}`)).pipe(res);
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
                    zlib: { level: 9 } // Sets the compression level.
                });
                archive.pipe(res);
                for (const item of info.data) {
                    const s3FilePath = `/${req.params.courseId}${info.path}${item.name}`;
                    if (item.isFile) {
                        const fileData = (await minioClient.getObject(Buckets.COURSE_FILES, s3FilePath));
                        archive.append(fileData, { name: item.name });
                    } else {
                        const children = await listObjects(minioClient, Buckets.COURSE_FILES, s3FilePath, true);
                        for (const child of children) {
                            const fileData = (await minioClient.getObject(Buckets.COURSE_FILES, child.name));
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

    private static async getCourseName(req): Promise<string> {
        return (await getRepository(Course).findOne(req.params.courseId)).name;
    }
}

export default FileController;
