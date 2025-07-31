
export interface CloudinaryFile extends Express.Multer.File {
    public_id?: string;
    path: string;
}