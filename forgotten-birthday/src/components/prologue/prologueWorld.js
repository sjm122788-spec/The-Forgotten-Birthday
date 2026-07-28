import broom from "../../assets/images/prologue/Broom.png";
import choiceStand from "../../assets/images/prologue/ChoiceStand.png";
import dice from "../../assets/images/prologue/Dice.png";
import dimCandle from "../../assets/images/prologue/DimCandle.png";
import brightCandle from "../../assets/images/prologue/BrightCandle.png";
import closedFlower from "../../assets/images/prologue/ClosedFlower.png";
import openFlower from "../../assets/images/prologue/OpenFlower.png";
import candles from "../../assets/images/prologue/Candles.png";
import cake from "../../assets/images/prologue/Cake.png";
import balloon from "../../assets/images/prologue/Balloon.png";
import gift from "../../assets/images/prologue/Gift.png";
import memoryLoom from "../../assets/images/prologue/MemoryLoom.png";
import clock from "../../assets/images/prologue/Clock.png";
import bridge from "../../assets/images/prologue/Bridge.png";
import chair from "../../assets/images/prologue/Chair.png";
import invitation from "../../assets/images/prologue/Invitation.png";
import archway from "../../assets/images/prologue/Archway.png";
import finalTable from "../../assets/images/prologue/FinalTable.png";

export const WORLD_HEIGHT = 768;
export const WORLD_WIDTH = 11200;

/**
 * x:
 * Horizontal position inside the continuous world.
 *
 * width:
 * Rendered object width in world pixels.
 *
 * bottom:
 * Distance from the bottom of the world.
 *
 * interactionDistance:
 * How close the Guest must be to interact.
 */
export const prologueObjects = [
  {
    id: "broom",
    image: broom,
    x: 850,
    width: 300,
    bottom: 105,
    narration: "Some things wait patiently to be remembered.",
  },

  {
    id: "choice",
    image: choiceStand,
    x: 1450,
    width: 280,
    bottom: 112,
    interaction: "choice",
    interactionDistance: 190,
  },

  {
    id: "dice",
    image: dice,
    x: 2200,
    width: 250,
    bottom: 118,
    interaction: "dice",
    interactionDistance: 185,
  },

  {
    id: "glory-candle",
    image: dimCandle,
    restoredImage: brightCandle,
    x: 3000,
    width: 115,
    bottom: 130,
    interaction: "glory",
    interactionDistance: 170,
  },

  {
    id: "glory-flower",
    image: closedFlower,
    restoredImage: openFlower,
    x: 3225,
    width: 135,
    bottom: 120,
    linkedToGlory: true,
  },

  {
    id: "candles",
    image: candles,
    x: 3900,
    width: 360,
    bottom: 125,
  },

  {
    id: "cake",
    image: cake,
    x: 4550,
    width: 195,
    bottom: 115,
  },

  {
    id: "balloon",
    image: balloon,
    x: 5100,
    width: 130,
    bottom: 145,
  },

  {
    id: "gift",
    image: gift,
    x: 5600,
    width: 180,
    bottom: 115,
  },

  {
    id: "memory-loom",
    image: memoryLoom,
    x: 6250,
    width: 250,
    bottom: 110,
  },

  {
    id: "clock",
    image: clock,
    x: 6850,
    width: 190,
    bottom: 125,
  },

  {
    id: "bridge",
    image: bridge,
    x: 7480,
    width: 430,
    bottom: 105,
  },

  {
    id: "chair-one",
    image: chair,
    x: 8200,
    width: 145,
    bottom: 115,
  },

  {
    id: "invitation",
    image: invitation,
    x: 8650,
    width: 185,
    bottom: 135,
  },

  {
    id: "chair-two",
    image: chair,
    x: 9150,
    width: 145,
    bottom: 115,
  },

  {
    id: "archway",
    image: archway,
    x: 9650,
    width: 420,
    bottom: 100,
  },

  {
    id: "final-table",
    image: finalTable,
    x: 10400,
    width: 430,
    bottom: 105,
    interaction: "book",
    interactionDistance: 240,
  },
];