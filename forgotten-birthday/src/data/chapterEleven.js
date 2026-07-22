import mapImage from "../assets/images/book/map.png";

import chapterElevenImage from "../assets/images/chapters/Chapter11.png";
import chapterElevenWindow from "../assets/images/windows/Window-Chapter11.png";

import bridgeKeeperImage from "../assets/images/guardians/BridgeKeeper.png";

import bridgeOneImage from "../assets/images/layers/bridge1.png";
import bridgeTwoImage from "../assets/images/layers/bridge2.png";
import bridgeThreeImage from "../assets/images/layers/bridge3.png";
import bridgeFourImage from "../assets/images/layers/bridge4.png";
import bridgeFiveImage from "../assets/images/layers/bridge5.png";
import bridgeSixImage from "../assets/images/layers/bridge6.png";
import bridgeSevenImage from "../assets/images/layers/bridge7.png";
import bridgeEightImage from "../assets/images/layers/bridge8.png";
import bridgeNineImage from "../assets/images/layers/bridge9.png";
import bridgeTenImage from "../assets/images/layers/bridge10.png";

const chapterEleven = {
  id:
    "chapter-11",

  number:
    11,

  title:
    "The Bridge of Wishes",

  guardianName:
    "The Bridge Keeper",

  protects:
    "Togetherness",

  mapImage,

  mapPosition: {
    left:
      50,

    top:
      61,
  },

  memoryWindowImage:
    chapterElevenWindow,

  heroImage:
    chapterElevenImage,

  guardian: {
    id:
      "bridge-keeper",

    image:
      bridgeKeeperImage,

    alt:
      "The Bridge Keeper",

    className:
      "guardian--bridge-keeper",
  },

  atmosphere: [
  {
    id:
      "chapter-eleven-moonlight",

    type:
      "effect",

    className:
      "atmosphere--chapter-eleven-moonlight",
  },

  {
    id:
      "chapter-eleven-mist",

    type:
      "effect",

    className:
      "atmosphere--chapter-eleven-mist",
  },

  {
    id:
      "chapter-eleven-lantern-shimmer",

    type:
      "effect",

    className:
      "atmosphere--chapter-eleven-lantern-shimmer",
  },
],
  sequence: [
    {
      id:
        "chapter-eleven-opening-one",

      type:
        "narration",

      text:
        "The final invitation dissolved into ink, but the page did not turn back toward the map.",
    },

    {
      id:
        "chapter-eleven-opening-two",

      type:
        "narration",

      text:
        "Instead, the Guests emerged beneath a sky filled with stars.",
    },

    {
      id:
        "chapter-eleven-canyon-one",

      type:
        "narration",

      text:
        "They stood at the edge of a vast canyon.",
    },

    {
      id:
        "chapter-eleven-canyon-two",

      type:
        "narration",

      text:
        "Far across the distance, warm candlelight glowed against the night.",
    },

    {
      id:
        "chapter-eleven-home-one",

      type:
        "narration",

      text:
        "A long table waited there.",
    },

    {
      id:
        "chapter-eleven-home-two",

      type:
        "narration",

      text:
        "Soft music traveled faintly across the open air.",
    },

    {
      id:
        "chapter-eleven-home-three",

      type:
        "narration",

      text:
        "It looked almost like home.",
    },

    {
      id:
        "chapter-eleven-bridge-one",

      type:
        "narration",

      text:
        "An unfinished bridge stretched toward it.",
    },

    {
      id:
        "chapter-eleven-bridge-two",

      type:
        "narration",

      text:
        "It had not been broken by violence or time.",
    },

    {
      id:
        "chapter-eleven-bridge-three",

      type:
        "narration",

      text:
        "It was simply incomplete.",
    },

    {
      id:
        "chapter-eleven-missing-span",

      type:
        "narration",

      text:
        "Stone gave way to empty air before reaching the opposite side.",
    },

    {
      id:
        "chapter-eleven-lanterns",

      type:
        "narration",

      text:
        "Dozens of lanterns hung beneath the missing span, swaying gently in the night breeze.",
    },

    {
      id:
        "chapter-eleven-keeper-introduction",

      type:
        "narration",

      text:
        "The Bridge Keeper waited quietly at the edge, one hand resting upon an unlit lantern.",
    },

    {
      id:
        "chapter-eleven-keeper-waited",

      type:
        "narration",

      text:
        "They had never crossed.",
    },

    {
      id:
        "chapter-eleven-keeper-waited-two",

      type:
        "narration",

      text:
        "They had only waited.",
    },

    {
      id:
        "chapter-eleven-puzzle-introduction",

      type:
        "narration",

      text:
        "Scattered beside the unfinished bridge were pieces collected from every road the Guests had traveled.",
    },

    {
      id:
        "chapter-eleven-puzzle-pieces",

      type:
        "narration",

      text:
        "Stone supports. Wooden planks. Knotted rope. Lantern posts. Small pieces that seemed insignificant until placed beside one another.",
    },

    {
      id:
        "chapter-eleven-bridge-connection",

      type:
        "progressIllustration",

      eyebrow:
        "The Final Connection",

      title:
        "Build the Way Across",

      prompt:
        "The bridge cannot be completed by one person. Every piece must find its place.",

      instructions:
        "Work together and place each contribution. There is no timer and no wrong pace.",

      contributeLabel:
        "Place a Bridge Piece",

      declineLabel:
        "Wait and Consider",

      continueLabel:
        "Cross the Completed Bridge",

      completionLabel:
        "The Bridge Is Whole",

      completionNarration:
        "The final piece settled into place. Warm light traveled across the completed bridge, and every lantern beneath it flared to life.",

      contributionGlory:
        1,

      maximumSharedGlory:
        6,

      previewMode:
        true,

      transitionDuration:
        700,

      frames: [
        {
          id:
            "bridge-stage-01",

          image:
            bridgeOneImage,

          alt:
            "An unfinished bridge ending above a dark canyon",
        },

        {
          id:
            "bridge-stage-02",

          image:
            bridgeTwoImage,

          alt:
            "The first bridge support settling into place",
        },

        {
          id:
            "bridge-stage-03",

          image:
            bridgeThreeImage,

          alt:
            "Stonework beginning to extend over the canyon",
        },

        {
          id:
            "bridge-stage-04",

          image:
            bridgeFourImage,

          alt:
            "Wooden beams connecting the growing bridge",
        },

        {
          id:
            "bridge-stage-05",

          image:
            bridgeFiveImage,

          alt:
            "Ropes and lantern posts being added to the bridge",
        },

        {
          id:
            "bridge-stage-06",

          image:
            bridgeSixImage,

          alt:
            "The bridge reaching beyond the center of the canyon",
        },

        {
          id:
            "bridge-stage-07",

          image:
            bridgeSevenImage,

          alt:
            "Several lanterns beginning to glow beneath the bridge",
        },

        {
          id:
            "bridge-stage-08",

          image:
            bridgeEightImage,

          alt:
            "The final span nearing the opposite side",
        },

        {
          id:
            "bridge-stage-09",

          image:
            bridgeNineImage,

          alt:
            "The nearly completed bridge glowing beneath the stars",
        },

        {
          id:
            "bridge-stage-10",

          image:
            bridgeTenImage,

          alt:
            "The completed bridge illuminated by warm lantern light",
        },
      ],
    },

    {
      id:
        "chapter-eleven-after-bridge-one",

      type:
        "narration",

      text:
        "Light traveled from lantern to lantern until the whole canyon glowed beneath them.",
    },

    {
      id:
        "chapter-eleven-after-bridge-two",

      type:
        "narration",

      text:
        "Stars reflected in the mist below.",
    },

    {
      id:
        "chapter-eleven-keeper-speaks",

      type:
        "narration",

      text:
        "The Bridge Keeper nodded. “No bridge has ever been built by one pair of hands.”",
    },

    {
      id:
        "chapter-eleven-crossing-introduction",

      type:
        "narration",

      text:
        "The Keeper stepped aside.",
    },

    {
      id:
        "chapter-eleven-crossing-introduction-two",

      type:
        "narration",

      text:
        "They did not cross first.",
    },

    {
      id:
        "chapter-eleven-first-crossing",

      type:
        "individualDecision",

      eyebrow:
        "One Final Crossing",

      title:
        "Who Should Take the First Step?",

      prompt:
        "One Guest is quietly chosen to decide who begins the crossing.",

      instructions:
        "Choose without searching for the correct answer. Both paths require trust.",

      options: [
        {
          id:
            "cross-yourself",

          label:
            "Yourself",

          description:
            "Take the first step and trust that the others will follow.",

          outcome:
            "The Guest stepped onto the bridge. At first they walked alone. Halfway across, their pace slowed. Before they could turn around, footsteps sounded behind them. The others had already begun to follow.",

          glory:
            2,

          visualState:
            "guest-crosses-first",
        },

        {
          id:
            "choose-another-guest",

          label:
            "Another Guest",

          description:
            "Place your trust in someone else and invite them to lead.",

          outcome:
            "The chosen Guest stepped forward. The Bridge Keeper smiled. “Trust often arrives before courage.” One by one, the others followed them into the lantern light.",

          glory:
            2,

          visualState:
            "another-guest-crosses-first",
        },
      ],
    },

    {
      id:
        "chapter-eleven-group-crossing-one",

      type:
        "narration",

      text:
        "Together, the Guests crossed the canyon.",
    },

    {
      id:
        "chapter-eleven-group-crossing-two",

      type:
        "narration",

      text:
        "The warm table grew clearer with every step.",
    },

    {
      id:
        "chapter-eleven-group-crossing-three",

      type:
        "narration",

      text:
        "The music no longer sounded distant.",
    },

    {
      id:
        "chapter-eleven-camera-lingers",

      type:
        "narration",

      text:
        "But the story did not follow them immediately.",
    },

    {
      id:
        "chapter-eleven-keeper-remains",

      type:
        "narration",

      text:
        "For a moment, it remained behind.",
    },

    {
      id:
        "chapter-eleven-keeper-watches",

      type:
        "narration",

      text:
        "The Bridge Keeper still stood where they always had, watching until every Guest reached the opposite side.",
    },

    {
      id:
        "chapter-eleven-keeper-crosses",

      type:
        "narration",

      text:
        "Only then did the Keeper place one foot upon the bridge.",
    },

    {
      id:
        "chapter-eleven-final-lantern",

      type:
        "narration",

      text:
        "The unlit lantern in their hand flared to life.",
    },

    {
      id:
        "chapter-eleven-not-my-bridge-one",

      type:
        "narration",

      text:
        "“It was never my bridge,” the Keeper said quietly.",
    },

    {
      id:
        "chapter-eleven-not-my-bridge-two",

      type:
        "narration",

      text:
        "“It was always yours.”",
    },

    {
      id:
        "chapter-eleven-transition-one",

      type:
        "narration",

      text:
        "The Guests continued walking as warm light spread across the horizon.",
    },

    {
      id:
        "chapter-eleven-transition-two",

      type:
        "narration",

      text:
        "The stars disappeared behind them one by one.",
    },

    {
      id:
        "chapter-eleven-transition-three",

      type:
        "narration",

      text:
        "Ahead, the glow of a birthday celebration filled the sky.",
    },

    {
      id:
        "chapter-eleven-transition-four",

      type:
        "narration",

      text:
        "The storybook map did not return.",
    },

    {
      id:
        "chapter-eleven-transition-five",

      type:
        "narration",

      text:
        "There was nowhere left to travel.",
    },

    {
      id:
        "chapter-eleven-transition-six",

      type:
        "narration",

      text:
        "Only one final place remained.",
    },

    {
      id:
        "chapter-eleven-complete",

      type:
        "chapterComplete",

      skipMap:
        true,

      nextChapterId:
        "finale",
    },
  ],
};

export default chapterEleven;