<script>
  import Prism from "prismjs";
  let className = ""
  
  export let code = "";
  export let lang = "js";
  let formattedCode = "";
  $: if (typeof Prism !== "undefined" && code) {
    formattedCode = Prism.highlight(code, Prism.languages[lang], lang);
  }
  export { className as class }
</script>

<pre class="language-{lang} {className}"><code class="language-{lang}">{@html formattedCode}</code></pre>
