import mapImage from "../assets/images/book/map.png";

import chapterTenImage from "../assets/images/chapters/Chapter10.png";
import chapterTenWindow from "../assets/images/windows/Window-Chapter10.png";

import invitationKeeperImage from "../assets/images/guardians/InvitationKeeper.png";
import openSealImage from "../assets/images/relics/OpenSeal.png";
import chapterTenLayer from "../assets/images/layers/Chapter10Layer.png";

const chapterTen = {
  id: "chapter-10",

  number: 10,

  title: "The Last Invitation",

  guardianName: "The Invitation Keeper",

  protects: "Belonging",

  mapImage,

  mapPosition: {
    left: 39,
    top: 55,
  },

  memoryWindowImage:
    chapterTenWindow,

  heroImage:
    chapterTenImage,

  guardian: {
    id:
      "invitation-keeper",

    image:
      invitationKeeperImage,

    alt:
      "The Invitation Keeper",

    className:
      "guardian--invitation-keeper",
  },

  atmosphere: [
  {
    id:
      "chapter-ten-window-light",

    type:
      "effect",

    className:
      "atmosphere--chapter-ten-window-light",
  },

  {
    id:
      "chapter-ten-invitation-layer",

    type:
      "image",

    image:
      chapterTenLayer,

    className:
      "atmosphere--chapter-ten-invitation-layer",
  },

  {
    id:
      "chapter-ten-dust",

    type:
      "effect",

    className:
      "atmosphere--chapter-ten-dust",
  },
],

  sequence: [
    {
      id:
        "chapter-ten-opening-one",

      type:
        "narration",

      text:
        "The glowing seed drifted beyond the garden wall and slipped through a narrow opening between two storybook pages.",
    },

    {
      id:
        "chapter-ten-opening-two",

      type:
        "narration",

      text:
        "When the Guests followed, they found themselves standing inside a library unlike any they had seen before.",
    },

    {
      id:
        "chapter-ten-opening-three",

      type:
        "narration",

      text:
        "There were no books upon its endless shelves.",
    },

    {
      id:
        "chapter-ten-opening-four",

      type:
        "narration",

      text:
        "Instead, every shelf held invitations.",
    },

    {
      id:
        "chapter-ten-invitations-one",

      type:
        "narration",

      text:
        "Some were elegant, written in careful gold lettering and tied with silk ribbon.",
    },

    {
      id:
        "chapter-ten-invitations-two",

      type:
        "narration",

      text:
        "Some were handwritten upon ordinary paper, folded and unfolded so many times that their edges had become soft.",
    },

    {
      id:
        "chapter-ten-invitations-three",

      type:
        "narration",

      text:
        "Some remained sealed.",
    },

    {
      id:
        "chapter-ten-invitations-four",

      type:
        "narration",

      text:
        "Others rested open upon the shelves, still waiting to be answered.",
    },

    {
      id:
        "chapter-ten-room",

      type:
        "narration",

      text:
        "Warm afternoon light poured through tall windows. Loose invitations drifted through the library like falling leaves.",
    },

    {
      id:
        "chapter-ten-keeper-introduction",

      type:
        "narration",

      text:
        "At the center of the room, the Invitation Keeper sat behind a small wooden desk.",
    },

    {
      id:
        "chapter-ten-unfinished-invitation",

      type:
        "narration",

      text:
        "They quietly turned one unfinished invitation over in their hands.",
    },

    {
      id:
        "chapter-ten-first-choice-introduction",

      type:
        "narration",

      text:
        "Without speaking, the Keeper placed three invitations side by side upon the desk.",
    },

    {
      id:
        "chapter-ten-invitation-choice",

      type:
        "groupDecision",

      eyebrow:
        "Three Invitations",

      title:
        "Which Should Be Delivered First?",

      prompt:
        "Each invitation was written with hope. Only one can leave the library before nightfall.",

      instructions:
        "Discuss what each invitation might mean. There is no wrong answer. When the group is ready, the Host chooses.",

      options: [
        {
          id:
            "to-my-family",

          label:
            "To My Family",

          description:
            "The paper is worn from being carried close for a very long time.",

          outcome:
            "The Keeper lifted the worn invitation carefully. “Some invitations travel only a few steps,” they said. It had been written by someone who lived beneath the same roof as the people they missed, yet had never found the courage to ask them to stay a little longer.",

          glory:
            3,
        },

        {
          id:
            "to-my-friends",

          label:
            "To My Friends",

          description:
            "The envelope bears stamps from places that no longer appear upon any map.",

          outcome:
            "The Keeper nodded and traced the faded stamps. “Some invitations travel many years.” It had crossed oceans and changing addresses, searching for friends who once promised they would always find one another again.",

          glory:
            3,
        },

        {
          id:
            "to-whoever-needs-this-most",

          label:
            "To Whoever Needs This Most",

          description:
            "There is no address, no name, and no mark showing where it should go.",

          outcome:
            "The Keeper paused with the invitation held between both hands. “Those are always the hardest to deliver.” It had been written by someone who never knew who would need it—only that somewhere, someone was waiting to be asked.",

          glory:
            3,
        },
      ],
    },

    {
      id:
        "chapter-ten-after-choice",

      type:
        "narration",

      text:
        "The chosen invitation rose gently from the desk. A current of warm air carried it between the shelves and through an open window.",
    },

    {
      id:
        "chapter-ten-belonging-one",

      type:
        "narration",

      text:
        "The Invitation Keeper watched until it disappeared.",
    },

    {
      id:
        "chapter-ten-belonging-two",

      type:
        "narration",

      text:
        "“Belonging does not begin when an invitation arrives,” they said.",
    },

    {
      id:
        "chapter-ten-belonging-three",

      type:
        "narration",

      text:
        "“It begins the moment someone hopes you will come.”",
    },

    {
      id:
        "chapter-ten-blank-space-introduction",

      type:
        "narration",

      text:
        "The Keeper opened the unfinished invitation.",
    },

    {
      id:
        "chapter-ten-blank-space-introduction-two",

      type:
        "narration",

      text:
        "Every line had been completed except one.",
    },

    {
      id:
        "chapter-ten-fill-the-silence",

      type:
        "fillTheSilence",

      eyebrow:
        "The Blank Space",

      title:
        "Reserved For",

      prompt:
        "Who do you think this invitation is waiting for?",

      instructions:
        "Each Guest chooses privately. Do not discuss the answer. No selections will be shown.",

      privacyMessage:
        "Some answers are meant to be carried quietly.",

      confirmLabel:
        "Place My Answer",

      completeLabel:
        "The Answers Remain Hidden",

      options: [
        {
          id:
            "someone-too-late",

          label:
            "Someone who thinks they are too late",
        },

        {
          id:
            "someone-who-never-belonged",

          label:
            "Someone who never believed they belonged",
        },

        {
          id:
            "someone-forgotten",

          label:
            "Someone who was forgotten",
        },

        {
          id:
            "someone-finding-courage",

          label:
            "Someone still finding the courage to come",
        },

        {
          id:
            "leave-it-blank",

          label:
            "Leave it blank",
        },
      ],

      hidden:
        true,

      glory:
        1,

      completionNarration:
        "The Keeper did not ask what the Guests had chosen. They simply folded the invitation closed, protecting every answer inside.",
    },

    {
      id:
        "chapter-ten-after-silence-one",

      type:
        "narration",

      text:
        "No names appeared upon the unfinished line.",
    },

    {
      id:
        "chapter-ten-after-silence-two",

      type:
        "narration",

      text:
        "Still, the blank space no longer felt empty.",
    },

    {
      id:
        "chapter-ten-final-seal-introduction",

      type:
        "narration",

      text:
        "The Keeper warmed a small bowl of wax and invited one Guest to complete the invitation.",
    },

    {
      id:
        "chapter-ten-final-seal",

      type:
        "individualDecision",

      eyebrow:
        "The Final Seal",

      title:
        "How Should the Invitation Wait?",

      prompt:
        "One Guest decides how the unfinished invitation should remain until the person it awaits is ready.",

      options: [
        {
          id:
            "seal-the-invitation",

          label:
            "Seal the Invitation",

          description:
            "Protect it until the right moment arrives.",

          outcome:
            "The Guest pressed the antique seal into the warm wax. The Keeper held the invitation carefully as the wax cooled. “Some invitations are protected until the right moment.”",

          glory:
            2,

          visualState:
            "invitation-sealed",
        },

        {
          id:
            "leave-it-open",

          label:
            "Leave It Open",

          description:
            "Let it remain easy to find and easy to enter.",

          outcome:
            "The Guest left the invitation unsealed. The Keeper smiled softly and placed it near the edge of the desk. “Some doors should never be difficult to open.”",

          glory:
            2,

          visualState:
            "invitation-open",
        },
      ],
    },

    {
  id:
    "chapter-ten-open-seal-reveal",

  type:
    "relicReveal",

  relicId:
    "open-seal",

  eyebrow:
    "A Story Relic",

  title:
    "The Open Seal",

  image:
    openSealImage,

  imageAlt:
    "An antique wax seal whose imprint resembles an open doorway",

  protects:
    "Belonging",

  description:
    "An antique seal whose imprint resembles an open doorway instead of a closed crest. It reminds its bearer that an invitation should never become a barrier.",

  continueLabel:
    "Keep the Seal",
},

    {
      id:
        "chapter-ten-departure-one",

      type:
        "narration",

      text:
        "As the Guests prepared to leave, a quiet rustling passed through the highest shelves.",
    },

    {
      id:
        "chapter-ten-departure-two",

      type:
        "narration",

      text:
        "One invitation slipped free.",
    },

    {
      id:
        "chapter-ten-departure-three",

      type:
        "narration",

      text:
        "It turned slowly through the golden light and landed upon the Keeper’s desk.",
    },

    {
      id:
        "chapter-ten-faded-invitation",

      type:
        "narration",

      text:
        "The Keeper opened it.",
    },

    {
      id:
        "chapter-ten-faded-words",

      type:
        "narration",

      text:
        "Every word inside had faded.",
    },

    {
      id:
        "chapter-ten-welcome",

      type:
        "narration",

      text:
        "Every word except one.",
    },

    {
      id:
        "chapter-ten-welcome-word",

      type:
        "narration",

      text:
        "Welcome.",
    },

    {
      id:
        "chapter-ten-keeper-smiles",

      type:
        "narration",

      text:
        "The Invitation Keeper smiled for the first time.",
    },

    {
      id:
        "chapter-ten-enough-one",

      type:
        "narration",

      text:
        "“Sometimes...”",
    },

    {
      id:
        "chapter-ten-enough-two",

      type:
        "narration",

      text:
        "“...that’s enough.”",
    },

    {
      id:
        "chapter-ten-closing",

      type:
        "narration",

      text:
        "The word Welcome glowed against the empty page. Its letters softened into storybook ink, spreading across the desk until the endless library disappeared beneath the turning page.",
    },

    {
      id:
        "chapter-ten-complete",

      type:
        "chapterComplete",
    },
  ],
};

export default chapterTen;