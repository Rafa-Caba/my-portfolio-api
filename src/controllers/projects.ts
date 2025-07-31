import { Request, Response } from 'express';
import Project, { IProject } from '../models/Project';
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary';

export const getAllProjects = async (_req: Request, res: Response) => {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch project', error: err });
    }
};

export const createProject = async (req: Request, res: Response) => {
    const { title, description, url, repoUrl, technologies, category, status, isPublic } = req.body;

    try {
        const newProject = new Project({
            title,
            description,
            url,
            repoUrl,
            technologies: technologies ? technologies.split(',') : [],
            category,
            status,
            isPublic,
            imageUrl: req.file?.path,
            imagePublicId: req.file?.filename,
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create project', error: err });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, url, repoUrl, technologies, category, status, isPublic } = req.body;

        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.title = title;
        project.description = description;
        project.technologies = technologies ? technologies.split(',') : [];
        project.category = category;
        project.url = url;
        project.repoUrl = repoUrl;
        project.status = status;

        if (isPublic === 'true') project.isPublic = isPublic;

        if (req.file) {
            // ✅ Delete old image from Cloudinary if it exists
            if (project.imagePublicId) {
                await deleteFromCloudinary(project.imagePublicId);
            }

            // ✅ Set new image data
            project.imageUrl = req.file.path;
            project.imagePublicId = req.file.filename;
        }

        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update project', error: err });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.imagePublicId) await deleteFromCloudinary(project.imagePublicId);

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed', error: err });
    }
};

export const getPublicProjects = async (req: Request, res: Response) => {
    try {
        const publicProjects = await Project.find({ isPublic: true });

        res.status(200).json(publicProjects);
    } catch (error) {
        console.error('Error fetching public projects:', error);
        res.status(500).json({ error: 'Failed to load public projects' });
    }
};
