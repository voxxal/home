import barba from "/js/barba.js";

barba.init({
  transitions: [
    {
      name: "transition",
      sync: true,
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          x: "-100%",
          position: "absolute",
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
          opacity: 0,
          x: "100%",
          position: "absolute",
        });
      },
    },
  ],
});
