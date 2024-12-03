import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { Model } from 'mongoose';

@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  async findById(id: string): Promise<FileDocument> {
    const result = await this.fileModel.findById(id).exec();
    return result;
  }

  async createFile(path: string): Promise<FileDocument> {
    const createdFile = new this.fileModel({ path });
    return createdFile.save();
  }
}
