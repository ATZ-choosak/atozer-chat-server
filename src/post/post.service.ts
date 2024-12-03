import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostrDto } from './dto/create-post.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private userService: UsersService,
  ) {}

  async createPost(
    userId: string,
    createPostDto: CreatePostrDto,
  ): Promise<PostDocument> {
    const createdPost = new this.postModel({ ...createPostDto, owner: userId });
    return createdPost.save();
  }

  async getAllPost(): Promise<PostDocument[]> {
    const getPosts = this.postModel
      .find({})
      .populate({
        path: 'owner',
        select: 'email name image',
      })
      .populate({
        path: 'likes',
        select: 'email name image',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'owner',
          select: 'email name image',
        },
      })
      .exec();
    return getPosts;
  }

  async getPostById(id: string): Promise<PostDocument> {
    const post = await this.postModel
      .findById(id)
      .populate({
        path: 'owner',
        select: 'email name image',
      })
      .populate({
        path: 'likes',
        select: 'email name image',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'owner',
          select: 'email name image',
        },
      })
      .exec();
    return post;
  }

  async likePost(userId: string, postId: string) {
    const post = await this.postModel.findById(postId).exec();

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const user = await this.userService.findById(userId);
    const found = post.likes.find(
      (like) => like._id.toString() === user._id.toString(),
    );
    if (found) {
      post.likes = post.likes.filter(
        (like) => like._id.toString() !== user._id.toString(),
      );
    } else {
      post.likes.push(user);
    }

    await post.save();

    return { like: !found };
  }

  async commentPost(
    userId: string,
    postId: string,
    comment: string,
  ): Promise<PostDocument> {
    const post = await this.postModel
      .findById(postId)
      .populate({
        path: 'owner',
        select: 'email name image',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'owner',
          select: 'email name image',
        },
      })
      .populate({
        path: 'likes',
        select: 'email name image',
      })
      .exec();

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const user = await this.userService.findById(userId);

    // Create a comment object
    const commentObject = {
      owner: user._id,
      message: comment,
    };

    // Push the comment to the comments array
    post.comments.push(commentObject);

    // Save the post
    const savedPost = await post.save();

    // Populate the comments with their owners after saving
    await savedPost.populate({
      path: 'comments',
      populate: {
        path: 'owner',
        select: 'email name image',
      },
    });

    return savedPost;
  }
}
