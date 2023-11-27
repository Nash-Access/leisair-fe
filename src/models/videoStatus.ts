

export interface VideoStatus {
    _id?: string;
    filename: string;
    status: string;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
}