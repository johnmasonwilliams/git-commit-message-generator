import { Configuration, OpenAIApi } from "openai";
import { exec } from "node:child_process";
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exec("git diff", (error, stdout, stderr) => {
    // const prePrompt = 'You will be given changes in a code base and should return a short, detailed, summarized description of those changes, focusing on the type of change followed by a very short explanation of the changes made. Please limit all your responses to a max of 18 tokens.'
    const prePrompt = 'You will be given code and will need to provide a very short summary, 1-2 sentences max, of the changes in the given code. You can group similar changes together into a single, broader description. You can use broken english to cut down unnecessary words. Please limit all your responses to a max of 18 tokens. The format of your entire response should only be a single sentence that separates each change by a comma and space and does not have any ending punctuation.'

    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: prePrompt + '\\n\\n###\\n\\n'
        }],
    }).then(async (response) => {
        openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: stdout + '\\n\\n###\\n\\n'
            }],
        }).then(async (response2) => {
            const summary = response2.data.choices[0].message?.content;

            if (summary) {
                console.log(summary)
            }
        }).catch((error2) => {
            console.log(error2);
        })
    }).catch((error) => {
        console.log(error);
    })
});
