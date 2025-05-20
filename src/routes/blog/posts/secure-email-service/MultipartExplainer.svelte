<script lang="ts">
  import CodeBlock, { highlight } from "$lib/components/CodeBlock.svelte";
  import type { Segment } from "motion";
  import { animate } from "motion";
  import type { DecorationItem } from "shiki";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  // TODO we do this easeInOut hack but i have a suspicion if i reverse the sequence
  const email0Seq: (Segment | null)[] = [
    ["#email0", { x: 0, display: "block" }],
    ["#email0", { x: -1200, display: "none" }],
  ];

  const email1Seq: (Segment | null)[] = [
    ["#email1", { x: 1200, display: "none" }],
    ["#email1", { x: 0, display: "block", justifySelf: "center" }],
    null,
    null,
    ["#email1", { x: 0, display: "block", margin: 0 }],
    ["#email1", { margin: "0.25rem 0" }],
  ];

  const email1MultipartInit: Segment = [
    "#email1-multipart",
    {
      color: "var(--text-em)",
      fontWeight: 700,
      backgroundColor: "var(--blue-200)",
    },
  ];
  const email1MultipartSeq: (Segment | null)[] = [
    email1MultipartInit,
    email1MultipartInit,
    [
      "#email1-multipart",
      { color: "var(--text-primary)", backgroundColor: "var(--blue-100)", fontWeight: 400 },
    ],
  ];

  const email1AdditionalHeadersInit: Segment = [
    "#email1-additional-headers",
    {
      height: 0,
      color: "var(--text-em)",
      fontWeight: 700,
      backgroundColor: "var(--blue-100)",
    },
  ];

  const email1AdditionalHeadersHold: Segment = [
    "#email1-additional-headers",
    {
      height: "auto",
      color: "var(--text-primary)",
      fontWeight: 400,
      backgroundColor: "var(--blue-100)",
    },
  ];
  const email1AdditionalHeadersSeq: (Segment | null)[] = [
    null,
    email1AdditionalHeadersInit,
    [
      "#email1-additional-headers",
      {
        height: "auto",
        color: "var(--text-em)",
        backgroundColor: "var(--blue-200)",
        fontWeight: 700,
      },
    ],
    email1AdditionalHeadersHold,
    email1AdditionalHeadersHold,
    email1AdditionalHeadersInit,
  ];

  const email1Chunk0Init: Segment = [
    "#email1-chunk0",
    {
      height: 0,
      margin: "0.5rem 0",
      "--chunk-color": "var(--purple-100)",
    },
  ];
  const email1Chunk0Seq: (Segment | null)[] = [
    email1Chunk0Init,
    null,
    email1Chunk0Init,
    [
      "#email1-chunk0",
      {
        height: "auto",
        margin: 0,
        "--chunk-color": "var(--purple-200)",
      },
    ],
    [
      "#email1-chunk0",
      {
        height: "auto",
        margin: 0,
        opacity: 1,
        "--chunk-color": "var(--purple-100)",
      },
    ],
  ];

  const email1Chunk1Init: Segment = [
    "#email1-chunk1",
    { height: 0, "--chunk-color": "var(--purple-100)" },
  ];
  const email1Chunk1Seq: (Segment | null)[] = [
    email1Chunk1Init,
    null,
    null,
    email1Chunk1Init,
    [
      "#email1-chunk1",
      {
        height: "auto",
        "--chunk-color": "var(--purple-200)",
      },
    ],
    [
      "#email1-chunk1",
      {
        height: "auto",
        "--chunk-color": "var(--purple-100)",
      },
    ],
  ];

  const revealWithSmime: (Segment | null)[] = [
    [".reveal-with-smime", { height: 0, "--header-gap": 0, overflow: "hidden" }],
    null,
    null,
    null,
    [
      ".reveal-with-smime",
      { height: 0, "--header-gap": 0, "--side-gap": "1rem", overflow: "hidden" },
    ],
    [
      ".reveal-with-smime",
      { height: "auto", "--header-gap": "0.5rem", "--side-gap": 0, overflow: "visible" },
    ],
  ];

  const smime: (Segment | null)[] = [
    ["#smime", { padding: 0, display: "none", backgroundColor: "transparent" }],
    ["#smime", { padding: 0, display: "grid", backgroundColor: "transparent" }],
    null,
    null,
    ["#smime", { padding: 0, display: "grid", backgroundColor: "var(--orange-100)" }],
    ["#smime", { padding: "1rem", backgroundColor: "var(--orange-100)" }],
  ];

  const sigBlock: (Segment | null)[] = [
    ["#sig-block", { margin: 0 }],
    null,
    null,
    null,
    null,
    ["#sig-block", { margin: 0 }],
    ["#sig-block", { margin: "0.25rem 0" }],
  ];

  const revealWithSigBlock: (Segment | null)[] = [
    [".reveal-with-sigblock", { height: 0 }],
    null,
    null,
    null,
    null,
    [".reveal-with-sigblock", { height: 0 }],
    [".reveal-with-sigblock", { height: "auto" }],
  ];

  const mimeHighlightedHeadersHold: Segment = [
    "#mime-highlighted-headers",
    {
      height: "auto",
      color: "var(--text-primary)",
      fontWeight: 400,
      backgroundColor: "var(--orange-100)",
    },
  ];
  const mimeHighlightedHeadersSeq: (Segment | null)[] = [
    mimeHighlightedHeadersHold,
    null,
    null,
    null,
    null,
    [
      "#mime-highlighted-headers",
      {
        height: "auto",
        color: "var(--text-em)",
        backgroundColor: "var(--orange-200)",
        fontWeight: 700,
      },
    ],
    mimeHighlightedHeadersHold,
  ];

  const decorations: (DecorationItem | null)[] = [
    null,
    highlight(12),
    highlight(13, 16),
    highlight(16),
    highlight(18, 20),
    highlight(21, 23),
    highlight(21, 23),
  ];

  const animationSequences = [
    email0Seq,
    email1Seq,
    email1AdditionalHeadersSeq,
    email1MultipartSeq,
    email1Chunk0Seq,
    email1Chunk1Seq,
    smime,
    revealWithSmime,
    sigBlock,
    revealWithSigBlock,
    mimeHighlightedHeadersSeq,
  ];

  const time = $state(new Tween(0, { easing: cubicOut }));
  let decoration = $derived(decorations[Math.min(Math.max(0, time.target), decorations.length)]);

  $effect(() => {
    (window as any).move = (a = 1) => {
      time.target += a;
    };
    animate(".visual", { display: "grid" }, { duration: 0 });
  });

  $effect(() => {
    for (const animationSeq of animationSequences) {
      const animation = animationSeq[Math.min(Math.max(0, time.target), animationSeq.length - 1)];
      if (!animation) continue;
      animate(...(animation as [string, string]), {
        ease: "circOut",
      });
    }

    for (let i = 0; i < 7; i++) {
      if (time.target == i) {
        animate(`#slide-${i}`, { x: 0, display: "block", height: "auto" }, { ease: "easeOut" });
      } else {
        const x = (i - time.target) * 1200;
        animate(`#slide-${i}`, { x, display: "none", height: 0 }, { ease: "easeOut" });
      }
    }
  });
</script>

<div class="oversized">
  <div class="container">
    <CodeBlock
      lang="python"
      file="util.py"
      decorations={decoration ? [decoration] : []}
      code={`# ... imports

def generate_email(
    sender: str,
    recipient: str,
    subject: str,
    content: str,
    html: bool = False,
    sign: bool = False,
    cert: str = '',
    key: str = '',
) -> str:
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = recipient
    msg['Subject'] = subject
    msg.attach(MIMEText(content))

    if html:
        msg.attach(MIMEText(content, 'html'))        

    if sign:
        return smail.sign_message(msg, key.encode(), cert.encode()).as_string()

    return msg.as_string()

# ... certificate stuff
`}
    />
    <div class="visualizer">
      <!-- prettier-ignore -->
      <div class="visual">
    <!-- stage -->
    <div class="email" id="email0">
      <div class="headers">
From: aiden@voxal.dev
To: you@your.domain
Subject: Hello!
      </div>
      <div>I'm here to contact you about your car's extended warrenty.</div>
    </div>

    <div class="smime" id="smime">
      <div class="reveal-with-smime">
        <div id="smime-headers" class="headers">Content-Type: multipart/signed; protocol="application/pkcs7-signature"; micalg="sha-256"; boundary="===============6659831451336357047=="
MIME-Version: 1.0<div id="mime-highlighted-headers" class="full-length">
From: admin@ses
To: user@ses
Subject: Hello new user!</div>
        </div>
      </div>
<div class="reveal-with-smime">This is an S/MIME signed message</div>
<div class="reveal-with-smime">--===============6659831451336357047==</div>
      <div class="email" id="email1">
        <div class="headers">
          <div id="email1-multipart" class="full-length">Content-Type: multipart/mixed; boundary="===============8925782044634493082=="</div>
MIME-Version: 1.0
          <div id="email1-additional-headers" class="full-length">From: admin@ses
To: user@ses
Subject: Hello new user!</div>
        </div>
      <div>--===============8925782044634493082==</div>
      <div id="email1-chunk0">
        <div class="multipart-chunk"><div class="headers">Content-Type: text/plain; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit</div>

&lt;p&gt;Thanks for signing up to secure email service!&lt;/p&gt;</div>
      </div>

      <div id="email1-chunk1">
        <div>--===============8925782044634493082==</div>
        <div class="multipart-chunk"><div class="headers">Content-Type: text/html; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit</div>

&lt;p&gt;Thanks for signing up to secure email service!&lt;/p&gt;</div>
      </div>

        <div>--===============8925782044634493082==--</div>
      </div>
      <div class="reveal-with-sigblock">
        --===============6659831451336357047==
        <div class="email" id="sig-block">
          <div class="headers">
Content-Type: application/pkcs7-signature; name="smime.p7s"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="smime.p7s"
Content-Description: S/MIME Cryptographic Signature
          </div>
MIIFLQYJKoZIhvcNAQcCoIIFHjCCBRoCAQExDz ...
        </div>
      </div>
      <div class="reveal-with-smime">--===============6659831451336357047==--</div>
    </div>
  </div>

      <div class="prose-container">
        <div class="prose" id="slide-0">
          <p>
            Before we continue, we should probably talk about how emails, and how email signing
            work. Emails are just
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages"
              >HTTP messages</a
            >
            (sans the start line). This is outlined in
            <a href="https://www.rfc-editor.org/rfc/rfc5322">RFC 5322</a>.
          </p>

          <p>
            An email has some required headers like <code>From</code> and <code>To</code>, but it
            shares many characteristics of HTTP messages. Crucially, the headers and body are
            seperated by an empty line.
          </p>
        </div>

        <div class="prose" id="slide-1">
          <p>
            The original email RFC only allowed for plaintext emails, so an extension known as
            <a href="https://en.wikipedia.org/wiki/MIME">MIME</a> was created to allow for email attachments
            and other character sets than ASCII.
          </p>
          <p>
            One of the features of MIME are multipart bodies, which splits the body up into multiple
            parts. Each part is seperated by a boundary defined in the <code>Content-Type</code> header.
          </p>
          <p>
            <code>MIMEMultipart()</code> automatically generates a random boundary, and creates a
            body with a single empty chunk. Each chunk is seperated by a line with
            <code>--&lt;boundary&gt;</code>, and the body is ended with
            <code>--&lt;boundary&gt;--</code>
          </p>
        </div>

        <div class="prose" id="slide-2">
          <p>The function then sets some headers based on the arguments passed in.</p>
        </div>

        <div class="prose" id="slide-3">
          <p>
            Attaching a <code>MIMEText</code> block creates a new chunk. By default, the
            <code>Content-Type</code> of this new chunk is <code>text/plain</code>
          </p>
          <p>Each chunk is its own HTTP message. with it's own headers and body.</p>
        </div>

        <div class="prose" id="slide-4">
          <p>
            If the <code>html</code> argument is <code>True</code>, another chunk of type
            <code>text/html</code> is added.
          </p>
        </div>

        <div class="prose" id="slide-5">
          <p>
            The email is signed if <code>sign</code> is <code>True</code>, this is achieved by
            wrapping the entire message with a signing message with the <code>Content-Type</code> of
            <code>multipart/signed</code>. The surrounding message is also created by
            <code>MIMEMultipart()</code> so it's own random barrier.
          </p>
          <p>Notice how the headers that originally got assigned moved out to the outer message.</p>
        </div>

        <div class="prose" id="slide-6">
          <p>
            Finally the a signature chunk is added which allows OpenSSL to ensure that the message
            contents are valid.
          </p>
          <p>
            OpenSSL returns (through stdout) the unwrapped (first blue chunk) message for further
            use.
          </p>
        </div>
      </div>
      <div class="controls">
        <div class="move-btns">
          <button onclick={() => (time.target = Math.max(0, time.target - 1))} class="move-btn"
            >&lt;</button
          >
          <button onclick={() => (time.target = Math.min(6, time.target + 1))} class="move-btn"
            >&gt;</button
          >
        </div>
        <div class="progress">
          {#each { length: 6 } as _, i}
            <div class="slider">
              <div
                class="slider-inside"
                style={`width:${Math.max(time.current - i, 0) * 100}%`}
              ></div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .oversized {
    width: 100vw;
  }

  .container {
    display: flex;
    gap: 1rem;
    margin: 0 2rem;
    :global(.code-block) {
      align-self: center;
    }
  }

  .visualizer {
    background: var(--surface-150);
    padding: 2rem;
    margin: 1.6rem 0;
    border-radius: var(--radius-1);
    gap: 2rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .prose {
    width: auto;
  }

  .visual {
    min-height: 16rem;
    /* display: grid; */
    display: none;
    align-items: center;
    justify-content: center;
  }

  .visual > * {
    grid-column-start: 1;
    grid-row-start: 1;
  }

  .email {
    background-color: var(--blue-100);
    padding: 1rem;
    white-space: pre-line;

    .full-length {
      margin: 0 -1rem;
      padding: 0 1rem;
    }
  }

  .multipart-chunk {
    padding: 1rem;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    background-color: var(--chunk-color);
  }

  .smime {
    padding: 1rem;
    max-width: 36rem;
    background-color: var(--orange-100);
    .full-length {
      margin: 0 -1rem;
      padding: 0 1rem;
    }
  }

  .headers {
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    white-space: pre-line;
    font-family: var(--font-mono);

    .email > & {
      border-bottom: 1px var(--blue-200) solid;
    }

    .multipart-chunk > & {
      border-bottom: 1px var(--purple-300) solid;
    }
  }

  #smime-headers {
    border-bottom: min(var(--header-gap), 1px) var(--orange-300) solid;
    padding-left: var(--side-gap);
    padding-right: var(--side-gap);

    padding-bottom: var(--header-gap);
    margin-bottom: var(--header-gap);
  }

  #email1-additional-headers,
  #email1-chunk0,
  #email1-chunk1,
  .reveal-with-smime,
  .reveal-with-sigblock {
    overflow: hidden;
  }

  .prose-container {
    display: grid;
    /* justify-content: center;
    align-items: center; */
  }

  .prose-container > * {
    grid-column-start: 1;
    grid-row-start: 1;
  }

  .controls {
    width: 100%;
    margin-top: auto;
  }

  .progress {
    height: 0.25rem;
    display: grid;
    gap: 0.25rem;
    grid-template-columns: repeat(6, 1fr);
  }

  .slider {
    background-color: var(--surface-300);
    height: 100%;
    overflow: hidden;
  }

  .slider-inside {
    background-color: var(--surface-400);
    height: 100%;
  }

  .move-btn {
    font-size: 2rem;
    height: 3rem;
    width: 100%;
    background-color: var(--surface-200);
    transition: 300ms;
    margin-bottom: 1rem;
    border-radius: 0 var(--radius-1) var(--radius-1) 0;

    &:first-of-type {
      border-radius: var(--radius-1) 0 0 var(--radius-1);
    }
  }

  .move-btn:hover {
    font-weight: 700;
    background-color: var(--surface-300);
  }

  .move-btns {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: 1fr 1fr;
  }

  /* repeating-linear-gradient(45deg, red 0rem, red 0.5rem, transparent 0.5rem, transparent 1rem) */
</style>
