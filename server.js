const express = require('express');
const PDFDocument = require('pdfkit');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
require('dotenv').config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { Configuration , OpenAIApi } = require('openai');
const config = new Configuration({  
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);
const vision = require('@google-cloud/vision');
const PORT = process.env.PORT || 3000;
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const speech = require('@google-cloud/speech');
const fs = require('fs');
const keyFile = 'C:\Users\jarin\OneDrive\Documents\bookgpt\speechKey.json';

const CREDENTIALS= process.env.CREDENTIALS;

const CONFIG = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
};

const client = new vision.ImageAnnotatorClient(CONFIG);


app.use(express.static('public'));


///for extract image

const detectLandmark = async (file_path) => {

    let [result] = await client.landmarkDetection('landmark_one.jpeg');
    console.log(result.landmarkAnnotations[0].description);
};

const detectText = async (file_path) => {

    let [result] = await client.textDetection(file_path);
    image_text = JSON.stringify(result.fullTextAnnotation.text);
    
};

const predict =async function(prompt){

    const prom = prompt;
    const response =await openai.createImage(
        
        {

        prompt : prom,
        n : 1,
        size : "256x256",
        response_format: 'b64_json',
    });
    

   // console.log(response.data);
    return response.data;
}




const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var parsedResponse={};
var image_text = "";
var buffer = null;



const runPrompt = async (query)=>{
try{
    const prompt = `
    
    I want to know that,

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

app.post('/image-query', async (req, res) => {
    const query = req.body.query;
    console.log(query);
    await detectText(query);
    await runPrompt(image_text);
    console.log(parsedResponse);
    return res.json(parsedResponse);
  });


app.post('/submit-query', async (req, res) => {
    const query = req.body.query;
    console.log("submit query")
    console.log(query);
    await runPrompt(query);
    
    console.log(parsedResponse);
    return res.json(parsedResponse);
  });

  app.post('/pdf-query', async (req, res) => {
    const query = req.body.query;
    
    await predict(query).then(response => {
        const now = Date.now();
        for (let i = 0; i < response.data.length; i++)
        {
            const b64 = response.data[i]['b64_json'];
             buffer = Buffer.from(b64, "base64");
            const filename = `image_${now}_${i}.png`;
            console.log("Writing image " + filename);
            fs.writeFileSync(filename, buffer);
            }
            }
        )

        await runPrompt("Tell me a story about" + query);
        
        console.log(parsedResponse.A);

        
    
    
    //console.log(parsedResponse);
    //return res.json(parsedResponse);
  });




app.get('/invoice', (req,res,next) => {
    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=invoice.pdf',
    }
    );

    buildPDF(
        (chunk) => stream.write(chunk),
        () => stream.end()

    );
});

function buildPDF(dataCallback, endCallback) {
    const doc = new PDFDocument({ bufferPages: true, font: 'Helvetica'});
    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    console.log("pdf e dhukechi");

    doc.fontSize(20).text("Kid's Paradise");

    doc.fontSize(14).text(parsedResponse.A);
    doc.image(buffer, {fit: [250, 300], align: 'center', valign: 'center'});

    doc.end();
    
}

// app.get('/upload', (req, res) => {
//     res.sendFile(path.join(__dirname , '/views/index.html'));
// });

app.post('/upload', upload.single("image"), async (req, res) => {
    
    console.log(req.file);
    await detectText(req.file.filename);
    console.log(image_text);
    await runPrompt(image_text);
    console.log("eta amar text")
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

