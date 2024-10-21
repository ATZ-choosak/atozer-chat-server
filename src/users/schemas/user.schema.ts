import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as bcrypt from 'bcrypt'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    password: string;

    @Prop({ default: false })
    is_verify: boolean;

    @Prop({ default: null })
    image: string;

    @Prop()
    google_id: string;

}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }

    next()
})