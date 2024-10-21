import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [

    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema }
    ])

  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule { }
