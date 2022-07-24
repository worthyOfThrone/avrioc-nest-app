import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import { Document } from 'mongoose';

type Timestamps = {
	createdAt: Date;
	updatedAt: Date;
};

export type UserDocument = User & Document & Timestamps;

@Schema({ collection: 'users', timestamps: true })
export class User {
	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	firstName: string;

	@Prop({ required: true })
	lastName: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	description: string;

	@Prop({ default: false })
	isReviewer?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
