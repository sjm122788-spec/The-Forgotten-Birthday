import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Prologue.css";

import titleLogo from "../../assets/images/prologue/TitleLogo.png";
import sky from "../../assets/images/prologue/Sky.png";
import landscape from "../../assets/images/prologue/Landscape.png";
import path from "../../assets/images/prologue/Path.png";

import idleFaceRight from "../../assets/images/prologue/IdleFaceRight.png";
import walk1FaceRight from "../../assets/images/prologue/Walk1FaceRight.png";
import walk2FaceRight from "../../assets/images/prologue/Walk2FaceRight.png";
import point1FaceRight from "../../assets/images/prologue/Point1FaceRight.png";
import point2FaceRight from "../../assets/images/prologue/Point2FaceRight.png";

import buttonA from "../../assets/images/prologue/ButtonA.png";
import leftButton from "../../assets/images/prologue/Left.png";
import rightButton from "../../assets/images/prologue/Right.png";
import interactPrompt from "../../assets/images/prologue/Interact.png";

import closedBook from "../../assets/images/prologue/ClosedBook.png";
import openingBook from "../../assets/images/prologue/OpeningBook.png";
import glowingBook from "../../assets/images/prologue/GlowingBook.png";
import inkBlot from "../../assets/images/prologue/InkBlot.png";

import guestView0 from "../../assets/images/prologue/GuestView0.png";
import guestView1 from "../../assets/images/prologue/GuestView1.png";
import guestView2 from "../../assets/images/prologue/GuestView2.png";
import guestView3 from "../../assets/images/prologue/GuestView3.png";
import guestView4 from "../../assets/images/prologue/GuestView4.png";
import guestView5 from "../../assets/images/prologue/GuestView5.png";

import {
  WORLD_HEIGHT,
  WORLD_WIDTH,
  prologueObjects,
} from "./prologueWorld";

const PROLOGUE_PHASES = {
  TITLE: "title",
  WAITING: "waiting",
  WORLD: "world",
  BOOK: "book",
  TRANSITION: "transition",
};

const PLAYER_START_X = 220;
const PLAYER_SPEED = 7;
const INTERACTION_DISTANCE = 145;

/**
 * connectedGuests:
 * Current number of connected phone Guests.
 *
 * requiredGuests:
 * Number needed before the Host may begin.
 *
 * devMode:
 * Allows the intro to begin without all Guests connected.
 *
 * onComplete:
 * Called after the ink transition. App should then show the storybook/map.
 */
export default function Prologue({
  connectedGuests = 0,
  requiredGuests = 6,
  devMode = false,
  onComplete,
}) {
  const [phase, setPhase] = useState(PROLOGUE_PHASES.TITLE);

  const [playerX, setPlayerX] = useState(PLAYER_START_X);
  const [direction, setDirection] = useState("right");
  const [isWalking, setIsWalking] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);

  const [completedInteractions, setCompletedInteractions] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);

  const [gloryRestored, setGloryRestored] = useState(false);
  const [gloryRevealVisible, setGloryRevealVisible] = useState(false);

  const [bookStage, setBookStage] = useState("closed");
  const [transitionStage, setTransitionStage] = useState("idle");

  const pressedKeysRef = useRef(new Set());
  const animationFrameRef = useRef(null);
  const lastWalkFrameTimeRef = useRef(0);

  const safeGuestCount = Math.max(
    0,
    Math.min(connectedGuests, requiredGuests)
  );

  const everyoneConnected = safeGuestCount >= requiredGuests;
  const mayBegin = everyoneConnected || devMode;

const maximumPlayerX = WORLD_WIDTH - 350;

const nearbyObject = useMemo(() => {
  const interactiveObjects = prologueObjects.filter(
    (object) => object.interaction
  );

  return interactiveObjects.reduce((nearest, object) => {
    const objectCenter = object.x + object.width / 2;
    const distance = Math.abs(objectCenter - playerX);

    if (!nearest || distance < nearest.distance) {
      return {
        ...object,
        distance,
      };
    }

    return nearest;
  }, null);
}, [playerX]);

const interactionDistance =
  nearbyObject?.interactionDistance ?? INTERACTION_DISTANCE;

const isNearInteraction =
  Boolean(nearbyObject?.interaction) &&
  nearbyObject.distance <= interactionDistance;

  const interactionComplete = nearbyObject
    ? completedInteractions.includes(nearbyObject.id)
    : false;

  const needsInteraction =
    Boolean(isNearInteraction) &&
    !interactionComplete &&
    nearbyObject?.interaction !== "movement";

  const cameraX = useMemo(() => {
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1408;

    const desiredCameraX = playerX - viewportWidth * 0.28;
    const maxCameraX = Math.max(0, WORLD_WIDTH - viewportWidth);

    return Math.max(0, Math.min(desiredCameraX, maxCameraX));
  }, [playerX]);

  const markInteractionComplete = useCallback((sceneId) => {
    setCompletedInteractions((current) => {
      if (current.includes(sceneId)) {
        return current;
      }

      return [...current, sceneId];
    });
  }, []);

  const beginWaitingRoom = useCallback(() => {
    setPhase(PROLOGUE_PHASES.WAITING);
  }, []);

  const beginWorld = useCallback(() => {
    if (!mayBegin) {
      return;
    }

    setPhase(PROLOGUE_PHASES.WORLD);
  }, [mayBegin]);

  const finishPrologue = useCallback(() => {
    setPhase(PROLOGUE_PHASES.TRANSITION);
    setTransitionStage("light");

    window.setTimeout(() => {
      setTransitionStage("dissolve");
    }, 1100);

    window.setTimeout(() => {
      setTransitionStage("black");
    }, 2600);

    window.setTimeout(() => {
      setTransitionStage("reveal");
    }, 3400);

    window.setTimeout(() => {
      setTransitionStage("finished");
      onComplete?.();
    }, 6500);
  }, [onComplete]);

  const performInteraction = useCallback(() => {
  if (phase === PROLOGUE_PHASES.TITLE) {
    beginWorld();
    return;
  }

  if (phase === PROLOGUE_PHASES.WAITING) {
    beginWorld();
    return;
  }

  if (phase === PROLOGUE_PHASES.BOOK) {
    if (bookStage !== "closed") {
      return;
    }

    setBookStage("opening");

    window.setTimeout(() => {
      setBookStage("glowing");
    }, 850);

    window.setTimeout(() => {
      finishPrologue();
    }, 2400);

    return;
  }

  if (
    phase !== PROLOGUE_PHASES.WORLD ||
    !isNearInteraction ||
    !nearbyObject ||
    interactionComplete
  ) {
    return;
  }

  switch (nearbyObject.interaction) {
    case "choice": {
      setActiveMessage({
        eyebrow: "THE GUESTS MUST CHOOSE",
        text: "Which path should be remembered?",
        options: ["The quiet path", "The candlelit path"],
      });

      markInteractionComplete(nearbyObject.id);
      break;
    }

    case "dice": {
      const roll = Math.floor(Math.random() * 20) + 1;

      setActiveMessage({
        eyebrow: "THE STORY TURNS",
        text: `The Guest rolled ${roll}.`,
        subtext:
          roll >= 10
            ? "The forgotten path opens."
            : "The path hesitates, but allows the Guest to continue.",
      });

      markInteractionComplete(nearbyObject.id);
      break;
    }

    case "glory": {
      setGloryRestored(true);
      markInteractionComplete(nearbyObject.id);

      window.setTimeout(() => {
        setGloryRevealVisible(true);
      }, 700);

      window.setTimeout(() => {
        setActiveMessage({
          eyebrow: "GLORY",
          text:
            "Every act of kindness, courage, and attention restores a little of what has been forgotten.",
          subtext: "We call that Glory.",
        });
      }, 1400);

      break;
    }

    case "book": {
      markInteractionComplete(nearbyObject.id);
      setPhase(PROLOGUE_PHASES.BOOK);
      break;
    }

    default:
      markInteractionComplete(nearbyObject.id);
  }
}, [
  beginWorld,
  bookStage,
  finishPrologue,
  interactionComplete,
  isNearInteraction,
  markInteractionComplete,
  nearbyObject,
  phase,
]);

  useEffect(() => {
    if (phase !== PROLOGUE_PHASES.WORLD) {
      return undefined;
    }

    const update = (timestamp) => {
      const keys = pressedKeysRef.current;

      const movingLeft = keys.has("arrowleft") || keys.has("a");
const movingRight = keys.has("arrowright") || keys.has("d");

      let movement = 0;

      if (movingLeft && !movingRight) {
        movement = -PLAYER_SPEED;
        setDirection("left");
      }

      if (movingRight && !movingLeft) {
        movement = PLAYER_SPEED;
        setDirection("right");
      }

      const walking = movement !== 0;
      setIsWalking(walking);

      if (walking) {
  setPlayerX((current) =>
    Math.max(
      PLAYER_START_X,
      Math.min(current + movement, maximumPlayerX)
    )
  );

  if (timestamp - lastWalkFrameTimeRef.current > 180) {
    setWalkFrame((current) => (current === 0 ? 1 : 0));
    lastWalkFrameTimeRef.current = timestamp;
  }
} else {
  setWalkFrame(0);
}

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [maximumPlayerX, phase]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (
        ["arrowleft", "arrowright", "a", "d", "enter", " "].includes(key)
      ) {
        event.preventDefault();
      }

      pressedKeysRef.current.add(key);

      if (key === "enter" || key === " ") {
        performInteraction();
      }
    };

    const handleKeyUp = (event) => {
      pressedKeysRef.current.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [performInteraction]);

  useEffect(() => {
    if (phase !== PROLOGUE_PHASES.WORLD || !nearbyObject) {
      return;
    }

    if (nearbyObject.interaction === "movement") {
      const isClose =
        Math.abs(nearbyObject.worldX - playerX) <= INTERACTION_DISTANCE;

      if (isClose && !completedInteractions.includes(nearbyObject.id)) {
        markInteractionComplete(nearbyObject.id);

        setActiveMessage({
          eyebrow: "MOVE",
          text: "Use the arrow keys to follow the path.",
        });
      }
    }
  }, [
    completedInteractions,
    nearbyObject,
    markInteractionComplete,
    phase,
    playerX,
  ]);

  const guestImages = [
    guestView0,
    guestView1,
    guestView2,
    guestView3,
    guestView4,
    guestView5,
  ];

  const waitingImage =
    guestImages[Math.min(safeGuestCount, guestImages.length - 1)];

  const playerSprite = useMemo(() => {
    if (!isWalking) {
      return idleFaceRight;
    }

    return walkFrame === 0 ? walk1FaceRight : walk2FaceRight;
  }, [isWalking, walkFrame]);

  return (
    <main className={`prologue prologue--${phase}`}>
      {phase === PROLOGUE_PHASES.TITLE && (
        <section className="prologue-title">
          <div className="prologue-crt" />

          <img
            className="prologue-title__logo"
            src={titleLogo}
            alt="Birthday Quest"
          />

          <button
            type="button"
            className="prologue-prompt prologue-prompt--pulse"
            onClick={beginWorld}
          >
            PRESS START
          </button>

          <p className="prologue-title__subtext">
            A forgotten game is waiting.
          </p>
        </section>
      )}

      {phase === PROLOGUE_PHASES.WAITING && (
        <section className="prologue-waiting">
          <img
            className="prologue-waiting__image"
            src={waitingImage}
            alt={`${safeGuestCount} of ${requiredGuests} Guests connected`}
          />

          <div className="prologue-waiting__overlay">
            <p className="prologue-waiting__count">
              {safeGuestCount} OF {requiredGuests} GUESTS CONNECTED
            </p>

            <button
              type="button"
              className={`prologue-prompt ${
                mayBegin ? "prologue-prompt--pulse" : ""
              }`}
              disabled={!mayBegin}
              onClick={beginWorld}
            >
              {mayBegin ? "PRESS START" : "WAITING FOR GUESTS..."}
            </button>
          </div>
        </section>
      )}

      {phase === PROLOGUE_PHASES.WORLD && (
        <section className="retro-world">
          <div className="retro-world__viewport">
            <div
              className="retro-world__layer retro-world__layer--sky"
              style={{
                backgroundImage: `url(${sky})`,
                transform: `translate3d(${-cameraX * 0.15}px, 0, 0)`,
              }}
            />

            <div
              className="retro-world__layer retro-world__layer--landscape"
              style={{
                backgroundImage: `url(${landscape})`,
                transform: `translate3d(${-cameraX * 0.45}px, 0, 0)`,
              }}
            />

            <div
              className="retro-world__layer retro-world__layer--path"
              style={{
                backgroundImage: `url(${path})`,
                transform: `translate3d(${-cameraX}px, 0, 0)`,
              }}
            />

            <div
  className="retro-world__track"
  style={{
    width: `${WORLD_WIDTH}px`,
    height: `${WORLD_HEIGHT}px`,
    transform: `translate3d(${-cameraX}px, 0, 0)`,
  }}
>
  {prologueObjects.map((object) => {
    const isRestored =
      gloryRestored &&
      (object.interaction === "glory" || object.linkedToGlory);

    const image =
      isRestored && object.restoredImage
        ? object.restoredImage
        : object.image;

    return (
      <div
        key={object.id}
        className={`retro-object retro-object--${object.id}`}
        style={{
          left: `${object.x}px`,
          bottom: `${object.bottom}px`,
          width: `${object.width}px`,
        }}
      >
        <img
          className="retro-object__image"
          src={image}
          alt=""
          draggable="false"
        />

        {object.interaction === "glory" && gloryRestored && (
          <div className="glory-particles" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                style={{
                  "--particle-index": index,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  })}

  <img
    className={`retro-player retro-player--${direction} ${
      isWalking ? "retro-player--walking" : ""
    }`}
    src={playerSprite}
    alt="Guest"
    draggable="false"
    style={{
      left: `${playerX}px`,
    }}
  />
</div>
{playerX < 700 && !activeMessage && (
  <div className="retro-movement-hint">
    <span>USE</span>
    <img src={leftButton} alt="Left" />
    <img src={rightButton} alt="Right" />
    <span>TO WALK</span>
  </div>
)}

            <div className="retro-world__vignette" />
            <div className="prologue-crt" />

            {needsInteraction && (
              <button
                type="button"
                className="retro-interact"
                onClick={performInteraction}
                aria-label="Interact"
              >
                <img src={buttonA} alt="" />
                <span>INTERACT</span>
              </button>
            )}

            {gloryRevealVisible && (
              <div className="glory-word" aria-hidden="true">
                GLORY
              </div>
            )}

            <div className="retro-controls">
              <button
                type="button"
                onPointerDown={() =>
                  pressedKeysRef.current.add("arrowleft")
                }
                onPointerUp={() =>
                  pressedKeysRef.current.delete("arrowleft")
                }
                onPointerCancel={() =>
                  pressedKeysRef.current.delete("arrowleft")
                }
                aria-label="Walk left"
              >
                <img src={leftButton} alt="" />
              </button>

              <button
                type="button"
                onPointerDown={() =>
                  pressedKeysRef.current.add("arrowright")
                }
                onPointerUp={() =>
                  pressedKeysRef.current.delete("arrowright")
                }
                onPointerCancel={() =>
                  pressedKeysRef.current.delete("arrowright")
                }
                aria-label="Walk right"
              >
                <img src={rightButton} alt="" />
              </button>

              <button
                type="button"
                className="retro-controls__interact"
                onClick={performInteraction}
                aria-label="Interact"
              >
                <img src={interactPrompt} alt="" />
              </button>
            </div>

            {activeMessage && (
              <div className="retro-dialogue">
                <p className="retro-dialogue__eyebrow">
                  {activeMessage.eyebrow}
                </p>

                <p className="retro-dialogue__text">
                  {activeMessage.text}
                </p>

                {activeMessage.subtext && (
                  <p className="retro-dialogue__subtext">
                    {activeMessage.subtext}
                  </p>
                )}

                {activeMessage.options && (
                  <div className="retro-dialogue__options">
                    {activeMessage.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setActiveMessage(null)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {!activeMessage.options && (
                  <button
                    type="button"
                    className="retro-dialogue__continue"
                    onClick={() => setActiveMessage(null)}
                  >
                    CONTINUE
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {phase === PROLOGUE_PHASES.BOOK && (
        <section className="retro-book-scene">
          <div className="retro-book-scene__table" />

          <img
            className={`retro-book-scene__book retro-book-scene__book--${bookStage}`}
            src={
              bookStage === "closed"
                ? closedBook
                : bookStage === "opening"
                  ? openingBook
                  : glowingBook
            }
            alt="A mysterious glowing book"
          />

          <button
            type="button"
            className="prologue-prompt prologue-prompt--pulse"
            onClick={performInteraction}
            disabled={bookStage !== "closed"}
          >
            {bookStage === "closed" ? "PRESS A TO OPEN" : ""}
          </button>

          <div className="prologue-crt" />
        </section>
      )}

      {phase === PROLOGUE_PHASES.TRANSITION && (
  <section
    className={`book-transition book-transition--${transitionStage}`}
  >
    <div className="book-transition__white-flare" />

    <div className="book-transition__pixel-noise">
      {Array.from({ length: 48 }).map((_, index) => (
        <span
          key={index}
          style={{
            "--pixel-index": index,
          }}
        />
      ))}
    </div>

    <img
      className="book-transition__ink"
      src={inkBlot}
      alt=""
    />

        <div className="book-transition__blackout" />
    <div className="book-transition__paper" />
    <div className="book-transition__veil" />

    <div className="book-transition__invited">
      YOU’RE INVITED
    </div>
  </section>
)}
    </main>
  );
}
