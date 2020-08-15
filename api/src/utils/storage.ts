import * as minio from "minio";

export const METADATA_SUFFIX = ".schoolsquirrel-metadata";

export function listObjects(client: minio.Client,
    bucketName: string, prefix?: string, recursive?: boolean): Promise<minio.BucketItem[]> {
    return new Promise((resolve) => {
        const s = client.listObjects(bucketName, prefix, recursive);
        const data = [];
        s.on("data", (d) => data.push(d));
        s.on("end", () => resolve(data.filter((f) => !(f.name as string)?.endsWith(METADATA_SUFFIX))));
    });
}
