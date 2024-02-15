import OpenAI from "openai";


interface Options {
    threadId: string;
    assistantId?: string
}

export const createRunUseCases = async (openai: OpenAI, { threadId, assistantId = `asst_2Ab6NPBJpqEeDRFTBEL6MDta` }: Options) => {

    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,

    })

    return run
}