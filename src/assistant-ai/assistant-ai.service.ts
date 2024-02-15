import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusUseCases, createRunUseCases, createThreadUseCases, getMessagesListUseCases, userQuestionUseCase } from './use-cases';
import { UserQuestionDto } from './dtos/question.dto';

@Injectable()
export class AssistantAiService {


    private openai = new OpenAI({
        apiKey: `${process.env.OPENAI_API_KEY}`,
    })

    async createThread() {
        return await createThreadUseCases(this.openai)
    }

    async userQuestion({ threadId, question }: UserQuestionDto) {
        const message = await userQuestionUseCase(this.openai, { threadId, question })
        const run = await createRunUseCases(this.openai, { threadId })

        await checkCompleteStatusUseCases(this.openai, { threadId: threadId, runId: run.id })

        const messages = await getMessagesListUseCases(this.openai, { threadId })

        return messages.reverse()
    }
}
