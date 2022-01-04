import { easy } from "./cvc-words";
import { shuffle } from "./utils";

console.log("🏃‍♀️ Reading Practice is up and running!");

const questionEl = document.getElementById("question");
const score = document.getElementById("score") as HTMLProgressElement;

let index = -1;
let previouslySeen = [];

const words = shuffle(easy);

function question() {
  index++;
  const word = words[index];
  const options = getOptions(word);
  questionEl.dataset.word = word.text;
  questionEl.dataset.emoji = word.emoji;
  delete questionEl.dataset.attempted;
  questionEl.innerHTML = `
<div class="question__word">${word.text}</div>
<div class="question__options">
${options
  .map(
    (option) =>
      `<button data-answer=${option.text === word.text}>${
        option.emoji
      }</button>`
  )
  .join("")}
</div>
`;
}

function getOptions(current) {
  const shuffled = shuffle(easy);
  const options = [current];

  for (let i = 0; i < shuffled.length; i++) {
    const element = shuffled[i];
    if (
      element.text !== current.text &&
      !previouslySeen.includes(element.text) &&
      !current.tooClose.includes(element.text)
    ) {
      options.push(element);

      if (options.length === 3) break;
    }
  }

  return shuffle(options);
}

question();

function speak(word) {
  let string = word.split("").join(",");
  string += ", spells " + word;

  const utterance = new SpeechSynthesisUtterance(string);
  utterance.rate = 0.75;
  speechSynthesis.speak(utterance);
}

function wordToSentence(word) {
  return word.split("").join("-") + " spells " + word;
}

questionEl.addEventListener("click", (event) => {
  if (!questionEl.contains(event.target)) return;

  if (event.target.dataset.answer === "true") {
    const nextValue = Number(score.value) + 1;
    score.value = nextValue;

    if (nextValue == score.max) {
      // There was a timing issue using data attributes with
      // Firefox here, so I went with a class to toggle.
      document.body.classList.add("winner");

      setTimeout(() => {
        if (confirm("💪 Great practicing! Would you like to play again?")) {
          score.value = 0;
          previouslySeen = [];
          document.body.classList.remove("winner");
          question();
        }
      }, 250);
    } else {
      alert("You did it! 😊");
    }

    previouslySeen.push(questionEl.dataset.word);
    question();
  } else {
    if (questionEl.dataset.attempted === "true") {
      speak(questionEl.dataset.word);
      alert(
        wordToSentence(questionEl.dataset.word) + " " + questionEl.dataset.emoji
      );
      question();
    } else {
      event.target.disabled = true;
      questionEl.dataset.attempted = true;
    }
  }
});
