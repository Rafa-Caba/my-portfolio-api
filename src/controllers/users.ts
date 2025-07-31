import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary';
import { CloudinaryFile } from '../types/cloudinary';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).lean();

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// export const updateUserById = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const {
//         name,
//         username,
//         email,
//         title,
//         role,
//         personalTheme,
//         bio,
//         active,
//         telephone,
//         visibility,
//         quickFacts
//     } = req.body;

//     const file = req.file as CloudinaryFile;

//     try {
//         if (req.user?.id !== id) {
//             return res.status(403).json({ error: 'Not authorized' });
//         }

//         const user = await User.findById(id);
//         if (!user) return res.status(404).json({ error: 'User not found' });

//         user.name = name ?? user.name;
//         user.username = username ?? user.username;
//         user.email = email ?? user.email;
//         user.title = title ?? user.title;
//         user.role = role ?? user.role;
//         user.personalTheme = personalTheme ?? user.personalTheme;
//         user.bio = bio ?? user.bio;
//         user.active = active ?? user.active;
//         user.telephone = telephone ?? user.telephone;

//         if (typeof quickFacts === 'string') {
//             try {
//                 const parsed = JSON.parse(quickFacts);
//                 if (Array.isArray(parsed) && parsed.every(f => typeof f === 'string')) {
//                     user.quickFacts = parsed;
//                 }
//             } catch (err) {
//                 console.warn('Invalid QuickFacts JSON');
//             }
//         }

//         type UserVisibility = IUser['visibility'];
//         type VisibilityKey = keyof UserVisibility;

//         if (typeof visibility === 'string') {
//             try {
//                 const parsedVisibility = JSON.parse(visibility);

//                 const allowedKeys: VisibilityKey[] = [
//                     'name', 'username', 'email', 'title',
//                     'role', 'imageUrl', 'personalTheme',
//                     'bio', 'telephone', 'quickFacts'
//                 ];

//                 const filteredVisibility = Object.fromEntries(
//                     Object.entries(parsedVisibility).filter(([key]) =>
//                         allowedKeys.includes(key as VisibilityKey)
//                     )
//                 ) as UserVisibility;

//                 user.visibility = {
//                     ...user.visibility,
//                     ...filteredVisibility,
//                 };
//             } catch (err) {
//                 console.warn('Invalid visibility JSON');
//             }
//         }

//         if (file) {
//             // ✅ Delete old image from Cloudinary if it exists
//             if (user.imagePublicId) {
//                 await deleteFromCloudinary(user.imagePublicId);
//             }

//             // ✅ Set new image data
//             user.imageUrl = file.path;
//             user.imagePublicId = file.filename || file.public_id;
//         }

//         const updatedUser = await user.save();
//         res.status(200).json(updatedUser);
//     } catch (err) {
//         console.error('Error updating user:', err);
//         res.status(500).json({ error: 'Error updating user' });
//     }
// };

export const updateUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file as CloudinaryFile;

    try {
        if (req.user?.id !== id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const {
            name,
            username,
            email,
            title,
            role,
            personalTheme,
            bio,
            active,
            telephone,
            visibility,
            quickFacts,
        } = req.body;

        // Apply simple string/boolean fields
        const updatableFields: Partial<IUser> = {
            name,
            username,
            email,
            title,
            role,
            personalTheme,
            bio,
            active,
            telephone,
        };

        for (const [key, value] of Object.entries(updatableFields)) {
            if (value !== undefined) {
                (user as any)[key] = value;
            }
        }

        // Parse and assign quickFacts (must be stringified array)
        if (typeof quickFacts === 'string') {
            try {
                const parsed = JSON.parse(quickFacts);
                if (Array.isArray(parsed) && parsed.every((f) => typeof f === 'string')) {
                    user.quickFacts = parsed;
                }
            } catch (err) {
                console.warn('⚠️ Invalid QuickFacts JSON');
            }
        }

        // Parse and assign visibility (must be stringified object)
        if (typeof visibility === 'string') {
            try {
                const parsedVisibility = JSON.parse(visibility);
                const allowedKeys: (keyof IUser['visibility'])[] = [
                    'name', 'username', 'email', 'title',
                    'role', 'imageUrl', 'personalTheme',
                    'bio', 'telephone', 'quickFacts'
                ];

                user.visibility = {
                    ...user.visibility,
                    ...Object.fromEntries(
                        Object.entries(parsedVisibility).filter(([key]) =>
                            allowedKeys.includes(key as keyof IUser['visibility'])
                        )
                    )
                };
            } catch (err) {
                console.warn('⚠️ Invalid Visibility JSON');
            }
        }

        // Replace image if new one is uploaded
        if (file) {
            if (user.imagePublicId) {
                await deleteFromCloudinary(user.imagePublicId);
            }
            user.imageUrl = file.path;
            user.imagePublicId = file.filename || file.public_id;
        }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('❌ Error updating user:', err);
        res.status(500).json({ error: 'Error updating user' });
    }
};


export const changePassword = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new passwords are required.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;

        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ error: 'Failed to update password' });
    }
};

export const getPublicUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ role: 'Admin' });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { visibility } = user;

        const publicProfile: Partial<typeof user> = {};
        publicProfile.visibility = {};

        if (visibility?.name) {
            publicProfile.name = user.name;
            publicProfile.visibility.name = user.visibility.name;
        }
        if (visibility?.username) {
            publicProfile.username = user.username;
            publicProfile.visibility.username = user.visibility.username;
        }
        if (visibility?.email) {
            publicProfile.email = user.email;
            publicProfile.visibility.email = user.visibility.email;
        }
        if (visibility?.title) {
            publicProfile.title = user.title;
            publicProfile.visibility.title = user.visibility.title;
        }
        if (visibility?.role) {
            publicProfile.role = user.role;
            publicProfile.visibility.role = user.visibility.role;
        }
        if (visibility?.imageUrl) {
            publicProfile.imageUrl = user.imageUrl;
            publicProfile.visibility.imageUrl = user.visibility.imageUrl;
        }
        if (visibility?.personalTheme) {
            publicProfile.personalTheme = user.personalTheme;
            publicProfile.visibility.personalTheme = user.visibility.personalTheme;
        }
        if (visibility?.bio) {
            publicProfile.bio = user.bio;
            publicProfile.visibility.bio = user.visibility.bio;
        }
        if (visibility?.telephone) {
            publicProfile.telephone = user.telephone;
            publicProfile.visibility.telephone = user.visibility.telephone;
        }
        if (visibility?.quickFacts) {
            publicProfile.quickFacts = user.quickFacts;
            publicProfile.visibility.quickFacts = user.visibility.quickFacts;
        }

        res.status(200).json(publicProfile);
    } catch (error) {
        console.error('Error fetching public user profile:', error);
        res.status(500).json({ error: 'Failed to load user profile' });
    }
};
