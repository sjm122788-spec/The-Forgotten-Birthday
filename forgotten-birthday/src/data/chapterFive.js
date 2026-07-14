import mapImage from "../assets/images/book/map.png";
import memoryWindowImage from "../assets/images/windows/Window-Chapter5.png";
import heroImage from "../assets/images/chapters/Chapter5.png";

import paradeMarshal from "../assets/images/guardians/ParadeMarshal.png";
import laughterBalloon from "../assets/images/relics/LaughterBalloon.png";

const chapterFive = {
  id: "chapter-05",
  title: "The Parade That Never Marched",

  mapPosition: {
    left: 76,
    top: 62,
  },

  mapImage,
  memoryWindowImage,
  heroImage,

  atmosphere: [
  {
    id: "chapter-five-street-lamp-glow",
    className:
      "atmosphere--chapter-five-street-lamp-glow",
  },
  {
    id: "chapter-five-confetti",
    className:
      "atmosphere--chapter-five-confetti",
  },
],
  guardian: {
    id: "parade-marshal",
    image: paradeMarshal,
    alt: "The Parade Marshal",
    className:
      "guardian--parade-marshal",
  },

  sequence: [
    {
      id: "chapter-five-opening-01",
      type: "narration",
      text:
        "The Guests arrived in a town square frozen one breath before celebration.",
    },
    {
      id: "chapter-five-opening-02",
      type: "narration",
      text:
        "Musicians waited with instruments raised. Banners hung without moving. Confetti remained suspended in the air.",
    },
    {
      id: "chapter-five-opening-03",
      type: "narration",
      text:
        "At the center stood the Parade Marshal, silver baton lowered, remembering every step except the first.",
    },

    {
      id: "begin-the-celebration",
      type: "groupDecision",

      prompt:
        "How should a celebration begin?",

      options: [
        {
          id: "play-the-music",
          label: "Play the music",
          outcome:
            "One drummer lifted their sticks. A single beat moved through the square, but the parade remained still.",
        },
        {
          id: "release-the-balloons",
          label:
            "Release the balloons",
          outcome:
            "The balloons tugged upward, bright against the sky, but no one yet knew which way to march.",
        },
        {
          id: "serve-the-cake",
          label: "Serve the cake",
          outcome:
            "Plates appeared along the route. The town remembered the promise of celebration, but not how to begin it.",
        },
      ],
    },

    {
      id: "parade-rhythm",
      type: "rhythmChallenge",

      eyebrow: "A Shared Rhythm",

      title:
        "Give the Parade Its First Step",

      prompt:
        "The Parade Marshal raises the silver baton. The Guests must return the rhythm together.",

      instructions:
        "Listen once, then tap the pattern back. The parade will wait as long as it needs to.",

      pattern: [
        0,
        430,
        860,
        1410,
      ],

      tolerance: 260,

      previewLabel:
        "Hear the Parade Rhythm",

      startLabel:
        "We Are Ready",

      tapLabel:
        "Tap",

      retryLabel:
        "Try the Rhythm Again",

      continueLabel:
        "Raise the Baton",

      successNarration:
        "The rhythm passes from drum to brass, from brass to banner, and from banner to every waiting foot in the square.",

      glory: 4,
    },

    {
      id: "first-confetti-falls",
      type: "narration",
      text:
        "One piece of frozen confetti finally fell. Then another. The Parade Marshal lifted the baton.",
    },

    {
      id: "escaped-balloon",
      type: "individualDecision",

      eyebrow:
        "A Choice for One Guest",

      title:
        "The Escaped Balloon",

      prompt:
        "One bright balloon slips free as the parade begins to move.",

      instructions:
        "What should happen to it?",

      confirmLabel:
        "Choose Its Path",

      options: [
        {
          id: "catch-it",
          label: "Catch it",
          description:
            "Return the balloon to the laughing crowd.",
          outcome:
            "The Guest catches the ribbon. The balloon bobs back into the parade and laughter follows it down the street.",
        },
        {
          id: "let-it-fly",
          label: "Let it fly",
          description:
            "Allow it to carry one unspoken wish into the sky.",
          outcome:
            "The balloon rises beyond the rooftops, carrying a wish no one asks to hear aloud.",
        },
        {
          id: "tie-it-to-the-parade",
          label:
            "Tie it to the parade",
          description:
            "Make the escaped balloon part of the tradition.",
          outcome:
            "The ribbon is tied beside the silver baton. From then on, the balloon marks the parade's first step.",
        },
      ],
    },

    {
      id: "laughter-balloon",
      type: "relicReveal",

      relicId:
        "laughter-balloon",

      eyebrow:
        "A Story Relic",

      title:
        "The Laughter Balloon",

      image:
        laughterBalloon,

      imageAlt:
        "A whimsical glowing balloon carrying warm laughter and celebration",

      protects:
        "Joy",

      description:
        "A balloon that never falls while someone nearby is smiling. It carries the sound of celebration even through the quietest places.",

      continueLabel:
        "Carry the Laughter",

      condition: {
        puzzleCueId:
          "parade-rhythm",

        requiresPuzzleCompletion:
          true,
      },
    },

    {
      id: "parade-awakens",
      type: "narration",
      text:
        "The first step became a second, then a hundred. Music filled the square as the parade finally marched.",
    },

    {
      id: "chapter-five-end",
      type: "chapterComplete",
    },
  ],
};

export default chapterFive;