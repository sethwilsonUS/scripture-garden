"use client";

export default function RuthChapterError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <section className="alert-banner alert-error" role="alert">
      <div>
        <h1 className="alert-banner__title">This chapter could not load.</h1>
        <p className="alert-banner__body">
          The public reader could not reach the Ruth corpus or semantic layer.
          Nothing internal has been exposed.
        </p>
        <button className="btn-secondary" type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </section>
  );
}
