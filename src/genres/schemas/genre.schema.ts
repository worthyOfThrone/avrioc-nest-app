import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Timestamps } from "src/helpers/interfaces/timestamp.interface";

export type GenreDocument = Genre & Document & Timestamps;

@Schema({ collection: 'genres', timestamps: true})
export class Genre {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ nullable: true })
    description?: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);