import mapImage from "../assets/images/book/map.png";
import memoryWindowImage from "../assets/images/windows/Window-Chapter3.png";
import heroImage from "../assets/images/chapters/Chapter3.png";

import candleKeeper from "../assets/images/guardians/CandleKeeper.png";
import candleOfFirstLight from "../assets/images/relics/CandleOfFirstLight.png";

const chapterThree = {
  id: "chapter-03",
  title: "The Candle Keeper",

  mapPosition: {
    left: 58,
    top: 40,
  },

  mapImage,
  memoryWindowImage,
  heroImage,

  atmosphere: [
    {
      id: "chapter-three-candle-glow",
      className: "atmosphere--chapter-three-candle-glow",
    },
    {
      id: "chapter-three-embers",
      className: "atmosphere--chapter-three-embers",
    },
  ],

  guardian: {
    id: "candle-keeper",
    image: candleKeeper,
    alt: "The Candle Keeper",
    className: "guardian--candle-keeper",
  },

  sequence: [
    {
      id: "chapter-three-opening-01",
      type: "narration",
      text:
        "The path ended at a hall so vast that its final candles disappeared into darkness.",
    },
    {
      id: "chapter-three-opening-02",
      type: "narration",
      text:
        "Every flame marked a birthday that someone, somewhere, still remembered.",
    },
    {
      id: "chapter-three-opening-03",
      type: "narration",
      text:
        "The Candle Keeper moved quietly among them, shielding the weakest flames with careful hands.",
    },

    {
      id: "restore-candle-pattern",
      type: "cooperativePuzzle",

      eyebrow: "A Shared Puzzle",
      title: "Restore the Candle Pattern",

      prompt:
        "Four candles have gone dark. The surviving flames remember the order in which they once burned.",

      instructions:
        "Discuss the clues together, then select the candles in the correct order.",

      successLabel:
        "The pattern catches and the hall brightens.",

      successNarration:
        "One by one, the extinguished candles reignite. Their light travels outward until the pattern is whole again.",

      glory: 3,

      items: [
        {
          id: "first-light",
          label: "First Light",
          symbol: "🕯️",
          hint:
            "The smallest flame begins the pattern.",
        },
        {
          id: "steady-flame",
          label: "Steady Flame",
          symbol: "🔥",
          hint:
            "It follows the first and never flickers.",
        },
        {
          id: "twin-flame",
          label: "Twin Flame",
          symbol: "✨",
          hint:
            "It comes after the steady light.",
        },
        {
          id: "blue-flame",
          label: "Blue Flame",
          symbol: "💠",
          hint:
            "The rarest flame completes the pattern.",
        },
      ],

      solution: [
        "first-light",
        "steady-flame",
        "twin-flame",
        "blue-flame",
      ],
    },

    {
      id: "candle-pattern-restored",
      type: "narration",
      text:
        "The Candle Keeper looked toward three flames that still struggled against the dark.",
    },

    {
      id: "protect-a-flame",
      type: "individualDecision",

      eyebrow: "A Choice for One Guest",
      title: "Which Flame Comes First?",

      prompt:
        "All three candles will be tended. One Guest must choose which one receives protection first.",

      instructions:
        "Choose the flame that calls to you.",

      confirmLabel:
        "Protect This Flame",

      options: [
        {
          id: "first-birthday",
          label:
            "A child's first birthday",
          description:
            "A beginning remembered by people who once held everything close.",
          outcome:
            "The smallest candle steadies. Its flame grows warm enough to illuminate a pair of tiny handprints beside it.",
        },
        {
          id: "celebrating-alone",
          label:
            "Someone celebrating alone",
          description:
            "A birthday marked quietly, with no one nearby to hear the wish.",
          outcome:
            "The lone candle brightens. For a moment, its light fills the empty space around it.",
        },
        {
          id: "no-one-remembers",
          label:
            "A birthday no one remembers",
          description:
            "A flame that has nearly disappeared from the world.",
          outcome:
            "The faintest candle answers first. It burns with a small, stubborn light.",
        },
      ],
    },

    {
      id: "falling-flame",
      type: "narration",
      text:
        "Then one final flame broke free from its candle and began falling through the dark.",
    },

    {
      id: "save-falling-flame",
      type: "dice",

      eyebrow: "A Moment of Chance",
      title: "Save the Falling Flame",

      prompt:
        "One Guest reaches into the darkness before the light disappears.",

      instructions:
        "Roll the twelve-sided story die. The story will continue whatever happens.",

      sides: 12,
      rollLabel:
        "Reach for the Flame",
      continueLabel:
        "See What Happened",

      outcomes: [
        {
          id: "great-success",
          min: 10,
          tier: "greatSuccess",
          label: "Great Success",
          preview:
            "The flame returns brighter than before.",
          narration:
            "The Guest catches the flame in both hands. It rises again, restored and radiant.",
          glory: 3,
        },
        {
          id: "success",
          min: 7,
          tier: "success",
          label: "Success",
          preview:
            "The flame is shielded and safely returned.",
          narration:
            "The Guest shields the flame from the dark and returns it to its candle.",
          glory: 2,
        },
        {
          id: "partial",
          min: 4,
          tier: "partial",
          label:
            "A Partial Result",
          preview:
            "The flame survives, but only barely.",
          narration:
            "The flame remains weak, but alive. The Candle Keeper cups a hand around it until it steadies.",
          glory: 1,
        },
        {
          id: "failure",
          min: 1,
          tier: "failure",
          label:
            "The Flame Goes Out",
          preview:
            "One memory disappears with it.",
          narration:
            "The flame vanishes before it can be reached. Somewhere beyond the hall, a memory quietly fades.",
          glory: 0,
        },
      ],
    },

    {
      id: "candle-of-first-light",
      type: "relicReveal",

      relicId:
        "candle-of-first-light",

      eyebrow:
        "The First Story Relic",

      title:
        "The Candle of First Light",

      image: candleOfFirstLight,

      imageAlt:
        "A blue candle flame glowing against the darkness",

      protects:
        "Light",

      description:
        "A blue flame that cannot be extinguished by forgetting. It may be carried forward and returned when the celebration is restored.",

      continueLabel:
        "Carry the Light",

      condition: {
        puzzleCueId:
          "restore-candle-pattern",

        requiresPuzzleCompletion:
          true,

        diceCueId:
          "save-falling-flame",

        minimumTier:
          "success",
      },
    },

   {
  id: "chapter-three-closing",
  type: "narration",
  text:
    "The remaining flames rose together, their light reaching every corner of the hall before folding itself into ink.",
},

    {
      id: "chapter-three-end",
      type: "chapterComplete",
    },
  ],
};

export default chapterThree;