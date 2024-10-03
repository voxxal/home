<script context="module">
  import FileDownload from "$lib/components/FileDownload.svelte";
  import { detect } from "detect-browser";

  export const metadata = {
    title: "cca common app grade importer",
    published: "2024-10-02",
  };
  const browser = detect();
  const tmDownloadLink =
    browser?.name === "firefox"
      ? "https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/"
      : "https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo";
</script>

<p>I come bearing gifts.</p>

<p>
  <FileDownload download={false} path="/files/capp-grade-importer/aeries.user.js">
    aeries.user.js
  </FileDownload>
  and
  <FileDownload download={false} path="/files/capp-grade-importer/common-app.user.js">
    common-app.user.js
  </FileDownload>
  are two Tampermonkey scripts that let you export grades from aeries and then import them into common
  app.
</p>

<h2>Installation</h2>

<p>
  In order to use the script, you must first install Tampermonkey. You can install it from
  <a href={tmDownloadLink}>here</a>.
</p>

<p>
  After installing Tampermonkey, click on these links and press <code>Install</code>
</p>
<p>
  <FileDownload download={false} path="/files/capp-grade-importer/aeries.user.js">
    aeries.user.js
  </FileDownload>
  <br />
  <FileDownload download={false} path="/files/capp-grade-importer/common-app.user.js">
    common-app.user.js
  </FileDownload>
</p>

<h2>Usage</h2>

<p>
  After installing the scripts, go to the
  <a href="https://sandieguito.aeries.net/student/Transcripts.aspx">Aeries Transcripts page</a>
  and press the "Export Grades" button.
</p>

<p>
  With the grades copied to your clipboard, go to the
  <a href="https://apply.commonapp.org/common/13/57">Common App Courses & Grades page</a>, and press
  the "Import Grades" button. Paste the encoded grades into the box and press enter.
</p>

<p>Then press any of the new buttons and <b>don't touch anything until it stops</b>.</p>

<p>
  After it stops doing anything, fill in any details that it didn't fill in for you (and let me know
  so I can update it.)
</p>

<p>
  Let me know if you have any issues or comments. Best way to reach me is through Discord. It's in
  the footer.
</p>
