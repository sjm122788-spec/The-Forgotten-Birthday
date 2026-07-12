import mapImage from "../assets/images/book/map.png";
import memoryWindowImage from "../assets/images/windows/Window-Chapter1.png";
import heroImage from "../assets/images/chapters/Chapter1.png";

import confettiSweeper from "../assets/images/guardians/confettisweeper.png";
import broom from "../assets/images/layers/broom.png";
import sparkles from "../assets/images/layers/sparkles.png";
import candlelight from "../assets/images/layers/candlelight.png";

const chapterOne = {
  id: "chapter-01",
  title: "The Empty Celebration",

  mapImage,
  memoryWindowImage,
  heroImage,

  atmosphere: [
    {
      id: "candlelight",
      image: candlelight,
      className: "atmosphere--candlelight",
    },
    {
      id: "sparkles",
      image: sparkles,
      className: "atmosphere--sparkles",
    },
  ],

  guardian: {
    id: "confetti-sweeper",
    image: confettiSweeper,
    alt: "The Confetti Sweeper",
    className: "guardian--confetti-sweeper",

    prop: {
      id: "broom",
      image: broom,
      alt: "",
      className: "guardian-prop--broom",
    },
  },

  sequence: [
    {
      id: "opening-01",
      type: "narration",
      text: "The celebration had been waiting...",
    },
    {
      id: "opening-02",
      type: "narration",
      text: "...for a very long time.",
    },
    {
      id: "opening-03",
      type: "narration",
      text: "Every candle still burned.",
    },
    {
      id: "opening-04",
      type: "narration",
      text: "Every gift remained unopened.",
    },
    {
      id: "opening-05",
      type: "narration",
      text: "Every chair patiently waited.",
    },
    {
      id: "opening-06",
      type: "narration",
      text: "As though someone had simply forgotten to arrive.",
    },
    {
      id: "chapter-end",
      type: "chapterComplete",
    },
  ],
};

export default chapterOne;