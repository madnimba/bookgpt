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
app.use(express.static('public'));


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var parsedResponse={};


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




app.get('/', (req, res) => {   
    res.sendFile(path.join(__dirname , '/views/index.html'));
}   
);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`)
);

