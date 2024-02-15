import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosCosDiscusserStreamUseCase = async (openai: OpenAI, { prompt }: Options) => {

    return await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                    Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                    la respuesta debe de ser en formato markdown,
                    los pros y contras deben tener formato de una lista.
                `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        max_tokens: 500,
        stream: true,
    });

}