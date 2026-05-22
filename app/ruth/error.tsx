"use client";

export default function RuthOverviewError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <section className="alert-banner alert-error" role="alert">
      <div>
        <h1 className="alert-banner__title">Ruth could not load.</h1>
        <p className="alert-banner__body">
          The reader stayed inside the Ruth-first boundary, but the public
          corpus request failed. Try again when you are ready.
        </p>
        <button className="btn-secondary" type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </section>
  );
}
