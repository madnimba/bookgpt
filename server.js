const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { Configuration , OpenAIApi } = require('openai');
const config = new Configuration({  
    apiKey: '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',
});
const openai = new OpenAIApi(config);
const PORT = process.env.PORT || 3000;
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const speech = require('@google-cloud/speech');
const fs = require('fs');
const keyFile = 'C:\Users\jarin\OneDrive\Documents\bookgpt\speechKey.json';
const client = new speech.SpeechClient({ keyFilename: keyFile });
const recorder = require('node-record-lpcm16');

app.use(express.static('public'));


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var parsedResponse={};
// const client = new speech.SpeechClient({
//     keyFilename: path.join(__dirname , '/applied-grove-392616-f51dbd5a3a6f.json'),
//   });
  


const runPrompt = async (query)=>{
try{
    const prompt = `

    ${query}. Return response in the following parsable JSON format:

    {
        "Q": "question",
        "A": "answer"
    }
    
    `;
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 2048,
        temperature : 1,
    });

    const parsableJsonResponse = (response.data.choices[0].text);
    parsedResponse = JSON.parse(parsableJsonResponse);

    console.log(parsedResponse);

    await delay(2000);

} catch (error) {
    if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }


};


app.post('/submit-query', async (req, res) => {
    const query = req.body.query;
    console.log("submit query")
    console.log(query);
    await runPrompt(query);
    
    console.log(parsedResponse);
    return res.json(parsedResponse);
  });



app.get('/speak', (req, res) => {
    res.sendFile(path.join(__dirname , '/views/speak.html'));
});




app.get('/', (req, res) => {   
    res.sendFile(path.join(__dirname , '/views/index.html'));
}   
);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`)
);

