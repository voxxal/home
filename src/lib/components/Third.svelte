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

<h1 class="overflow-hidden font-medium text-8xl" id="third">
  <SplitText class="inline-block whitespace-pre thirdIn {third.color} to-70% bubbled-lg pb-4 opacity-0" text={third.text} />
</h1>
