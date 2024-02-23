<script lang="ts">
  export let data;

  import state from "$lib/state";
  import Toc from "svelte-toc";
  import "$lib/app.css";
  import "$lib/prism.css";

  $state.navbarColor = data.navbarColor;
</script>

<svelte:head><title>voxal | {data.title}</title></svelte:head>

{#if data.defaultLayout}
  <div class="px-12 pt-28">
    <header>
      <h1 class="text-7xl font-medium bubbled-lg from-purple-800 to-60% pb-2 overflow-hidden">
        {data.title}
      </h1>
      <p><span class="font-bold">Published:</span> {data.published}</p>
    </header>
    <hr class="my-4 border-zinc-600/75" />
    <div class="flex m-auto">
      <article
        class="w-full mb-16 prose lg:prose-xl xl:prose-2xl prose-invert prose-code:before:content-none prose-code:after:content-none prose-code:bg-zinc-800 prose-code:rounded prose-code:p-1"
      >
        <svelte:component this={data.content} />
      </article>
      <Toc title="">
        <li let:heading slot="toc-item">
          {heading.innerText}
        </li>
      </Toc>
    </div>
  </div>
{:else}
  <svelte:component this={data.content} />
{/if}
