import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostrDto } from './dto/create-post.dto';
import { PostDocument } from './schemas/post.schema';
import { LikePostDto } from './dto/like-post.dto';
import { CommentPostDto } from './dto/comment-post.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags("Post")
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }


  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Request() req, @Body() data: CreatePostrDto): Promise<PostDocument> {
    const userId = req.user.userId
    const result = await this.postService.createPost(userId, data)
    return result
  }


  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPost() {
    const result = await this.postService.getAllPost()
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Post("/like")
  @HttpCode(200)
  async likePost(@Request() req, @Body() likePostDto: LikePostDto) {
    const userId = req.user.userId
    const result = await this.postService.likePost(userId, likePostDto.postId)
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Post("/comment")
  @HttpCode(200)
  async commentPost(@Request() req, @Body() commentPostDto: CommentPostDto) {
    const userId = req.user.userId
    const result = await this.postService.commentPost(userId, commentPostDto.postId, commentPostDto.comment)
    return result
  }
}
