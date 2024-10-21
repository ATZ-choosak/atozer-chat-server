import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Date, HydratedDocument } from "mongoose";
import { UserDocument } from "src/users/schemas/user.schema";

export type PostDocument = HydratedDocument<Post>

@Schema()
export class Post {

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ default: [] })
    images: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: UserDocument

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
    likes: UserDocument[];

    @Prop({
        type: [{
            owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            message: { type: String, required: true },
            create_at: { default: Date.now, type: mongoose.Schema.Types.Date }
        }],
        default: []
    })
    comments: { owner: mongoose.Types.ObjectId; message: string; }[];

    @Prop({ default: Date.now, type: mongoose.Schema.Types.Date })
    create_at: Date

    @Prop({ default: Date.now, type: mongoose.Schema.Types.Date })
    update_at: Date

}

export const PostSchema = SchemaFactory.createForClass(Post)

PostSchema.pre("findOneAndUpdate", async function (next) {
    this.set({ update_at: Date.now() })
    next()
})