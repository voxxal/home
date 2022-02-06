"use strict";
document.getElementById("discord-icon").onclick = (e) => {
  navigator.clipboard.writeText("voxal#6558");
  let tooltip = document.createElement("div");
  tooltip.innerHTML = "Copied!";
  tooltip.classList.add("tooltip");
  document.getElementById("discord-icon").appendChild(tooltip);
  setTimeout(() => tooltip.style.opacity = 1, 100);
  setTimeout(() => {
    tooltip.style.opacity = 0;
    setTimeout(()=> document.getElementById("discord-icon").removeChild(tooltip), 500);
  }, 1000);
};
