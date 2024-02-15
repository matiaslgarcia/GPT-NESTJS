import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';

import { orthographyCheckUseCase } from './use-cases/orthography.use-cases';
import { OrthographyDto } from './dtos/orthography.dto';
import { ProsCosDiscusserDto } from './dtos/prosCosDiscusser.dto';
import { prosCosDiscusserStreamUseCase, prosCosDiscusserUseCase, textoToAudioUseCase, translateUseCase, audioToFileUseCase, imageGenerationUseCase, imageGenerationVariationUseCase } from './use-cases';
import { TranslateDto } from './dtos/translateDto.dto';
import { TextToAudioDto } from './dtos/textToAudio.dto';
import * as path from "path";
import { AudioToTextDto, ImageGenerationVariationDto } from './dtos';
import { ImageGenerationDto } from './dtos/imageGeneration.dto';
import * as fs from 'fs';

@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: `${process.env.OPENAI_API_KEY}`,
    })

    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase(
            this.openai,
            { prompt: orthographyDto.prompt }
        )
    }

    async prosConsDiscusserCheck(prosCosDiscusserDto: ProsCosDiscusserDto) {
        return await prosCosDiscusserUseCase(
            this.openai,
            { prompt: prosCosDiscusserDto.prompt }
        )
    }

    async prosConsDiscusserCheckStream(prosCosDiscusserDto: ProsCosDiscusserDto) {
        return await prosCosDiscusserStreamUseCase(
            this.openai,
            { prompt: prosCosDiscusserDto.prompt }
        )
    }

    async translateCheck(translateDto: TranslateDto) {
        return await translateUseCase(
            this.openai,
            {
                prompt: translateDto.prompt,
                lang: translateDto.lang
            }
        )
    }

    async textToAudioCheck(textToAudioDto: TextToAudioDto) {
        return await textoToAudioUseCase(this.openai, {
            prompt: textToAudioDto.prompt,
            voice: textToAudioDto.voice
        })
    }

    async getPathFile(fileId: number) {
        const folderPath = path.resolve(__dirname, '../../generated/audios/')

        const speechFile = path.resolve(`${folderPath}/${fileId}.mp3`)

        return speechFile
    }


    async audioToFile(file: Express.Multer.File, prompt?: AudioToTextDto) {
        return await audioToFileUseCase(this.openai, {
            audioFile: file,
            prompt: prompt.prompt
        })
    }

    async imageGeneration(imageGenerationDto: ImageGenerationDto) {
        return await imageGenerationUseCase(this.openai, { ...imageGenerationDto })
    }

    async getImageFile(fileId: string) {
        const folderPath = path.resolve(__dirname, '../../generated/images/', fileId)

        const exists = fs.existsSync(folderPath)
        if (!exists) throw new NotFoundException('File not found')
        return folderPath
    }

    async imageGenerationVariation({ baseImage }: ImageGenerationVariationDto) {
        return await imageGenerationVariationUseCase(this.openai, { baseImage })
    }
}
