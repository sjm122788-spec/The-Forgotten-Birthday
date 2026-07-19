import mapImage from "../assets/images/book/map.png";

import chapterEightImage from "../assets/images/chapters/Chapter8.png";
import chapterEightWindow from "../assets/images/windows/Window-Chapter8.png";

import clockMenderImage from "../assets/images/guardians/ClockMender.png";
import pocketWatchImage from "../assets/images/relics/PocketWatchOfLostTime.png";

const chapterEight = {
  id: "chapter-08",

  number: 8,

  title: "The Clockmaker's Hour",

  guardianName: "The Clock Mender",

  protects: "Time Together",

  mapImage,

  mapPosition: {
    left: 38,
    top: 58,
  },

  memoryWindowImage:
    chapterEightWindow,

  heroImage:
    chapterEightImage,

  guardian: {
    id:
      "clock-mender",

    image:
      clockMenderImage,

    alt:
      "The Clock Mender",

    className:
      "guardian--clock-mender",
  },

  atmosphere: [
    {
      type:
        "effect",

      className:
        "atmosphere--chapter-eight-clocklight",
    },

    {
      type:
        "effect",

      className:
        "atmosphere--chapter-eight-dust",
    },

    {
      type:
        "effect",

      className:
        "atmosphere--chapter-eight-pendulum",
    },
  ],

  sequence: [
    {
      id:
        "chapter-eight-opening-one",

      type:
        "narration",

      text:
        "The first tick from the Hall of Echoes became the sound of a door unlocking.",
    },

    {
      id:
        "chapter-eight-opening-two",

      type:
        "narration",

      text:
        "Beyond it rose an immense clock tower filled with thousands of clocks suspended in warm golden light.",
    },

    {
      id:
        "chapter-eight-opening-three",

      type:
        "narration",

      text:
        "Some clocks were grand enough to fill an entire wall. Others were no larger than a pocket watch.",
    },

    {
      id:
        "chapter-eight-opening-four",

      type:
        "narration",

      text:
        "Every clock had stopped at a different birthday.",
    },

    {
      id:
        "chapter-eight-opening-five",

      type:
        "narration",

      text:
        "One held a joyful afternoon beneath a summer sky. Another remembered a quiet evening around a kitchen table. A third had frozen just before someone leaned forward to blow out their candles.",
    },

    {
      id:
        "chapter-eight-great-clock",

      type:
        "narration",

      text:
        "High above them all stood the Great Clock, silent and still.",
    },

    {
      id:
        "chapter-eight-mender-introduction",

      type:
        "narration",

      text:
        "The Clock Mender waited beneath it with one hand resting gently against the enormous mechanism. They were not trying to repair it. They were listening.",
    },

    {
      id:
        "chapter-eight-mender-speaks",

      type:
        "narration",

      text:
        "“The Great Clock does not measure hours,” the Mender said. “It measures the moments people shared inside them.”",
    },

    {
      id:
        "chapter-eight-puzzle-introduction",

      type:
        "narration",

      text:
        "Several pieces of the mechanism had drifted apart. No single Guest could see how the entire clock belonged together.",
    },

    {
      id:
        "chapter-eight-clockwork-puzzle",

      type:
        "cooperativePuzzle",

      eyebrow:
        "A Shared Mechanism",

      title:
        "Restore the Great Clock",

      prompt:
        "Each part of the mechanism carries only one clue. Work together to return the pieces in the order that allows the Great Clock to move.",

      instructions:
        "Discuss what each piece does, then place the mechanism from the first movement to the final sound.",

      items: [
        {
          id:
            "winding-key",

          symbol:
            "🗝️",

          label:
            "The Winding Key",

          hint:
            "I give the mechanism the strength to begin.",
        },

        {
          id:
            "turning-gears",

          symbol:
            "⚙️",

          label:
            "The Turning Gears",

          hint:
            "I carry movement from one part of the clock to another.",
        },

        {
          id:
            "swinging-pendulum",

          symbol:
            "↔️",

          label:
            "The Pendulum",

          hint:
            "I divide movement into steady moments.",
        },

        {
          id:
            "clock-hands",

          symbol:
            "🕰️",

          label:
            "The Clock Hands",

          hint:
            "I show where the gathered moments have carried us.",
        },

        {
          id:
            "striking-bell",

          symbol:
            "🔔",

          label:
            "The Bell",

          hint:
            "I speak only after every other piece has done its work.",
        },
      ],

      solution: [
        "winding-key",
        "turning-gears",
        "swinging-pendulum",
        "clock-hands",
        "striking-bell",
      ],

      successLabel:
        "The Great Clock Moves",

      resetLabel:
        "Reset the Mechanism",

      successNarration:
        "The final piece settled into place. More clocks began to glow. Shafts of golden light brightened through the tower as tiny gears turned and dust rose sparkling into the air.",

      glory:
        5,
    },

    {
      id:
        "chapter-eight-first-tick",

      type:
        "narration",

      text:
        "The enormous pendulum moved once.",
    },

    {
      id:
        "chapter-eight-second-tick",

      type:
        "narration",

      text:
        "A single deep tick traveled through the tower. Then another.",
    },

    {
      id:
        "chapter-eight-more-time",

      type:
        "narration",

      text:
        "The Clock Mender smiled. “A little more time.”",
    },

    {
      id:
        "chapter-eight-falling-memory-one",

      type:
        "narration",

      text:
        "As the room grew quiet again, one tiny glowing memory slipped free from the Great Clock.",
    },

    {
      id:
        "chapter-eight-falling-memory-two",

      type:
        "narration",

      text:
        "It drifted downward through the tower like a falling star.",
    },

    {
  id:
    "chapter-eight-falling-memory-roll",

  type:
    "dice",

  eyebrow:
    "One Falling Moment",

  title:
    "Preserve the Memory",

  prompt:
    "One Guest reaches for the falling light before it disappears.",

  instructions:
    "Roll the twelve-sided story die to see how much of the moment can be preserved.",

  sides:
    12,

  rollLabel:
    "Reach for the Memory",

  continueLabel:
    "See What Remains",

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
        "The memory settles safely into the Clock Mender’s hands.",

      narration:
        "The memory settles safely into the Clock Mender’s hands, whole and glowing. Inside it, laughter rises around a table just as someone turns toward the people they love.",

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
        "The falling light is guided safely back into the clock.",

      narration:
        "The falling light is gently guided back into the Great Clock. Its warmth spreads through the mechanism as though it had never left.",

      glory:
        3,
    },

    {
      id:
        "partial",

      min:
        5,

      tier:
        "partial",

      label:
        "A Partial Result",

      preview:
        "The details fade, but the warmth of the memory remains.",

      narration:
        "Only part of the memory can be saved. The details disappear, but a small warmth remains in the Clock Mender’s hands.",

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
        "The Moment Passes",

      preview:
        "The light fades quietly before anyone can reach it.",

      narration:
        "The light fades quietly before anyone can reach it. The Clock Mender watches it disappear without anger or surprise.",

      glory:
        0,
    },
  ],
},

    {
      id:
        "chapter-eight-after-roll-one",

      type:
        "narration",

      text:
        "“Not every moment stays,” the Clock Mender said.",
    },

    {
      id:
        "chapter-eight-after-roll-two",

      type:
        "narration",

      text:
        "“That is why we must notice them while they are here.”",
    },

    {
      id:
        "chapter-eight-secret-clock",

      type:
        "individualDecision",

      eyebrow:
        "A Private Moment",

      title:
        "The Familiar Clock",

      prompt:
        "One Guest notices a small clock drifting among the others. Its face feels strangely familiar, though no one else seems to recognize it.",

      instructions:
        "What do you do?",

      confirmLabel:
        "Remember the Choice",

      options: [
        {
          id:
            "reach-toward-clock",

          label:
            "Reach toward it",

          description:
            "Follow the feeling before the clock drifts beyond reach.",

          outcome:
            "For one brief moment, the clock’s frozen hands tremble. A warmth passes through the Guest’s fingertips, but the clock gives no answer.",
        },

        {
          id:
            "let-clock-drift",

          label:
            "Let it drift away",

          description:
            "Some familiar things may not yet be ready to return.",

          outcome:
            "The clock disappears among the thousands suspended above. Its faint ticking remains in the Guest’s thoughts long after it is gone.",
        },
      ],
    },

    {
      id:
        "chapter-eight-revelation",

      type:
        "narration",

      text:
        "The clocks did not preserve birthdays by stopping time. They remembered the people who had filled that time together.",
    },

    {
      id:
        "chapter-eight-relic",

      type:
        "relicReveal",

      relicId:
        "pocket-watch-of-lost-time",

      eyebrow:
        "A Story Relic",

      title:
        "The Pocket Watch of Lost Time",

      image:
        pocketWatchImage,

      imageAlt:
        "The Pocket Watch of Lost Time",

      protects:
        "Time Together",

      description:
        "A small watch whose hands never point toward the present. It remembers the moments that mattered, even after the hour itself has passed.",

      continueLabel:
        "Carry the Watch",

      condition: {
        puzzleCueId:
          "chapter-eight-clockwork-puzzle",

        requiresPuzzleCompletion:
          true,
      },
    },

    {
      id:
        "chapter-eight-watch-words-one",

      type:
        "narration",

      text:
        "The Clock Mender removed the small watch from their pocket. Its hands moved constantly, though they never pointed toward the current hour.",
    },

    {
      id:
        "chapter-eight-watch-words-two",

      type:
        "narration",

      text:
        "“It never tells you what time it is,” they said. “Only which moments mattered.”",
    },

    {
      id:
        "chapter-eight-all-clocks",

      type:
        "narration",

      text:
        "Before the Guests left, every clock in the tower began ticking again.",
    },

    {
      id:
        "chapter-eight-frozen-clock",

      type:
        "narration",

      text:
        "Every clock except one.",
    },

    {
      id:
        "chapter-eight-frozen-clock-two",

      type:
        "narration",

      text:
        "High above the Great Clock, a small clock remained frozen. Its hands did not tremble. Its face gave off no light.",
    },

    {
      id:
        "chapter-eight-mender-watches",

      type:
        "narration",

      text:
        "The Clock Mender followed the Guests’ gaze but said nothing.",
    },

    {
      id:
        "chapter-eight-final-warning-one",

      type:
        "narration",

      text:
        "Only after a long silence did they whisper, “Some moments cannot begin...”",
    },

    {
      id:
        "chapter-eight-final-warning-two",

      type:
        "narration",

      text:
        "“...until everyone has arrived.”",
    },

    {
      id:
        "chapter-eight-closing",

      type:
        "narration",

      text:
        "The ticking tower softened into the rhythm of turning pages. Golden gears darkened into storybook ink, and the hour disappeared beneath it.",
    },

    {
      id:
        "chapter-eight-complete",

      type:
        "chapterComplete",
    },
  ],
};

export default chapterEight;