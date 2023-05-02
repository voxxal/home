<script lang="ts">
  import SplitText from "./SplitText.svelte";
  const thirdChoices = [
    { text: "and mad scientist.", color: "from-emerald-500" },
    { text: "and professional idiot.", color: "from-yellow-500" },
    { text: "and ctf amateur.", color: "from-orange-500" },
    { text: "and berry collector.", color: "from-red-500" },
    { text: "and glyph shifter.", color: "from-purple-500" },
    { text: "and pixel placer.", color: "from-green-500" },
  ];

  const third = thirdChoices[Math.floor(Math.random() * thirdChoices.length)];
</script>

<h1 class="text-8xl font-medium bubbled-lg {third.color} to-70% pb-4 overflow-hidden" id="third">
  <SplitText class="inline-block whitespace-pre thirdIn" text={third.text} />
</h1>
