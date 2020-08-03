import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { Assignment } from "../entity/Assignment";
import { Course } from "../entity/Course";
import { sanitizeHtml } from "../utils/html";
import { User } from "../entity/User";
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
                    name: req.body.path == "/" ? (await getRepository(Course).findOne(req.params.courseId)).name : "",
                    hasChild: items.length > 0,
                },
                files: items as any,
            } as FileList)
        } else {
            res.status(500).send("Unknown action");
        }
    }
}

export default FileController;
