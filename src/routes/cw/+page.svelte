<script lang="ts">
  import { type Puzzle, parsePuzFile, type Direction } from "$lib/puzzle";
  import state from "$lib/state";
  import { onMount } from "svelte";
  let fileUpload: HTMLInputElement | null = null;
  let puzzle: Puzzle | null = null;
  $state.navbarColor = "from-zinc-600";
  onMount(() => {
    if (document.location.hash) {
      const data = atob(document.location.hash.substring(1));
      puzzle = parsePuzFile(data);
    }
    if (!fileUpload) return;
    fileUpload.addEventListener("change", () => {
      if (!fileUpload) return; // appease the typescript gods
      const reader = new FileReader();
      reader.onload = () => {
        // TODO display nice looking error message if this errors
        puzzle = parsePuzFile(reader.result as string);
        console.log(puzzle);
      };

      if (!fileUpload.files?.length) return;
      reader.readAsBinaryString(fileUpload.files[0]);
    });

    const handleKeydown = (e: KeyboardEvent) => {
      if (!puzzle) return;
      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp":
        case "ArrowRight":
        case "ArrowLeft":
          // compiler is not smart enough to know.
          puzzle.move(e.key.substring(5).toLowerCase() as Direction);
          break;
        case " ":
          puzzle.switchFacing();
          break;
        case "Backspace":
          puzzle.setCell(puzzle.cursor, " ");
          if (puzzle.facing === "across") puzzle.move("left");
          else puzzle.move("up");
          break;
        default:
          puzzle.setCell(puzzle.cursor, e.key);
          if (puzzle.facing === "across") puzzle.move("right");
          else puzzle.move("down");
          break;
      }
      puzzle = puzzle;
    };
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });
  $: wordInfo = puzzle?.wordInfo() ?? { parts: [], wordNum: 0 };
  $: win = puzzle?.solution === puzzle?.grid;
  const color = (puzzle: Puzzle, i: number): string => {
    if (puzzle.solution[i] === ".") return "bg-zinc-600";
    if (puzzle.cursor === i) return "bg-navy";
    if (wordInfo.parts.includes(i)) return "bg-dark-navy";

    return "bg-blot";
  };
</script>

<svelte:head><title>voxal | crossword {puzzle ? `- ${puzzle.title} by ${puzzle.author}` : ''}</title></svelte:head>
<div class="h-full px-12 pt-28">
  {#if win}<h4>you win! (i promise i'll make it look better later)</h4>{/if}
  {#if puzzle === null}
    <header>
      <h1 class="overflow-hidden font-medium text-7xl bubbled-lg from-zinc-400 to-60% pb-2">
        crossword viewer
      </h1>
    </header>
    <hr class="my-4 border-zinc-600/75" />
  {/if}
  <div class:hidden={puzzle !== null}>
    <label for="fileUpload">Upload file: </label>
    <input type="file" id="fileUpload" bind:this={fileUpload} accept=".puz" class="mb-3" />
  </div>
  {#if puzzle !== null}
    <div class="flex w-full h-full gap-8">
      <div class="h-full w-fit">
        <div class="flex items-start justify-between mb-1">
          <h2 class="text-2xl">{puzzle.title}</h2>
          <h3 class="text-lg">{puzzle.author}</h3>
        </div>
        <div
          class="grid gap-0.5 aspect-square w-fit bg-zinc-600 p-0.5 h-full"
          style="grid-template-columns:repeat({puzzle.width}, minmax(0, 1fr));grid-template-rows:repeat({puzzle.height}, minmax(0, 1fr));"
        >
          {#each puzzle.grid as cell, i}
            {@const isBlackCell = puzzle.solution[i] === "."}
            <!-- svelte-ignore a11y-click-events-have-key-events -->

            <div
              class="relative {color(puzzle, i)} select-none {isBlackCell ? '' : 'cursor-pointer'}"
              on:click={() => {
                if (!puzzle || isBlackCell) return;
                if (puzzle.cursor === i) puzzle.switchFacing();
                puzzle.cursor = i;
              }}
            >
              <div class="absolute text-sm left-0.5 top-0.5">{puzzle.gridNums[i] ?? ""}</div>
              <div class="flex items-center justify-center w-full h-full text-4xl font-bold">
                {puzzle.solution[i] !== "." ? puzzle.grid[i] : ""}
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="grid grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-bold">Across</h3>
          <div>
            {#each Object.entries(puzzle.clues.across) as [knum, clue]}
              {@const num = +knum}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="px-4 py-1 text-lg transition-colors rounded-md cursor-pointer {num ===
                  wordInfo.wordNum && puzzle.facing === 'across'
                  ? 'bg-navy'
                  : 'hover:bg-slate-300/10'}"
                on:click={() => {
                  if (!puzzle) return;
                  puzzle.facing = "across";
                  puzzle.cursor = puzzle.gridNums.findIndex((x) => x === num) || puzzle.cursor;
                }}
              >
                <span class="inline-block w-5 mr-3 font-bold text-right">{num}</span>{clue}
              </div>
            {/each}
          </div>
        </div>
        <div>
          <h3 class="text-xl font-bold">Down</h3>
          <div>
            {#each Object.entries(puzzle.clues.down) as [knum, clue]}
              {@const num = +knum}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="px-4 py-1 text-lg transition-colors rounded-md cursor-pointer {num ===
                  wordInfo.wordNum && puzzle.facing === 'down'
                  ? 'bg-navy'
                  : 'hover:bg-slate-300/10'}"
                on:click={() => {
                  if (!puzzle) return;
                  puzzle.facing = "down";
                  puzzle.cursor = puzzle.gridNums.findIndex((x) => x === num) || puzzle.cursor;
                }}
              >
                <span class="inline-block w-5 mr-3 font-bold text-right">{num}</span>{clue}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  #fileUpload::file-selector-button {
    @apply px-3 py-1.5 font-bold bg-purple-700 rounded hover:bg-purple-800 disabled:bg-slate-400 text-zinc-100 border-none;
  }
</style>
