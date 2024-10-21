import { Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer'
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }


  @UseGuards(JwtAuthGuard)
  @Post("/upload")
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: "./uploads",
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
      }
    })
  }))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const result = await this.fileService.createFile(file.filename)
    return result
  }

  @Get("/:id")
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.fileService.findById(id)

    if (!file) {
      throw new NotFoundException("Image not found.")
    }

    const imagePath = path.join(__dirname, "..", ".." , `./uploads/${file.path}`)

    res.sendFile(imagePath)
  }

}
