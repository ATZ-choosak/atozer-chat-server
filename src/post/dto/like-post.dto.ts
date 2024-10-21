import { IsNotEmpty, IsString } from "class-validator";

export class LikePostDto {

    @IsNotEmpty()
    @IsString()
    readonly postId: string;


}