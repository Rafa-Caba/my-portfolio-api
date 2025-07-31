import { Schema, model, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    imageUrl?: string;
    imagePublicId?: string;
    url?: string;
    repoUrl?: string;
    technologies: string[];
    category?: string;
    status?: string;
    isPublic?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String },
        imagePublicId: { type: String },
        url: { type: String },
        repoUrl: { type: String },
        technologies: [{ type: String }],
        category: { type: String },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Archived'],
            default: 'Active',
        },
        isPublic: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Project = model<IProject>('Project', ProjectSchema);
export default Project;
