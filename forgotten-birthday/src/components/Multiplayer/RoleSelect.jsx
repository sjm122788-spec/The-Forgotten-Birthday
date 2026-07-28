import "./RoleSelect.css";

export default function RoleSelect({
  onHostCreate,
  onJoinGuest,
  loading = false,
  error = "",
}) {
  return (
    <main className="multiplayer-role-select">
      <section className="multiplayer-role-select__card">
        <p className="multiplayer-role-select__eyebrow">A candle glows for two</p>
        <h1 className="multiplayer-role-select__title">The Forgotten Birthday</h1>
        <p className="multiplayer-role-select__copy">
          Gather a small circle of guests and guide the story together from the host table.
        </p>

        {error ? <p className="multiplayer-role-select__error">{error}</p> : null}

        <div className="multiplayer-role-select__actions">
          <button type="button" onClick={onHostCreate} disabled={loading}>
            {loading ? "Preparing room..." : "Host the Story"}
          </button>
          <button type="button" onClick={onJoinGuest} disabled={loading}>
            Join the Story
          </button>
        </div>
      </section>
    </main>
  );
}
