<script lang="ts">
  import ElementsDfsResult from './ElementsDfsResult.svelte';
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  // BLESS https://upload.wikimedia.org/wikipedia/commons/6/67/Sorted_binary_tree.svg
  // prettier-ignore
  const elements = new Map([["Sauna", "💦"],["Railway Engine", "🚂"],["Clay", "🎨"],["Geolocation", "📍"],["Colorful Steam", "💨"],["Sand", "🏖️"],["Visualization", "📈"],["Heat Engine", "🔩"],["Steam Locomotive", "🚂"],["Patterned Design", "🎨"],["Smoke", "💨"],["Brick", "🏠"],["Sandstorm", "🌪️"],["Hot Tub", "🛀"],["Cybersecurity", "🔒"],["Lightning", "⚡"],["Fireplace", "🔥"],["Fog Machine", "💨"],["Mud Bath", "🛀"],["Earthenware", "🍽️"],["Web Design", "💻"],["Dust", "🌀"],["Design Template", "📋"],["Ceramic", "🎨"],["Sulfur", "💨"],["Algae", "🌱"],["Computer Chip", "💻"],["Rainbow Pool", "🏊‍♀️"],["Internet", "💻"],["Thunderstorm", "🌩️"],["Cement", "🏭"],["Data", "📊"],["Oven", "🍞"],["Geothermal Energy", "🌋"],["Static", "💭"],["Brick Oven", "🍞"],["Mud", "💦"],["Steam", "🚂"],["S'mores", "🍪"],["Graphic Design", "🖋️"],["Art", "🎨"],["Geothermal Power Plant", "🌋"],["Circuit Failure", "💣"],["Earth", "🌍"],["Real-Time Positioning", "📍"],["Power Surge", "💥"],["Smart HVAC System", "💻"],["Mosaic", "🎨"],["Mudbrick", "🏰"],["Smart Device", "📱"],["Security", "🔒"],["User Input", "📱"],["Vulnerability", "🚨"],["Ash Residue", "💔"],["Rock", "🤘"],["Vapor", "💨"],["Healing Water", "💧"],["Excavator", "🚧"],["Map", "🗺️"],["Fire", "🔥"],["Heat Resistant Material", "🔥"],["Mist", "💨"],["Air", "💨"],["Swamp", "🌿"],["Water", "💧"],["IoT", "📱"],["Hydropower", "💧"],["Hydroelectric Power", "💧"],["Reflection", "💭"],["Volcano", "🌋"],["Data Mining", "💻"],["Smart Thermostat", "💻"],["Storm", "🌪️"],["Black Rain", "🌩️"],["Rain", "🌧"],["Blackout", "💔"],["Haze", "💨"],["Location Tracking", "📍"],["Software", "📊"],["Adobe", "📢"],["Color Spectrum", "🎨"],["Exploit", "💰"],["Electricity", "💡"],["Silt", "🌀"],["Marsh", "🐢"],["Glass", "🍷"],["Volcanic Glass", "🌋"],["Refraction", "🔍"],["Colorful Display", "🎨"],["Program", "📊"],["Fog", "🌫️"],["Steam Engine", "🚂"],["Lava Lamp", "💡"],["Cloud", "☁️"],["Mineral Spring", "💧"],["XSS", "😈"],["Magma", "🔥"],["Sludge", "💢"],["Overload", "😩"],["Mineral", "💎"],["Volcanic Lightning", "🌋"],["Ash Rock", "🔥"],["Ash", "🔥"],["Rainbow", "🌈"],["Rainbow Cloud", "🌈"],["Concrete", "🏛️"],["Volcanic Rock", "🌋"],["Artificial Intelligence", "🤖"],["Powder", "💨"],["Colorful Pattern", "🎨"],["Cinder", "👠"],["Interactive Design", "📱"],["Machine Learning", "🤖"],["Lightning Conductor", "⚡"],["Hot Spring", "🛀"],["Colorful Interface", "🎨"],["Cloud Computing", "💻"],["Rainbow Fire", "🔥"],["Charcoal", "🔥"],["Encryption", "🔒"],["Volcanic Ash", "🌋"],["Brick Kiln", "🏭"],["Email", "📧"],["Obsidian", "🔥"],["Wall", "🏰"],["Lava", "🔥"],["Colorful Flames", "🔥"],["Paving Stone", "🛠️"],["Artwork", "🎨"]]);
  interface DfsResult {
    result: string;
    step: number;
    found?: boolean;
    children: number;
    a: DfsResult | null;
    b: DfsResult | null;
  }
  interface Props {
    res?: DfsResult | null;
    x: number;
    y: number;
    visited?: any;
  }

  let {
    res = null,
    x,
    y,
    visited = new Set()
  }: Props = $props();
  const core = ["Fire", "Water", "Earth", "Air"].includes(res?.result as string);

  //   let has = visited.has(res?.result as string);
  // okay this isn't working, will dbg later
  let has = false;
  if (res && !has) visited.add(res.result);
  let hoverbox: SVGGElement | null = $state(null);
  let textbox: SVGGElement | null = $state(null);
  onMount(() => {
    if (!hoverbox || !textbox) return;
    const { height, width, x, y } = textbox.getBBox();
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttributeNS(null, "width", (width + 8).toString());
    rect.setAttributeNS(null, "height", (height + 8).toString());
    rect.setAttributeNS(null, "x", (x - 4).toString());
    rect.setAttributeNS(null, "y", (y - 4).toString());
    rect.setAttributeNS(null, "fill", "#3F3F46");
    rect.setAttributeNS(null, "rx", "2");
    textbox.setAttributeNS(null, "opacity", "0");

    textbox.prepend(rect);
    hoverbox.onmouseover = () => {
      if (!textbox) return;
      textbox.setAttributeNS(null, "opacity", "1");
    };
    hoverbox.onmouseleave = () => {
      if (!textbox) return;
      textbox.setAttributeNS(null, "opacity", "0");
    };
  });
</script>

{#if res}
  {#if res.a && !has}
    {#key res.a.step}
      <line
        in:fade={{ duration: 150 }}
        out:fade={{ duration: 150 }}
        x1="{x}%"
        y1={y}
        x2="{x - res.children * 0.7}%"
        y2={y + 48}
        class="stroke-2 stroke-white"
      />
    {/key}
    <ElementsDfsResult res={res.a} x={x - res.children * 0.7} y={y + 48} {visited} />
  {/if}
  {#if res.b && !has}
    {#key res.b.step}
      <line
        in:fade={{ duration: 150 }}
        out:fade={{ duration: 150 }}
        x1="{x}%"
        y1={y}
        x2="{x + res.children * 0.7}%"
        y2={y + 48}
        class="stroke-2 stroke-white"
      />
    {/key}
    <ElementsDfsResult res={res.b} x={x + res.children * 0.7} y={y + 48} {visited} />
  {/if}
  {#key res.step}
    <g in:fade={{ duration: 150 }} out:fade={{ duration: 150 }}>
      <g>
        <ellipse
          cx="{x}%"
          cy={y}
          rx="14"
          ry="14"
          class={res.found ? "fill-blue-300" : core ? "fill-yellow-300" : "fill-white"}
        />
        <text
          xmlns="http://www.w3.org/2000/svg"
          text-anchor="middle"
          x="{x}%"
          y={y + 4.5}
          class="text-sm cursor-default">{elements.get(res.result)}</text
        >
      </g>
      <g bind:this={hoverbox}>
        <ellipse cx="{x}%" cy={y} rx="24" ry="24" class="fill-transparent" />
      </g>
      <g bind:this={textbox}>
        <text
          xmlns="http://www.w3.org/2000/svg"
          text-anchor="middle"
          x="{x}%"
          y={y - 24}
          class="text-sm bg-black fill-white">{res.result}</text
        >
      </g>
    </g>
  {/key}
{/if}
