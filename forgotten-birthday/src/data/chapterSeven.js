import mapImage from "../assets/images/book/map.png";

import chapterSevenImage from "../assets/images/chapters/Chapter7.png";
import chapterSevenWindow from "../assets/images/windows/Window-Chapter7.png";

import memoryWeaverImage from "../assets/images/guardians/MemoryWeaver.png";

const chapterSeven = {
  id: "chapter-07",

  number: 7,

  title: "The Hall of Echoes",

  guardianName: "The Memory Weaver",

  protects: "Remembrance",

  mapImage,

  mapPosition: {
    left: 50,
    top: 64,
  },

  memoryWindowImage:
    chapterSevenWindow,

  heroImage:
    chapterSevenImage,

  guardian: {
    id: "memory-weaver",

    image:
      memoryWeaverImage,

    alt:
      "The Memory Weaver",

    className:
      "guardian--memory-weaver",
  },

  atmosphere: [
    {
      type: "effect",

      className:
        "atmosphere--chapter-seven-memory-light",
    },

    {
      id:
        "chapter-seven-tapestry-ripple",

      type: "effect",

      className:
        "atmosphere--chapter-seven-memory-dust",
    },

    {
      type: "effect",

      className:
        "atmosphere--chapter-seven-tapestry-ripple",
    },
  ],

  sequence: [
    {
      id:
        "chapter-seven-opening-one",

      type:
        "narration",

      text:
        "Beyond the workshop waited a hall so long that its farthest walls disappeared into silver-blue shadow.",
    },

    {
      id:
        "chapter-seven-opening-two",

      type:
        "narration",

      text:
        "Tapestries hung from the rafters in endless rows. Each one held the shape of a celebration: a table crowded with plates, candles burning low, hands passing gifts, faces turned toward someone just beyond the edge of the frame.",
    },

    {
      id:
        "chapter-seven-opening-three",

      type:
        "narration",

      text:
        "The pictures did not remain still. They shimmered faintly, as though the memories inside them were breathing.",
    },

    {
      id:
        "chapter-seven-opening-four",

      type:
        "narration",

      text:
        "At the center of the hall stood the Memory Weaver, gathering loose golden threads before they could vanish into the dark.",
    },

    {
      id:
        "chapter-seven-opening-five",

      type:
        "narration",

      text:
        "“People think memories disappear,” the Weaver said. “They do not. They wait for someone to tell them again.”",
    },

    {
      id:
        "chapter-seven-puzzle-introduction",

      type:
        "narration",

      text:
        "One tapestry had almost completely unraveled. Four moments remained, but time had pulled them out of order.",
    },

    {
      id:
        "chapter-seven-memory-puzzle",

      type:
        "cooperativePuzzle",

      audience:
        "host",

      eyebrow:
        "A Shared Memory",

      title:
        "Restore the Celebration",

      prompt:
        "The tapestry remembers the feeling of being welcomed, but not the order in which that feeling grew.",

      instructions:
        "Work together to restore the memory from first welcome to lasting remembrance.",

      items: [
        {
          id:
            "remembered-detail",

          symbol:
            "🎁",

          label:
            "The Remembered Detail",

          hint:
            "A gift waited with no name tag, chosen too carefully to be random.",
        },

        {
          id:
            "story-retold",

          symbol:
            "🧵",

          label:
            "The Story Retold",

          hint:
            "Long after the plates were cleared, someone was still telling the moment back.",
        },

        {
          id:
            "waiting-chair",

          symbol:
            "🪑",

          label:
            "The Waiting Chair",

          hint:
            "Before anyone arrived, one chair had already been pulled from the table.",
        },

        {
          id:
            "familiar-knock",

          symbol:
            "🚪",

          label:
            "The Familiar Knock",

          hint:
            "The room changed before the door fully opened. Someone knew that sound.",
        },
      ],

      solution: [
        "waiting-chair",
        "familiar-knock",
        "remembered-detail",
        "story-retold",
      ],

      successLabel:
        "The Feeling Holds",

      resetLabel:
        "Gather the Feeling Again",

      successNarration:
        "The fragments joined together. First the chair, then the door, then the careful gift, then the story carried forward. Golden thread raced through the tapestry until the celebration remembered not only what happened, but why it mattered.",

      glory:
        4,

      awardGloryTo:
        "allGuests",
    },

    {
      id:
        "chapter-seven-after-puzzle-one",

      type:
        "narration",

      text:
        "The restored figures had no names. Their faces were softened by time, and no voice in the hall could say where the celebration had taken place.",
    },

    {
      id:
        "chapter-seven-after-puzzle-two",

      type:
        "narration",

      text:
        "But the feeling inside it remained perfectly clear: someone had been expected, welcomed, and known.",
    },

    {
      id:
        "chapter-seven-weaver-revelation",

      type:
        "narration",

      text:
        "The Memory Weaver touched the repaired tapestry. “The details are often the first things lost,” they said. “The feeling is what teaches the memory how to return.”",
    },

    {
      id:
        "chapter-seven-individual-decision",

      type:
        "individualDecision",

      audience:
        "selectedGuest",

      glory:
        1,

      eyebrow:
        "A Choice for One Guest",

      title:
        "The Thread That Remains",

      prompt:
        "Three loose threads still glowed in the Weaver’s hand. Only one could be returned to the fading tapestry beside them.",

      instructions:
        "Which feeling should the memory preserve?",

      confirmLabel:
        "Weave the Thread",

      options: [
        {
          id:
            "being-awaited",

          label:
            "The feeling of being awaited",

          description:
            "Preserve the moment someone realizes their arrival mattered.",

          outcome:
            "The thread brightened and stitched itself around an open doorway. The tapestry remembered that someone had watched for a familiar face and smiled when it appeared.",
        },

        {
          id:
            "being-known",

          label:
            "The feeling of being known",

          description:
            "Preserve the small details someone remembered without being asked.",

          outcome:
            "The thread crossed the table and gathered around a carefully chosen gift. The tapestry remembered the quiet comfort of being understood.",
        },

        {
          id:
            "belonging-there",

          label:
            "The feeling of belonging there",

          description:
            "Preserve the certainty that no place needed to be earned.",

          outcome:
            "The thread wound through every figure in the scene. The tapestry remembered a chair already waiting and a place that had never needed to be requested.",
        },
      ],
    },

    {
      id:
        "chapter-seven-after-individual",

      type:
        "narration",

      text:
        "The chosen thread disappeared into the cloth. For a moment, the figures inside the tapestry turned toward one another as if hearing a familiar voice.",
    },

    {
      id:
        "chapter-seven-blank-tapestry-one",

      type:
        "narration",

      text:
        "Then the guests noticed a tapestry hanging apart from all the others.",
    },

    {
      id:
        "chapter-seven-blank-tapestry-two",

      type:
        "narration",

      text:
        "It was completely blank. No table. No candles. No faces. Only pale cloth stretched inside an ornate frame.",
    },

    {
      id:
        "chapter-seven-blank-tapestry-three",

      type:
        "narration",

      text:
        "A single black thread had been tied around one corner, as though someone had once begun weaving there and stopped.",
    },

    {
      id:
        "chapter-seven-private-choice",

      type:
        "individualDecision",

      audience:
        "selectedGuest",

      glory:
        1,

      excludePreviousPlayerFromCueId:
        "chapter-seven-individual-decision",

      eyebrow:
        "A Quiet Choice",

      title:
        "The Empty Tapestry",

      prompt:
        "The Memory Weaver has turned away. One guest alone notices that the blank cloth responds when they step closer.",

      instructions:
        "What should be left inside it?",

      confirmLabel:
        "Leave Your Mark",

      options: [
        {
          id:
            "offer-memory",

          label:
            "Offer it a memory",

          description:
            "Give the empty tapestry one small moment of warmth to hold.",

          outcome:
            "A faint golden mark appeared in the center of the cloth. It was too small to form a picture, but the tapestry no longer felt entirely empty.",
        },

        {
          id:
            "leave-empty",

          label:
            "Leave it untouched",

          description:
            "Some empty spaces may belong to memories that have not yet returned.",

          outcome:
            "The cloth remained blank. Still, the black thread at its corner loosened slightly, as though the tapestry understood that waiting was not the same as being forgotten.",
        },

        {
          id:
            "tie-new-thread",

          label:
            "Tie a new thread beside the old one",

          description:
            "Do not replace what was lost. Leave a sign that someone came looking.",

          outcome:
            "A second thread appeared beside the first. One black, one gold. Neither formed a picture, but together they looked less like an ending.",
        },
      ],
    },

    {
      id:
        "chapter-seven-echo",

      type:
        "narration",

      text:
        "Somewhere behind the rows of tapestries, a chair scraped softly across the floor.",
    },

    {
      id:
        "chapter-seven-echo-two",

      type:
        "narration",

      text:
        "The Memory Weaver froze. The sound did not come again.",
    },

    {
      id:
        "chapter-seven-revelation",

      type:
        "narration",

      text:
        "A memory was more than a perfect record of what had happened. It was proof that a moment had mattered enough for someone to carry it forward.",
    },

    {
      id:
        "chapter-seven-closing-one",

      type:
        "narration",

      text:
        "The repaired tapestries brightened along the hall, one after another, until their golden threads formed a path through the shadows.",
    },

    {
      id:
        "chapter-seven-closing-two",

      type:
        "narration",

      text:
        "At the far end, the threads gathered around the outline of a great clock whose hands had stopped between one hour and the next.",
    },

    {
      id:
        "chapter-seven-closing-three",

      type:
        "narration",

      text:
        "The first tick echoed through the hall. Storybook ink trembled across the floor in time with the second.",
    },

    {
      id:
        "chapter-seven-complete",

      type:
        "chapterComplete",
    },
  ],
};

export default chapterSeven;
