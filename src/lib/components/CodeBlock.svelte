<script lang="ts" module>
  import { createHighlighterCoreSync, createJavaScriptRegexEngine } from "shiki";
  import js from "shiki/langs/javascript.mjs";
  import py from "shiki/langs/python.mjs";
  import html from "shiki/langs/html.mjs";
  import css from "shiki/langs/css.mjs";
  import bash from "shiki/langs/bash.mjs";

  const shiki = createHighlighterCoreSync({
    engine: createJavaScriptRegexEngine(),
    themes: [everforestDark],
    langs: [html, css, js, py, bash],
  });
  
  export const highlight = (start: number, end?: number): DecorationItem => ({
    start: { line: start, character: 0 },
    end: { line: end ?? start + 1, character: 0 },
    properties: { class: "highlighted" },
  });
</script>

<script lang="ts">
  import { type CSSLength } from "$lib/util";
  import { LucideClipboard } from "lucide-svelte";
  import everforestDark from "shiki/themes/everforest-dark.mjs";
  import { type BundledLanguage, type DecorationItem } from "shiki";

  const {
    code = "",
    lang,
    file = "",
    decorations,
    maxHeight,
    class: className,
  }: {
    code: string;
    lang: BundledLanguage | 'text';
    file?: string;
    decorations?: DecorationItem[];
    maxHeight?: CSSLength;
    class?: string;
  } = $props();

  let out = $state(
    shiki.codeToHtml(code, {
      lang,
      theme: "everforest-dark",
      decorations,
    }),
  );

  $effect(() => {
    out = shiki.codeToHtml(code, {
      lang,
      theme: "everforest-dark",
      decorations,
    });
  });
</script>

<div class="code-block {className}">
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
    {@html out}
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
    padding: 0.5rem 0.5rem;
    /* padding-left: 0.5rem; */
    /* font-family: var(--font-mono); */
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .file-details {
    background: var(--accent-100);
    border-radius: var(--radius-half);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .file-details:has(:global(.file-name)) {
    padding-right: 0.5rem;
  }

  /* .loading {
    display: grid;
    align-items: center;
    justify-content: center;
  } */

  .file-details .language {
    font-weight: 800;
    color: var(--text-em);
    background: var(--accent-200);
    border-radius: var(--radius-half);
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
    display: block;
    overflow: auto;
  }

  .code-block :global(.line.highlighted) {
    background: rgba(142, 150, 170, 0.14);
    width: calc(100% + 2rem);
    display: inline-block;
    margin: 0 -1rem;
    padding: 0 1rem;
  }

  .code-block :global(.line) {
    background: transparent;
    transition: background 300ms;
  }

  .copy-button {
    border-radius: var(--radius-half);
    background: var(--accent-100);
    padding: 0.25rem 0.5rem;
    transition: 200ms;
  }

  .copy-button:hover {
    background: var(--accent-200);
  }
</style>
