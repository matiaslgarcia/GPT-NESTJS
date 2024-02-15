import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageGenerationVariationDto, OrthographyDto, ProsCosDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';


@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) { }


  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ) {
    return this.gptService.orthographyCheck(orthographyDto)
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(
    @Body() prosCosDiscusserDto: ProsCosDiscusserDto,
  ) {
    return this.gptService.prosConsDiscusserCheck(prosCosDiscusserDto)
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosCosDiscusserDto: ProsCosDiscusserDto,
    @Res() res: Response,
  ) {

    const stream = await this.gptService.prosConsDiscusserCheckStream(prosCosDiscusserDto)

    res.setHeader('Content-Type', 'application/json')
    res.status(HttpStatus.OK)

    //manera de generar una salida como en tiempo real
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || ''
      res.write(piece)
    }

    res.end();
  }

  @Post('translate')
  async translate(
    @Body() translateDto: TranslateDto,
  ) {
    return this.gptService.translateCheck(translateDto)
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response
  ) {
    const filePath = await this.gptService.textToAudioCheck(textToAudioDto)
    res.setHeader('Content-Type', 'audio/mp3')
    res.status(HttpStatus.OK)
    res.sendFile(filePath)
  }

  @Get('text-to-audio/:fileId')
  async getTextToAudio(
    @Res() res: Response,
    @Param('fileId', ParseIntPipe) fileId: number
  ) {
    const filePath = await this.gptService.getPathFile(fileId)
    res.setHeader('Content-Type', 'audio/mp3')
    res.status(HttpStatus.OK)
    res.sendFile(filePath)
  }


  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor(
      'file',
      {
        storage: diskStorage({
          destination: './generated/uploads',
          filename: (req, file, cb) => {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${new Date().getTime()}.${fileExtension}}`
            return cb(null, fileName)
          }
        })
      }
    )
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'FIle is bigger than 5 MB' }),
          new FileTypeValidator({ fileType: 'audio/*' })
        ]
      })
    ) file: Express.Multer.File,
    @Body('prompt') audioToTextDto: AudioToTextDto
  ) {

    return this.gptService.audioToFile(file, audioToTextDto)
  }


  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto
  ){
    return await this.gptService.imageGeneration(imageGenerationDto)
  }

  @Get('image-generation/:fileId')
  async getImageGeneration(
    @Res() res: Response,
    @Param('fileId') fileId: string
  ) {
    const filePath = await this.gptService.getImageFile(fileId)
    // res.setHeader('Content-Type', 'audio/mp3')
    res.status(HttpStatus.OK)
    res.sendFile(filePath)
  }

  @Post('image-generation-variation')
  async imageGenerationVariation(
    @Body() imageGenerationVariationDto: ImageGenerationVariationDto
  ){
    return await this.gptService.imageGenerationVariation(imageGenerationVariationDto)
  }

}
