<script lang="ts">
  import type { Range } from "$lib/util";

  export let method:
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE"
    | "PATCH";

  let methodColor: string | null = null;

  $: {
    switch (method) {
      case "GET":
        methodColor = "text-green-400";
        break;
      case "HEAD":
        methodColor = "text-cyan-400";
        break;
      case "POST":
        methodColor = "text-yellow-400";
        break;
      case "PUT":
        methodColor = "text-sky-400";
        break;
      case "DELETE":
        methodColor = "text-red-400";
        break;
      case "CONNECT":
        methodColor = "text-neutral-400";
        break;
      case "OPTIONS":
        methodColor = "text-indigo-400";
        break;
      case "TRACE":
        methodColor = "text-neutral-400";
        break;
      case "PATCH":
        methodColor = "text-purple-400";
        break;
    }
  }
  export let url: string;
  export let status: Range<100, 599>;
  let statusColor: string | null = null;
  $: {
    if (status >= 200 && status < 300) {
      statusColor = "bg-green-600 text-blot";
    } else if (status >= 300 && status < 400) {
      statusColor = "bg-yellow-600 text-blot";
    } else if (status >= 400 && status < 600) {
      statusColor = "bg-purple-600 text-blot";
    }
  }
  export let reqBody: {
    type: string;
    data: { [k: string]: any } | string;
  } | null = null;

  export let resCookies: {
    [k: string]: {
      value: string;
      httpOnly?: boolean;
      path?: string;
    };
  } | null = null;
  export let resHeaders: {
    [k: string]: string;
  } | null = null;
  export let resBody: {
    type: string;
    data: { [k: string]: any } | string;
  } | null = null;

  let className = "";
  export { className as class };
</script>

<div class={className}>
  <div class="flex justify-between mb-6 font-mono text-xl">
    <span class="font-bold">
      <span class="{statusColor} rounded-md px-2">{status}</span>
      <span class={methodColor}>{method}</span>
    </span>
    <span>{url}</span>
  </div>
  {#if reqBody}
    <div class="mb-6 last:m-0">
      <h4 class="flex justify-between text-sm border-b border-zinc-600">
        <span class="text-zinc-400">Request Body</span>
        <span class="text-zinc-200">{reqBody.type}</span>
      </h4>
      {#if typeof reqBody.data === "object"}
        {#each Object.entries(reqBody.data) as [k, v]}
          <div class="grid grid-cols-2 text-lg truncate border-b border-zinc-600">
            <div class="py-1.5 pl-2">{k}</div>
            <div class="py-1.5 pl-2 font-mono border-l border-zinc-600">{v}</div>
          </div>
        {/each}
      {:else}
        <div class="pl-2 font-mono text-lg py-1.5">{reqBody.data}</div>
      {/if}
    </div>
  {/if}

  {#if resCookies}
    <div class="mb-6 last:m-0">
      <h4 class="flex justify-between mb-2 text-sm border-b border-zinc-600">
        <span class="text-zinc-400">Response Cookies</span>
      </h4>
      {#each Object.entries(resCookies) as [k, v]}
        <div>
          <div class="text-xl font-bold">{k}</div>
          <div class="ml-4">
            {#each Object.entries(v) as [prop, value]}
              <div class="truncate text-zinc-400">
                <span class="font-medium text-white">{prop}</span>:
                <span class="font-mono">{value}</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if resHeaders}
    <div class="mb-6 last:m-0">
      <h4 class="flex justify-between text-sm border-b border-zinc-600">
        <span class="text-zinc-400">Response Headers</span>
      </h4>
      {#each Object.entries(resHeaders) as [k, v]}
        <div class="grid grid-cols-2 text-lg border-b border-zinc-600">
          <div class="py-1.5 pl-2">{k}</div>
          <div class="py-1.5 pl-2 font-mono border-l border-zinc-600">{v}</div>
        </div>
      {/each}
    </div>
  {/if}

  {#if resBody}
    <div class="mb-6 last:m-0">
      <h4 class="flex justify-between text-sm border-b border-zinc-600">
        <span class="text-zinc-400">Response Body</span>
        <span class="text-zinc-200">{resBody.type}</span>
      </h4>
      {#if typeof resBody.data === "object"}
        {#each Object.entries(resBody.data) as [k, v]}
          <div class="grid grid-cols-2 text-lg truncate border-b border-zinc-600">
            <div class="py-1.5 pl-2">{k}</div>
            <div class="py-1.5 pl-2 font-mono border-l border-zinc-600">{v}</div>
          </div>
        {/each}
      {:else}
        <div class="pl-2 font-mono text-lg py-1.5">{resBody.data}</div>
      {/if}
    </div>
  {/if}
</div>
