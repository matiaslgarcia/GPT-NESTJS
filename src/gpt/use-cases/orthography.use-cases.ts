import OpenAI from "openai";


interface Options {
    prompt: string;
}
export const orthographyCheckUseCase = async (openai: OpenAI, { prompt }: Options) => {

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                    Te seran proveidos textos en español con posibles errores ortograficos y gramaticales, 
                    Las palabras usadas deben existir en el diccionario de la RAE,
                    Debes de responder en formato JSON,
                    tu tarea sera corregirlos y retornar informacion con su solucion,
                    tambien debes dar un porcentaje de acierto por el usuario,

                    Si no hay errores, debes retornar un mensaje de felicitaciones.

                    Ejemplo de salida:
                    {
                        userScore: number,
                        errors: string[], // ['error -> solucion']
                        message: string, // Usa emojis y texto para fecilitar al usuario.
                    }
                `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        max_tokens: 150,

    });

    const jsonResp = JSON.parse(completion.choices[0].message.content)
    return jsonResp;

}