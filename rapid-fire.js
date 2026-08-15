/* =====================================================
   PHOENIX AI HACKATHON
   RAPID FIRE ENGINE
   File: rapid-fire.js
===================================================== */


/* =====================================================
   1. QUESTION DATABASE
   20 Questions × 10 XP = 200 XP
===================================================== */

const questions = [

  {
    question:
      'Who proposed the "Imitation Game", later known as the Turing Test?',
    options: [
      "John McCarthy",
      "Alan Turing",
      "Marvin Minsky",
      "Geoffrey Hinton"
    ],
    answer: 1
  },

  {
    question:
      "Sophia, the famous humanoid robot, was developed by which company?",
    options: [
      "Boston Dynamics",
      "Hanson Robotics",
      "IBM",
      "DeepMind"
    ],
    answer: 1
  },

  {
    question:
      "Which company develops Claude?",
    options: [
      "OpenAI",
      "Google DeepMind",
      "Anthropic",
      "xAI"
    ],
    answer: 2
  },

  {
    question:
      "Which 1956 event is closely associated with the birth of Artificial Intelligence as an academic field?",
    options: [
      "Turing Conference",
      "Dartmouth Summer Research Project",
      "Bell Labs AI Summit",
      "MIT Intelligence Project"
    ],
    answer: 1
  },

  {
    question:
      'Who coined the term "Artificial Intelligence"?',
    options: [
      "Alan Turing",
      "John McCarthy",
      "Claude Shannon",
      "Marvin Minsky"
    ],
    answer: 1
  },

  {
    question:
      "AlphaGo became famous for defeating top human players in which game?",
    options: [
      "Chess",
      "Go",
      "Shogi",
      "Poker"
    ],
    answer: 1
  },

  {
    question:
      "Before defeating Lee Sedol, AlphaGo defeated which professional Go player 5–0?",
    options: [
      "Ke Jie",
      "Fan Hui",
      "Cho Chikun",
      "Shin Jin-seo"
    ],
    answer: 1
  },

  {
    question:
      "Which computer defeated world chess champion Garry Kasparov in a 1997 match?",
    options: [
      "Watson",
      "Deep Thought",
      "Deep Blue",
      "AlphaZero"
    ],
    answer: 2
  },

  {
    question:
      "ELIZA, created in the 1960s, is best described as an early:",
    options: [
      "Image generator",
      "Chatbot",
      "Chess engine",
      "Humanoid robot"
    ],
    answer: 1
  },

  {
    question:
      "Which researcher is most closely associated with the invention of the Perceptron?",
    options: [
      "Frank Rosenblatt",
      "Yann LeCun",
      "Demis Hassabis",
      "Sam Altman"
    ],
    answer: 0
  },

  {
    question:
      "An AI gives you a convincing citation, including an author and paper title, but the paper does not exist. What is this commonly called?",
    options: [
      "Overfitting",
      "Hallucination",
      "Tokenization",
      "Reinforcement"
    ],
    answer: 1
  },

  {
    question:
      'Which architecture was introduced in the 2017 paper "Attention Is All You Need"?',
    options: [
      "GAN",
      "Transformer",
      "Perceptron",
      "CNN"
    ],
    answer: 1
  },

  {
    question:
      "In LLM, what does the first letter L stand for?",
    options: [
      "Learning",
      "Language",
      "Large",
      "Logic"
    ],
    answer: 2
  },

  {
    question:
      "What does the letter G in GPT stand for?",
    options: [
      "General",
      "Generative",
      "Guided",
      "Gradient"
    ],
    answer: 1
  },

  {
    question:
      "A realistic AI-generated video makes a person appear to say something they never said. What is this commonly called?",
    options: [
      "Deepfake",
      "Overfitting",
      "Fine-tuning",
      "Tokenization"
    ],
    answer: 0
  },

  {
    question:
      "What does the term AI Winter refer to?",
    options: [
      "AI systems failing in cold environments",
      "Periods of reduced AI funding and interest",
      "AI models trained only during winter",
      "A cybersecurity technique"
    ],
    answer: 1
  },

  {
    question:
      "Which of these pairings is incorrect?",
    options: [
      "Claude — Anthropic",
      "Gemini — Google",
      "ChatGPT — OpenAI",
      "Sophia — DeepMind"
    ],
    answer: 3
  },

  {
    question:
      "What is the primary function of a token in a Large Language Model?",
    options: [
      "It proves the user owns the AI",
      "It represents units of text processed by the model",
      "It stores the model password",
      "It verifies information as true"
    ],
    answer: 1
  },

  {
    question:
      "An AI hiring system consistently disadvantages a particular group because of patterns in its training data. Which AI problem does this illustrate?",
    options: [
      "Latency",
      "Bias",
      "Token limit",
      "Compression"
    ],
    answer: 1
  },

  {
    question:
      "Which statement is true?",
    options: [
      "Sophia was developed by Anthropic",
      "Deep Blue defeated Lee Sedol",
      "AlphaGo defeated Fan Hui before Lee Sedol",
      "Alan Turing coined the term Artificial Intelligence"
    ],
    answer: 2
  }

];


/* =====================================================
   2. GAME STATE
===================================================== */

let playerName = "";
let playerBatch = "";

let currentQuestion = 0;

let score = 0;
let correctAnswers = 0;

let startTime = 0;
let totalSeconds = 0;

let timerInterval = null;

let answerLocked = false;


/* =====================================================
   3. ELEMENTS
===================================================== */

const startScreen =
  document.getElementById("startScreen");

const quizScreen =
  document.getElementById("quizScreen");

const resultScreen =
  document.getElementById("resultScreen");

const leaderboardScreen =
  document.getElementById("leaderboardScreen");


const nameInput =
  document.getElementById("participantName");

const batchInput =
  document.getElementById("participantBatch");

const startError =
  document.getElementById("startError");

const startBtn =
  document.getElementById("startBtn");


const questionNumber =
  document.getElementById("questionNumber");

const liveScore =
  document.getElementById("liveScore");

const liveTimer =
  document.getElementById("liveTimer");

const progressPercent =
  document.getElementById("progressPercent");

const progressBar =
  document.getElementById("progressBar");

const questionLabel =
  document.getElementById("questionLabel");

const questionText =
  document.getElementById("questionText");

const optionsContainer =
  document.getElementById("optionsContainer");


/* =====================================================
   4. SCREEN CONTROL
===================================================== */

function showScreen(screen) {

  document
    .querySelectorAll(".screen")
    .forEach(function(item) {

      item.classList.remove("active");

    });

  screen.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =====================================================
   5. START RAPID FIRE
===================================================== */

startBtn.addEventListener("click", startRapidFire);


function startRapidFire() {

  const name =
    nameInput.value.trim();

  const batch =
    batchInput.value;


  if (!name || !batch) {

    startError.textContent =
      "Please enter your full name and select your batch.";

    startError.style.display =
      "block";

    return;
  }


  startError.style.display =
    "none";


  playerName = name;
  playerBatch = batch;

  currentQuestion = 0;

  score = 0;
  correctAnswers = 0;

  totalSeconds = 0;
  answerLocked = false;


  liveScore.textContent =
    "0 XP";

  liveTimer.textContent =
    "00:00";


  showScreen(quizScreen);

  startTimer();

  loadQuestion();

}


/* =====================================================
   6. CONTINUOUS STOPWATCH

   No 10-second countdown.
   Timer starts once and runs until Q20.
===================================================== */

function startTimer() {

  startTime = Date.now();


  timerInterval =
    setInterval(function() {

      totalSeconds =
        Math.floor(
          (Date.now() - startTime) / 1000
        );


      liveTimer.textContent =
        formatTime(totalSeconds);

    }, 250);

}


function stopTimer() {

  clearInterval(timerInterval);


  totalSeconds =
    Math.floor(
      (Date.now() - startTime) / 1000
    );

}


function formatTime(seconds) {

  const minutes =
    Math.floor(seconds / 60);

  const secs =
    seconds % 60;


  return (
    String(minutes).padStart(2, "0")
    +
    ":"
    +
    String(secs).padStart(2, "0")
  );

}


/* =====================================================
   7. LOAD QUESTION
===================================================== */

function loadQuestion() {

  answerLocked = false;


  const data =
    questions[currentQuestion];


  const number =
    currentQuestion + 1;


  questionNumber.textContent =
    number + " / " + questions.length;


  questionLabel.textContent =
    "QUESTION "
    +
    String(number).padStart(2, "0");


  questionText.textContent =
    data.question;


  optionsContainer.innerHTML =
    "";


  const letters =
    ["A", "B", "C", "D"];


  data.options.forEach(
    function(option, index) {

      const button =
        document.createElement("button");


      button.className =
        "option-btn";


      const letter =
        document.createElement("span");

      letter.className =
        "option-letter";

      letter.textContent =
        letters[index];


      const optionText =
        document.createElement("span");

      optionText.textContent =
        option;


      button.appendChild(letter);
      button.appendChild(optionText);


      button.addEventListener(
        "click",
        function() {

          submitAnswer(
            index,
            button
          );

        }
      );


      optionsContainer.appendChild(
        button
      );

    }
  );


  updateProgress();

}


/* =====================================================
   8. ANSWER SUBMISSION

   IMPORTANT:
   - One click only
   - No correct answer reveal
   - No wrong answer reveal
   - No Previous button
   - No Next button
   - Automatically advances
===================================================== */

function submitAnswer(
  selectedIndex,
  selectedButton
) {

  if (answerLocked) {
    return;
  }


  answerLocked = true;


  const allButtons =
    document.querySelectorAll(
      ".option-btn"
    );


  allButtons.forEach(
    function(button) {

      button.disabled = true;

    }
  );


  /*
     Only show that the participant
     clicked THIS option.

     We DO NOT show whether it was
     right or wrong.
  */

  selectedButton
    .classList.add("selected");


  const correctIndex =
    questions[currentQuestion].answer;


  if (
    selectedIndex ===
    correctIndex
  ) {

    score += 10;

    correctAnswers += 1;


    liveScore.textContent =
      score + " XP";

  }


  /*
     Small transition only.

     Then automatically
     move forward.
  */

  setTimeout(function() {

    currentQuestion += 1;


    if (
      currentQuestion <
      questions.length
    ) {

      loadQuestion();

    }

    else {

      finishRapidFire();

    }

  }, 220);

}


/* =====================================================
   9. PROGRESS
===================================================== */

function updateProgress() {

  const completed =
    currentQuestion + 1;


  const percentage =
    Math.round(
      (completed / questions.length)
      * 100
    );


  progressBar.style.width =
    percentage + "%";


  progressPercent.textContent =
    percentage + "%";

}


/* =====================================================
   10. FINISH RAPID FIRE
===================================================== */

function finishRapidFire() {

  stopTimer();


  const result = {

    id:
      createResultID(),

    name:
      playerName,

    batch:
      playerBatch,

    score:
      score,

    correct:
      correctAnswers,

    time:
      totalSeconds,

    completedAt:
      new Date().toISOString()

  };


  saveResult(result);


  const rank =
    getRankForResult(result.id);


  document
    .getElementById(
      "resultParticipantName"
    )
    .textContent =
      "Well Done, "
      +
      playerName
      +
      "!";


  document
    .getElementById(
      "finalScore"
    )
    .textContent =
      score
      +
      " / 200 XP";


  document
    .getElementById(
      "finalCorrect"
    )
    .textContent =
      correctAnswers
      +
      " / 20";


  document
    .getElementById(
      "finalTime"
    )
    .textContent =
      formatTime(totalSeconds);


  document
    .getElementById(
      "finalRank"
    )
    .textContent =
      "#"
      +
      rank;


  showScreen(resultScreen);

}


/* =====================================================
   11. UNIQUE RESULT ID
===================================================== */

function createResultID() {

  return (
    Date.now().toString(36)
    +
    "-"
    +
    Math.random()
      .toString(36)
      .substring(2, 9)
  );

}


/* =====================================================
   12. LOCAL DATABASE

   TESTING VERSION ONLY.

   Later this section will be replaced
   with the live shared database.
===================================================== */

const STORAGE_KEY =
  "phoenixRapidFireResults";


function getResults() {

  const stored =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!stored) {
    return [];
  }


  try {

    const parsed =
      JSON.parse(stored);


    return Array.isArray(parsed)
      ? parsed
      : [];

  }

  catch (error) {

    console.error(
      "Could not read leaderboard:",
      error
    );

    return [];

  }

}


/* =====================================================
   13. SAVE RESULT
===================================================== */

function saveResult(result) {

  let results =
    getResults();


  /*
     During local testing,
     same Name + Batch keeps
     only the latest attempt.

     This prevents accidental
     duplicate rows while testing.
  */

  results =
    results.filter(
      function(oldResult) {

        const sameName =
          oldResult.name
            .trim()
            .toLowerCase()
          ===
          result.name
            .trim()
            .toLowerCase();


        const sameBatch =
          String(oldResult.batch)
          ===
          String(result.batch);


        return !(
          sameName &&
          sameBatch
        );

      }
    );


  results.push(result);


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(results)
  );

}


/* =====================================================
   14. LEADERBOARD RANKING

   PRIMARY:
   Higher XP

   SECONDARY:
   Lower completion time

   This gives us a clear position when
   two participants have equal scores.
===================================================== */

function getRankedResults() {

  const results =
    getResults();


  results.sort(
    function(a, b) {

      /*
         First compare score.
      */

      if (
        b.score !== a.score
      ) {

        return b.score - a.score;

      }


      /*
         Equal score:
         faster participant ranks higher.
      */

      if (
        a.time !== b.time
      ) {

        return a.time - b.time;

      }


      /*
         Final deterministic fallback.
      */

      return (
        new Date(a.completedAt)
        -
        new Date(b.completedAt)
      );

    }
  );


  return results.map(
    function(result, index) {

      return {
        ...result,
        rank: index + 1
      };

    }
  );

}


/* =====================================================
   15. FIND CURRENT PLAYER RANK
===================================================== */

function getRankForResult(id) {

  const ranked =
    getRankedResults();


  const result =
    ranked.find(
      function(item) {

        return item.id === id;

      }
    );


  return result
    ? result.rank
    : "-";

}


/* =====================================================
   16. LEADERBOARD DISPLAY
===================================================== */

function renderLeaderboard() {

  const container =
    document.getElementById(
      "leaderboardRows"
    );


  const results =
    getRankedResults();


  container.innerHTML = "";


  if (
    results.length === 0
  ) {

    container.innerHTML =
      `
      <div class="empty-board">
        No Rapid Fire attempts yet.
      </div>
      `;

    return;

  }


  results.forEach(
    function(result) {

      const row =
        document.createElement("div");


      row.className =
        "leaderboard-row";


      /* RANK */

      const rankColumn =
        document.createElement("div");


      const badge =
        document.createElement("div");


      badge.className =
        "rank-badge";


      badge.textContent =
        result.rank;


      rankColumn.appendChild(
        badge
      );


      /* PARTICIPANT */

      const participantColumn =
        document.createElement("div");


      participantColumn.className =
        "participant-info";


      const participantName =
        document.createElement("strong");


      participantName.textContent =
        result.name;


      const batch =
        document.createElement("span");


      batch.textContent =
        "Batch "
        +
        result.batch;


      participantColumn.appendChild(
        participantName
      );


      participantColumn.appendChild(
        batch
      );


      /* SCORE */

      const scoreColumn =
        document.createElement("div");


      scoreColumn.innerHTML =
        "<strong>"
        +
        result.score
        +
        " XP</strong>";


      /* TIME */

      const timeColumn =
        document.createElement("div");


      timeColumn.textContent =
        formatTime(
          result.time
        );


      /* ADD EVERYTHING */

      row.appendChild(
        rankColumn
      );


      row.appendChild(
        participantColumn
      );


      row.appendChild(
        scoreColumn
      );


      row.appendChild(
        timeColumn
      );


      container.appendChild(
        row
      );

    }
  );

}


/* =====================================================
   17. LEADERBOARD BUTTON
===================================================== */

document
  .getElementById(
    "leaderboardBtn"
  )
  .addEventListener(
    "click",
    function() {

      renderLeaderboard();

      showScreen(
        leaderboardScreen
      );

    }
  );


/* =====================================================
   18. BACK TO RESULT
===================================================== */

document
  .getElementById(
    "backToResultBtn"
  )
  .addEventListener(
    "click",
    function() {

      showScreen(
        resultScreen
      );

    }
  );


/* =====================================================
   19. PREVENT ACCIDENTAL ENTER SUBMISSION
===================================================== */

nameInput.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      startRapidFire();

    }

  }
);


/* =====================================================
   END OF RAPID FIRE ENGINE
===================================================== */
