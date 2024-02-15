import { Body, Controller, Post } from '@nestjs/common';
import { AssistantAiService } from './assistant-ai.service';
import { UserQuestionDto } from './dtos/question.dto';

@Controller('assistant-ai')
export class AssistantAiController {
  constructor(private readonly assitantAiService: AssistantAiService) { }


  @Post('create-thread')
  async createThread() {
    return await this.assitantAiService.createThread()
  }


  @Post('user-question')
  async userQuestion(
    @Body() userQuestionDto: UserQuestionDto
  ) {
    return await this.assitantAiService.userQuestion(userQuestionDto)
  }
}
