import mapImage from "../assets/images/book/map.png";
import memoryWindowImage from "../assets/images/windows/Window-Chapter4.png";
import heroImage from "../assets/images/chapters/Chapter4.png";

import celebrationBaker from "../assets/images/guardians/CelebrationBaker.png";
import observationFour from "../assets/images/observations/Observation4.png";

import elegantCake from "../assets/images/layers/Chapter4CakeElegant.png";
import lopsidedCake from "../assets/images/layers/Chapter4CakeLopsided.png";
import handmadeCake from "../assets/images/layers/Chapter4CakeHandmade.png";

const chapterFour = {
  id: "chapter-04",
  title: "The Baker Without a Recipe",

  mapPosition: {
    left: 68,
    top: 50,
  },

  mapImage,
  memoryWindowImage,
  heroImage,

  atmosphere: [
    {
      id: "chapter-four-flour-dust",
      className: "atmosphere--chapter-four-flour-dust",
    },
    {
      id: "chapter-four-oven-glow",
      className: "atmosphere--chapter-four-oven-glow",
    },
  ],

  guardian: {
    id: "celebration-baker",
    image: celebrationBaker,
    alt: "The Celebration Baker",
    className: "guardian--celebration-baker",
  },

  sequence: [
    {
      id: "chapter-four-opening-01",
      type: "narration",
      text:
        "Warmth reached the Guests before the bakery came into view.",
    },
    {
      id: "chapter-four-opening-02",
      type: "narration",
      text:
        "Inside, recipe pages floated through the air while unfinished cakes waited beneath a soft covering of flour.",
    },
    {
      id: "chapter-four-opening-03",
      type: "narration",
      text:
        "The Celebration Baker remembered every birthday they had ever baked for. They simply could not remember how to begin.",
    },

    {
      id: "where-to-search",
      type: "groupDecision",
      prompt: "Where should the Guests search first?",
      options: [
        {
          id: "pantry",
          label: "The Pantry",
          outcome:
            "The ingredients remained, but every label had faded. Sugar, salt, and flour waited in identical jars.",
        },
        {
          id: "recipe-shelf",
          label: "The Recipe Shelf",
          outcome:
            "Hundreds of recipes filled the shelves, but the words vanished whenever anyone tried to read them.",
        },
        {
          id: "old-oven",
          label: "The Old Oven",
          outcome:
            "The oven gave off a patient warmth, as though it remembered every cake even when the Baker did not.",
        },
      ],
    },

    {
      id: "bakery-observation",
      type: "observation",

      title: "The Bakery Remembers",

      instructions:
        "Look carefully. Four small things still hold pieces of the Baker's memory.",

      image: observationFour,

      imageAlt:
        "A warm, cluttered birthday bakery containing four hidden clues.",

      allowEarlyFinish: true,

      completeLabel:
        "We Have Looked Everywhere",

      clues: [
        {
          id: "measuring-spoon",
          label:
            "A measuring spoon hidden in a flower pot",
          hiddenLabel:
            "Something among the flowers",
          x: 18,
          y: 70,
          width: 9,
          height: 12,
        },
        {
          id: "flour-footprints",
          label:
            "Flour footprints",
          hiddenLabel:
            "A trail across the floor",
          x: 42,
          y: 78,
          width: 15,
          height: 12,
        },
        {
          id: "golden-rolling-pin",
          label:
            "A rolling pin repaired with gold",
          hiddenLabel:
            "Something mended",
          x: 70,
          y: 56,
          width: 13,
          height: 10,
        },
        {
          id: "handwritten-note",
          label:
            "A handwritten note beneath a cooling rack",
          hiddenLabel:
            "Something tucked away",
          x: 83,
          y: 74,
          width: 11,
          height: 10,
        },
      ],
    },

    {
      id: "memory-returning",
      type: "narration",
      text:
        "With every clue, the bakery seemed to remember a little more. The Baker placed an empty bowl on the table.",
    },

    {
      id: "stir-the-batter",
      type: "individualDecision",

      eyebrow:
        "A Choice for One Guest",

      title:
        "How Should the Batter Be Stirred?",

      prompt:
        "The Celebration Baker offers the spoon to one Guest.",

      instructions:
        "There is no perfect answer. Choose the kind of cake this celebration needs.",

      confirmLabel:
        "Stir the Batter",

      options: [
        {
          id: "carefully",
          label:
            "Stir carefully",
          description:
            "Move slowly and keep every part of the batter smooth.",
          outcome:
            "The batter turned glossy and even. The finished cake stood elegant and perfectly balanced.",

          visualState: {
            id:
              "chapter-four-elegant-cake",
            image:
              elegantCake,
            alt:
              "An elegant finished birthday cake",
            className:
              "chapter-visual--chapter-four-cake",
          },
        },
        {
          id: "enthusiastically",
          label:
            "Stir enthusiastically",
          description:
            "Put your whole heart into it, even if some batter escapes the bowl.",
          outcome:
            "Flour burst into the air. The finished cake leaned proudly to one side and looked gloriously alive.",

          visualState: {
            id:
              "chapter-four-lopsided-cake",
            image:
              lopsidedCake,
            alt:
              "A joyful lopsided birthday cake",
            className:
              "chapter-visual--chapter-four-cake",
          },
        },
        {
          id: "invite-another",
          label:
            "Invite another Guest",
          description:
            "Make room at the bowl and create it together.",
          outcome:
            "Two sets of hands guided the spoon. The finished cake was simple, handmade, and unmistakably meant to be shared.",

          visualState: {
            id:
              "chapter-four-handmade-cake",
            image:
              handmadeCake,
            alt:
              "A simple handmade birthday cake",
            className:
              "chapter-visual--chapter-four-cake",
          },
        },
      ],
    },

    {
      id: "baker-reveal",
      type: "narration",
      text:
        "The Baker looked at the completed cake and finally smiled. The secret was never the recipe. It was who I was baking for.",
    },

    {
      id: "late-guest-slice",
      type: "narration",
      text:
        "Before the Guests left, the Baker placed one slice on an empty plate. Just in case someone was late.",
    },

    {
      id: "chapter-four-end",
      type: "chapterComplete",
    },
  ],
};

export default chapterFour;