import "./HostLobby.css";

export default function HostLobby({
  roomCode,
  guests = [],
  loading = false,
  error = "",
  onStartStory,
  onLeaveRoom,
}) {
  const guestList = Array.isArray(guests) ? guests : [];

  return (
    <main className="multiplayer-host-lobby">
      <section className="multiplayer-host-lobby__card">
        <p className="multiplayer-host-lobby__eyebrow">Host table</p>
        <h1 className="multiplayer-host-lobby__title">The room is ready</h1>
        <p className="multiplayer-host-lobby__room-code">{roomCode}</p>
        <p className="multiplayer-host-lobby__copy">
          Guests can join with this code. When the circle is ready, begin the story.
        </p>

        {error ? <p className="multiplayer-host-lobby__error">{error}</p> : null}

        <div className="multiplayer-host-lobby__meta">
          <div>
            <span className="multiplayer-host-lobby__label">Guests</span>
            <strong>{guestList.length}</strong>
          </div>
          <div>
            <span className="multiplayer-host-lobby__label">Status</span>
            <strong>Lobby</strong>
          </div>
        </div>

        <ul className="multiplayer-host-lobby__guests">
          {guestList.length === 0 ? (
            <li>No guests have joined yet.</li>
          ) : (
            guestList.map((guest) => <li key={guest.id ?? guest.name}>{guest.name}</li>)
          )}
        </ul>

        <div className="multiplayer-host-lobby__actions">
          <button type="button" onClick={onStartStory} disabled={loading || guestList.length === 0}>
            {loading ? "Starting..." : "Start Story"}
          </button>
          <button type="button" onClick={onLeaveRoom} disabled={loading}>
            Start New Room
          </button>
        </div>
      </section>
    </main>
  );
}
