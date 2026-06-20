import * as Minio from 'minio';

export const minioClient = new Minio.Client({
    endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.NEXT_PUBLIC_MINIO_PORT || '9000'),
    useSSL: process.env.NEXT_PUBLIC_MINIO_USE_SSL === 'true',
    accessKey: process.env.NEXT_PUBLIC_MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.NEXT_PUBLIC_MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_MINIO_BUCKET_NAME || 'aussteller';
const FILE_NAME = 'Ausstellermappe.pdf';

export async function getAusstellermappeDownloadUrl(): Promise<string> {
    try {
        return await minioClient.presignedGetObject(BUCKET_NAME, FILE_NAME, 3600);
    } catch (error) {
        console.error('Fehler beim Generieren der MinIO Download-URL:', error);
        throw new Error('Die Ausstellermappe konnte nicht geladen werden.');
    }
}