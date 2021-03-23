import * as express from "express";
import * as socketIO from "socket.io";
import * as minio from "minio";
import "reflect-metadata";
import { getConfig } from "container-env";
import { HolidayData } from "../entity/Holiday";
import { User } from "../entity/User";

interface Locals {
    sockets: {
        [userId: string]: {
            socket: socketIO.Socket;
            activeChat?: string;
        }
    }
    config: ReturnType<typeof getConfig>;
    minio: minio.Client;
    holidays: HolidayData;
    jwtPayload: {
        userId: string;
        user: User;
    }
}

export interface IExpress extends express.Express {
    locals: Locals;
}

export interface IResponse extends express.Response {
    locals: Locals;
}
