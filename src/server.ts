import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import cors from 'cors';

import loginRoute from './routes/login';
import logoutRoute from './routes/logout';
import registerRoute from './routes/register';
import refreshRoute from './routes/refresh';
import userRoutes from './routes/users';
import settingsRoutes from './routes/settings';
import projectsRoutes from './routes/projects';
import dashboardRoutes from './routes/dashboard';
import visitRoutes from './routes/visits';

const app: Application = express();

// Middlewares
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://my-portfolio-six-tan-41.vercel.app'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/auth/login', loginRoute);
app.use('/api/auth/logout', logoutRoute);
app.use('/api/auth/register', registerRoute);
app.use('/api/auth/refresh', refreshRoute);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/visits', visitRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
    console.error('Falta MONGO_URI en el archivo .env');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log('🟢 Connecte to MongoDB Atlas'))
    .catch((err) => console.error('🔴 Error in MongoDB:', err));

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
