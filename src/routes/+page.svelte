<script>
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar.svelte";
  import "../app.css";
  const thirdChoices = [
    { text: "and mad scientist.", color: "from-emerald-500" },
    { text: "and professional idiot.", color: "from-yellow-500" },
    { text: "and ctf amateur.", color: "from-orange-500" },
    { text: "and berry collector.", color: "from-red-500" },
    { text: "and glyph shifter", color: "from-purple-500" },
    { text: "and pixel placer", color: "from-green-500" }
  ]

  let third = { text: "", color: "" };
  onMount(() => {
    third = thirdChoices[Math.floor(Math.random() * thirdChoices.length)];
  })
</script>

<body class="w-full min-h-full text-white bg-zinc-900 selection:bg-navy/50">
  <Navbar />
    <header>
        <div>
            <h2 class="pb-2 text-6xl">hey, i'm <span class="bubbled-md from-navy to-60% px-1">aiden.</span></h2>
            <h1 class="text-8xl font-medium bubbled-lg from-navy to-70% pb-4">developer,</h1>
            <h1 class="text-8xl font-medium bubbled-lg from-navy to-70% pb-4">designer,</h1>
            <h1 class="text-8xl font-medium bubbled-lg {third.color} to-70% pb-4">{third.text}</h1>
        </div>
    </header>
</body>
