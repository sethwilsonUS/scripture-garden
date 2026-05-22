import type { Metadata } from "next";
import { loginAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="admin-login" aria-labelledby="admin-login-title">
      <div className="garden-bed admin-login__panel">
        <p className="eyebrow">MVP workbench</p>
        <h1 id="admin-login-title" className="section-heading">
          Editor login
        </h1>
        <p className="section-copy">
          This protected area is for Ruth-first editorial curation and approval.
        </p>

        {params.error ? (
          <div className="alert-banner alert-error" role="alert">
            <div>
              <h2 className="alert-banner__title">Login did not work</h2>
              <p className="alert-banner__body">
                Check the MVP admin password and try again.
              </p>
            </div>
          </div>
        ) : null}

        <form action={loginAction} className="admin-form">
          <input type="hidden" name="next" value={params.next ?? "/admin"} />
          <label className="form-field">
            <span className="form-field__label">Password</span>
            <input
              className="input-field"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="btn-primary" type="submit">
            Enter workbench
          </button>
        </form>
      </div>
    </section>
  );
}
