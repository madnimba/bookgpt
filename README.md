# bookgpt
BOOK-GPT

1.INTRODUCTION
A conversational chatbot that can accept user input in both speech and text forms is what the Chatbot with speech and Text Input project wants to build. The behavior of the language model is changed by the chatbot using a language model and an external API. Depending on the user's preference, it can produce responses in either text or voice. The project also uses OCR to extract text from image files and extends capabilities to allow users to contribute image or text files as prompts. The role also include creating visually appealing PDF files for children's books.

2. System Requirements

To set up and run the Chatbot with Voice and Text Input project, ensure that your system meets the following requirements:

    -Operating System: Windows, macOS, or Linux
    -Node.js 
    -Internet connection to access the external APIs

3. Installation

Follow these steps to install and set up the Chatbot with Voice and Text Input project:

    1.Clone the project repository from [GitHub Repository URL].
    2.Open a terminal/command prompt and navigate to the project directory.
    3.Run the following command to install the project dependencies:    'npm install'
    4.Configure the project settings as described in the next section.

4. API Documentation

The Chatbot with Voice and Text Input project provides an API as the backend functionality for the chatbot.To extract text from image files ,we use Google Cloud OpenAI vision API.And to generate image,we use Open AI Dalle 2 api .This section outlines the API endpoints, request/response formats, and authentication requirements.

Endpoints:

    1.'/chat': This endpoint handles the chatbot conversation. It accepts both voice and text inputs and generates responses accordingly.

    2.'/upload': This endpoint allows users to upload files containing prompts. The input files can be either images or text files.

    3.'/invoice': This endpoint generates PDF files for kids' books based on prompts. It incorporates language models, image-generating APIs, and OCR functionalities.
                  After generating the storybook, you have to go to the endpoint manually in the browser. Sorry for the inconvenience.

  
Feel free to explore these additional resources for further information and support related to the Chatbot with Voice and Text Input project.
