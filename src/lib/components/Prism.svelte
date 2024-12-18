<script lang="ts">
  import { run } from 'svelte/legacy';

  import Prism from "prismjs";
  
  interface Props {
    class?: string;
    code?: string;
    lang?: string;
  }

  let { class: className = "", code = "", lang = "js" }: Props = $props();
  let formattedCode = $state("");
  run(() => {
    if (typeof Prism !== "undefined" && code) {
      formattedCode = Prism.highlight(code, Prism.languages[lang], lang);
    }
  });
  
</script>

<pre class="language-{lang} {className}"><code class="language-{lang}">{@html formattedCode}</code></pre>
