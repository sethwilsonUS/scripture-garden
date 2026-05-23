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
          The garden could not gather the text just now. Try again when you are
          ready.
        </p>
        <button className="btn-secondary" type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </section>
  );
}
