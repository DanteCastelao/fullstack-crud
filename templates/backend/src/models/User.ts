import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document { }

const userSchema = new Schema<IUserDocument>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            message: 'Role must be either "admin" or "user"',
        },
        default: 'user',
    },
    entityId: {
        type: Schema.Types.ObjectId,
        ref: 'Entity',
    },
});

userSchema.index(
    { username: 1 },
    { unique: true, collation: { locale: 'en', strength: 2 } }
);

export const User = mongoose.model<IUserDocument>('User', userSchema);
