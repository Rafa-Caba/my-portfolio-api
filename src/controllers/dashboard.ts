import { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';

export const getDashboardStats = async (_req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const activeProjects = await Project.countDocuments({ status: 'Active' });

        // console.log({ totalUsers, totalProjects, activeProjects });

        res.json({ totalUsers, totalProjects, activeProjects });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err });
    }
};