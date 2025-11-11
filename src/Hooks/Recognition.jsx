import React from 'react'
import Toast from '../Function/Toast';
const Recognition = (lang) => {
    try {
        const [result, setResult] = React.useState("");
        const [isStart, setIsStart] = React.useState(false);
        const speechRecognitionRef = React.useRef(new SpeechRecognition());
        const speechRecognition = speechRecognitionRef.current;

        speechRecognition.lang = lang;
        speechRecognition.continuous = true;
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (e) => {
            let transcript = "";
            for (let i = 0; i <= e.resultIndex; i++) {
                transcript = transcript + " " + e.results[i][0].transcript;
            }
            setResult(transcript);
            console.log("Speech Result:", transcript);
        }

        speechRecognition.onerror = (e) => {
            console.log(e);
            if (e.error == "not-allowed") {
                Toast("error", "User not allowed");
            }
        }

        function start() {
            setIsStart(true);
            speechRecognition.start();
        }

        function stop() {
            setIsStart(false);
            speechRecognition.stop()
        }

        return { start, stop, isStart, result }
    }
    catch (e) {
        Toast("error", "Browser Doesn't support speech recognition");
        return null;
    }
}

export default Recognition