<script lang="ts">
  import adminBotVideo from "./admin-bot.mp4";
  import CodeBlock, { highlight } from "$lib/components/CodeBlock.svelte";
  import type { DecorationItem } from "shiki";

  let playbackTime: number = $state(0);
  const decorations: DecorationItem[] = [
    highlight(4, 8),
    highlight(10, 13),
    highlight(15, 24),
    highlight(26, 32),
    highlight(34, 45)
  ];

  const timestamps = [0, 1, 5.4, 8.7, 11.5].toReversed();

  let decoration = $state(decorations[0]);

  $effect(() => {
    for (const i in timestamps) {
      if (playbackTime > timestamps[i]) {
        decoration = decorations[timestamps.length - +i - 1];
        return;
      }
    }
    decoration = decorations[0];
  });
</script>

<div class="oversized">
  <div class="container">
    <div class="admin-video">
      <video src={adminBotVideo} controls bind:currentTime={playbackTime}
        ><track kind="captions" /></video
      >
    </div>
    <div class="admin-code">
      <CodeBlock
        lang="python"
        file="admin_bot.py"
        decorations={[decoration]}
        code={`async def bot():
  async with asyncio.timeout(12):
    async with async_playwright() as p:
      browser = await p.chromium.launch()
      page = await browser.new_page()
      await page.goto('http://localhost:8000')
      
      await page.evaluate('flag => localStorage.setItem("flag", flag)', flag)
      
      # login
      await page.type('[name=username]', 'admin@ses')
      await page.type('[name=password]', password)
      await page.click('button')

      # click on first email
      await page.wait_for_url(
        'http://localhost:8000/inbox.html', 
        wait_until='networkidle'
      )
      try:
        await page.click('tbody tr', timeout=1000)
      except:
        await browser.close()
        return

      # click reply button
      await page.wait_for_url(
        'http://localhost:8000/email.html?id=*',
        wait_until='networkidle'
      )
      await expect(page.locator('#reply')).to_have_attribute('href', re.compile('.*'))
      await page.click('#reply button')

      # reply to email
      await page.wait_for_url(
        'http://localhost:8000/reply.html?id=*', 
        wait_until='networkidle'
      )
      await page.type('textarea', '\\n\\n'.join([
        'We\\'ve gotten your message and will respond soon.',
        'Thank you for choosing SES!',
        'Best regards,',
        'The Secure Email Service Team'
      ]))
      await page.click('#reply button')
      await browser.close()

asyncio.run(bot())`}
      />
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
  }

  .admin-code {
    flex: 1;
  }

  .admin-video {
    margin: 1.6rem 0;
    & > video {
      border-radius: var(--radius-1);
      position: sticky;
      top: 1.6rem;
    }
  }
</style>
