import finaleImage from "../assets/images/chapters/Finale.png";
import uninvitedGuestImage from "../assets/images/layers/Finale-UninvitedGuest.png";

import candleOfFirstLightImage from "../assets/images/relics/CandleOfFirstLight.png";
import laughterBalloonImage from "../assets/images/relics/LaughterBalloon.png";
import ribbonOfBelongingImage from "../assets/images/relics/RibbonOfBelonging.png";
import pocketWatchImage from "../assets/images/relics/PocketWatchOfLostTime.png";
import openSealImage from "../assets/images/relics/OpenSeal.png";

export const finaleRelics = [
  {
    id: "candle-of-first-light",
    name: "The Candle of First Light",
    image: candleOfFirstLightImage,
    className: "finale-relic--candle",
  },
  {
    id: "laughter-balloon",
    name: "The Laughter Balloon",
    image: laughterBalloonImage,
    className: "finale-relic--balloon",
  },
  {
    id: "ribbon-of-belonging",
    name: "The Ribbon of Belonging",
    image: ribbonOfBelongingImage,
    className: "finale-relic--ribbon",
  },
  {
    id: "pocket-watch-of-lost-time",
    name: "The Pocket Watch of Lost Time",
    image: pocketWatchImage,
    className: "finale-relic--watch",
  },
  {
    id: "open-seal",
    name: "The Open Seal",
    image: openSealImage,
    className: "finale-relic--seal",
  },
];

const finale = {
  id: "finale",
  title: "The Forgotten Birthday",
  heroImage: finaleImage,
  uninvitedGuestImage,

  sequence: [
    {
      id: "finale-opening-one",
      phase: "opening",
      text: "The Guests stepped through the great doors.",
    },
    {
      id: "finale-opening-two",
      phase: "opening",
      text: "Before them waited the celebration they had spent the entire journey restoring.",
    },
    {
      id: "finale-opening-three",
      phase: "opening",
      text: "The long table stretched across the ballroom. Candles glowed. Flowers filled every centerpiece. Music drifted softly through the hall.",
    },
    {
      id: "finale-opening-four",
      phase: "opening",
      text: "Every Guardian had gathered together for the first time.",
    },
    {
      id: "finale-opening-five",
      phase: "opening",
      text: "At the very end of the table, one chair remained empty.",
    },
    {
      id: "finale-opening-six",
      phase: "opening",
      text: "The same chair. Waiting.",
    },

    {
      id: "finale-relic-return",
      phase: "relics",
      automatic: true,
    },

    {
      id: "finale-glory-return",
      phase: "glory",
      automatic: true,
    },

    {
      id: "finale-recognition-one",
      phase: "recognition",
      text: "We thought we had been restoring candles.",
    },
    {
      id: "finale-recognition-two",
      phase: "recognition",
      text: "Wishes. Songs. Traditions. Invitations. Bridges. Memories.",
    },
    {
      id: "finale-recognition-three",
      phase: "recognition",
      text: "But every Guardian had been protecting something far more fragile.",
    },
    {
      id: "finale-recognition-four",
      phase: "recognition",
      text: "The hope that one day, everyone who belonged would find their way back to the table.",
    },

    {
      id: "finale-doorway-one",
      phase: "doorway",
      text: "Beyond the open doors, just outside the warmth of the celebration, stood the Uninvited Guest.",
    },
    {
      id: "finale-doorway-two",
      phase: "doorway",
      text: "The same worn coat. The same carefully wrapped present. The same faded burgundy ribbon.",
    },
    {
      id: "finale-doorway-three",
      phase: "doorway",
      text: "Nothing about them had changed. Only the room had.",
    },
    {
      id: "finale-doorway-four",
      phase: "doorway",
      text: "They remained beyond the light, not because they were unwelcome, but because they had forgotten what it felt like to be expected.",
    },

    {
      id: "finale-invitation-one",
      phase: "invitation",
      text: "Some hearts do not need to be found.",
    },
    {
      id: "finale-invitation-two",
      phase: "invitation",
      text: "They only need to know there is still a place waiting for them.",
    },
    {
      id: "finale-invitation-three",
      phase: "invitation",
      text: "The final invitation was placed beside the empty plate.",
    },
    {
      id: "finale-invitation-four",
      phase: "invitation",
      text: "The empty chair was pulled back.",
    },
    {
      id: "finale-invitation-five",
      phase: "invitation",
      text: "No one called out. No one insisted. They simply made room.",
    },

    {
      id: "finale-guest-one",
      phase: "guest",
      text: "After a long moment, the Uninvited Guest took one step into the light.",
    },
    {
      id: "finale-guest-two",
      phase: "guest",
      text: "Then another.",
    },
    {
      id: "finale-guest-three",
      phase: "guest",
      text: "They carefully placed the unopened present at the center of the table.",
    },
    {
      id: "finale-guest-four",
      phase: "guest-seated",
      text: "And sat.",
    },

    {
      id: "finale-title-one",
      phase: "title-reveal",
      text: "It had never been a forgotten cake.",
    },
    {
      id: "finale-title-two",
      phase: "title-reveal",
      text: "Or a forgotten candle.",
    },
    {
      id: "finale-title-three",
      phase: "title-reveal",
      text: "Or a forgotten gift.",
    },
    {
      id: "finale-title-four",
      phase: "title-reveal",
      text: "It was a forgotten birthday.",
    },
    {
      id: "finale-title-five",
      phase: "title-reveal",
      text: "And every birthday deserves someone waiting at the table.",
    },

    {
      id: "finale-confetti-one",
      phase: "confetti",
      text: "The Confetti Sweeper looked down at the tiny pile they had carried since the beginning.",
    },
    {
      id: "finale-confetti-two",
      phase: "confetti",
      text: "With the smallest smile, they tossed it into the air.",
    },
    {
      id: "finale-confetti-three",
      phase: "confetti",
      text: "For the first time, it had someone to fall upon.",
    },

    {
      id: "finale-closing-one",
      phase: "closing",
      text: "No celebration is remembered because of the cake. Or the candles. Or the presents.",
    },
    {
      id: "finale-closing-two",
      phase: "closing",
      text: "It is remembered because someone looked across the table and made room.",
    },
    {
      id: "finale-closing-three",
      phase: "closing",
      text: "One chair stood empty no longer.",
    },
  ],
};

export default finale;
