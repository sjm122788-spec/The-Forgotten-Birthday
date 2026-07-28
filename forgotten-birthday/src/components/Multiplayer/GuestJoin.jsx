import { useState } from "react";
import "./GuestJoin.css";

export default function GuestJoin({
  onJoin,
  onBack,
  loading = false,
  error = "",
}) {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onJoin({ roomCode, name });
  }

  return (
    <main className="multiplayer-guest-join">
      <section className="multiplayer-guest-join__card">
        <p className="multiplayer-guest-join__eyebrow">Guest arrival</p>
        <h1 className="multiplayer-guest-join__title">Join the story</h1>
        <p className="multiplayer-guest-join__copy">
          Enter the room code from the host and your name. The room will welcome you in moments.
        </p>

        {error ? <p className="multiplayer-guest-join__error">{error}</p> : null}

        <form className="multiplayer-guest-join__form" onSubmit={handleSubmit}>
          <label className="multiplayer-guest-join__field">
            <span>Room code</span>
            <input
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
              placeholder="ABC123"
              autoCapitalize="characters"
              autoComplete="off"
              maxLength={6}
            />
          </label>

          <label className="multiplayer-guest-join__field">
            <span>Your name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="First name"
              autoComplete="name"
            />
          </label>

          <div className="multiplayer-guest-join__actions">
            <button type="submit" disabled={loading}>
              {loading ? "Joining..." : "Join"}
            </button>
            <button type="button" onClick={onBack} disabled={loading}>
              Back
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
