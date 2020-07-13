module.exports = class SpeechRec {
  onCreate() {
    this.state = {
      noteContent: "",
      isRecording: false,
    };
  }

  showToastMessage(message) {
    const toastElement = document.querySelector(".toast");
    if (toastElement) {
      const toastInstance = M.Toast.getInstance(toastElement);
      toastInstance.dismiss();
    }
    M.toast({
      html: message,
    });
  }

  onMount() {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      // const SpeechGrammarList =
      //   window.SpeechGrammarList || window.webkitSpeechGrammarList;
      this.voiceRecognition = new SpeechRecognition();
      // const speechRecognitionList = new SpeechGrammarList();
      // this.voiceRecognition.grammars = speechRecognitionList;
    } catch (e) {
      console.log(e);
    }

    this.voiceRecognition.continuous = true;
    this.voiceRecognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      // There is a weird bug on mobile, where everything is repeated twice.
      // There is no official solution so far so I had to handle an edge case.
      const mobileRepeatBug =
        current == 1 && transcript == event.results[0][0].transcript;
      if (!mobileRepeatBug) {
        this.state.noteContent += transcript;
      }
    };

    this.voiceRecognition.onstart = () => {
      this.showToastMessage(
        "Voice recognition activated. Try speaking into the microphone."
      );
      this.state.isRecording = true;
    };

    this.voiceRecognition.onspeechend = () => {
      this.showToastMessage(
        "You were quiet for a while so voice recognition turned itself off."
      );
      this.state.isRecording = false;
    };

    this.voiceRecognition.onerror = (event) => {
      if (event.error == "no-speech") {
        this.showToastMessage(
          "No speech was detected. Try again."
        );
        this.state.isRecording = false;
      }
    };
  }

  recordNote() {
    if(this.state.isRecording) {
      this.voiceRecognition.stop();
      this.state.isRecording = false;
      this.showToastMessage("Recording paused, resume when you're ready!");
    } else {
      if (this.state.noteContent.length) {
        this.state.noteContent += " ";
      }
      this.voiceRecognition.start();
    }
  }

  addPunctuation(data) {
    if (this.state.noteContent.length) {
      this.state.noteContent += data;
    }
  }
};
