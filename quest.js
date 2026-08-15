/* =========================================================
   PHOENIX QUEST ENGINE
   quest.js

   CHUNK 1 / 4
   Participant Identity + Access System
========================================================= */

(function () {

  "use strict";


  /* =======================================================
     STORAGE KEYS
  ======================================================= */

  const PARTICIPANTS_KEY =
    "phoenixQuestParticipants";

  const ACTIVE_ID_KEY =
    "phoenixActiveId";

  const QUEST_RESULTS_KEY =
    "phoenixQuestResults";


  /* =======================================================
     BASIC HELPERS
  ======================================================= */

  function normalizeName(name) {

    return String(name || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  }


  function normalizeAccessId(id) {

    return String(id || "")
      .trim()
      .toUpperCase();

  }


  function safeParse(value, fallback) {

    if (!value) {
      return fallback;
    }

    try {

      return JSON.parse(value);

    }

    catch (error) {

      console.error(
        "Phoenix Quest storage error:",
        error
      );

      return fallback;

    }

  }


  /* =======================================================
     PARTICIPANT DATABASE
  ======================================================= */

  function getParticipants() {

    const stored =
      localStorage.getItem(
        PARTICIPANTS_KEY
      );


    const participants =
      safeParse(
        stored,
        {}
      );


    if (
      !participants ||
      typeof participants !== "object" ||
      Array.isArray(participants)
    ) {

      return {};

    }


    return participants;

  }


  function saveParticipants(
    participants
  ) {

    localStorage.setItem(
      PARTICIPANTS_KEY,
      JSON.stringify(
        participants
      )
    );

  }


  /* =======================================================
     ACCESS ID GENERATOR
  ======================================================= */

  function randomCharacters(
    length
  ) {

    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let output = "";


    for (
      let i = 0;
      i < length;
      i++
    ) {

      output +=
        characters.charAt(
          Math.floor(
            Math.random() *
            characters.length
          )
        );

    }


    return output;

  }


  function generateUniqueAccessId() {

    const participants =
      getParticipants();


    let accessId;


    do {

      accessId =
        "PHX-" +
        randomCharacters(6);

    }

    while (
      participants[accessId]
    );


    return accessId;

  }


  /* =======================================================
     FIND EXISTING PARTICIPANT BY NAME
  ======================================================= */

  function findParticipantByName(
    name
  ) {

    const normalized =
      normalizeName(name);


    const participants =
      getParticipants();


    const ids =
      Object.keys(participants);


    for (
      const id of ids
    ) {

      const participant =
        participants[id];


      if (
        normalizeName(
          participant.name
        )
        ===
        normalized
      ) {

        return participant;

      }

    }


    return null;

  }


  /* =======================================================
     CREATE NEW PARTICIPANT
  ======================================================= */

  function signUp(name) {

    const cleanName =
      String(name || "")
        .trim()
        .replace(/\s+/g, " ");


    if (
      cleanName.length < 2
    ) {

      return {
        success: false,
        message:
          "Please enter your full name."
      };

    }


    /*
      Duplicate-name protection.

      If this participant has already
      registered in this browser,
      a second ID will NOT be created.
    */

    const existing =
      findParticipantByName(
        cleanName
      );


    if (existing) {

      return {

        success: false,

        message:
          "You are already registered. Please use Sign In with your existing Phoenix Access ID."

      };

    }


    const accessId =
      generateUniqueAccessId();


    const participant = {

      accessId:
        accessId,

      name:
        cleanName,

      createdAt:
        new Date()
          .toISOString(),

      currentGate:
        1,

      questXP:
        0,

      completedGates:
        [],

      gateAttempts: {

        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0

      },

      gateXP: {

        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0

      },

      questCompleted:
        false,

      completedAt:
        null

    };


    const participants =
      getParticipants();


    participants[accessId] =
      participant;


    saveParticipants(
      participants
    );


    /*
      IMPORTANT:

      Participant becomes the ACTIVE
      Phoenix immediately.

      quest.html will read this ID
      automatically.

      It will NOT ask for the ID again.
    */

    localStorage.setItem(
      ACTIVE_ID_KEY,
      accessId
    );


    return {

      success: true,

      accessId:
        accessId,

      participant:
        participant

    };

  }


  /* =======================================================
     SIGN IN EXISTING PARTICIPANT
  ======================================================= */

  function signIn(accessId) {

    const cleanId =
      normalizeAccessId(
        accessId
      );


    if (!cleanId) {

      return {

        success: false,

        message:
          "Please enter your Phoenix Access ID."

      };

    }


    const participants =
      getParticipants();


    const participant =
      participants[cleanId];


    if (!participant) {

      return {

        success: false,

        message:
          "Phoenix Access ID not found. Check the ID and try again."

      };

    }


    /*
      This is the key fix.

      The verified ID is saved as
      the current active participant.
    */

    localStorage.setItem(
      ACTIVE_ID_KEY,
      cleanId
    );


    return {

      success: true,

      participant:
        participant,

      currentGate:
        participant.currentGate || 1

    };

  }


  /* =======================================================
     GET ACTIVE PARTICIPANT
  ======================================================= */

  function getActiveAccessId() {

    return normalizeAccessId(

      localStorage.getItem(
        ACTIVE_ID_KEY
      )

    );

  }


  function getActiveParticipant() {

    const accessId =
      getActiveAccessId();


    if (!accessId) {
      return null;
    }


    const participants =
      getParticipants();


    return (
      participants[accessId]
      ||
      null
    );

  }


  /* =======================================================
     SAVE ACTIVE PARTICIPANT
  ======================================================= */

  function saveActiveParticipant(
    participant
  ) {

    if (
      !participant ||
      !participant.accessId
    ) {

      return false;

    }


    const participants =
      getParticipants();


    participants[
      participant.accessId
    ] = participant;


    saveParticipants(
      participants
    );


    return true;

  }


  /* =======================================================
     LOG OUT / CLEAR ACTIVE SESSION

     Participant data remains saved.
     Only current session is cleared.
  ======================================================= */

  function signOut() {

    localStorage.removeItem(
      ACTIVE_ID_KEY
    );


    return true;

  }


  /* =======================================================
     TEMPORARY PUBLIC API

     More Quest methods will be added
     in Chunks 2, 3 and 4.
  ======================================================= */

  window.PhoenixQuest = {

    signUp:
      signUp,

    signIn:
      signIn,

    signOut:
      signOut,

    getActiveParticipant:
      getActiveParticipant,

    getActiveAccessId:
      getActiveAccessId,

    saveActiveParticipant:
      saveActiveParticipant,

    /* Internal helpers needed by
       later chunks */

    _getParticipants:
      getParticipants,

    _saveParticipants:
      saveParticipants,

    _keys: {

      participants:
        PARTICIPANTS_KEY,

      activeId:
        ACTIVE_ID_KEY,

      questResults:
        QUEST_RESULTS_KEY

    }

  };


/* ===== END QUEST.JS CHUNK 1 ===== */
 /* =========================================================
   QUEST.JS
   CHUNK 2 / 4

   Gate Data + Answer Matching + XP Logic
========================================================= */


/* =======================================================
   GATE DEFINITIONS
======================================================= */

  const QUEST_GATES = [

    {
      id: 1,

      title:
        "The Voice in Time",

      subtitle:
        "Listen carefully. The first key is hidden in a digital trail.",

      clue:
`A familiar journey holds a voice from another world.

Find the right moment.
Follow the machine.
Return with the name that spoke.`,

      answers: [
        "OPTIMUS PRIME"
      ]
    },


    {
      id: 2,

      title:
        "The Signature",

      subtitle:
        "Some clues are remembered, not searched.",

      clue:
`Every mentor leaves behind more than lessons.

One short phrase became a signature.
You have heard it before.

Bring the phrase back to the Gate.`,

      answers: [
        "MOJ KARO"
      ]
    },


    {
      id: 3,

      title:
        "The Law of Power",

      subtitle:
        "Books carry identities that do not depend on ratings.",

      clue:
`Power has rules. Exactly forty-eight of them.

Find the book written by the man
who turned those rules into a worldwide bestseller.

The title is not your key.
The author is not your key.

Ignore price, stars and reviews.

Find the Main Edition dated
20 November 2000.

Every edition carries a numerical identity.

Find its 13-digit identity.
Remove the hyphen.

That number is your third key.`,

      answers: [
        "9781861972781"
      ]
    },


    {
      id: 4,

      title:
        "The Digital Footprint",

      subtitle:
        "Creators leave trails even when they never draw a map.",

      clue:
`A creator leaves a trail,
though never on the ground.

Where reels and little squares
are gathered all around.

Find Shalini there,
but her name is not your key.

A trail beyond her profile
hides what you must see.

Three letters guard a doorway;
step beyond their wall.

Then seek the first creation —
the oldest one of all.

A legacy of a doctor waits
where the trail will end.

Its title is the password
that opens Gate Four, my friend.`,

      answers: [
        "DR ARADHANA LEGACY"
      ]
    },


    {
      id: 5,

      title:
        "The Place Beside the Proof",

      subtitle:
        "Sometimes the next answer lives in the real world.",

      clue:
`At the end of this journey,
a proof will bear a name.

A silent partner in the background
of the game.

Find where that name lives
in the real world, not online.

Then look around its neighbourhood
and follow one small sign.

Do not trust the stars,
for stars can rise and fall.

Seek instead the place
where borrowed pages call.

The nearest keeper of books
holds the fifth key.

Write its complete name
to set the next Gate free.`,

      answers: [
        "MANGLAM LIBRARY AJMER"
      ]
    },


    {
      id: 6,

      title:
        "The Machine That Talks Back",

      subtitle:
        "The outsider is hiding inside the numbers.",

      clue:
`Five names hide inside a storm of numbers.

Four obey the same law.
One does not.

Search engines may find pages,
but they cannot reason through the pattern for you.

Take the evidence to the machine
that talks back.

Ask it to discover the common rule
and identify the outsider.

The outsider's name
is your sixth key.

DATA:

VEGA     12   7   5   26
VEGA     18   4   9   31
VEGA     15  11   8   33
VEGA     21   6  10   38
VEGA     14   9   7   30
VEGA     17   8   6   36

LYRA     11  10   4   28
LYRA     16   5   7   30
LYRA     19   8  12   34
LYRA     13   9   5   30
LYRA     20   7  11   36
LYRA     15   6   8   28

SIRIUS   14   5   6   27
SIRIUS   22   9  13   40
SIRIUS   17   7   9   32
SIRIUS   12   8   4   28
SIRIUS   18  10  12   34
SIRIUS   16   9   7   34

NOVA     10  12   5   27
NOVA     15   8   6   32
NOVA     21   5  14   33
NOVA     13  11   9   28
NOVA     19   6  10   34
NOVA     16   7   5   34

ORION    12   6   7   24
ORION    18   9  11   35
ORION    14  10   8   31
ORION    20   7  12   36
ORION    15   9   6   34
ORION    17   5   9   31`,

      answers: [
        "ORION"
      ]
    },


    {
      id: 7,

      title:
        "The Machine Behind the Movie",

      subtitle:
        "Words can become moving frames.",

      clue:
`I have no camera,
yet I create a scene.

No actor stands before me,
yet faces can be seen.

A sentence is enough
to make my pictures move.

But finding me is only half
of what you must prove.

My home belongs to the company
whose name became a verb.

My name is something
water knows how to do.

Enter the studio.

Find the family of models
responsible for turning imagination
into moving pictures.

The three-letter name
of that family is your seventh key.`,

      answers: [
        "VEO"
      ]
    },


    {
      id: 8,

      title:
        "The Priceless Machine",

      subtitle:
        "Luxury is not the answer. The pattern is.",

      clue:
`I can travel faster
than most homes can move,

yet some homes cost less
than one of me.

I was built not merely to travel,
but to become a statement.

Find one of the world's
most expensive production cars.

Ignore its price.
Money changes.

Ignore its speed.
Records fall.

Find the number hidden in its name.

Then find the year
in which the company behind it was born.

Multiply the digits
of the number in its name.

Add the four digits
of the company's birth year individually.

The final result
is your eighth key.`,

      /*
        FINAL ANSWER TO BE VERIFIED
        BEFORE LIVE EVENT.

        Example:
        answers: ["42"]
      */

      answers: [
        "GATE8KEY"
      ]
    },


    {
      id: 9,

      title:
        "The Fresh Reel",

      subtitle:
        "The newest story may hide an older beginning.",

      clue:
`Yesterday I was anticipation.

Today I belong to the screen.

Find the film that arrived
closest to the day
India raised its flag
for the eightieth time.

Do not bring me its hero.

Do not bring me its rating.

Find the person
behind the camera.

Now travel backwards
through that person's journey.

Find their first feature film
as director.

The final word
of that film's title
is your ninth key.`,

      /*
        FINAL ANSWER TO BE VERIFIED
        FROM THE SELECTED 2026 FILM.
      */

      answers: [
        "GATE9KEY"
      ]
    },


    {
      id: 10,

      title:
        "The Cicada Tribute",

      subtitle:
        "The final Gate rewards those who understand how puzzles speak.",

      clue:
`The final Gate belongs
to an insect that once made
the Internet listen.

3301.

Find the mystery.

Study how one of its early doors
was opened through a classical cipher.

Do not merely discover the cipher.

Understand it.

Then apply that knowledge
to the Phoenix ciphertext
shown below.

PHOENIX CIPHERTEXT:
[FINAL CIPHERTEXT WILL BE INSERTED HERE]

The decoded phrase
is your Master Key.`,

      /*
        MASTER KEY WILL BE INSERTED
        WHEN THE FINAL CIPHER IS CREATED.
      */

      answers: [
        "MASTERKEY"
      ]
    }

  ];


/* =======================================================
   ANSWER NORMALIZATION
======================================================= */

  function normalizeAnswer(
    value
  ) {

    return String(value || "")

      .trim()

      .replace(/\s+/g, " ")

      .toUpperCase();

  }


  /*
    Slightly relaxed normalization
    only for punctuation.

    Capital / small letters do not matter.

    Example:

    Dr. Aradhana Legacy
    DR ARADHANA LEGACY

    both become equivalent.
  */

  function normalizeLooseAnswer(
    value
  ) {

    return normalizeAnswer(value)

      .replace(/[.,'"]/g, "")

      .replace(/\s+/g, " ")

      .trim();

  }


/* =======================================================
   GET GATE
======================================================= */

  function getGate(
    gateNumber
  ) {

    const number =
      Number(gateNumber);


    return (
      QUEST_GATES.find(
        function(gate) {

          return (
            gate.id === number
          );

        }
      )
      ||
      null
    );

  }


/* =======================================================
   ANSWER MATCHING
======================================================= */

  function isCorrectAnswer(
    gate,
    submittedAnswer
  ) {

    if (
      !gate ||
      !Array.isArray(gate.answers)
    ) {

      return false;

    }


    const submitted =
      normalizeLooseAnswer(
        submittedAnswer
      );


    return gate.answers.some(
      function(validAnswer) {

        return (

          normalizeLooseAnswer(
            validAnswer
          )
          ===
          submitted

        );

      }
    );

  }


/* =======================================================
   XP PER ATTEMPT
======================================================= */

  function calculateGateXP(
    attemptNumber
  ) {

    const attempt =
      Number(attemptNumber);


    if (
      attempt <= 1
    ) {

      return 30;

    }


    if (
      attempt === 2
    ) {

      return 25;

    }


    if (
      attempt === 3
    ) {

      return 20;

    }


    /*
      Fourth attempt and every
      attempt after that:

      Minimum 15 XP.
    */

    return 15;

  }


/* =======================================================
   ENSURE PARTICIPANT DATA STRUCTURE
======================================================= */

  function ensureParticipantStructure(
    participant
  ) {

    if (!participant) {
      return null;
    }


    if (
      !Number.isInteger(
        Number(
          participant.currentGate
        )
      )
    ) {

      participant.currentGate = 1;

    }


    participant.currentGate =
      Math.max(
        1,
        Math.min(
          10,
          Number(
            participant.currentGate
          )
        )
      );


    if (
      typeof participant.questXP
      !==
      "number"
    ) {

      participant.questXP = 0;

    }


    if (
      !Array.isArray(
        participant.completedGates
      )
    ) {

      participant.completedGates =
        [];

    }


    if (
      !participant.gateAttempts
      ||
      typeof participant.gateAttempts
      !==
      "object"
    ) {

      participant.gateAttempts =
        {};

    }


    if (
      !participant.gateXP
      ||
      typeof participant.gateXP
      !==
      "object"
    ) {

      participant.gateXP =
        {};

    }


    for (
      let gate = 1;
      gate <= 10;
      gate++
    ) {

      if (
        typeof participant
          .gateAttempts[gate]
        !==
        "number"
      ) {

        participant
          .gateAttempts[gate]
          = 0;

      }


      if (
        typeof participant
          .gateXP[gate]
        !==
        "number"
      ) {

        participant
          .gateXP[gate]
          = 0;

      }

    }


    if (
      typeof participant.questCompleted
      !==
      "boolean"
    ) {

      participant.questCompleted =
        false;

    }


    return participant;

  }


/* =======================================================
   DOM HELPER
======================================================= */

  function getElement(
    id
  ) {

    return document
      .getElementById(
        id
      );

  }


/* =======================================================
   UPDATE PLAYER BAR
======================================================= */

  function renderPlayerBar(
    participant
  ) {

    const nameElement =
      getElement(
        "playerName"
      );


    const xpElement =
      getElement(
        "playerXP"
      );


    if (nameElement) {

      nameElement.textContent =
        participant.name;

    }


    if (xpElement) {

      xpElement.textContent =
        participant.questXP
        +
        " XP";

    }

  }


/* =======================================================
   UPDATE 10-GATE PROGRESS BAR
======================================================= */

  function renderGateProgress(
    participant
  ) {

    const progress =
      getElement(
        "gateProgress"
      );


    if (!progress) {
      return;
    }


    const dots =
      progress
        .querySelectorAll(
          ".gate-dot"
        );


    dots.forEach(
      function(dot, index) {

        const gateNumber =
          index + 1;


        dot.classList.remove(
          "done",
          "current"
        );


        if (
          participant
            .completedGates
            .includes(
              gateNumber
            )
        ) {

          dot.classList.add(
            "done"
          );

        }


        else if (
          gateNumber ===
          participant.currentGate
        ) {

          dot.classList.add(
            "current"
          );

        }

      }
    );

  }


/* =======================================================
   RENDER CURRENT GATE
======================================================= */

  function renderCurrentGate(
    participant
  ) {

    const gate =
      getGate(
        participant.currentGate
      );


    if (!gate) {
      return false;
    }


    const numberElement =
      getElement(
        "gateNumber"
      );


    const titleElement =
      getElement(
        "gateTitle"
      );


    const subtitleElement =
      getElement(
        "gateSubtitle"
      );


    const clueElement =
      getElement(
        "gateClue"
      );


    const answerInput =
      getElement(
        "gateAnswer"
      );


    const messageElement =
      getElement(
        "gateMessage"
      );


    if (numberElement) {

      numberElement.textContent =
        "GATE "
        +
        String(
          gate.id
        ).padStart(
          2,
          "0"
        )
        +
        " / 10";

    }


    if (titleElement) {

      titleElement.textContent =
        gate.title;

    }


    if (subtitleElement) {

      subtitleElement.textContent =
        gate.subtitle;

    }


    if (clueElement) {

      clueElement.textContent =
        gate.clue;

    }


    if (answerInput) {

      answerInput.value =
        "";

      answerInput.type =
        "password";

      answerInput
        .classList
        .remove(
          "error"
        );

    }


    if (messageElement) {

      messageElement.textContent =
        "";

      messageElement.className =
        "gate-message";

    }


    renderPlayerBar(
      participant
    );


    renderGateProgress(
      participant
    );


    return true;

  }


/* =======================================================
   EXPOSE INTERNAL METHODS FOR NEXT CHUNKS
======================================================= */

  PhoenixQuest._gates =
    QUEST_GATES;


  PhoenixQuest._getGate =
    getGate;


  PhoenixQuest._isCorrectAnswer =
    isCorrectAnswer;


  PhoenixQuest._calculateGateXP =
    calculateGateXP;


  PhoenixQuest._ensureParticipantStructure =
    ensureParticipantStructure;


  PhoenixQuest._renderCurrentGate =
    renderCurrentGate;


  PhoenixQuest._renderPlayerBar =
    renderPlayerBar;


  PhoenixQuest._renderGateProgress =
    renderGateProgress;


/* ===== END QUEST.JS CHUNK 2 ===== */
 /* =========================================================
   QUEST.JS
   CHUNK 3 / 4

   Quest Loading + Gate Submission + Auto Progress
========================================================= */


/* =======================================================
   LOAD QUEST PAGE

   IMPORTANT:
   NO ACCESS ID IS ASKED HERE.

   quest.html automatically reads
   phoenixActiveId saved during Sign Up / Sign In.
======================================================= */

  function loadQuestPage() {

    const loadingElement =
      document.getElementById(
        "questLoading"
      );


    const gateCard =
      document.getElementById(
        "gateCard"
      );


    /*
      Get current active participant
      saved in Chunk 1.
    */

    let participant =
      PhoenixQuest
        .getActiveParticipant();


    /*
      No active ID?

      Participant must go back
      to Access Portal.
    */

    if (!participant) {

      if (loadingElement) {

        loadingElement.textContent =
          "No active Phoenix identity found. Redirecting to Access Portal...";

      }


      setTimeout(
        function() {

          window.location.href =
            "quest-access.html";

        },
        700
      );


      return;

    }


    /*
      Repair older participant records
      if structure changed.
    */

    participant =
      PhoenixQuest
        ._ensureParticipantStructure(
          participant
        );


    PhoenixQuest
      .saveActiveParticipant(
        participant
      );


    /*
      Participant already completed
      all 10 Gates.
    */

    if (
      participant.questCompleted
      === true
    ) {

      if (
        typeof PhoenixQuest
          ._showQuestComplete
        ===
        "function"
      ) {

        PhoenixQuest
          ._showQuestComplete(
            participant
          );

      }

      else {

        if (loadingElement) {

          loadingElement.textContent =
            "Phoenix Quest already completed.";

        }

      }


      return;

    }


    /*
      Hide verification text
      and show Gate UI.
    */

    if (loadingElement) {

      loadingElement.style.display =
        "none";

    }


    if (gateCard) {

      gateCard.style.display =
        "block";

    }


    /*
      Render participant's saved Gate.
    */

    PhoenixQuest
      ._renderCurrentGate(
        participant
      );

  }


/* =======================================================
   WRONG ANSWER EFFECT
======================================================= */

  function showWrongAnswer(
    message
  ) {

    const answerInput =
      document.getElementById(
        "gateAnswer"
      );


    const messageElement =
      document.getElementById(
        "gateMessage"
      );


    if (messageElement) {

      messageElement.textContent =
        message
        ||
        "Incorrect key. Try again.";


      messageElement.className =
        "gate-message error";

    }


    if (answerInput) {

      /*
        Restart shake animation
        even on repeated wrong attempts.
      */

      answerInput
        .classList
        .remove(
          "error"
        );


      void answerInput.offsetWidth;


      answerInput
        .classList
        .add(
          "error"
        );


      setTimeout(
        function() {

          answerInput
            .classList
            .remove(
              "error"
            );

        },
        450
      );

    }

  }


/* =======================================================
   CORRECT ANSWER MESSAGE
======================================================= */

  function showCorrectAnswer(
    xp
  ) {

    const messageElement =
      document.getElementById(
        "gateMessage"
      );


    if (!messageElement) {
      return;
    }


    messageElement.textContent =
      "Gate unlocked. +"
      +
      xp
      +
      " XP";


    messageElement.className =
      "gate-message success";

  }


/* =======================================================
   DISABLE / ENABLE ANSWER CONTROLS
======================================================= */

  function setGateControlsLocked(
    locked
  ) {

    const input =
      document.getElementById(
        "gateAnswer"
      );


    const button =
      document.getElementById(
        "unlockGateBtn"
      );


    if (input) {

      input.disabled =
        Boolean(locked);

    }


    if (button) {

      button.disabled =
        Boolean(locked);


      button.style.opacity =
        locked
        ? "0.65"
        : "1";


      button.style.cursor =
        locked
        ? "default"
        : "pointer";

    }

  }


/* =======================================================
   SUBMIT GATE ANSWER
======================================================= */

  function submitGateAnswer(
    submittedAnswer
  ) {

    let participant =
      PhoenixQuest
        .getActiveParticipant();


    /*
      Session vanished somehow.
    */

    if (!participant) {

      window.location.href =
        "quest-access.html";

      return {
        success: false
      };

    }


    participant =
      PhoenixQuest
        ._ensureParticipantStructure(
          participant
        );


    /*
      Prevent answers after
      Quest completion.
    */

    if (
      participant.questCompleted
      === true
    ) {

      return {
        success: false,
        message:
          "Quest already completed."
      };

    }


    const currentGate =
      Number(
        participant.currentGate
      );


    const gate =
      PhoenixQuest
        ._getGate(
          currentGate
        );


    if (!gate) {

      return {
        success: false,
        message:
          "Gate could not be loaded."
      };

    }


    /*
      Increase attempt BEFORE
      checking correctness.

      Every submitted answer counts.
    */

    participant
      .gateAttempts[currentGate]
      += 1;


    const attemptNumber =
      participant
        .gateAttempts[currentGate];


    /*
      Save attempt immediately.

      Even wrong attempts survive
      refresh / leaving the page.
    */

    PhoenixQuest
      .saveActiveParticipant(
        participant
      );


    const correct =
      PhoenixQuest
        ._isCorrectAnswer(
          gate,
          submittedAnswer
        );


    /* ===================================================
       WRONG
    =================================================== */

    if (!correct) {

      showWrongAnswer(
        "Incorrect key • Attempt "
        +
        attemptNumber
      );


      return {

        success: false,

        attempt:
          attemptNumber

      };

    }


    /* ===================================================
       CORRECT
    =================================================== */

    const earnedXP =
      PhoenixQuest
        ._calculateGateXP(
          attemptNumber
        );


    /*
      A Gate can only award XP once.

      This prevents refresh tricks
      or duplicate submissions.
    */

    const alreadyCompleted =
      participant
        .completedGates
        .includes(
          currentGate
        );


    if (!alreadyCompleted) {

      participant
        .completedGates
        .push(
          currentGate
        );


      participant
        .gateXP[currentGate]
        =
        earnedXP;


      participant.questXP +=
        earnedXP;

    }


    /*
      Sort completed Gates
      for clean storage.
    */

    participant
      .completedGates
      .sort(
        function(a, b) {

          return a - b;

        }
      );


    showCorrectAnswer(
      earnedXP
    );


    setGateControlsLocked(
      true
    );


    PhoenixQuest
      ._renderPlayerBar(
        participant
      );


    PhoenixQuest
      ._renderGateProgress(
        participant
      );


    /* ===================================================
       GATES 1–9

       Automatically move to next Gate.
    =================================================== */

    if (
      currentGate < 10
    ) {

      participant.currentGate =
        currentGate + 1;


      PhoenixQuest
        .saveActiveParticipant(
          participant
        );


      setTimeout(
        function() {

          setGateControlsLocked(
            false
          );


          PhoenixQuest
            ._renderCurrentGate(
              participant
            );


          /*
            Put cursor straight
            into next Gate answer field.
          */

          const nextInput =
            document.getElementById(
              "gateAnswer"
            );


          if (nextInput) {

            nextInput.focus();

          }

        },
        850
      );


      return {

        success: true,

        xp:
          earnedXP,

        nextGate:
          participant.currentGate

      };

    }


    /* ===================================================
       GATE 10

       Quest completion is handled
       by Chunk 4.
    =================================================== */

    participant.questCompleted =
      true;


    participant.completedAt =
      new Date()
        .toISOString();


    PhoenixQuest
      .saveActiveParticipant(
        participant
      );


    setTimeout(
      function() {

        if (
          typeof PhoenixQuest
            ._completeQuest
          ===
          "function"
        ) {

          PhoenixQuest
            ._completeQuest(
              participant
            );

        }

      },
      900
    );


    return {

      success: true,

      completed: true,

      xp:
        earnedXP

    };

  }


/* =======================================================
   REFRESH CURRENT GATE
======================================================= */

  function refreshQuest() {

    let participant =
      PhoenixQuest
        .getActiveParticipant();


    if (!participant) {

      window.location.href =
        "quest-access.html";

      return;

    }


    participant =
      PhoenixQuest
        ._ensureParticipantStructure(
          participant
        );


    PhoenixQuest
      ._renderCurrentGate(
        participant
      );

  }


/* =======================================================
   ADD CHUNK 3 FUNCTIONS TO PUBLIC API
======================================================= */

  PhoenixQuest.loadQuestPage =
    loadQuestPage;


  PhoenixQuest.submitGateAnswer =
    submitGateAnswer;


  PhoenixQuest.refreshQuest =
    refreshQuest;


  PhoenixQuest._showWrongAnswer =
    showWrongAnswer;


  PhoenixQuest._showCorrectAnswer =
    showCorrectAnswer;


  PhoenixQuest._setGateControlsLocked =
    setGateControlsLocked;


/* ===== END QUEST.JS CHUNK 3 ===== */
 /* =========================================================
   QUEST.JS
   CHUNK 4 / 4

   Quest Completion + Result Saving
   + Phoenix Protocol Unlock
========================================================= */


/* =======================================================
   GET QUEST RESULTS
======================================================= */

  function getQuestResults() {

    const key =
      PhoenixQuest
        ._keys
        .questResults;


    const stored =
      localStorage.getItem(
        key
      );


    if (!stored) {
      return [];
    }


    try {

      const data =
        JSON.parse(
          stored
        );


      return Array.isArray(data)
        ? data
        : [];

    }

    catch (error) {

      console.error(
        "Unable to read Phoenix Quest results:",
        error
      );


      return [];

    }

  }


/* =======================================================
   SAVE QUEST RESULTS
======================================================= */

  function saveQuestResults(
    results
  ) {

    localStorage.setItem(

      PhoenixQuest
        ._keys
        .questResults,

      JSON.stringify(
        results
      )

    );

  }


/* =======================================================
   SAVE COMPLETED PARTICIPANT

   One Access ID = one final leaderboard record.
======================================================= */

  function saveCompletedResult(
    participant
  ) {

    let results =
      getQuestResults();


    /*
      Remove previous record for
      same Phoenix Access ID.

      This prevents duplicate
      leaderboard entries.
    */

    results =
      results.filter(
        function(item) {

          return (
            item.accessId
            !==
            participant.accessId
          );

        }
      );


    const result = {

      accessId:
        participant.accessId,

      name:
        participant.name,

      /*
        For now the participant's
        displayed Phoenix identity
        is based on their name.

        We can later replace this
        with a dedicated Code Name
        system without changing
        the Quest engine.
      */

      codeName:
        participant.name,

      score:
        Number(
          participant.questXP
        ) || 0,

      completedGates:
        Array.isArray(
          participant.completedGates
        )
        ?
        participant.completedGates.length
        :
        10,

      completed:
        true,

      status:
        "completed",

      completedAt:
        participant.completedAt
        ||
        new Date()
          .toISOString()

    };


    results.push(
      result
    );


    saveQuestResults(
      results
    );


    return result;

  }


/* =======================================================
   COMPLETION SCREEN CSS
======================================================= */

  function injectCompletionStyles() {

    if (
      document.getElementById(
        "phoenixCompletionStyles"
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "phoenixCompletionStyles";


    style.textContent = `

      .phoenix-complete-overlay{

        position:fixed;

        inset:0;

        z-index:9999;

        overflow-y:auto;

        display:flex;

        align-items:center;

        justify-content:center;

        padding:24px;

        background:

          radial-gradient(
            circle at 50% 20%,
            rgba(255,100,39,.22),
            transparent 32%
          ),

          #02060c;

        color:#fff;

        animation:
          phoenixFadeIn
          .6s ease;

      }


      @keyframes phoenixFadeIn{

        from{
          opacity:0;
        }

        to{
          opacity:1;
        }

      }


      .phoenix-complete-card{

        width:min(620px,100%);

        text-align:center;

        padding:
          45px 28px;

        border:

          1px solid
          rgba(255,255,255,.11);

        border-radius:30px;

        background:

          rgba(12,23,40,.94);

        box-shadow:

          0 35px 100px
          rgba(0,0,0,.55);

      }


      .phoenix-fire{

        width:90px;

        height:90px;

        margin:
          0 auto 20px;

        display:grid;

        place-items:center;

        border-radius:50%;

        background:

          linear-gradient(
            135deg,
            #ff6427,
            #f4b942
          );

        font-size:42px;

        box-shadow:

          0 0 50px
          rgba(255,100,39,.28);

      }


      .phoenix-complete-label{

        display:inline-block;

        padding:
          7px 11px;

        border-radius:50px;

        background:

          rgba(255,100,39,.10);

        color:#ff8b5d;

        font-size:10px;

        font-weight:900;

        letter-spacing:2px;

        margin-bottom:14px;

      }


      .phoenix-complete-card h1{

        font-size:

          clamp(
            35px,
            9vw,
            60px
          );

        line-height:.95;

        margin-bottom:15px;

      }


      .phoenix-complete-card h1 span{

        color:#ff6427;

      }


      .phoenix-complete-message{

        max-width:500px;

        margin:
          0 auto 25px;

        color:#9da9b8;

        font-size:14px;

      }


      .phoenix-result-grid{

        display:grid;

        grid-template-columns:
          repeat(3,1fr);

        gap:10px;

        margin-bottom:25px;

      }


      .phoenix-result-box{

        padding:
          16px 8px;

        border-radius:15px;

        background:

          rgba(255,255,255,.05);

        border:

          1px solid
          rgba(255,255,255,.07);

      }


      .phoenix-result-box span{

        display:block;

        color:#8996a7;

        font-size:9px;

        font-weight:900;

        letter-spacing:1px;

        text-transform:uppercase;

        margin-bottom:4px;

      }


      .phoenix-result-box strong{

        display:block;

        color:#fff;

        font-size:18px;

      }


      .phoenix-result-box
      strong.gold{

        color:#f4b942;

      }


      .protocol-unlocked{

        margin-top:18px;

        padding:20px;

        border-radius:17px;

        background:

          linear-gradient(
            145deg,
            rgba(255,100,39,.16),
            rgba(244,185,66,.06)
          );

        border:

          1px solid
          rgba(255,100,39,.20);

      }


      .protocol-unlocked small{

        display:block;

        color:#ff8b5d;

        font-size:10px;

        font-weight:900;

        letter-spacing:1.5px;

        margin-bottom:5px;

      }


      .protocol-unlocked h2{

        font-size:22px;

        margin-bottom:7px;

      }


      .protocol-unlocked p{

        color:#9da9b8;

        font-size:12px;

        margin-bottom:16px;

      }


      .protocol-button{

        width:100%;

        display:flex;

        align-items:center;

        justify-content:center;

        min-height:52px;

        padding:14px;

        border-radius:13px;

        background:

          linear-gradient(
            135deg,
            #ff6427,
            #d94a14
          );

        color:white;

        text-decoration:none;

        font-weight:900;

      }


      .quest-home-button{

        display:inline-block;

        margin-top:17px;

        color:#8895a5;

        text-decoration:none;

        font-size:12px;

        font-weight:800;

      }


      @media(max-width:500px){

        .phoenix-complete-overlay{

          padding:15px;

          align-items:flex-start;

        }


        .phoenix-complete-card{

          margin:
            20px 0;

          padding:
            34px 18px;

        }


        .phoenix-result-grid{

          grid-template-columns:
            1fr 1fr;

        }


        .phoenix-result-box:last-child{

          grid-column:
            1 / -1;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


/* =======================================================
   SHOW FINAL COMPLETION SCREEN
======================================================= */

  function showQuestComplete(
    participant
  ) {

    if (!participant) {
      return;
    }


    injectCompletionStyles();


    /*
      Remove an older completion
      screen if function is called twice.
    */

    const oldOverlay =
      document.getElementById(
        "phoenixCompleteOverlay"
      );


    if (oldOverlay) {

      oldOverlay.remove();

    }


    const overlay =
      document.createElement(
        "div"
      );


    overlay.id =
      "phoenixCompleteOverlay";


    overlay.className =
      "phoenix-complete-overlay";


    /*
      Build elements safely
      rather than injecting participant
      name directly as HTML.
    */


    const card =
      document.createElement(
        "div"
      );


    card.className =
      "phoenix-complete-card";



    /* FIRE ICON */

    const fire =
      document.createElement(
        "div"
      );


    fire.className =
      "phoenix-fire";


    fire.textContent =
      "🔥";


    card.appendChild(
      fire
    );



    /* LABEL */

    const label =
      document.createElement(
        "div"
      );


    label.className =
      "phoenix-complete-label";


    label.textContent =
      "10 / 10 GATES CLEARED";


    card.appendChild(
      label
    );



    /* TITLE */

    const title =
      document.createElement(
        "h1"
      );


    title.appendChild(
      document.createTextNode(
        "YOU "
      )
    );


    const rose =
      document.createElement(
        "span"
      );


    rose.textContent =
      "ROSE.";


    title.appendChild(
      rose
    );


    card.appendChild(
      title
    );



    /* MESSAGE */

    const message =
      document.createElement(
        "p"
      );


    message.className =
      "phoenix-complete-message";


    message.textContent =
      "Congratulations, "
      +
      participant.name
      +
      ". You have cleared all ten Phoenix Gates. The search is over. Now creation begins.";


    card.appendChild(
      message
    );



    /* RESULT GRID */

    const resultGrid =
      document.createElement(
        "div"
      );


    resultGrid.className =
      "phoenix-result-grid";



    /*
      NAME
    */

    const nameBox =
      document.createElement(
        "div"
      );


    nameBox.className =
      "phoenix-result-box";


    nameBox.innerHTML =
      "<span>PHOENIX</span>";


    const nameValue =
      document.createElement(
        "strong"
      );


    nameValue.textContent =
      participant.name;


    nameBox.appendChild(
      nameValue
    );



    /*
      XP
    */

    const xpBox =
      document.createElement(
        "div"
      );


    xpBox.className =
      "phoenix-result-box";


    xpBox.innerHTML =
      "<span>QUEST XP</span>";


    const xpValue =
      document.createElement(
        "strong"
      );


    xpValue.className =
      "gold";


    xpValue.textContent =
      participant.questXP
      +
      " XP";


    xpBox.appendChild(
      xpValue
    );



    /*
      GATES
    */

    const gatesBox =
      document.createElement(
        "div"
      );


    gatesBox.className =
      "phoenix-result-box";


    gatesBox.innerHTML =
      "<span>GATES</span>";


    const gatesValue =
      document.createElement(
        "strong"
      );


    gatesValue.textContent =
      "10 / 10";


    gatesBox.appendChild(
      gatesValue
    );



    resultGrid.appendChild(
      nameBox
    );


    resultGrid.appendChild(
      xpBox
    );


    resultGrid.appendChild(
      gatesBox
    );


    card.appendChild(
      resultGrid
    );



    /* =========================================
       PHOENIX PROTOCOL
    ========================================== */

    const protocol =
      document.createElement(
        "div"
      );


    protocol.className =
      "protocol-unlocked";


    const protocolLabel =
      document.createElement(
        "small"
      );


    protocolLabel.textContent =
      "PHOENIX PROTOCOL UNLOCKED";


    const protocolTitle =
      document.createElement(
        "h2"
      );


    protocolTitle.textContent =
      "The Final Build Awaits";


    const protocolText =
      document.createElement(
        "p"
      );


    protocolText.textContent =
      "You have learned to search. Now prove that you can create.";


    const protocolButton =
      document.createElement(
        "a"
      );


    protocolButton.href =
      "phoenix-protocol.html";


    protocolButton.className =
      "protocol-button";


    protocolButton.textContent =
      "ENTER PHOENIX PROTOCOL →";


    protocol.appendChild(
      protocolLabel
    );


    protocol.appendChild(
      protocolTitle
    );


    protocol.appendChild(
      protocolText
    );


    protocol.appendChild(
      protocolButton
    );


    card.appendChild(
      protocol
    );



    /* HOME */

    const homeButton =
      document.createElement(
        "a"
      );


    homeButton.href =
      "index.html";


    homeButton.className =
      "quest-home-button";


    homeButton.textContent =
      "← Return to Hackathon Home";


    card.appendChild(
      homeButton
    );


    overlay.appendChild(
      card
    );


    document.body.appendChild(
      overlay
    );


    /*
      Prevent page underneath
      from scrolling.
    */

    document.body.style.overflow =
      "hidden";

  }


/* =======================================================
   COMPLETE QUEST
======================================================= */

  function completeQuest(
    participant
  ) {

    if (!participant) {
      return;
    }


    participant.questCompleted =
      true;


    if (
      !participant.completedAt
    ) {

      participant.completedAt =
        new Date()
          .toISOString();

    }


    PhoenixQuest
      .saveActiveParticipant(
        participant
      );


    /*
      Create / update final Quest
      leaderboard result.
    */

    saveCompletedResult(
      participant
    );


    /*
      Hide normal Gate UI.
    */

    const gateCard =
      document.getElementById(
        "gateCard"
      );


    const loading =
      document.getElementById(
        "questLoading"
      );


    if (gateCard) {

      gateCard.style.display =
        "none";

    }


    if (loading) {

      loading.style.display =
        "none";

    }


    showQuestComplete(
      participant
    );

  }


/* =======================================================
   GET QUEST SUMMARY
======================================================= */

  function getQuestSummary() {

    const participant =
      PhoenixQuest
        .getActiveParticipant();


    if (!participant) {

      return null;

    }


    return {

      accessId:
        participant.accessId,

      name:
        participant.name,

      currentGate:
        participant.currentGate,

      questXP:
        participant.questXP,

      completedGates:
        participant.completedGates,

      questCompleted:
        participant.questCompleted,

      completedAt:
        participant.completedAt

    };

  }


/* =======================================================
   SECURITY / SESSION HELPER

   This does NOT delete participant progress.
======================================================= */

  function exitQuest() {

    /*
      We intentionally keep
      phoenixActiveId saved.

      This means refreshing or returning
      does not force a second login
      during the same browser session.

      Returning participants can still
      manually use Sign In later.
    */

    window.location.href =
      "index.html";

  }


/* =======================================================
   PUBLIC METHODS
======================================================= */

  PhoenixQuest._completeQuest =
    completeQuest;


  PhoenixQuest._showQuestComplete =
    showQuestComplete;


  PhoenixQuest.getQuestResults =
    getQuestResults;


  PhoenixQuest.getQuestSummary =
    getQuestSummary;


  PhoenixQuest.exitQuest =
    exitQuest;


/* =======================================================
   FINAL ENGINE CHECK
======================================================= */

  PhoenixQuest.version =
    "1.0.0";


  console.log(
    "Phoenix Quest Engine loaded successfully."
  );


/* =======================================================
   CLOSE MAIN WRAPPER

   IMPORTANT:
   This closes the
   (function () { ... })();
   started in Chunk 1.
======================================================= */

})();

/* ===== END QUEST.JS CHUNK 4 ===== */
