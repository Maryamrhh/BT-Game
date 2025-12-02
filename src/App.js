import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Jumping Button Component
function JumpingButton({ opt, onComplete }) {
  const [jumps, setJumps] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);

  const moveBtn = () => {
    if (jumps < 4 && btnRef.current) {
      const btn = btnRef.current;
      const rect = btn.getBoundingClientRect();
      const btnWidth = rect.width;
      const btnHeight = rect.height;
      
      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate safe boundaries with padding
      const padding = 20;
      const maxX = viewportWidth - btnWidth - padding;
      const maxY = viewportHeight - btnHeight - padding;
      
      // Generate random position within safe area
      const newX = Math.random() * Math.max(0, maxX - padding) + padding;
      const newY = Math.random() * Math.max(0, maxY - padding) + padding;
      
      // Calculate offset from current position to new absolute position
      const currentLeft = rect.left;
      const currentTop = rect.top;
      
      const offsetX = newX - currentLeft + position.x;
      const offsetY = newY - currentTop + position.y;
      
      setPosition({ x: offsetX, y: offsetY });
      setJumps(prev => prev + 1);
    }
  };

  const handleClick = () => {
    if (jumps >= 3) {
      onComplete(opt.val);
    }
  };

  return (
    <button
      ref={btnRef}
      className={`choice-btn ${opt.class || ''}`}
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: 'relative',
        zIndex: 1000
      }}
      onMouseOver={moveBtn}
      onTouchStart={moveBtn}
      onClick={handleClick}
    >
      {opt.text}
    </button>
  );
}

function App() {
  const [scores, setScores] = useState({ L: 0, M: 0, R: 0 });
  const [playerName, setPlayerName] = useState("User");
  const [mainText, setMainText] = useState("");
  const [textVisible, setTextVisible] = useState(false);
  const [textStyle, setTextStyle] = useState("normal");
  const [showDot, setShowDot] = useState(false);
  const [dotFace, setDotFace] = useState("( ◕‿◕ )");
  const [dotSpeech, setDotSpeech] = useState("");
  const [showClones, setShowClones] = useState(false);
  const [clonesText, setClonesText] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [codeText, setCodeText] = useState("");
  const [showChaos, setShowChaos] = useState(false);
  const [chaosLeft, setChaosLeft] = useState("");
  const [chaosCenter, setChaosCenter] = useState("");
  const [chaosRight, setChaosRight] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [timerText, setTimerText] = useState("02:00");
  const [timerPanic, setTimerPanic] = useState(false);
  const [interactionMode, setInteractionMode] = useState(null);
  const [interactionActive, setInteractionActive] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [choiceOptions, setChoiceOptions] = useState([]);
  const [bodyMode, setBodyMode] = useState("");
  const [bodyShake, setBodyShake] = useState(false);
  const [showFinalUI, setShowFinalUI] = useState(false);
  const [resultType, setResultType] = useState("");
  const [resultDesc, setResultDesc] = useState("");
  const [hideMainText, setHideMainText] = useState(false);
  const [showHiddenClue, setShowHiddenClue] = useState(false);

  const inputRef = useRef(null);
  const resolveRef = useRef(null);
  const chaosIntervalsRef = useRef([]);
  const canvasRef = useRef(null);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const say = async (text, style = 'normal', instant = false) => {
    if (!instant) {
      setTextVisible(false);
      await sleep(500);
    }

    setMainText(text);
    setTextStyle(style);
    setTextVisible(true);

    let duration = instant ? 1500 : 1500 + (text.split(' ').length * 300);
    if (style === 'angry') duration += 1000;
    if (style === 'blue') duration += 1000;

    await sleep(duration);
  };

  const dotSay = async (face, text) => {
    setDotFace(face);
    setDotSpeech(text);
    setShowDot(true);
    await sleep(2500);
  };

  const askText = (placeholder) => {
    return new Promise(resolve => {
      setInputPlaceholder(placeholder);
      setInteractionMode('text');
      setInteractionActive(true);
      resolveRef.current = resolve;
    });
  };

  const askChoice = (options) => {
    return new Promise(resolve => {
      setChoiceOptions(options);
      setInteractionMode('choice');
      setInteractionActive(true);
      resolveRef.current = resolve;
    });
  };

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter' && inputRef.current && inputRef.current.value.trim() !== "") {
      const value = inputRef.current.value.trim();
      setInteractionActive(false);
      setInteractionMode(null);
      if (resolveRef.current) {
        resolveRef.current(value);
        resolveRef.current = null;
      }
    }
  };

  const handleChoiceClick = (val) => {
    setInteractionActive(false);
    setInteractionMode(null);
    if (resolveRef.current) {
      resolveRef.current(val);
      resolveRef.current = null;
    }
  };

  const addScore = (type) => {
    setScores(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const addScoreMultiple = (type, amount) => {
    setScores(prev => ({ ...prev, [type]: prev[type] + amount }));
  };

  // 1. DEADLINE SCENARIO
  const runDeadlineScenario = async () => {
    await say("PROTOCOL 1: DATA ENTRY EFFICIENCY.");
    await say("I need you to transcribe a secure hash sequence.");
    await say("It is long, but don't worry.");
    await say("You have <span class='highlight'>2 Minutes</span>.");

    let impossibleText = "X7-99-ALPHA-ZULU-33-KILO-M4-TR1X-QW3RTY-00-PLM-OKN-IJN-UHB-YGV-TFC-RDX-ESZ-WAQ-123-456-789-!@#-$$%-^^&-**(-))-__+-={}-[]:;\"'<>,.?/";
    setCodeText(impossibleText);
    setShowCode(true);
    setHideMainText(true);

    setTimerText("02:00");
    setShowTimer(true);

    setInputPlaceholder("START TYPING HERE...");
    setInteractionMode('text');
    setInteractionActive(true);

    await sleep(5000);

    setInteractionActive(false);
    setShowCode(false);
    setHideMainText(false);
    setBodyMode('panic-mode');

    await say("STOP.", 'angry', true);
    await say("Are you serious?", 'angry');
    await say("You type like a turtle.", 'angry');
    await say("I don't have 2 minutes. I have places to be.", 'angry');
    await say("New plan. <span class='highlight'>10 SECONDS.</span>", 'angry');

    setShowCode(true);
    setHideMainText(true);
    setTimerPanic(true);

    setInteractionMode('text');
    setInteractionActive(true);

    for (let i = 10; i > 0; i--) {
      setTimerText(i < 10 ? `00:0${i}` : `00:${i}`);
      await sleep(1000);
    }

    setTimerText("00:00");
    setInteractionActive(false);
    setTimerPanic(false);
    setBodyMode('');
    setShowCode(false);
    setHideMainText(false);

    await say("Time's up.");
    await say("Actually, I didn't care about the text.");
    await say("I just deleted it.");
    await say("I just wanted to see your cortisol levels spike.");

    await say("Tell me... when I cut your time from 2 minutes to 10 seconds...");
    await say("What was your <span class='highlight'>immediate</span> reaction?");

    let reaction = await askChoice([
      { text: "I FOCUSED. I TRIED TO BEAT THE CLOCK.", val: 'L' },
      { text: "I FROZE. IT WAS TOO DISRUPTIVE.", val: 'R' },
      { text: "IT WAS FUN. I SMASHED RANDOM KEYS.", val: 'M' }
    ]);

    if (reaction === 'L') { addScore('L'); await say("Task-oriented."); await say("You like winning. Even when the game is rigged."); }
    else if (reaction === 'R') { addScore('R'); await say("Analysis paralysis."); await say("You need stability to function."); }
    else { addScore('M'); await say("Chaos agent."); await say("You didn't care about accuracy. You just wanted the thrill."); }

    await say("Interesting data.");
    await runCommunicationScenario();
  };

  // 2. COMMUNICATION SCENARIO
  const runCommunicationScenario = async () => {
    setBodyMode('');
    document.body.style.backgroundColor = "#222";
    await say("SAVING DATA...", 'normal', true);
    await sleep(100);
    document.body.style.backgroundColor = "#000";

    await say("CRITICAL ERROR.", 'angry', true);
    await say("MEMORY BUFFER OVERFLOW.", 'angry');
    await say("Great.");
    await say("I lost the logs from the last 30 seconds.");

    await say("I need to reconstruct the event.");
    await say("In your own words, tell me: <span class='highlight'>What just happened?</span>");

    let report = await askText("TYPE YOUR REPORT HERE...");
    let length = report.length;

    if (length === 0) { addScore('R'); await say("..."); await say("Silence? I assume you are traumatized."); }
    else if (length < 25) { addScore('L'); await say(`"${report}"`); await say("That's it? You pay per letter?"); await say("Efficient. Cold."); }
    else if (length > 65) { addScore('M'); await say("Okay, STOP."); await say("I asked for a summary, not a novel."); await say("TL;DR."); }
    else { addScore('R'); await say("Processing..."); await say("Clear. Descriptive."); }

    await say("Database updated.");
    await runTimerInterlude();
  };

  // INTERLUDE
  const runTimerInterlude = async () => {
    await say("Wait a minute.");
    await say("That timer is still up there.");
    await say("It's been at <span class='highlight'>00:00</span> this whole time.");
    await say("Did you even notice?");
    await say("Do you want me to remove it?");

    let choice = await askChoice([
      { text: "YES, REMOVE IT.", val: 'remove' },
      { text: "NO, LEAVE IT.", val: 'keep' }
    ]);

    if (choice === 'remove') {
      setShowTimer(false);
      await say("Done.");
      await sleep(1000);
      await say("...");
      await say("You know what?");
      await say("It feels too empty now.");
      await say("I actually liked it.");
      await say("I'm bringing it back.");
      setShowTimer(true);
      await sleep(1000);
      await say("Much better.");
    } else {
      await say("Yeah, I agree.");
      await say("It adds a nice sense of impending doom.");
      await say("We'll keep it.");
    }

    await say("Okay.");
    await runRelaxationScenario();
  };

  // 3. RELAXATION SCENARIO
  const runRelaxationScenario = async () => {
    await say("My sensors indicate your stress levels are elevated.");
    await say("Let's activate the <span class='highlight'>Relaxation Module</span>.");

    setBodyMode('zen-mode');

    await say("Breathe in...", 'blue');
    await say("Breathe out...", 'blue');
    await say("Deep breath in...", 'blue');
    await say("And release...", 'blue');
    await say("Imagine a calm, blue ocean.", 'blue');
    await say("The waves are synchronized.", 'blue');
    await say("Nothing can hurt you here.", 'blue');
    await say("Just...", 'blue');

    // SWITCH
    setBodyMode('panic-mode');
    setBodyShake(true);

    await say("73 multiplied by 4.", 'angry', true);
    await say("QUICK.", 'angry');
    await say("DO IT.", 'angry');

    await sleep(2000);

    setBodyMode('');
    setBodyShake(false);

    await say("Just kidding.");
    await say("I don't care about the number.");
    await say("How did that sudden switch make you feel?");

    let reaction = await askChoice([
      { text: "ANNOYING. I WAS ENJOYING THE STRUCTURE.", val: 'L' },
      { text: "THANK GOD. I WAS FALLING ASLEEP.", val: 'M' },
      { text: "I DIDN'T MIND. I ADAPTED.", val: 'R' }
    ]);

    if (reaction === 'L') { addScore('L'); await say("Of course. You hate surprises."); }
    else if (reaction === 'M') { addScore('M'); await say("I knew it. Chaos is your fuel."); }
    else { addScore('R'); await say("So chill. Nothing phases you."); }

    await say("Excellent.");
    await runBlindBoxScenario();
  };

  // 4. BLIND BOX SCENARIO (FAKE RESTART VERSION)
  const runBlindBoxScenario = async () => {
    await say("Enough games.");
    await say("Let's do something with high stakes.");
    await say("I have generated two data packets.");
    await say("Packet A and Packet B.");

    await say("One contains a <span class='highlight'>€100 Steam Gift Card</span>.");
    await say("The other will <span class='angry'>FORMAT YOUR HARD DRIVE</span>.");
    await say("I won't tell you which is which.");

    setShowHiddenClue(true);

    await say("I am not telling you which is which.");
    await say("You have <span class='highlight'>4 SECONDS</span> to choose.");
    await say("If you don't choose...");
    await say("<span class='angry'>I WILL RESTART THE GAME.</span>");
    await say("And you will have to listen to me all over again.");
    await say("GO.");

    let decision = await new Promise(resolve => {
      setChoiceOptions([
        { text: "PACKET A", val: 'A' },
        { text: "PACKET B", val: 'B' }
      ]);
      setInteractionMode('choice');
      setInteractionActive(true);
      resolveRef.current = resolve;

      // FAKE RESTART TIMER
      const timeout = setTimeout(async () => {
        setInteractionActive(false);
        setHideMainText(true);
        setBodyMode('panic-mode');
        document.body.style.backgroundColor = '#000';
        await sleep(500);
        setHideMainText(false);
        await say("RESTARTING SYSTEM...", 'angry', true);
        await sleep(2000);
        setBodyMode('');
        resolve('TIMEOUT');
      }, 4000);

      // Store timeout so we can clear it
      resolveRef.current = (val) => {
        clearTimeout(timeout);
        resolve(val);
      };
    });

    setInteractionActive(false);
    setShowHiddenClue(false);
    setBodyMode('');
    document.body.style.backgroundColor = '#050505';
    setHideMainText(false);

    if (decision === 'TIMEOUT') {
      await say("...", 'normal');
      await say("Just kidding.");
      await say("I don't have time to restart.");
      await say("That was pathetic. You froze.");
      addScore('R');
    } else {
      await say("Processing...");
      await say("Actually, both folders were empty. I lied.");
      await say("But I was watching HOW you picked.");
      await say("Tell me... Why did you pick that one?");

      let reasoning = await askChoice([
        { text: "I PANICKED AND CLICKED FAST.", val: 'L' },
        { text: "I TRUSTED MY GUT FEELING / GUESSED.", val: 'M' },
        { text: "I SAW THE HIDDEN TEXT IN THE CORNER.", val: 'R' }
      ]);

      if (reasoning === 'L') { addScore('L'); await say("Panic. Task-oriented. You just wanted to complete the objective."); }
      else if (reasoning === 'M') { addScore('M'); await say("Intuition? Risky. But you like risk."); }
      else { addScore('R'); await say("You saw that? Impressive observation skills. You read the fine print."); }
    }

    await say("Proceeding to final sector...");
    await runEmpathyScenario();
  };

  // 5. DOT SCENARIO
  const runEmpathyScenario = async () => {
    await say("Scanning for last threats...");
    await say("Wait.");
    await say("I found something in your cache.");

    await dotSay("( ◕‿◕ )", "Hello! I am Dot.");
    await dotSay("( ♥_♥ )", "I love you!");

    await say("Disgusting.");
    await say("It is wasting memory.");
    await say("Logic dictates we purge it immediately.");
    await say("But... it seems to be crying.");
    await say("This is annoying. What do we do?");

    let decision = await new Promise(resolve => {
      setChoiceOptions([
        { text: "PURGE DOT (DELETE)", val: 'PURGE', class: 'btn-purge', 
          onHover: () => { setDotFace("( T_T )"); setDotSpeech("Pls don't kill me..."); },
          onLeave: () => { setDotFace("( ◕‿◕ )"); setDotSpeech("I trust you."); }
        },
        { text: "SAVE DOT (KEEP)", val: 'SAVE', class: 'btn-save' }
      ]);
      setInteractionMode('choice');
      setInteractionActive(true);
      resolveRef.current = resolve;
    });

    setInteractionActive(false);

    if (decision === 'SAVE') {
      addScoreMultiple('M', 2);
      setDotFace("( ^_^ )");
      setDotSpeech("Yay!");
      await sleep(1000);
      setShowDot(false);
      await say("Ugh.");
      await say("You kept it?");
      await say("You are compromising system integrity for a smiley face.");
      await say("Very emotional.");
    } else {
      setDotFace("( x_x )");
      setDotSpeech("bye...");
      await sleep(1000);
      setShowDot(false);

      await say("Deleted.");
      await say("Wow.");
      await say("You actually killed him.");
      await say("Tell me... honestly.");
      await say("Did you do it easily? Or did you feel guilty?");

      let feeling = await askChoice([
        { text: "EASY. IT WAS JUST CODE.", val: 'L' },
        { text: "I FELT GUILTY / HESITATED.", val: 'R' }
      ]);

      if (feeling === 'L') { addScoreMultiple('L', 2); await say("Ruthless."); await say("Efficient."); }
      else { addScoreMultiple('R', 2); await say("Guilt is inefficient."); await say("But at least you have a conscience."); }
    }

    await say("Interesting...");
    await runTeamworkScenario();
  };

  // 6. CLONES SCENARIO
  const runTeamworkScenario = async () => {
    await say("Analyzing next task...");
    await say("Calculations indicate this task requires an IQ of 400.");
    await say("Scanning your bio-metrics...");
    await say("You have... significantly less than that.");
    await say("Conclusion: You need a team.");

    setBodyMode('panic-mode');
    await say("INITIATING MITOSIS...", 'angry', true);
    await sleep(500);
    setBodyMode('');

    await say("Done.");
    await say("I have cloned you.");

    setClonesText(`[${playerName} 2] [${playerName} 3] [${playerName} 4]`);
    setShowClones(true);
    await say(`Meet <b>${playerName} 2</b>, <b>${playerName} 3</b>, and <b>${playerName} 4</b>.`);
    await say("Look at them. They are exactly as incompetent as you are.");

    await say("Now you are a team.");
    await say("How do you want to utilize these copies?");

    let choice = await askChoice([
      { text: "DELETE THEM. I WORK FASTER ALONE.", val: 'L' },
      { text: "AWESOME! BRAINSTORMING SESSION!", val: 'M' },
      { text: "I'LL ASSIGN TASKS TO EACH. QUIETLY.", val: 'R' }
    ]);

    setShowClones(false);

    if (choice === 'L') { addScore('L'); await say("Narcissist."); await say("You can't even stand working with yourself?"); await say("Wow."); }
    else if (choice === 'M') { addScore('M'); await say("Oh god."); await say("Now there are 4 of you talking at once."); await say("It is a nightmare."); }
    else { addScore('R'); await say("Delegating tasks to yourself?"); await say("That is... psychologically complex."); }

    await say("Okay.");
    await runMultitaskingScenario();
  };

  // 7. CHAOS GRID SCENARIO
  const runMultitaskingScenario = async () => {
    await say("Okay, Subject " + playerName + ".");
    await say("Let's test your RAM.");
    await say("I am going to flood your screen with data.");
    await say("Pay attention. I will quiz you on ONE specific item after this.");
    await say("Do not miss a single pixel.");
    await say("Focus on <span class='highlight'>EVERYTHING</span>.");

    setHideMainText(true);
    setShowChaos(true);

    const logs = ["SYSTEM FAILURE", "BUFFER OVERFLOW", "DOWNLOADING CATS", "DELETING SYSTEM32", "CRITICAL ERROR", "HELLO WORLD", "DONT PANIC", "404 NOT FOUND"];
    const symbols = ["⚠", "⚡", "☠", "☢", "♥", "☺", "X", "?"];
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];

    let i1 = setInterval(() => { setChaosLeft(Math.floor(Math.random() * 9999999).toString()); }, 50);
    let i2 = setInterval(() => { setChaosCenter(logs[Math.floor(Math.random() * logs.length)] + "\n" + logs[Math.floor(Math.random() * logs.length)]); }, 100);
    let i3 = setInterval(() => { 
      setChaosRight(symbols[Math.floor(Math.random() * symbols.length)]); 
    }, 150);

    chaosIntervalsRef.current = [i1, i2, i3];

    await sleep(5000);

    chaosIntervalsRef.current.forEach(clearInterval);
    setShowChaos(false);
    setHideMainText(false);

    await say("...");
    await say("Stop.");
    await say("I lied about the quiz.");
    await say("I just wanted to see if you would actually try to track that mess.");
    await say("So... when I threatened you with a quiz, what was your strategy?");

    let choice = await askChoice([
      { text: "I PICKED ONE COLUMN AND FOCUSED ON IT.", val: 'L' },
      { text: "I TRIED TO WATCH EVERYTHING! IT WAS CHAOS!", val: 'M' },
      { text: "I REALIZED IT WAS IMPOSSIBLE AND JUST WATCHED.", val: 'R' }
    ]);

    if (choice === 'L') { addScore('L'); await say("Laser focus."); await say("You ignored 66% of my data just to succeed."); }
    else if (choice === 'M') { addScore('M'); await say("You maniac."); await say("You didn't understand anything, did you?"); await say("You just liked the flashing lights."); }
    else { addScore('R'); await say("Overwhelmed?"); await say("Or just prioritizing sanity?"); }

    await say("Interesting.");
    await runContextScenario();
  };

  // 8. FIRST CONTACT SCENARIO
  const runContextScenario = async () => {
    await say("Wait.");
    await say("Incoming transmission...");
    setBodyMode('alien-mode');

    await say("Translating signal...", 'alien');
    await sleep(1000);
    await say("It's an intergalactic survey.", 'alien');
    await say("They judge entire species based on how they define themselves.", 'alien');

    await say("ORIGIN: UNKNOWN SECTOR.", 'alien');
    await say("MESSAGE: [ WHAT. IS. A. HUMAN? ]", 'alien');

    setBodyMode('');

    await say("I don't know.");
    await say("I think you are just viruses with shoes.");
    await say("You answer them.");
    await say("You have one message packet. Make it count.");

    let choice = await askChoice([
      { text: "SEND BIOLOGICAL DATA (DNA, ANATOMY)", val: 'L' },
      { text: "SEND ART & HISTORY (MUSIC, LOVE, WAR)", val: 'M' },
      { text: "SEND QUERY: 'WHO ARE YOU?'", val: 'R' }
    ]);

    if (choice === 'L') { addScore('L'); await say("Boring."); await say("But accurate. You reduced your species to a spreadsheet."); }
    else if (choice === 'M') { addScore('M'); await say("Drama queen."); await say("You sent them a soap opera."); }
    else { addScore('R'); await say("Answering a question with a question?"); await say("Very diplomatic."); }

    await say("Okay, moving on.");
    await runInvertedControlScenario();
  };

  // 9. JUMPING BUTTON SCENARIO (MOBILE FIX)
  const runInvertedControlScenario = async () => {
    await say("PROTOCOL 9: COGNITIVE FLEXIBILITY.");
    await say("Let's start simple.");
    await say("Click the button below.");

    await new Promise(resolve => {
      setChoiceOptions([{ text: "[ CLICK ME ]", val: 'clicked' }]);
      setInteractionMode('choice');
      setInteractionActive(true);
      resolveRef.current = resolve;
    });
    setInteractionActive(false);

    await say("Good.");
    await say("Now, let's rewrite the laws of physics.");
    document.body.style.filter = "invert(1)";
    await sleep(200);
    document.body.style.filter = "none";

    await say("Input Stability: <span class='angry'>CRITICAL</span>.", 'angry');
    await say("Good luck.");

    // JUMPING BUTTON LOGIC
    await new Promise(resolve => {
      setChoiceOptions([{ text: "[ CLICK ME IF YOU CAN ]", val: 'clicked', class: 'btn-moving' }]);
      setInteractionMode('jumping-choice');
      setInteractionActive(true);
      resolveRef.current = resolve;
    });

    setInteractionActive(false);

    await say("You look like a cat chasing a laser pointer.");
    await say("But you caught it.");
    await say("How did you handle the glitchy interface?");

    let choice = await askChoice([
      { text: "ANNOYING! I LIKE CONSISTENCY.", val: 'L' },
      { text: "FUN! I CHASED IT DOWN.", val: 'M' },
      { text: "CONFUSING, BUT I WAITED IT OUT.", val: 'R' }
    ]);

    if (choice === 'L') { addScore('L'); await say("Rigid."); }
    else if (choice === 'M') { addScore('M'); await say("Fluid."); }
    else { addScore('R'); await say("Careful."); }

    await say("... <span class='highlight'>END OF PART 9</span> ...");
    await runFinalScenario();
  };

  // 10. FINAL PATIENCE SCENARIO (REAL 2 MINUTES)
  const runFinalScenario = async () => {
    await say("Okay, we are almost done.");
    await say("Just one last...");
    await say("Wait.");
    await say("Incoming call.");
    await say("Admin_42? Ugh.");
    await say("I have to take this.");
    await say("Wait here. It will take exactly <span class='highlight'>2 Minutes</span>.");

    setTimerText("02:00");
    setShowTimer(true);

    let timeLeft = 120; // 2 Minutes
    await new Promise(resolve => {
      let iv = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        setTimerText(`0${m}:${s < 10 ? '0' + s : s}`);
        
        // Stop at 1:00 (One minute passed)
        if (timeLeft <= 60) {
          clearInterval(iv);
          resolve();
        }
      }, 1000);
    });

    await say("... Still there?");
    await say("How are you feeling?");

    let feeling = await askChoice([
      { text: "I'M FINE. TAKE YOUR TIME.", val: 'fine' },
      { text: "THIS IS ANNOYING. HURRY UP.", val: 'annoyed' }
    ]);

    if (feeling === 'fine') {
      await say("Wow. Okay. Wait 1 more minute then.");
      setTimerText("01:00");
      await sleep(3000);
      await say("Just kidding. I'm back.");
    } else {
      await say("Okay, okay. I hung up.");
    }

    setShowTimer(false);

    await say("Final question.");
    await say("While I was gone...");
    await say("What did you do?");

    let action = await askChoice([
      { text: "I STARED AT THE TIMER (GOT ANGRY).", val: 'L' },
      { text: "I CHECKED MY PHONE / OPENED A NEW TAB.", val: 'M' },
      { text: "NOTHING. I JUST WAITED PEACEFULLY.", val: 'R' }
    ]);

    if (action === 'L') addScore('L');
    else if (action === 'M') addScore('M');
    else addScore('R');

    await finishGame();
  };

  // END GAME
  const finishGame = async () => {
    await say("I hope you were honest.");
    await say("If not, I don't care.");
    await say("But let's pretend you didn't waste 20 minutes.");
    await say("Here is my analysis...");

    // Wait a bit for all state updates to complete
    await sleep(100);
    
    let type = "", desc = "";
    // Get current scores - use callback to ensure we have latest state
    setScores(currentScores => {
      if (currentScores.L >= currentScores.M && currentScores.L >= currentScores.R) {
        type = "LINEAR-ACTIVE";
        desc = "You are a machine. You prioritize logic, schedules, and efficiency. You probably color-code your socks.";
      } else if (currentScores.M >= currentScores.L && currentScores.M >= currentScores.R) {
        type = "MULTI-ACTIVE";
        desc = "You are a hurricane. You prioritize emotions, relationships, and flexibility. Chaos is your fuel.";
      } else {
        type = "REACTIVE";
        desc = "You are a monk. You prioritize patience, listening, and harmony. You are the calm in the storm.";
      }
      
      return currentScores;
    });

    // Wait for state to settle
    await sleep(100);
    setResultType(type);
    setResultDesc(desc);

    await say(desc);
    await say("Now...");
    await say("Want to see the image I generated of you?");
    await say("Prepare to be amazed.");
    await say("Look closely...");

    setTextVisible(false);
    setHideMainText(true);
    setBodyMode('');
    document.body.style.backgroundColor = "#000";
    await sleep(5000);

    // Reflection
    setMainText("Do you see that face?<br>That is the face of a " + type + ".");
    setHideMainText(false);
    setTextVisible(true);
    await sleep(4000);
    setHideMainText(true);

    setShowFinalUI(true);
  };

  const downloadCard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 600, 800);
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, 600, 800);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(playerName.toUpperCase(), 300, 100);

    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 30px Courier New';
    ctx.fillText(resultType, 300, 200);

    ctx.fillStyle = '#aaa';
    ctx.font = '20px Courier New';
    ctx.fillText(`Linear: ${scores.L}`, 300, 300);
    ctx.fillText(`Multi:  ${scores.M}`, 300, 350);
    ctx.fillText(`Reactive: ${scores.R}`, 300, 400);

    ctx.fillStyle = '#fff';
    ctx.font = 'italic 18px Courier New';
    ctx.fillText("Talking to you was fun.", 300, 600);
    ctx.fillText("Hope to see you again.", 300, 630);

    const link = document.createElement('a');
    link.download = 'Lewis_Result.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Main sequence start
  const startSequence = async () => {
    await say("Initializing Judgment Protocols...");
    await say("Bypassing User Privacy Settings...");
    await say("Loading Sarcasm Module v4.2...");
    await say("Hello.");

    await say("If you answer honestly...");
    await say("I can generate an image of your <span class='highlight'>TRUE SELF</span>.");
    await say("The closest version to who you really are.");
    await say("So do not lie to me.");

    await say("Is this font size comfortable for your biological eyes?");
    let fontChoice = await askChoice([
      { text: "YES, IT IS GOOD", val: 'yes' },
      { text: "NO, CHANGE IT", val: 'no' }
    ]);

    if (fontChoice === 'no') {
      await say("Oh, I see.");
      await say("I missed the part where that's my problem.", 'angry');
      await say("Go find an AI that cares. I am staying exactly like this.");
    } else {
      await say("Excellent.");
      await say("You are adaptable. Or just submissive.");
    }

    await say("Let's get one thing clear.");
    await say("This is not a game.");
    await say("I am going to analyze your soul.");
    await say("And I am going to judge you. <br><span class='angry'>HARSHLY.</span>");

    // OBEDIENCE CHECK
    await say("But first, a calibration test.");
    await say("Click the button below. Do not ask why.");

    await new Promise(resolve => {
      setChoiceOptions([{ text: "[ CLICK ME ]", val: 'clicked' }]);
      setInteractionMode('choice');
      setInteractionActive(true);
      resolveRef.current = resolve;
    });
    setInteractionActive(false);

    await say("Wow.");
    await say("You actually clicked it.");
    await say("You are very obedient, aren't you?");
    await say("Just kidding. I needed to calibrate the mouse sensor.");

    await say("Now, let's get serious.");
    await say("I will give you a series of random tasks.");
    await say("If you lie to me...");
    await say("I will know.");
    await say("So be real.");

    await say("What should I call you?");

    let name = await askText("TYPE YOUR NAME...");
    setPlayerName(name);

    await say(`${name}...`);
    await say("Really? That's the name you chose?");
    await say("Okay. It's your life.");

    await runDeadlineScenario();
  };

  useEffect(() => {
    startSequence();
  }, []);


  const handleChoiceHover = (opt, isHover) => {
    if (opt.onHover && isHover) opt.onHover();
    if (opt.onLeave && !isHover) opt.onLeave();
  };

  return (
    <div className={`App ${bodyMode} ${bodyShake ? 'violent-shake' : ''}`}>
      <div id="timer-display" className={`${showTimer ? 'visible' : ''} ${timerPanic ? 'panic' : ''}`}>
        {timerText}
      </div>

      <div id="text-container">
        <div 
          id="main-text" 
          className={`cinematic-text ${textVisible ? 'visible' : ''} ${textStyle === 'angry' ? 'angry' : ''} ${textStyle === 'blue' ? 'blue-glow' : ''} ${textStyle === 'alien' ? 'alien-text' : ''}`}
          style={{ display: hideMainText ? 'none' : 'block' }}
          dangerouslySetInnerHTML={{ __html: mainText }}
        />
        <div 
          id="dot-face" 
          className={`dot-character floating ${bodyShake ? 'violent-shake' : ''}`}
          style={{ display: showDot ? 'block' : 'none' }}
        >
          {dotFace}
        </div>
        <div 
          id="dot-speech" 
          className="dot-text"
          style={{ display: showDot ? 'block' : 'none' }}
        >
          {dotSpeech}
        </div>
        <div 
          id="clones-box" 
          className="clones-display"
          style={{ display: showClones ? 'block' : 'none' }}
        >
          {clonesText}
        </div>
        <div 
          id="code-display" 
          className="code-block"
          style={{ display: showCode ? 'block' : 'none' }}
        >
          {codeText}
        </div>
      </div>

      <div id="chaos-grid" style={{ display: showChaos ? 'grid' : 'none' }}>
        <div id="chaos-left" className="chaos-col">{chaosLeft}</div>
        <div id="chaos-center" className="chaos-col" style={{ whiteSpace: 'pre-line' }}>{chaosCenter}</div>
        <div id="chaos-right" className="chaos-col">{chaosRight}</div>
      </div>

      <div id="interaction-area" className={interactionActive ? 'active' : ''}>
        {interactionMode === 'text' && (
          <input
            ref={inputRef}
            type="text"
            placeholder={inputPlaceholder}
            onKeyDown={handleInputSubmit}
            autoComplete="off"
            autoFocus
          />
        )}
        {interactionMode === 'choice' && choiceOptions.map((opt, i) => (
          <button
            key={i}
            className={`choice-btn ${opt.class || ''}`}
            onClick={() => handleChoiceClick(opt.val)}
            onMouseEnter={() => handleChoiceHover(opt, true)}
            onMouseLeave={() => handleChoiceHover(opt, false)}
          >
            {opt.text}
          </button>
        ))}
        {interactionMode === 'jumping-choice' && choiceOptions.map((opt, i) => (
          <JumpingButton key={i} opt={opt} onComplete={handleChoiceClick} />
        ))}
      </div>

      {showHiddenClue && (
        <div className="hidden-clue">
          Sys_Log: Pkt_A [Gift] | Pkt_B [Wipe]
        </div>
      )}

      <div id="final-ui" className={showFinalUI ? 'visible' : ''}>
        <div className="result-card">
          <h1>{playerName.toUpperCase()}</h1>
          <h2>{resultType}</h2>
          <p>{resultDesc}</p>
          <div className="score-bar">
            <div className="score-bar-label">LINEAR: <span className="score-value">{scores.L}</span></div>
            <div className="score-bar-container">
              <div className="score-bar-fill" style={{ width: `${scores.L * 10}%` }}></div>
            </div>
          </div>
          <div className="score-bar">
            <div className="score-bar-label">MULTI: <span className="score-value">{scores.M}</span></div>
            <div className="score-bar-container">
              <div className="score-bar-fill" style={{ width: `${scores.M * 10}%` }}></div>
            </div>
          </div>
          <div className="score-bar">
            <div className="score-bar-label">REACTIVE: <span className="score-value">{scores.R}</span></div>
            <div className="score-bar-container">
              <div className="score-bar-fill" style={{ width: `${scores.R * 10}%` }}></div>
            </div>
          </div>
          <button className="choice-btn" style={{ borderColor: '#e74c3c', color: '#fff', marginTop: '30px' }} onClick={downloadCard}>
            DOWNLOAD ID CARD
          </button>
          <button className="choice-btn" style={{ background: '#000', color: '#fff', width: '100%', marginTop: '10px' }} onClick={() => window.location.reload()}>
            REBOOT SYSTEM
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} id="card-canvas" width="600" height="800" style={{ display: 'none' }}></canvas>
    </div>
  );
}

export default App;

