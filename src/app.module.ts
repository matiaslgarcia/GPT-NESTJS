import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';
import { AssistantAiModule } from './assistant-ai/assistant-ai.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    GptModule,
    AssistantAiModule
  ]
})
export class AppModule {}
