import OpenAI from "openai";


interface Options {
    threadId: string,

}

export const getMessagesListUseCases = async (openai: OpenAI, { threadId }: Options) => {

    const messageList = await openai.beta.threads.messages.list(threadId)

    const messages = messageList.data.map(mjs => ({
        role: mjs.role,
        content: mjs.content.map(content => (content as any).text.value)
    }))

    return messages;
}