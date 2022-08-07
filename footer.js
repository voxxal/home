import { html, render } from "https://unpkg.com/lit-html?module";

const footers = [
  html` <p class="footer-text">
    Made with
    <span class="stardust-text"
      >${"stardust"
        .split("")
        .map((c, i) => html`<span style="--i:${i}" class="stardust-letter">${c}</span>`)}
    </span>
  </p>`,
  html`
    <p class="footer-text">
      Made with <span class="love-text"><img src="./imgs/heart.svg" class="love-icon" /> Love</span>
    </p>
  `,
];

const footer = document.getElementById("footer");

render(footers[Math.floor(Math.random() * footers.length)], footer);
