import Link from "next/link";

export default function NotFound() {
  return (
    <div className="notfound">
      <p className="eyebrow">404</p>
      <h1>That page is not here</h1>
      <p style={{ color: "var(--muted)", margin: "14px 0 24px" }}>
        The planner is still where you left it.
      </p>
      <Link className="btn" href="/">
        Back to DrawDesk
      </Link>
    </div>
  );
}
