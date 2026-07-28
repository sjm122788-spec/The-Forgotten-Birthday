import mapImage from "../assets/images/book/map.png";
import memoryWindowImage from "../assets/images/windows/Window-Chapter2.png";
import heroImage from "../assets/images/chapters/Chapter2.png";

import wishKeeper from "../assets/images/guardians/WishKeeper.png";
import wishTree from "../assets/images/layers/Chapter2Layer.png";

const chapterTwo = {
  id: "chapter-02",
  title: "The Whispering Woods",

  mapPosition: {
    left: 44,
    top: 27,
  },

  mapImage,
  memoryWindowImage,
  heroImage,

  mapImage,
  memoryWindowImage,
  heroImage,

atmosphere: [
  {
    id: "chapter-two-mist",
    className: "atmosphere--chapter-two-mist",
  },
  {
    id: "chapter-two-fireflies",
    className: "atmosphere--chapter-two-fireflies",
  },
],

  guardian: {
    id: "wish-keeper",
    image: wishKeeper,
    alt: "The Wish Keeper",
    className: "guardian--wish-keeper",
  },

  sequence: [
    {
      id: "chapter-two-opening-01",
      type: "narration",
      text:
        "Beyond the ballroom, the path narrowed beneath trees that whispered without wind.",
    },
    {
      id: "chapter-two-opening-02",
      type: "narration",
      text:
        "Small lights drifted between the branches, carrying words that had never quite been finished.",
    },
    {
      id: "chapter-two-opening-03",
      type: "narration",
      text:
        "The Wish Keeper listened to each one before placing it gently into glass.",
    },

    {
      id: "choose-a-wish",
      type: "groupDecision",
      prompt: "Which wish should the Guests follow?",
      options: [
        {
          id: "hope-they-come",
          label: "I hope they come.",
          outcome:
            "The wish moved deeper into the woods, toward a place where someone had waited beside an untouched chair.",
        },
        {
          id: "hope-they-remember",
          label: "I hope they remember.",
          outcome:
            "The wish brightened as though being heard had already made it less alone.",
        },
        {
          id: "hope-today-never-ends",
          label: "I hope today never ends.",
          outcome:
            "The wish circled an old branch where ribbons had faded, but never fallen.",
        },
      ],
    },

    {
      id: "wish-keeper-truth",
      type: "narration",
      text:
        "The Wish Keeper held out a torn piece of paper. Some wishes, they explained, did not know where they belonged.",
    },

    {
      id: "torn-wish-choice",
      type: "individualDecision",

      eyebrow: "A Choice for One Guest",
      title: "The Torn Wish",

      prompt:
        "One unfinished wish rests in your hands, its final words missing.",

      instructions: "What should happen to it?",

      confirmLabel: "Choose Its Path",

      options: [
        {
          id: "restore-it",
          label: "Restore it",
          description:
            "Help the wish become whole before returning it to the trees.",
          outcome:
            "The torn edges drew together. The restored wish rose above the branches and joined the others.",
        },
        {
          id: "keep-it",
          label: "Keep it",
          description:
            "Protect the unfinished wish until its meaning becomes clear.",
          outcome:
            "The paper folded itself into a small square and remained warm in the Guest's hand.",
        },
        {
          id: "release-it",
          label: "Release it",
          description:
            "Trust the wish to find the place it was meant to go.",
          outcome:
            "The Guest opened their hand. The wish drifted away without fear.",
        },
      ],
    },

    {
      id: "final-wish-appears",
      type: "narration",
      text:
        "Then one final wish slipped loose from the highest branch and began drifting into the night.",
    },

    {
      id: "catch-final-wish",
      type: "dice",

      eyebrow: "The First Roll",
      title: "Catch the Wish",

      prompt:
        "It is already moving beyond the light. One Guest reaches for it.",

      instructions:
        "Roll the twelve-sided story die. Whatever happens, the journey continues.",

      sides: 12,
      rollLabel: "Reach for the Wish",
      continueLabel: "See What Happened",

      outcomes: [
        {
          id: "great-success",
          min: 10,
          tier: "greatSuccess",
          label: "Great Success",
          preview:
            "The wish settles safely into a glowing bottle.",
          narration:
            "The Guest catches the wish cleanly. It settles into a glowing bottle, bright and whole.",
          glory: 3,
        },
        {
          id: "success",
          min: 7,
          tier: "success",
          label: "Success",
          preview:
            "The wish is caught just before the wind takes it.",
          narration:
            "The wish brushes the Guest's fingertips, then folds safely into their hands.",
          glory: 2,
        },
        {
          id: "partial",
          min: 4,
          tier: "partial",
          label: "A Partial Result",
          preview:
            "The Wish Keeper hears it before it disappears.",
          narration:
            "The wish slips away, but the Guest slows it long enough for the Wish Keeper to hear every word.",
          glory: 1,
        },
        {
          id: "failure",
          min: 1,
          tier: "failure",
          label: "The Wish Escapes",
          preview:
            "The wish vanishes into the dark between the trees.",
          narration:
            "The wish disappears into the night. The Wish Keeper watches it go, then quietly says that not every wish is lost simply because it cannot be held.",
          glory: 0,
        },
      ],
    },

    {
      id: "chapter-two-reveal",
      type: "narration",
      text:
        'One last scrap of paper landed at the Guests\' feet. It read: "I wish they remembered me."',
    },

    {
      id: "chapter-two-keeper-line",
      type: "narration",
      text:
        "The Wish Keeper looked toward the dark path ahead. Wishes do not disappear, they said. They wait.",
    },

    {
      id: "chapter-two-end",
      type: "chapterComplete",
    },
  ],
};

export default chapterTwo;