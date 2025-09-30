import { easy } from "./cvc-words.js";
import { shuffle } from "./utils.js";

console.log("🏃‍♀️ Reading Practice is up and running!");

const questionEl = document.getElementById("question");
const score = document.getElementById("score");

const audioURLs = [
  new URL("yay.mp3", import.meta.url),
  new URL("good-working.mp3", import.meta.url),
];

const letterNamesAudioURLs = {
  a: new URL("letters-and-sounds/name-a.wav", import.meta.url),
  b: new URL("letters-and-sounds/name-b.wav", import.meta.url),
  c: new URL("letters-and-sounds/name-c.wav", import.meta.url),
  d: new URL("letters-and-sounds/name-d.wav", import.meta.url),
  e: new URL("letters-and-sounds/name-e.wav", import.meta.url),
  f: new URL("letters-and-sounds/name-f.wav", import.meta.url),
  g: new URL("letters-and-sounds/name-g.wav", import.meta.url),
  h: new URL("letters-and-sounds/name-h.wav", import.meta.url),
  i: new URL("letters-and-sounds/name-i.wav", import.meta.url),
  j: new URL("letters-and-sounds/name-j.wav", import.meta.url),
  k: new URL("letters-and-sounds/name-k.wav", import.meta.url),
  l: new URL("letters-and-sounds/name-l.wav", import.meta.url),
  m: new URL("letters-and-sounds/name-m.wav", import.meta.url),
  n: new URL("letters-and-sounds/name-n.wav", import.meta.url),
  o: new URL("letters-and-sounds/name-o.wav", import.meta.url),
  p: new URL("letters-and-sounds/name-p.wav", import.meta.url),
  q: new URL("letters-and-sounds/name-q.wav", import.meta.url),
  r: new URL("letters-and-sounds/name-r.wav", import.meta.url),
  s: new URL("letters-and-sounds/name-s.wav", import.meta.url),
  t: new URL("letters-and-sounds/name-t.wav", import.meta.url),
  u: new URL("letters-and-sounds/name-u.wav", import.meta.url),
  v: new URL("letters-and-sounds/name-v.wav", import.meta.url),
  w: new URL("letters-and-sounds/name-w.wav", import.meta.url),
  x: new URL("letters-and-sounds/name-x.wav", import.meta.url),
  y: new URL("letters-and-sounds/name-y.wav", import.meta.url),
  z: new URL("letters-and-sounds/name-z.wav", import.meta.url),
};

const letterSoundsAudioURLs = {
  a: new URL("letters-and-sounds/sound-a.wav", import.meta.url),
  b: new URL("letters-and-sounds/sound-b.wav", import.meta.url),
  c: new URL("letters-and-sounds/sound-c.wav", import.meta.url),
  d: new URL("letters-and-sounds/sound-d.wav", import.meta.url),
  e: new URL("letters-and-sounds/sound-e.wav", import.meta.url),
  f: new URL("letters-and-sounds/sound-f.wav", import.meta.url),
  g: new URL("letters-and-sounds/sound-g.wav", import.meta.url),
  h: new URL("letters-and-sounds/sound-h.wav", import.meta.url),
  i: new URL("letters-and-sounds/sound-i.wav", import.meta.url),
  j: new URL("letters-and-sounds/sound-j.wav", import.meta.url),
  k: new URL("letters-and-sounds/sound-k.wav", import.meta.url),
  l: new URL("letters-and-sounds/sound-l.wav", import.meta.url),
  m: new URL("letters-and-sounds/sound-m.wav", import.meta.url),
  n: new URL("letters-and-sounds/sound-n.wav", import.meta.url),
  o: new URL("letters-and-sounds/sound-o.wav", import.meta.url),
  p: new URL("letters-and-sounds/sound-p.wav", import.meta.url),
  q: new URL("letters-and-sounds/sound-q.wav", import.meta.url),
  r: new URL("letters-and-sounds/sound-r.wav", import.meta.url),
  s: new URL("letters-and-sounds/sound-s.wav", import.meta.url),
  t: new URL("letters-and-sounds/sound-t.wav", import.meta.url),
  u: new URL("letters-and-sounds/sound-u.wav", import.meta.url),
  v: new URL("letters-and-sounds/sound-v.wav", import.meta.url),
  w: new URL("letters-and-sounds/sound-w.wav", import.meta.url),
  x: new URL("letters-and-sounds/sound-x.wav", import.meta.url),
  y: new URL("letters-and-sounds/sound-y.wav", import.meta.url),
  z: new URL("letters-and-sounds/sound-z.wav", import.meta.url),
};

function playLetterName(letter) {
  const url = letterNamesAudioURLs[letter.toLowerCase()];
  if (!url) return;
  const audio = new Audio(url.toString());
  audio.play();
}

function playLetterSound(letter) {
  const url = letterSoundsAudioURLs[letter.toLowerCase()];
  if (!url) return;
  const audio = new Audio(url.toString());
  audio.play();
}

let audioCount = Math.random() > 0.5 ? 1 : 0;
function getAudio() {
  const url = audioURLs[audioCount % audioURLs.length];
  audioCount++;
  return new Audio(url.toString());
}

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
<div class="question__word">
${word.text
  .split("")
  .map(
    (letter) =>
      `<div class="question__letter">
        <span>${letter}</span>
        <button aria-label="name" data-name="${letter}"></button>
        <button aria-label="sound" data-sound="${letter}"></button>
      </div>`
  )
  .join("")}
</div>
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

  setTimeout(() => {
    const options = questionEl.querySelector(".question__options");
    options.dataset.visible = "true";
  }, 3000);
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

questionEl.addEventListener("click", (event) => {
  if (!questionEl.contains(event.target)) return;

  if (event.target.classList.contains("question__word")) {
    return;
  }

  if (event.target.dataset.name) {
    playLetterName(event.target.dataset.name);
    return;
  }

  if (event.target.dataset.sound) {
    playLetterSound(event.target.dataset.sound);
    return;
  }

  if (event.target.dataset.answer === "true") {
    const nextValue = Number(score.value) + 1;
    score.value = nextValue;

    getAudio().play();

    if (nextValue == score.max) {
      document.body.dataset.winner = "true";
      return;
    }

    previouslySeen.push(questionEl.dataset.word);
    question();
  } else {
    if (questionEl.dataset.attempted === "true") {
      question();
    } else {
      event.target.disabled = "true";
      questionEl.dataset.attempted = "true";
    }
  }
});
