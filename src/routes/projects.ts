import { Router } from 'express';
import verifyToken from '../middleware/auth';
import { getAllProjects, createProject, deleteProject, getProjectById, updateProject, getPublicProjects } from '../controllers/projects';
import { uploadProjectImage } from '../middleware/cloudinary';
import { logAction } from '../middleware/logAction';

const router = Router();

router.get('/', getAllProjects);
router.get('/public-projects', getPublicProjects);
router.get('/:id', verifyToken, getProjectById);
router.post('/', verifyToken, uploadProjectImage.single('image'), logAction('Created Project', 'Project'), createProject);
router.put('/:id', verifyToken, uploadProjectImage.single('image'), updateProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;
