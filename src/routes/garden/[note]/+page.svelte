<script lang="ts">
  export let data;

  import Toc from "svelte-toc";
  import "$lib/app.css";
  import "$lib/prism.css";

</script>

<div class="px-12 pt-28">
  <header>
    <h1 class="text-7xl font-medium bubbled-lg from-emerald-600 to-60% pb-2 overflow-hidden">
      {data.title}
    </h1>
    <p><span class="font-bold">Last Tended:</span> {data.lastUpdated}</p>
  </header>
  <hr class="my-4 border-zinc-600/75" />
  <div class="flex m-auto">
    <article
      class="w-full mb-16 tw-prose lg:tw-prose-xl tw-prose-invert tw-prose-code:before:content-none tw-prose-code:after:content-none tw-prose-code:bg-zinc-800 tw-prose-code:rounded tw-prose-code:py-0.5 tw-prose-code:px-1.5"
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
