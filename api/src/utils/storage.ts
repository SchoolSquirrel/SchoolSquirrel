import * as minio from "minio";

export function listObjects(client: minio.Client, metdataSuffix: string, bucketName: string, prefix?: string, recursive?: boolean): Promise<minio.BucketItem[]> {
    return new Promise((resolve) => {
        const s = client.listObjects(bucketName, prefix, recursive);
        const data = [];
        s.on("data", (d) => data.push(d));
        s.on("end", () => resolve(data.filter((f) => !(f.name as string).endsWith(metdataSuffix))));
    });
}