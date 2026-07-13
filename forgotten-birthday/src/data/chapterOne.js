import mapImage from "../assets/images/book/map.png";
import memoryWindowImage from "../assets/images/windows/Window-Chapter1.png";
import heroImage from "../assets/images/chapters/Chapter1.png";

import confettiSweeper from "../assets/images/guardians/confettisweeper.png";
import broom from "../assets/images/layers/broom.png";
import sparkles from "../assets/images/layers/sparkles.png";
import candlelight from "../assets/images/layers/candlelight.png";
import observationOne from "../assets/images/observations/Observation1.png";

const chapterOne = {
  id: "chapter-01",
  title: "The Empty Celebration",

  mapPosition: {
    left: 30,
    top: 33,
  },

  mapImage,
  memoryWindowImage,
  heroImage,

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
      id: "investigate-first",
      type: "groupDecision",
      prompt: "Where do people usually look first?",
      options: [
        {
          id: "cake",
          label: "The Cake",
          outcome:
            "One slice had already been served. No one remembered to whom.",
        },
        {
          id: "presents",
          label: "The Presents",
          outcome:
            "Every gift tag had faded. One box still rattled softly.",
        },
        {
          id: "music-box",
          label: "The Music Box",
          outcome:
            "It waited for someone who still remembered the melody.",
        },
      ],
    },
{
  id: "ballroom-observation",
  type: "observation",

  title: "The Ballroom Remembers",

  instructions:
    "Look closely. Four things in this room seem to remember more than the others.",

  image: observationOne,

  imageAlt:
    "An abandoned birthday ballroom containing several hidden clues.",

  allowEarlyFinish: true,

  completeLabel: "We Have Looked Everywhere",

  clues: [
    {
      id: "invitation-corner",
      label: "A torn invitation corner",
      hiddenLabel: "A piece of something",
      x: 18,
      y: 78,
      width: 9,
      height: 12,
    },
    {
      id: "birthday-hat",
      label: "A birthday hat beneath a chair",
      hiddenLabel: "Something beneath a chair",
      x: 69,
      y: 72,
      width: 10,
      height: 13,
    },
    {
      id: "extinguished-candle",
      label: "One candle that has gone out",
      hiddenLabel: "Something different on the cake",
      x: 47,
      y: 34,
      width: 7,
      height: 10,
    },
    {
      id: "blurred-portrait",
      label: "A blurred portrait",
      hiddenLabel: "Something unclear on the wall",
      x: 82,
      y: 27,
      width: 10,
      height: 16,
    },
  ],
  // TODO: Chapter 1 observation hotspots still need placement and testing.
},
    {
      id: "after-investigation",
      type: "narration",
      text: "Whatever had happened here, the celebration had been interrupted.",
    },
    {
      id: "unsigned-invitation",
      type: "individualDecision",

      eyebrow: "A Choice for One Guest",
      title: "The Unsigned Invitation",

      prompt:
        "The Confetti Sweeper lifts a small envelope from beneath the chair and offers it forward.",

      instructions:
        "What should happen next?",

      confirmLabel: "Make This Choice",

      options: [
        {
          id: "open-now",
          label: "Open it now",
          description:
            "Step forward before the room has time to grow quiet again.",
          outcome:
            "The envelope opens at once. The paper inside trembles as though it has been waiting to be seen.",
        },
        {
          id: "wait",
          label: "Wait a little longer",
          description:
            "Stay with the stillness and listen before opening it.",
          outcome:
            "For a little while, no one moves. The music continues softly. Then the envelope is opened with care.",
        },
      ],
    },
    {
      id: "invitation-reveal",
      type: "narration",
      text: "Inside, only four words had been written: Please remember me.",
    },

    {
      id: "chapter-end",
      type: "chapterComplete",
    },
  ],
};

export default chapterOne;