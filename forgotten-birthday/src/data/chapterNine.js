import mapImage from "../assets/images/book/map.png";

import chapterNineImage from "../assets/images/chapters/Chapter9.png";
import chapterNineWindow from "../assets/images/windows/Window-Chapter9.png";

import nameGardenerImage from "../assets/images/guardians/NameGardener.png";
import flowerOneImage from "../assets/images/layers/flower1.png";
import flowerTwoImage from "../assets/images/layers/flower2.png";
import flowerThreeImage from "../assets/images/layers/flower3.png";
import flowerFourImage from "../assets/images/layers/flower4.png";
import flowerFiveImage from "../assets/images/layers/flower5.png";
import flowerSixImage from "../assets/images/layers/flower6.png";
import flowerSevenImage from "../assets/images/layers/flower7.png";
import flowerEightImage from "../assets/images/layers/flower8.png";
import flowerNineImage from "../assets/images/layers/flower9.png";
import flowerTenImage from "../assets/images/layers/flower10.png";

const chapterNine = {
  id: "chapter-09",

  number: 9,

  title: "The Garden of Fading Names",

  guardianName: "The Name Gardener",

  protects: "Remembrance",

  mapImage,

  mapPosition: {
    left: 28,
    top: 49,
  },

  memoryWindowImage:
    chapterNineWindow,

  heroImage:
    chapterNineImage,

  guardian: {
    id:
      "name-gardener",

    image:
      nameGardenerImage,

    alt:
      "The Name Gardener",

    className:
      "guardian--name-gardener",
  },

  atmosphere: [
    {
      type:
        "effect",

      className:
        "atmosphere--chapter-nine-sunlight",
    },

    {
      type:
        "effect",

      className:
        "atmosphere--chapter-nine-pollen",
    },

    {
      type:
        "effect",

      className:
        "atmosphere--chapter-nine-petals",
    },
  ],

  sequence: [
    {
      id:
        "chapter-nine-opening-one",

      type:
        "narration",

      text:
        "The final ticking of the clock tower softened into the sound of leaves moving in a distant breeze.",
    },

    {
      id:
        "chapter-nine-opening-two",

      type:
        "narration",

      text:
        "The Guests stepped into a quiet garden stretching farther than they could see.",
    },

    {
      id:
        "chapter-nine-opening-three",

      type:
        "narration",

      text:
        "Thousands of flowers grew beneath the trees. Beside every stem stood a small wooden marker.",
    },

    {
      id:
        "chapter-nine-opening-four",

      type:
        "narration",

      text:
        "Some markers held names written clearly in dark ink.",
    },

    {
      id:
        "chapter-nine-opening-five",

      type:
        "narration",

      text:
        "Some had faded until only a few letters remained.",
    },

    {
      id:
        "chapter-nine-opening-six",

      type:
        "narration",

      text:
        "Others had become completely blank.",
    },

    {
      id:
        "chapter-nine-gardener-introduction",

      type:
        "narration",

      text:
        "The Name Gardener moved carefully between them, watering every flower in turn.",
    },

    {
      id:
        "chapter-nine-gardener-introduction-two",

      type:
        "narration",

      text:
        "They watered the flowers whose names were still remembered. They watered those whose names were beginning to disappear. They watered the nameless flowers too.",
    },

    {
      id:
        "chapter-nine-gardener-speaks",

      type:
        "narration",

      text:
        "“A name does not have to be known by everyone,” the Gardener said. “It only has to have mattered deeply to someone.”",
    },

    {
      id:
        "chapter-nine-choice-introduction",

      type:
        "narration",

      text:
        "The Gardener knelt beside three flowers growing close together.",
    },

    {
      id:
        "chapter-nine-difficult-choice",

      type:
        "difficultChoice",

      eyebrow:
        "A Difficult Choice",

      title:
        "Which Flower Comes First?",

      prompt:
        "There is only enough water in the Gardener’s can to care for one flower before the afternoon heat arrives.",

      question:
        "If you could only care for one first, which would you choose?",

      instructions:
        "Discuss what each flower needs. There is no wrong answer. When the group is ready, the Host chooses.",

      confirmLabel:
        "Water This Flower",

      choices: [
        {
          id:
            "bright-flower",

          label:
            "The Bright Flower",

          description:
            "Its name is clear, its petals are open, and it is already surrounded by signs of care.",

          outcome:
            "The Gardener poured a little water around the brilliant flower. Its petals lifted toward the sun, and its color deepened.",

          guardianResponse:
            "“It is good to celebrate what is already loved.”",

          glory:
            3,
        },

        {
          id:
            "fading-flower",

          label:
            "The Fading Flower",

          description:
            "Its petals have begun to curl, and several letters have disappeared from its marker.",

          outcome:
            "The Gardener poured the water slowly. Color returned along the edges of the fading petals, and one lost letter appeared again upon the marker.",

          guardianResponse:
            "“Sometimes love arrives just before forgetting.”",

          glory:
            3,
        },

        {
          id:
            "nameless-flower",

          label:
            "The Nameless Flower",

          description:
            "Its wooden marker is blank, but a tightly closed bud still waits above the soil.",

          outcome:
            "The Gardener watered the nameless flower. Its bud opened without hesitation, glowing softly despite the empty marker beside it.",

          guardianResponse:
            "“Perhaps someone still carries the name in their heart.”",

          glory:
            3,
        },
      ],

      outcomeId:
        "chapter-nine-choice-outcome",
    },

    {
      id:
        "chapter-nine-after-choice",

      type:
        "narration",

      text:
        "The other two flowers remained where they were. The Gardener did not call the choice fair or unfair. They simply refilled the watering can.",
    },

    {
      id:
        "chapter-nine-watering-introduction",

      type:
        "narration",

      text:
        "Farther into the garden, a smaller flower leaned beneath a marker whose name had nearly vanished.",
    },

    {
  id:
    "chapter-nine-shared-watering",

  type:
    "progressIllustration",

  eyebrow:
    "A Quiet Offering",

  title:
    "Give What You Can",

  prompt:
    "A small flower leans beneath a marker whose name has nearly vanished.",

  instructions:
    "Each Guest may offer a little water. There is no timer, no correct answer, and no amount too small to matter.",

  contributeLabel:
    "Pour a Little Water",

  declineLabel:
    "Hold the Water",

  continueLabel:
    "See What Grew",

  completionLabel:
    "The Flower Comes Alive",

  completionNarration:
    "The flower opened beneath the afternoon light. The Name Gardener did not count how much water had been given. They only watched the flower respond to the care it received.",

  contributionGlory:
    1,

  maximumSharedGlory:
    5,

  previewMode:
    true,

  transitionDuration:
    650,

  frames: [
    {
      id:
        "flower-stage-01",

      image:
        flowerOneImage,

      alt:
        "A fading flower resting low against the soil",
    },

    {
      id:
        "flower-stage-02",

      image:
        flowerTwoImage,

      alt:
        "The flower beginning to respond to water",
    },

    {
      id:
        "flower-stage-03",

      image:
        flowerThreeImage,

      alt:
        "Small leaves beginning to lift",
    },

    {
      id:
        "flower-stage-04",

      image:
        flowerFourImage,

      alt:
        "A closed flower bud growing stronger",
    },

    {
      id:
        "flower-stage-05",

      image:
        flowerFiveImage,

      alt:
        "The flower bud beginning to swell",
    },

    {
      id:
        "flower-stage-06",

      image:
        flowerSixImage,

      alt:
        "The first petals beginning to open",
    },

    {
      id:
        "flower-stage-07",

      image:
        flowerSevenImage,

      alt:
        "The flower opening beneath warm sunlight",
    },

    {
      id:
        "flower-stage-08",

      image:
        flowerEightImage,

      alt:
        "The flower nearly fully bloomed",
    },

    {
      id:
        "flower-stage-09",

      image:
        flowerNineImage,

      alt:
        "The restored flower glowing softly",
    },

    {
      id:
        "flower-stage-10",

      image:
        flowerTenImage,

      alt:
        "The fully restored flower surrounded by golden light",
    },
  ],
},
    {
      id:
        "chapter-nine-after-watering-one",

      type:
        "narration",

      text:
        "The Gardener did not count how much water any Guest had given.",
    },

    {
      id:
        "chapter-nine-after-watering-two",

      type:
        "narration",

      text:
        "They only watched the flower respond to the care it had received.",
    },

    {
      id:
        "chapter-nine-blossom-falls",

      type:
        "narration",

      text:
        "A sudden gust passed through the trees. One glowing blossom broke free and lifted high above the garden path.",
    },

    {
      id:
        "chapter-nine-blossom-roll",

      type:
        "dice",

      eyebrow:
        "A Blossom in the Wind",

      title:
        "Reach Before It Vanishes",

      prompt:
        "One Guest reaches toward the blossom as the wind carries it across the garden.",

      instructions:
        "Roll the twelve-sided story die to discover what remains.",

      sides:
        12,

      rollLabel:
        "Reach for the Blossom",

      continueLabel:
        "Follow the Wind",

      outcomes: [
        {
          id:
            "great-success",

          min:
            11,

          tier:
            "greatSuccess",

          label:
            "Great Success",

          preview:
            "The blossom is caught gently before the wind can carry it away.",

          narration:
            "The Guest catches the blossom without bruising a single petal. The Name Gardener returns it carefully to its stem, where it blooms brighter than before.",

          glory:
            4,
        },

        {
          id:
            "success",

          min:
            8,

          tier:
            "success",

          label:
            "Success",

          preview:
            "The blossom lands safely among the flowers nearby.",

          narration:
            "The Guest guides the blossom away from the garden wall. It settles safely among the nearby flowers, where its light continues to glow.",

          glory:
            3,
        },

        {
          id:
            "partial-success",

          min:
            5,

          tier:
            "partial",

          label:
            "A Partial Result",

          preview:
            "The blossom disappears, but one glowing petal remains.",

          narration:
            "The wind carries the blossom beyond reach. One glowing petal drifts back and settles into the Guest’s hand, still holding a little warmth.",

          glory:
            1,
        },

        {
          id:
            "failure",

          min:
            1,

          tier:
            "failure",

          label:
            "Carried Away",

          preview:
            "The blossom disappears over the garden wall.",

          narration:
            "The blossom rises beyond the trees and disappears over the garden wall. Nothing falls back into the path below.",

          glory:
            0,
        },
      ],
    },

    {
      id:
        "chapter-nine-after-roll-one",

      type:
        "narration",

      text:
        "The Name Gardener watched the wind travel beyond the wall.",
    },

    {
      id:
        "chapter-nine-after-roll-two",

      type:
        "narration",

      text:
        "“Perhaps...” they said.",
    },

    {
      id:
        "chapter-nine-after-roll-three",

      type:
        "narration",

      text:
        "“...someone else needed to remember.”",
    },

    {
      id:
        "chapter-nine-revelation-one",

      type:
        "narration",

      text:
        "The garden did not belong only to celebrated names or stories remembered by crowds.",
    },

    {
      id:
        "chapter-nine-revelation-two",

      type:
        "narration",

      text:
        "Every flower marked the place where one person had mattered deeply to another.",
    },

    {
      id:
        "chapter-nine-blank-marker-one",

      type:
        "narration",

      text:
        "Near the edge of the garden, one flower bloomed more beautifully than all the rest.",
    },

    {
      id:
        "chapter-nine-blank-marker-two",

      type:
        "narration",

      text:
        "Its petals were full and bright. Golden seeds drifted lazily around it.",
    },

    {
      id:
        "chapter-nine-blank-marker-three",

      type:
        "narration",

      text:
        "The wooden marker beside it was completely blank.",
    },

    {
      id:
        "chapter-nine-gardener-clears-marker",

      type:
        "narration",

      text:
        "The Name Gardener knelt and gently brushed the dirt from its surface.",
    },

    {
      id:
        "chapter-nine-name-is-gone",

      type:
        "narration",

      text:
        "After a long silence, they said, “The name is gone.”",
    },

    {
      id:
        "chapter-nine-love-remains",

      type:
        "narration",

      text:
        "“The love isn’t.”",
    },

    {
      id:
        "chapter-nine-foreshadowing",

      type:
        "narration",

      text:
        "The blank marker caught the afternoon light. For the briefest moment, it resembled a place card waiting beside an empty chair.",
    },

    {
      id:
        "chapter-nine-closing",

      type:
        "narration",

      text:
        "A glowing seed rose from the nameless flower and drifted beyond the garden wall. Storybook ink followed it into the sky until the garden disappeared beneath the turning page.",
    },

    {
      id:
        "chapter-nine-complete",

      type:
        "chapterComplete",
    },
  ],
};

export default chapterNine;