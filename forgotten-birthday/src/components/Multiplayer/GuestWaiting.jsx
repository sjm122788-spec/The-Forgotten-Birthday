import GuestPrompt from "./GuestPrompt";
import GuestObservation from "./GuestObservation";
import "./GuestWaiting.css";

export default function GuestWaiting({
  roomCode,
  playerId,
  playerName,
  guestCount = 0,
  started = false,
  activePrompt = null,
  onSubmitPrompt,
  promptError = "",
  onLeaveRoom,
}) {
  const isObservationPrompt =
    started && activePrompt?.type === "observation";

  if (isObservationPrompt) {
    return (
      <GuestObservation
        key={activePrompt.id}
        prompt={activePrompt}
        onSubmit={onSubmitPrompt}
        error={promptError}
      />
    );
  }

  const isTargeted =
    started &&
    activePrompt?.status === "awaiting-response" &&
    activePrompt?.targetPlayerIds?.includes(playerId);

  if (isTargeted) {
    return (
      <GuestPrompt
        key={activePrompt.id}
        prompt={activePrompt}
        onSubmit={onSubmitPrompt}
        error={promptError}
      />
    );
  }

  return (
    <main className="multiplayer-guest-waiting">
      <section className="multiplayer-guest-waiting__card">
        <p className="multiplayer-guest-waiting__eyebrow">Guest seat</p>
        <h1 className="multiplayer-guest-waiting__title">
          {started ? "The story has begun" : "Waiting for the host"}
        </h1>
        <p className="multiplayer-guest-waiting__copy">
          {started
            ? "Watch the television. Your phone will wake when the story needs you."
            : "The host is preparing the room. Stay here while your name is welcomed to the circle."}
        </p>

        <div className="multiplayer-guest-waiting__details">
          <div>
            <span className="multiplayer-guest-waiting__label">Room</span>
            <strong>{roomCode}</strong>
          </div>
          <div>
            <span className="multiplayer-guest-waiting__label">Name</span>
            <strong>{playerName}</strong>
          </div>
          <div>
            <span className="multiplayer-guest-waiting__label">Guests</span>
            <strong>{guestCount}</strong>
          </div>
        </div>

        <button type="button" onClick={onLeaveRoom}>
          Leave Room
        </button>
      </section>
    </main>
  );
}
