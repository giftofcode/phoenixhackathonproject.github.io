<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <meta
    name="theme-color"
    content="#08101d"
  >

  <title>
    Phoenix Quest | Access Portal
  </title>

  <!-- Quest CSS -->
  <link
    rel="stylesheet"
    href="quest.css"
  >
</head>


<body class="access-page">


<!-- =========================================
     HEADER
========================================= -->

<header class="quest-header">

  <div class="quest-nav">

    <a
      href="index.html"
      class="quest-brand"
    >

      <div class="quest-logo">
        P
      </div>

      <div class="brand-text">

        <strong>
          PHOENIX QUEST
        </strong>

        <span>
          AI Hackathon
        </span>

      </div>

    </a>


    <a
      href="index.html"
      class="home-link"
    >
      Home
    </a>

  </div>

</header>



<!-- =========================================
     MAIN
========================================= -->

<main class="access-main">


  <section class="access-wrapper">


    <!-- LEFT / HERO -->

    <div class="access-hero">


      <span class="eyebrow">
        THE PHOENIX QUEST
      </span>


      <h1>
        ENTER THE
        <span>10 GATES.</span>
      </h1>


      <p class="hero-description">

        Ten gates stand between you and
        the Final Quest.

        Every solved gate takes you
        deeper into the challenge.

      </p>


      <div class="gate-preview">

        <span>01</span>
        <span>02</span>
        <span>03</span>
        <span>04</span>
        <span>05</span>
        <span>06</span>
        <span>07</span>
        <span>08</span>
        <span>09</span>
        <span>10</span>

      </div>


      <div class="hero-rule">

        <strong>
          Your progress is remembered.
        </strong>

        <p>
          If you leave the Quest and return later,
          sign in using the same Phoenix Access ID
          to continue from your last unlocked gate.
        </p>

      </div>

    </div>



    <!-- RIGHT / ACCESS PANEL -->

    <div class="access-panel">


      <!-- TAB BUTTONS -->

      <div class="access-tabs">

        <button
          type="button"
          id="signUpTab"
          class="access-tab active"
        >
          SIGN UP
        </button>


        <button
          type="button"
          id="signInTab"
          class="access-tab"
        >
          SIGN IN
        </button>

      </div>



      <!-- =====================================
           SIGN UP
      ====================================== -->

      <section
        id="signUpSection"
        class="access-section active"
      >


        <div class="section-heading">

          <span>
            NEW PARTICIPANT
          </span>

          <h2>
            Create Your Quest Identity
          </h2>

          <p>
            Enter your details once.
            A unique Phoenix Access ID
            will be generated for you.
          </p>

        </div>



        <!-- NAME -->

        <div class="form-group">

          <label for="questName">
            Full Name
          </label>

          <input
            type="text"
            id="questName"
            placeholder="Enter your full name"
            autocomplete="name"
            maxlength="60"
          >

        </div>



        <!-- BATCH -->

        <div class="form-group">

          <label for="questBatch">
            Batch
          </label>

          <select id="questBatch">

            <option value="">
              Select your batch
            </option>

            <option value="1">
              Batch 1
            </option>

            <option value="2">
              Batch 2
            </option>

            <option value="3">
              Batch 3
            </option>

            <option value="4">
              Batch 4
            </option>

          </select>

        </div>



        <!-- SIGNUP ERROR -->

        <div
          id="signUpError"
          class="form-message error-message"
        ></div>



        <button
          type="button"
          id="createAccessBtn"
          class="quest-primary-btn"
        >

          CREATE PHOENIX ID

        </button>



        <p class="access-help">

          Already entered the Quest?

          <button
            type="button"
            id="switchToSignIn"
            class="text-button"
          >
            Sign In
          </button>

        </p>


      </section>



      <!-- =====================================
           SIGN IN
      ====================================== -->

      <section
        id="signInSection"
        class="access-section"
      >


        <div class="section-heading">

          <span>
            RETURNING PARTICIPANT
          </span>

          <h2>
            Continue Your Quest
          </h2>

          <p>
            Enter your existing Phoenix Access ID.
            You will return to your last unlocked gate.
          </p>

        </div>



        <!-- ACCESS ID -->

        <div class="form-group">

          <label for="accessIdInput">
            Phoenix Access ID
          </label>


          <div class="password-field">

            <input
              type="password"
              id="accessIdInput"
              placeholder="Enter your Phoenix Access ID"
              autocomplete="off"
              maxlength="40"
            >


            <button
              type="button"
              id="toggleAccessId"
              class="visibility-btn"
              aria-label="Show Phoenix Access ID"
            >
              👁
            </button>

          </div>

        </div>



        <!-- SIGNIN ERROR -->

        <div
          id="signInError"
          class="form-message error-message"
        ></div>



        <button
          type="button"
          id="signInBtn"
          class="quest-primary-btn"
        >

          ENTER THE QUEST

        </button>



        <p class="access-help">

          First time here?

          <button
            type="button"
            id="switchToSignUp"
            class="text-button"
          >
            Sign Up
          </button>

        </p>


      </section>


    </div>

  </section>

</main>



<!-- =========================================
     NEW ID SUCCESS MODAL
========================================= -->

<div
  id="idModal"
  class="modal-overlay"
  aria-hidden="true"
>


  <div class="id-modal">


    <div class="id-symbol">
      🔥
    </div>


    <span class="modal-label">
      IDENTITY CREATED
    </span>


    <h2>
      Welcome,
      <span id="createdPlayerName">
        Phoenix
      </span>.
    </h2>


    <p class="modal-intro">

      This is your permanent
      Phoenix Access ID.

    </p>



    <div class="generated-id-box">

      <span>
        PHOENIX ACCESS ID
      </span>


      <strong id="generatedAccessId">
        PHX-XXXXXX
      </strong>

    </div>



    <div class="important-id-note">

      <strong>
        ⚠ SAVE THIS ID
      </strong>

      <p>
        You will need the same Access ID
        whenever you return to the Quest.
        A new ID will not be created for
        an existing participant.
      </p>

    </div>



    <button
      type="button"
      id="copyIdBtn"
      class="copy-id-btn"
    >

      COPY ACCESS ID

    </button>



    <button
      type="button"
      id="beginQuestBtn"
      class="quest-primary-btn"
    >

      ENTER GATE 01 →

    </button>


  </div>

</div>



<!-- =========================================
     RETURNING PLAYER MODAL
========================================= -->

<div
  id="resumeModal"
  class="modal-overlay"
  aria-hidden="true"
>


  <div class="id-modal">


    <div class="id-symbol">
      🦅
    </div>


    <span class="modal-label">
      IDENTITY VERIFIED
    </span>


    <h2>
      Welcome Back,
      <span id="returningPlayerName">
        Phoenix
      </span>.
    </h2>


    <p class="modal-intro">

      Your Quest progress has been recovered.

    </p>



    <div class="resume-gate-box">

      <span>
        LAST UNLOCKED
      </span>

      <strong id="resumeGateNumber">
        GATE 01
      </strong>

    </div>



    <button
      type="button"
      id="resumeQuestBtn"
      class="quest-primary-btn"
    >

      CONTINUE QUEST →

    </button>


  </div>

</div>



<!-- =========================================
     JAVASCRIPT
========================================= -->

<script src="quest.js"></script>


</body>
</html>
