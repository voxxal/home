<script lang="ts">
    import { File } from "lucide-svelte";
import { type Snippet } from "svelte";

  const {
    path,
    children,
    download = true,
  }: {
    path: string;
    children: Snippet;
    download?: boolean;
  } = $props();
</script>

<span class="file-download">
  <File class="file-icon"/>
  <a href={path} download={download ? "" : undefined} target="_blank">
    {@render children()}
  </a>
</span>

<style>
  .file-download {
    /* background: var(--surface-150);
    border-radius: var(--radius-1);
    border: 2px solid var(--surface-100); */
    padding: 0 0.125rem;

    :global(.file-icon) {
      display: inline;
      height: 1rem;
      width: 1rem;
      color: var(--accent-400);
    }
  }

</style>
