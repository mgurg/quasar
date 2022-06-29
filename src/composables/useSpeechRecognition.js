import { ref, watch } from "vue";

// the function accepts parameters
export function useSpeechRecognition({ lang, continuous, interimResults }) {
  const isListening = ref(false);
  const isFinal = ref(false);
  const result = ref("");
  const error = ref("");

  const raw = ref([]);

  // Intialize the web speech API
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  // Checks if the browser supports the API
  const isSupported = Boolean(SpeechRecognition);
  // The speech recognition constructor
  const recognition = SpeechRecognition ? new SpeechRecognition() : false;

  // a function to set it for listening
  const start = () => {
    isListening.value = true;
  };

  // a function to stop it from listening
  const stop = () => {
    isListening.value = false;
  };

  // Checks if the browser supports
  if (isSupported) {
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isFinal.value = false;
    };

    // the method to get the result of the transcription
    recognition.onresult = (event) => {
      // raw words that the user spoke
      const transcript = Array.from(event.results)
        .map((result) => {

          console.log(result[0].transcript, result.isFinal, result[0].confidence )
          // console.log(result)

          raw.value.push([result[0].transcript,result.isFinal, result[0].confidence ])

          isFinal.value = result.isFinal && (result[0].confidence > 0);
          return result[0];
        })
        .map((result) => result.transcript)
        .join("");

      result.value = transcript;
      error.value = undefined;
    };

    // method to handle error
    recognition.onerror = (event) => {
      error.value = "Speech recognition error detected: " + event.error;
    };

    recognition.onend = () => {
      isListening.value = false;
    };

    watch(isListening, () => {
      if (isListening.value)
        // Starting the speech recognition
        recognition.start();
      // stopping the recognition
      else recognition.stop();
    });
  }

  return {
    isSupported,
    isListening,
    isFinal,
    recognition,
    result,
    raw,
    error,
    start,
    stop,
  };
}
