import { Module } from '@nestjs/common';
import { AssistantAiService } from './assistant-ai.service';
import { AssistantAiController } from './assistant-ai.controller';

@Module({
  controllers: [AssistantAiController],
  providers: [AssistantAiService],
})
export class AssistantAiModule {}
