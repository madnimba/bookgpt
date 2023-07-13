startBtn.addEventListener('click', function () {
    var speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            
        phraseDiv.innerHTML = transcript;

    })
    if (speech == true) {
        recognition.start();
    }

})

// var speechRecognition = window.webkitSpeechRecognition;
// var recognition = new speechRecognition();
// var textbox = $("#phraseDiv");

// var content = '';

// recognition.continuous = true;

// recognition.onstart = function () {
//     startBtn.val("Listening...");
// }

// recognition.onspeechend = function () {
//     startBtn.val("Tap to Speak");
// }

// recognition.onerror = function () {
//     startBtn.val("Tap to Speak");
// }

// recognition.onresult = function (event) {
//     var current = event.resultIndex;
//     var transcript = event.results[current][0].transcript;

//     content += transcript;

//     phraseDiv.val(content);
// }

// $("#startBtn").click(function (event) {
//     if(content.length){
//         content += '';
//     }

//     recognition.start();

// })