module.exports = class SpeechRec {
  onCreate() {
    this.state = {
      noteContent: "",
      helpText: "",
      isRecording: false
    };
    console.log("class");
  }

  onMount() {
    console.log("onMount");
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
        const SpeechGrammarList =
          window.SpeechGrammarList || window.webkitSpeechGrammarList;
        this.voiceRecognition = new SpeechRecognition();
        const speechRecognitionList = new SpeechGrammarList();
        this.voiceRecognition.grammars = speechRecognitionList;
    } catch (e) {
      console.log(e);
    }

    this.voiceRecognition.continuous = true;
    this.voiceRecognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        // There is a weird bug on mobile, where everything is repeated twice.
        // There is no official solution so far so I had to handle an edge case.
        const mobileRepeatBug = current == 1 && transcript == event.results[0][0].transcript;
        if (!mobileRepeatBug) {
            this.state.noteContent += transcript;
        }
    };

    this.voiceRecognition.onstart = () => {
        this.state.helpText =
          "Voice recognition activated. Try speaking into the microphone.";
        this.state.isRecording = true;
    };

    this.voiceRecognition.onspeechend = () => {
      this.state.helpText =
        "You were quiet for a while so voice recognition turned itself off.";
      this.state.isRecording = false;
    };

    this.voiceRecognition.onerror = (event) => {
      if (event.error == "no-speech") {
        this.state.helpText = "No speech was detected. Try again.";
        this.state.isRecording = false;
      }
    };
  }

  recordNote() {
    console.log("HERE")
    if (this.state.noteContent.length) {
      this.state.noteContent += " ";
    }
    this.voiceRecognition.start();
  }

  pauseRecording() {
      this.voiceRecognition.stop();
  }
};
