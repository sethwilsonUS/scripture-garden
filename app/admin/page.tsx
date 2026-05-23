import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getConvexAdminSecret } from "@/lib/admin/session";
import {
  createAnchorAction,
  createNodeAction,
  createNodeTextLinkAction,
  createRelationshipAction,
  decideRelationshipAction,
  logoutAction,
  reviewSuggestionAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Workbench",
};

const nodeTypes = [
  "person",
  "place",
  "group_lineage",
  "thing_practice",
  "theme_motif",
  "external_stub",
];

const relationshipTypes = [
  "appears_in",
  "kinship",
  "located_in",
  "movement",
  "associated_with",
  "linked_passage",
  "cross_book_stub_link",
  "thematic_resonance",
];

function Select({
  name,
  label,
  values,
}: {
  name: string;
  label: string;
  values: string[];
}) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      <select className="input-field" name={name} required>
        {values.map((value) => (
          <option key={value} value={value}>
            {value.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  name,
  label,
  required = true,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      <input className="input-field" name={name} required={required} />
    </label>
  );
}

function NumberField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: number;
}) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      <input
        className="input-field"
        name={name}
        type="number"
        min="1"
        step="1"
        defaultValue={defaultValue}
        required
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  required = true,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      <textarea className="input-field textarea-field" name={name} required={required} />
    </label>
  );
}

export default async function AdminPage() {
  const data = await fetchQuery(api.admin.listWorkbench, {
    adminSecret: getConvexAdminSecret(),
  });

  return (
    <div className="admin-workbench">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Protected workbench</p>
          <h1 className="section-heading">Ruth editorial garden</h1>
          <p className="section-copy">
            Create, anchor, preview, approve, and audit Ruth-first semantic
            content. Public relationships stay hidden until approved.
          </p>
        </div>
        <form action={logoutAction}>
          <button className="btn-secondary" type="submit">
            Log out
          </button>
        </form>
      </header>

      <section className="admin-summary-grid" aria-label="Workbench summary">
        <div className="garden-bed">
          <p className="eyebrow">Nodes</p>
          <p className="admin-metric">{data.nodes.length}</p>
        </div>
        <div className="garden-bed">
          <p className="eyebrow">Relationships</p>
          <p className="admin-metric">{data.relationships.length}</p>
        </div>
        <div className="garden-bed">
          <p className="eyebrow">AI suggestions</p>
          <p className="admin-metric">{data.suggestions.length}</p>
        </div>
      </section>

      <div className="admin-grid">
        <section className="garden-bed" aria-labelledby="create-node-title">
          <h2 id="create-node-title" className="garden-card-title">
            Create node or stub
          </h2>
          <form action={createNodeAction} className="admin-form">
            <TextField name="displayName" label="Display name" />
            <TextField name="slug" label="Slug" />
            <Select name="nodeType" label="Type" values={nodeTypes} />
            <Select
              name="status"
              label="Status"
              values={["draft", "published", "archived"]}
            />
            <TextArea name="summary" label="Public summary" />
            <TextField name="externalReference" label="External reference" required={false} />
            <TextArea name="boundaryNote" label="Boundary note" required={false} />
            <label className="checkbox-field">
              <input type="checkbox" name="isPublic" />
              <span>Publish if status is published</span>
            </label>
            <button className="btn-primary" type="submit">
              Save node
            </button>
          </form>
        </section>

        <section className="garden-bed" aria-labelledby="anchor-title">
          <h2 id="anchor-title" className="garden-card-title">
            Anchor node to Ruth
          </h2>
          <form action={createAnchorAction} className="admin-form">
            <TextField name="nodeSlug" label="Node slug" />
            <TextField name="passageSlug" label="Passage slug" />
            <Select
              name="anchorKind"
              label="Anchor kind"
              values={["primary", "mention", "context", "background"]}
            />
            <Select
              name="readerSurface"
              label="Reader surface"
              values={["detail_only", "note"]}
            />
            <TextField name="displayLabel" label="Display label" />
            <button className="btn-primary" type="submit">
              Save anchor
            </button>
          </form>
        </section>

        <section className="garden-bed" aria-labelledby="text-link-title">
          <h2 id="text-link-title" className="garden-card-title">
            Create inline text link
          </h2>
          <form action={createNodeTextLinkAction} className="admin-form">
            <TextField name="nodeSlug" label="Node slug" />
            <TextField name="passageSlug" label="Passage slug" />
            <TextField name="verseKey" label="Verse key" />
            <TextField name="linkedText" label="Linked text" />
            <NumberField
              name="occurrenceNumber"
              label="Occurrence number"
              defaultValue={1}
            />
            <Select
              name="anchorKind"
              label="Anchor kind"
              values={["primary", "mention", "context", "background"]}
            />
            <TextField name="displayLabel" label="Display label" />
            <TextField name="contextLabel" label="Context label" required={false} />
            <button className="btn-primary" type="submit">
              Save inline link
            </button>
          </form>
        </section>

        <section className="garden-bed" aria-labelledby="relationship-title">
          <h2 id="relationship-title" className="garden-card-title">
            Draft relationship
          </h2>
          <form action={createRelationshipAction} className="admin-form">
            <TextField name="sourceNodeSlug" label="Source node slug" />
            <TextField name="targetNodeSlug" label="Target node slug" />
            <Select
              name="relationshipTypeKey"
              label="Relationship type"
              values={relationshipTypes}
            />
            <Select
              name="evidenceClass"
              label="Evidence"
              values={["textual", "contextual", "editorial"]}
            />
            <TextField name="sourcePassageSlug" label="Source passage slug" required={false} />
            <TextField name="publicLabel" label="Public label" />
            <TextArea name="rationale" label="Public rationale" />
            <button className="btn-primary" type="submit">
              Save draft relationship
            </button>
          </form>
        </section>
      </div>

      <section className="garden-bed" aria-labelledby="preview-title">
        <h2 id="preview-title" className="garden-card-title">
          Preview and approvals
        </h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <caption>
              Relationships with public status and approval controls
            </caption>
            <thead>
              <tr>
                <th scope="col">Path</th>
                <th scope="col">Evidence</th>
                <th scope="col">Status</th>
                <th scope="col">Rationale</th>
                <th scope="col">Decision</th>
              </tr>
            </thead>
            <tbody>
              {data.relationships.map((relationship) => (
                <tr key={relationship._id}>
                  <td>
                    <strong>{relationship.sourceNode?.displayName}</strong>{" "}
                    {relationship.publicLabel}{" "}
                    <strong>{relationship.targetNode?.displayName}</strong>
                  </td>
                  <td>{relationship.evidenceClass}</td>
                  <td>
                    {relationship.isPublic ? "public" : "internal"} /{" "}
                    {relationship.approvalStatus}
                  </td>
                  <td>{relationship.rationale}</td>
                  <td>
                    <form action={decideRelationshipAction} className="inline-form">
                      <input
                        type="hidden"
                        name="relationshipId"
                        value={relationship._id}
                      />
                      <input
                        type="hidden"
                        name="rationale"
                        value="Reviewed in MVP workbench."
                      />
                      <button
                        className="btn-secondary"
                        type="submit"
                        name="decision"
                        value="approved"
                      >
                        Approve
                      </button>
                      <button
                        className="btn-secondary"
                        type="submit"
                        name="decision"
                        value="rejected"
                      >
                        Reject
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="garden-bed" aria-labelledby="suggestions-title">
        <h2 id="suggestions-title" className="garden-card-title">
          AI suggestions stay internal
        </h2>
        <ul className="admin-list">
          {data.suggestions.map((suggestion) => (
            <li key={suggestion._id}>
              <span>
                {suggestion.suggestionType} / {suggestion.reviewStatus}
              </span>
              <form action={reviewSuggestionAction} className="inline-form">
                <input type="hidden" name="suggestionId" value={suggestion._id} />
                <button
                  className="btn-secondary"
                  type="submit"
                  name="reviewStatus"
                  value="reviewed"
                >
                  Mark reviewed
                </button>
                <button
                  className="btn-secondary"
                  type="submit"
                  name="reviewStatus"
                  value="rejected"
                >
                  Reject
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className="garden-bed" aria-labelledby="audit-title">
        <h2 id="audit-title" className="garden-card-title">
          Recent audit trail
        </h2>
        <ol className="admin-list">
          {data.auditEntries.map((entry) => (
            <li key={entry._id}>
              <span>{entry.action}</span>
              <small>
                {entry.targetTable} at{" "}
                {new Date(entry.occurredAt).toLocaleString("en-US")}
              </small>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
