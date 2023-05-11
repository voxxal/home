<script lang="ts">
  export let data;
  
  import state from "$lib/state";
  import Toc from "svelte-toc";
  import "$lib/app.css";
  import "$lib/prism.css";

  $state.navbarColor = "from-emerald-800"
</script>

<header>
  <h1 class="text-7xl font-medium bubbled-lg from-emerald-600 to-60% pb-2 overflow-hidden">
    {data.title}
  </h1>
  <p><span class="font-bold">Last Tended:</span> {data.lastUpdated}</p>
</header>
<hr class="my-4 border-zinc-600/75" />
<div class="flex m-auto">
  <article
    class="mb-16 prose lg:prose-xl prose-invert prose-code:before:content-none prose-code:after:content-none prose-code:bg-zinc-800 prose-code:rounded prose-code:p-1"
  >
    <svelte:component this={data.content} />
  </article>
  <Toc title="">
    <li let:heading slot="toc-item">
      {heading.innerText}
    </li>
  </Toc>
</div>
