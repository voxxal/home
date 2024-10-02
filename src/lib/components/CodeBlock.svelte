<script lang="ts">
  import { type CSSLength } from "$lib/util";
  import { LucideClipboard } from "lucide-svelte";
  import { type BundledLanguage, type DecorationItem, codeToHtml } from "shiki";
  const {
    code,
    lang,
    file = "",
    decorations,
    maxHeight,
  }: {
    code: string;
    lang: BundledLanguage;
    file?: string;
    decorations?: DecorationItem[];
    maxHeight?: CSSLength;
  } = $props();

  const out = codeToHtml(code, {
    lang,
    theme: "everforest-dark",
    decorations,
  });
</script>

<div class="code-block">
  <div class="code-block-header">
    <div class="file-details">
      <div class="language">{lang.toUpperCase()}</div>
      {#if file}<div class="file-name">{file}</div>{/if}
    </div>
    <div>
      <button onclick={() => navigator.clipboard.writeText(code)} class="copy-button">
        <LucideClipboard size={16} />
      </button>
    </div>
  </div>
  <div class="scroller" style={maxHeight ? `--max-height: ${maxHeight}` : ""}>
    {#await out}
      <!-- TODO its possible to calculate how tall the code block will be so we don't get any layout shift -->
      <div class="loading" style="height: calc(1rem + {code.split('\n').length}lh)">
        <div>Loading...</div>
      </div>
    {:then html}
      {@html html}
    {/await}
  </div>
</div>

<style>
  .code-block {
    background: var(--surface-150);
    border-radius: var(--radius-1);
    border: 2px solid var(--surface-100);
    overflow: hidden;
  }

  .code-block-header {
    padding: 0.5rem 1rem;
    padding-left: 0.5rem;
    /* font-family: var(--font-mono); */
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .file-details {
    background: var(--accent-100);
    border-radius: var(--radius-1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .file-details:has(.file-name) {
    padding-right: 0.5rem;
  }

  .loading {
    display: grid;
    align-items: center;
    justify-content: center;
  }

  .file-details .language {
    font-weight: 800;
    color: var(--text-em);
    background: var(--accent-200);
    border-radius: var(--radius-1);
    padding: 0rem 0.5rem;
    font-family: var(--font-mono);
  }

  .code-block .scroller {
    border-top: 2px dashed var(--surface-100);
    max-height: var(--max-height);
    overflow: auto;
  }

  .code-block :global(.shiki) {
    padding: 0.5rem 1rem;
  }

  .copy-button {
    border-radius: var(--radius-1);
    background: var(--accent-100);
    padding: 0.25rem 0.5rem;
    transition: 200ms;
  }

  .copy-button:hover {
    background: var(--accent-200);
  }
</style>
