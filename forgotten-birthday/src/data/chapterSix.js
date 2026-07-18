import mapImage from "../assets/images/book/map.png";

import chapterSixImage from "../assets/images/chapters/Chapter6.png";
import chapterSixWindow from "../assets/images/windows/Window-Chapter6.png";

import ribbonStitcherImage from "../assets/images/guardians/RibbonStitcher.png";
import ribbonOfBelongingImage from "../assets/images/relics/RibbonOfBelonging.png";

import giftOneImage from "../assets/images/layers/Gift1.png";
import giftTwoImage from "../assets/images/layers/Gift2.png";
import giftThreeImage from "../assets/images/layers/Gift3.png";

const chapterSix = {
  id: "chapter-06",

  number: 6,

  title: "The Giftmaker's Workshop",

  guardianName: "The Ribbon Stitcher",

  protects: "Thoughtfulness",

  mapImage,

  mapPosition: {
    left: 64,
    top: 76,
  },

  memoryWindowImage:
    chapterSixWindow,

  heroImage:
    chapterSixImage,

  guardian: {
    id: "ribbon-stitcher",
    image:
      ribbonStitcherImage,
    alt:
      "The Ribbon Stitcher",
    className:
      "guardian--ribbon-stitcher",
  },

  atmosphere: [
    {
      id:
        "chapter-six-workshop-light",

      className:
        "atmosphere--chapter-six-workshop-light",
    },

    {
      id:
        "chapter-six-ribbon-drift",

      className:
        "atmosphere--chapter-six-ribbon-drift",
    },
  ],

  sequence: [
    {
      id:
        "chapter-six-opening-one",

      type:
        "narration",

      text:
        "Warm light filled a wooden workshop crowded with wrapped gifts, folded paper, handwritten notes, and ribbons waiting to be tied.",
    },

    {
      id:
        "chapter-six-opening-two",

      type:
        "narration",

      text:
        "Nothing in the room was especially grand. Every object had simply been chosen for someone.",
    },

    {
      id:
        "chapter-six-opening-three",

      type:
        "narration",

      text:
        "At the workbench sat the Ribbon Stitcher, surrounded by unfinished gifts and blank tags.",
    },

    {
      id:
        "chapter-six-opening-four",

      type:
        "narration",

      text:
        "They remembered how to wrap every shape, mend every ribbon, and finish every bow. They could no longer remember who the gifts were meant to reach.",
    },

    {
      id:
        "chapter-six-gift-selection",

      type:
        "giftSelection",

      eyebrow:
        "A Shared Choice",

      title:
        "Finish What Was Chosen",

      prompt:
        "Three unfinished gifts remained on the workbench. Each had been chosen carefully, but the reason had begun to fade.",

      instructions:
        "Choose each gift and uncover the small act of attention hidden inside it.",

      gifts: [
        {
          id:
            "carved-bird",

          label:
            "The Carved Bird",

          description:
            "A tiny wooden bird rests inside a box no larger than two hands.",

          image:
            giftOneImage,

          imageAlt:
            "A tiny carved wooden bird inside a gift box",

          reveal:
            "Someone had noticed that its recipient always stopped to listen when birds began singing.",
        },

        {
          id:
            "patched-scarf",

          label:
            "The Patched Scarf",

          description:
            "A plain wool scarf has already been repaired twice.",

          image:
            giftTwoImage,

          imageAlt:
            "A carefully folded patched wool scarf inside a gift box",

          reveal:
            "Someone had noticed that its recipient was always cold, even when they insisted they were comfortable.",
        },

        {
          id:
            "bundle-of-letters",

          label:
            "The Bundle of Letters",

          description:
            "Old letters are tied together with simple string.",

          image:
            giftThreeImage,

          imageAlt:
            "A bundle of old letters tied together inside a gift box",

          reveal:
            "None of the letters were valuable. Every one had been kept.",
        },
      ],

      outcomeId:
        "workshop-remembers",

      successNarration:
        "The Ribbon Stitcher had not forgotten the objects. They had forgotten the small moments of attention that gave each object meaning.",

      continueLabel:
        "Remember Their Meaning",

      glory: 4,
    },

    {
      id:
        "chapter-six-after-gifts",

      type:
        "narration",

      text:
        "The workshop no longer felt like a room full of objects. It felt like a record of people who had paid attention.",
    },

    {
      id:
        "chapter-six-individual-decision",

      type:
        "individualDecision",

      eyebrow:
        "A Choice for One Guest",

      title:
        "The Blank Tag",

      prompt:
        "One package was complete except for the words that would tell its recipient why it had been chosen.",

      instructions:
        "What should the tag say?",

      confirmLabel:
        "Complete the Gift",

      options: [
        {
          id:
            "thought-of-you",

          label:
            "I saw this and thought of you.",

          description:
            "Tell someone they were remembered even while they were away.",

          outcome:
            "The words settled onto the blank tag. The Ribbon Stitcher remembered that to be noticed is its own kind of gift.",
        },

        {
          id:
            "make-you-happy",

          label:
            "I hope this makes you happy.",

          description:
            "Offer joy without asking for anything in return.",

          outcome:
            "The words settled onto the blank tag. The Ribbon Stitcher remembered that joy given freely often finds its way back.",
        },

        {
          id:
            "you-matter",

          label:
            "You matter to me.",

          description:
            "Say plainly what the gift was always meant to communicate.",

          outcome:
            "The words settled onto the blank tag. The Ribbon Stitcher remembered that some people wait years to hear what others assume they already know.",
        },
      ],
    },

    {
      id:
        "chapter-six-revelation",

      type:
        "narration",

      text:
        "The best gifts did not prove what something had cost. They told someone they mattered enough to be thought of.",
    },

    {
      id:
        "chapter-six-relic",

      type:
        "relicReveal",

      relicId:
        "ribbon-of-belonging",

      eyebrow:
        "A Story Relic",

      title:
        "The Ribbon of Belonging",

      image:
        ribbonOfBelongingImage,

      imageAlt:
        "The Ribbon of Belonging",

      protects:
        "Thoughtfulness",

      description:
        "A ribbon that ensures nothing offered with love arrives unfinished. It remembers the care carried inside every gift.",

      continueLabel:
        "Carry the Ribbon",

      condition: {
        puzzleCueId:
          "chapter-six-gift-selection",

        requiresPuzzleCompletion:
          true,
      },
    },

    {
      id:
        "chapter-six-foreshadowing",

      type:
        "narration",

      text:
        "High on the final shelf, one perfectly wrapped gift still waited without a tag. Even the Ribbon Stitcher could not remember who it had been prepared for.",
    },

    {
      id:
        "chapter-six-closing",

      type:
        "narration",

      text:
        "A loose length of ribbon rested across the edge of the workbench. Storybook ink followed its curve until ribbon and ink became impossible to tell apart.",
    },

    {
      id:
        "chapter-six-complete",

      type:
        "chapterComplete",
    },
  ],
};

export default chapterSix;