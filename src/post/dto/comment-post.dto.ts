import { IsNotEmpty, IsString } from "class-validator";

export class CommentPostDto {

    @IsNotEmpty()
    @IsString()
    readonly postId: string;

    @IsNotEmpty()
    @IsString()
    readonly comment: string;


}