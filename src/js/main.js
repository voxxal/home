import barba from "/js/barba.js";

barba.init({
  transitions: [
    {
      name: "transition",
      sync: true,
      leave(data) {
        return gsap.to(data.current.container, {
          ease: "power2.out",
          duration: 0.2,
          opacity: 0,
          x: "-100%",
          position: "absolute",
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
            ease: "power2.out",
          duration: 0.4,
          opacity: 0,
          x: "100%",
          position: "absolute",
        });
      },
    },
  ],
});
