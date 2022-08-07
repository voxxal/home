import { html, render } from "https://unpkg.com/lit-html?module";
import { classMap } from "https://unpkg.com/lit-html/directives/class-map.js?module";

const skillLevels = ["Beginner", "Competent", "Proficient", "Expert", "Mastered"];

const skillBar = (skill, color) =>
  html` <div class="skill-bar">
    ${new Array(4).fill("").map(
      (_, i) => html`<div class="skill-segment">
        <div
          class="skill-inner-segment"
          style="width: ${Math.max(Math.min((skill / 25 - i) * 100, 100), 0)}%; --color: ${color}"
        ></div>
      </div>`
    )}
  </div>`;

let modelOpen = false;
let currentModelData = {};

const techModel = (data) => html` <div class="${classMap({ model: true, open: modelOpen })}">
  <div class="model-content">
    <div class="model-left">
      <h3 class="model-title">${data.title}</h3>
      <p class="model-description">${data.description}</p>
    </div>
    <div class="model-right">
      ${skillBar(data.skill, data.color)}
      <p class="skill-level" style="--color: ${data.color}">
        ${skillLevels[Math.floor(data.skill / 25)]}
      </p>
    </div>
    <span class="model-close" @click=${closeModel}>&times;</span>
  </div>
</div>`;

const closeModel = (e) => {
  modelOpen = false;
  render(techModel(currentModelData), document.body);
};

const openTechModel = (data) => () => {
  modelOpen = true;
  currentModelData = data;
  render(techModel(data), document.body);
};

const rustModelData = {
  title: "Rust",
  description:
    "Rust has to be my favorite language. I use it for everything non web related. I wouldn't say I'm the best Rust programmer because there are a lot of concepts within the standard library that I don't fully understand.",
  skill: 65,
  color: "var(--rust-brand)",
};

const typescriptModelData = {
  title: "Typescript",
  description:
    "I probably use Typescript the most, since I mostly do web development these days. There are a few parts of Typescript that I haven't explored yet though.",
  skill: 80,
  color: "var(--typescript-brand)",
};

render(
  html` I love programming langauges. My main languages are
    <span class="rust-color open-model" @click=${openTechModel(rustModelData)}>Rust</span>
    and
    <span class="typescript-color open-model" @click=${openTechModel(typescriptModelData)}
      >Typescript</span
    >.`,
  document.getElementById("main-technologies")
);

window.techModel = techModel;
window.render = render;
