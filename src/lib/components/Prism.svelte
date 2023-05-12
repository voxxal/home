<script>
  import Prism from "prismjs";
  
  export let code = "";
  export let lang = "js";
  let formattedCode = "";
  $: if (typeof Prism !== "undefined" && code) {
    formattedCode = Prism.highlight(code, Prism.languages[lang], lang);
  }
</script>

<pre class="language-{lang}"><code class="language-{lang}">{@html formattedCode}</code></pre>
