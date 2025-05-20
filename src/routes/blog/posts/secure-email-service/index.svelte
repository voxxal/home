<script module>
  import CodeBlock, { highlight } from "$lib/components/CodeBlock.svelte";
  import AdminBotExplainer from "./AdminBotExplainer.svelte";
  import MultipartExplainer from "./MultipartExplainer.svelte";

  export const metadata = {
    title: "secure email service",
    published: "2025-03-17",
    layout: "header",
    hidden: true,
  };
</script>

<article class="prose">
  <p>
    Another year, another picoCTF, which means it's time for another ehhthing challenge! This time
    he's teamed up with strellic, and he promised he cooked...
  </p>
  <blockquote
    cite="https://discord.com/channels/575006934089072650/1333577067949985822/1348054793620422656"
  >
    guys i promise i cooked so hard this year solve solve solve solve 😉
  </blockquote>
  <cite>ehhthing</cite>

  <p>
    Well, awesome, unfortunately for ehhthing I got nerd-sniped by Pachinko Revisited with my
    teammate <a href="https://unvariant.pages.dev/">unvariant</a>, so I didn't get to this challenge
    until the second day. Nevertheless, ehhthing was definitely right and this challenge was an
    absolute blast to solve.
  </p>

  <h2>Surveying the challenge</h2>
  <p>
    Contained in the provided files is a FastAPI server, attached to a redis instance as a database,
    along with a frontend of plain html files. The application lets users email each other.
  </p>
  <p>We'll look at the backend first before moving onto the front end</p>
  <h3>The Backend</h3>
  <p>
    The first thing the server does when its started is connect to the redist database and create 2
    users. The admin user, which the admin bot uses, and the "user" user which we get access to.
  </p>
  <CodeBlock
    lang="python"
    file="init.py"
    code={`async def init():
    if await db.r.get('initialized') is not None:
        return await db.r.aclose() # type: ignore
    
    await db.r.set('initialized', 1)

    ca_pub, ca_priv = util.generate_root_cert()
    await db.set_root_cert(
        ca_pub.public_bytes(serialization.Encoding.PEM).decode()
    )

    admin_pub, admin_priv = util.export(
        util.generate_sign_cert('admin@ses', ca_pub, ca_priv)
    )
    admin = User(
        username='admin@ses',
        password=secrets.token_hex(16),
        public_key=admin_pub,
        private_key=admin_priv
    )
    await db.set_user('admin@ses', admin)

    user = User(
        username='user@ses',
        password=secrets.token_hex(16)
    )
    await db.set_user('user@ses', user)
    # ... an email from admin to the user is created`}
  />
  <p>
    The admin gets a public-private key pair, which lets the admin send signed emails. The logic for
    sending emails can be found in <code>util.py</code>.
  </p>
  <MultipartExplainer />
  <p>
    This function is called in the <code>/api/send</code> endpoint defined in <code>main.py</code>
  </p>
  <CodeBlock
    class="oversized"
    lang="python"
    file="main.py"
    code={`@app.post('/api/send')
async def send(
    user: Annotated[User, Depends(db.request_user)],
    to: Annotated[str, Body()],
    subject: Annotated[str, Body()],
    body: Annotated[str, Body()]
):
    # make sure the email we're sending to is valid
    recipient = await db.get_user(to)

    if len(user.public_key) == 0:
        msg = util.generate_email(
            sender=user.username,
            recipient=recipient.username,
            subject=subject,
            content=body,
        )
    else:
        msg = util.generate_email(
            sender=user.username,
            recipient=recipient.username,
            subject=subject,
            content=template.render(
                title=subject,
                content=body
            ),
            html=True,
            sign=True,
            cert=user.public_key,
            key=user.private_key
        )

    email_id = str(uuid.uuid4())
    await db.send_email(recipient, email_id, msg)

    return email_id
`}
  />
  <p>
    Since our user does not have a public key, it can't send signed emails, meaning the admin is the
    only one that can send these special signed email. Let's look at the front end to see how its
    handling signed emails.
  </p>
  <h3>The Frontend</h3>
  <p>
    The only files we really care about in the frontend are <code>email.html</code> and
    <code>reply.html</code>. Glancing over the other files shows us that there really isn't anything
    important (i.e vulnerable) on those pages.
  </p>

  <p>
    <code>email.html</code> is the first file of interest.
  </p>
  <CodeBlock
    class="oversized"
    lang="html"
    file="email.html"
    decorations={[highlight(32, 41)]}
    code={`<div>
  <a href="/inbox.html"><button>Back to inbox</button></a>
  <a id="reply"><button style="float: right">Reply</button></a>
</div>
<h4 id="subject"></h4>
<div id="content"></div>
${"<"}script type="module">
  import { email, requireLogin, rootCert, markRead } from './src/api.js'
  import { getSigned } from './src/smime.js';
  import { parse } from './src/email.js'

  await requireLogin();

  const id = new URL(window.location.href).searchParams.get('id');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)) {
    alert('invalid id');
    location.href = '/inbox.html';
  }

  await markRead(id);

  const msg = await email(id);
  const parsed = await parse(msg.data);

  document.getElementById('subject').innerText = parsed.subject;

  const replyUrl = new URL('/reply.html', origin);
  replyUrl.searchParams.set('id', id);
  document.getElementById('reply').href = replyUrl;
  
  const content = document.getElementById('content');
  if (parsed.html) {
    const signed = await getSigned(msg.data, await rootCert());
    if (signed) {
      const { html } = await parse(signed);
      const shadow = content.attachShadow({ mode: 'closed' });
      shadow.innerHTML = \`${"<c"}style>:host { all: initial }</style>\${html}\`;
    } else {
      content.style.color = 'red';
      content.innerText = 'invalid signature!';
    }
  } else {
    const pre = document.createElement('pre');
    pre.style.overflow = 'auto';
    pre.innerText = parsed.text;
    content.appendChild(pre);
  }
</script>
`}
  />
  <p>
    <code>email.html</code> first requests the email of said id from the server, then parses it
    using this <code>parse</code> function. If the parser returns something in the HTML field, and its
    properly signed, the html gets directly embedded onto the page.
  </p>

  <p>Let's take a look at how the <code>parse</code> function works and what it returns</p>
  <CodeBlock
    class="oversized"
    lang="js"
    file="src/email.js"
    decorations={[highlight(12)]}
    code={`const parser = new WebAssembly.Module(await (await fetch('/wasm/parser.wasm')).arrayBuffer());

export const parse = async (email) => {
    let stdout = '';

    const args = ['parser'];
    const env = [];
    const fds = [
        new OpenFile(new File([])),
        ConsoleStdout.lineBuffered(line => stdout += line + '\\n'),
        ConsoleStdout.lineBuffered(() => {}),
        new PreopenDirectory('/', [
            ['email.eml', new File(new TextEncoder('utf-8').encode(email))],
        ])
    ]

    const wasi = new WASI(args, env, fds, { debug: false });

    const instance = await WebAssembly.instantiate(parser, {
        wasi_snapshot_preview1: wasi.wasiImport
    });

    wasi.start(instance);
    
    return JSON.parse(stdout);
}`}
  />
  <p>
    <a href="https://wasi.dev/">WASI</a> is a interface that allows WebAssembly to access files and other
    things on a system. It's not really too important to understand for this challenge, its used here
    to pass our email to the WebAssembly program.
  </p>
  <p>
    We can test this locally using <a href="https://wasmtime.dev/">Wasmtime</a>. First we'll need an
    email to test it on, we can get one by just emailing ourselves on the website, and looking at
    the network tab for our email.
  </p>

  <p>
    Just write the email to the file <code>email.eml</code> and invoke Wasmtime on it.
  </p>
  <div class="oversized">
    <CodeBlock
      lang="text"
      file="email.eml"
      code={`Content-Type: multipart/mixed; boundary="===============8135674181858065264=="
MIME-Version: 1.0
From: user@ses
To: user@ses
Subject: According to all known laws of aviation, there is no way a bee should be able to fly.

--===============8135674181858065264==
Content-Type: text/plain; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit

Its wings are too small to get its fat little body off the ground.
--===============8135674181858065264==--
`}
    />
    <CodeBlock
      lang="bash"
      class="oversized"
      code={`$ wasmtime --dir . frontend/public/wasm/parser.wasm
{
  "from": "user@ses",
  "html": null,
  "subject": "According to all known laws of aviation, there is no way a bee should be able to fly.",
  "text": "Its wings are too small to get its fat little body off the ground.",
  "to": "user@ses"
}`}
    />
  </div>
  <p>
    Looks like the parser is selecting some important headers like <code>From</code>,
    <code>To</code> and <code>Subject</code>, as well as parsing out parts of our body.
  </p>
  <p>
    Let's see what happens when we put a chunk of type <code>text/html</code> into our email. We'll just
    manually edit in a new chunk.
  </p>
  <div class="oversized">
    <CodeBlock
      lang="text"
      file="email.eml"
      decorations={[highlight(13, 20)]}
      code={`Content-Type: multipart/mixed; boundary="===============8135674181858065264=="
MIME-Version: 1.0
From: user@ses
To: user@ses
Subject: According to all known laws of aviation, there is no way a bee should be able to fly.

--===============8135674181858065264==
Content-Type: text/plain; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit

Its wings are too small to get its fat little body off the ground.

--===============8135674181858065264==
Content-Type: text/html; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
 
<h1>Its wings are too small to get its fat little body off the ground.</h1>
--===============8135674181858065264==--

`}
    />
    <CodeBlock
      lang="bash"
      class="oversized"
      code={`$ wasmtime --dir . frontend/public/wasm/parser.wasm
{
  "from": "user@ses",
  "html": null,
  "subject": "According to all known laws of aviation, there is no way a bee should be able to fly.",
  "text": "Its wings are too small to get its fat little body off the ground.",
  "to": "user@ses"
}`}
    />
  </div>
  <p>Cool, so that means that the extra HTML chunk that is added to signed messages is parsed.</p>

  <p>Now let's take a look at <code>reply.html</code>.</p>

  <CodeBlock
    class="oversized"
    lang="html"
    file="reply.html (truncated)"
    decorations={[highlight(23, 25), highlight(32)]}
    code={`<a href="/inbox.html"><button>Back to inbox</button></a>
<form id="reply">
  <h4 id="subject"></h4>
  <textarea 
    name="body"
    style="width: 100%; height: 50vh; font-family: monospace;"
    placeholder="content" 
  ></textarea>
  <br>
  <button>Reply</button>
</form>
${"<"}script type="module">
  import { email, requireLogin, send } from './src/api.js'
  import { parse } from './src/email.js'

  await requireLogin();

  const id = new URL(window.location.href).searchParams.get('id');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)) {
    alert('invalid id');
    location.href = '/inbox.html';
  }

  const parsed = await parse((await email(id)).data);
  const subject = \`Re: \${parsed.subject}\`;
  document.getElementById('subject').innerText = subject;

  document.getElementById('reply').onsubmit = async e => {
    e.preventDefault();

    const body = document.querySelector('[name=body]').value;
    try {
      await send(parsed.from, subject, body);
    } catch(e) {
      alert(e);
      return;
    }
    
    alert('sent!');
    location.href = '/inbox.html';
  }
</script>
`}
  />
  <p>
    So it gets the email, parses it, uses the parsed subject to set the new subject, and then
    sends the email based on the <code>parsed.from</code> field.
  </p>

  <h3>Admin Bot</h3>

  <AdminBotExplainer />

  <p>
    Looks like we would be able to get XSS on this page if the email is signed properly. So that
    means that any emails sent by the admin would be able to embed arbitrary HTML. There are a few
    paths we could go down here, but the most obvious one is to forge the signature.
  </p>

  <p>
    We actually tried to find a bug in OpenSSL for quite a while but it ended up not working out, so
    we stopped trying to go down that path.
  </p>

  <p>
    Lets take a look at the other thing the admin does, replying to our email. This is largely
    controlled by <code>reply.html</code> so I took a look at this file.
  </p>

  <p>
    I've been banging my head at this challenge for several hours now, but I had a revelation when I
    saw this code. When sending the email, the recipient was set to <code>parsed.from</code>. This
    meant <em>if everything went right</em> we had a solve path.
  </p>
</article>
<aside class="times"></aside>

<style>
  .placeholder-thing {
    background: var(--surface-150);
    height: 8rem;
    display: grid;
    align-items: center;
    justify-content: center;
  }
</style>
