<script module>
  export const metadata = {
    title: "simple port forwarding",
    published: "2026-01-08",
  };
</script>

<script lang="ts">
  import CodeBlock from "$lib/components/CodeBlock.svelte";
</script>

<p>For whatever reason, ngrok decided to suspend my account some time ago. Because of that I've decided to setup a port forwarding service on my own. Here's a quick walkthrough of what I did for anyone else's future reference :)</p>
<p><strong>You will need:</strong></p>
<ul>
  <li>A domain</li>
  <li>A server of some sorts (With a dedicated IP address)</li>
</ul>
<p>
  First, install <a href="https://github.com/fatedier/frp">frps</a> onto your server by extracting and placing the frps binary into <code>/usr/bin</code>.
  Then create a config file at <code>/etc/frp/frps.toml</code> with the following config.
</p>
<CodeBlock code={`bindPort = 7000
vhostHTTPPort = 1337 
subDomainHost = "tun.<your-domain>"
auth.token = "<password>"`} file="frps.toml" lang="toml" />
<p>Next, setup the caddy route to point at <code>vhostHTTPPort</code>.</p>
<CodeBlock code={`https://*.tun.voxal.dev {
    tls {
        // you'll need to configure caddy to solve the dns challenge
        // https://caddyserver.com/docs/automatic-https#dns-challenge
    }

    reverse_proxy localhost:1337
}`} file="Caddyfile" />
<p>Make sure to also setup the DNS records to point to your IP address!</p>
<CodeBlock code={`A        *.tun.<your-domain>        <server-ip-address>`} />
<p>Finally on your client machine, install <code>frpc</code> and then set up a command to let you forward a port.</p>
<CodeBlock class="oversized" code={`function random_flower
    set flowers rose tulip sunflower daisy lily orchid daffodil \\
        iris peony lavender dahlia marigold poppy violet jasmine \\
        magnolia cherry-blossom azalea begonia camellia crocus \\
        freesia gardenia hibiscus pansy zinnia aster
    echo $flowers[(random 1 (count $flowers))]
end

function tun
    argparse 'd/subdomain=' -- $argv
    or return

    set subdomain $(random_flower)
    set -ql _flag_subdomain && set subdomain $_flag_subdomain

    echo "Forwarding port $argv[1] to https://$subdomain.tun.<your-domain>"
    frpc http \\
        --proxy-name tun \\
        --server-addr <server-ip-address> \\
        --local-port $argv[1] \\
        --sd $subdomain \\
        --token "<password>"
end`} file="tun.fish" lang="fish"} />
<p>I use fish so its a fish script, but feel free to translate it into bash. Now you can use <code>tun 5000</code> or any other port number to port forward an HTTP service  to a random subdomain at <code>*.tun.&lt;your-domain&gt;</code>. Implementing tcp port forwarding is left as an exercise for the reader.</p>
<p>That's all! Happy Hacking!</p>
