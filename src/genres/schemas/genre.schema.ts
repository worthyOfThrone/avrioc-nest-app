import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type GenreDocument = Genre & Document;

@Schema({ collection: 'Genres', timestamps: true})
export class Genre {
    @Prop({ required: true })
    name: string;

    @Prop({ nullable: true })
    description?: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);