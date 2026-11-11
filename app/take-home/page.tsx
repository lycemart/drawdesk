import type { Metadata } from "next";
import { optimiseSalary, type Breakdown } from "@/lib/engine";
import { formatGBP, formatPercent, poundsToPence } from "@/lib/format";
import { siteUrl, withBase } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Director take-home pay by company profit (2026/27)",
  description:
    "See the best salary, dividend and take-home pay at profit levels from £30,000 to £200,000 for 2025/26 and 2026/27, calculated with the DrawDesk engine.",
  alternates: { canonical: `${siteUrl}/take-home/` },
};

const PROFITS = [
  30_000, 40_000, 50_000, 60_000, 70_000, 80_000, 90_000, 100_000, 110_000,
  120_000, 140_000, 160_000, 180_000, 200_000,
];

interface Row {
  profit: number;
  current: Breakdown;
  previous: Breakdown;
}

const rows: Row[] = PROFITS.map((profit) => ({
  profit,
  current: optimiseSalary(poundsToPence(profit), 0, "2026/27").best,
  previous: optimiseSalary(poundsToPence(profit), 0, "2025/26").best,
}));

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "DrawDesk", item: `${siteUrl}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Take-home by profit",
      item: `${siteUrl}/take-home/`,
    },
  ],
};

export default function TakeHomePage() {
  const sixty = rows.find((row) => row.profit === 60_000)!;

  return (
    <article className="methodology">
      <p className="eyebrow">Reference table</p>
      <h1>Director take-home by company profit</h1>
      <p className="lead">
        The same engine as the planner, run for one director with no other
        income, no pension and all profit paid out. At £60,000 of profit in
        2026/27 the director keeps {formatGBP(sixty.current.takeHome, 0)}.
      </p>

      <div className="callout">
        <strong>How to read this:</strong> each row is the best affordable
        salary, with the rest paid as dividends after Corporation Tax. The
        2025/26 column uses the old dividend rates, which is why it is higher.
      </div>

      <div className="scroll">
        <table className="wide">
          <caption
            style={{
              captionSide: "top",
              textAlign: "left",
              padding: "12px 0",
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            One director, England/Wales/NI, no pension, all profit extracted.
          </caption>
          <thead>
            <tr>
              <th scope="col">Company profit</th>
              <th scope="col" className="num">
                Best salary
              </th>
              <th scope="col" className="num">
                Take-home 2026/27
              </th>
              <th scope="col" className="num">
                Total tax
              </th>
              <th scope="col" className="num">
                Take-home 2025/26
              </th>
              <th scope="col" className="num">
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.profit}>
                <th scope="row" style={{ textTransform: "none", letterSpacing: 0 }}>
                  {formatGBP(poundsToPence(row.profit), 0)}
                </th>
                <td className="num">{formatGBP(row.current.salary, 0)}</td>
                <td className="num">{formatGBP(row.current.takeHome, 0)}</td>
                <td className="num">
                  {formatGBP(row.current.totalTax, 0)}
                  <span className="sub">
                    {formatPercent(row.current.effectiveRate)}
                  </span>
                </td>
                <td className="num">{formatGBP(row.previous.takeHome, 0)}</td>
                <td className="num">
                  {formatGBP(
                    row.previous.takeHome - row.current.takeHome,
                    0
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="note">
        Rounded to whole pounds for the table; the planner shows every line to
        the penny. The best salary is not always £12,570: above £100,000 the
        personal allowance tapers, and between the Corporation Tax bands a
        different salary can win. Around £140,000 the best salary tracks the
        remaining tapered allowance, which is why it is not a round number.
      </p>

      <h2>What the table shows</h2>
      <p>
        At small profits the £12,570 salary wins: it uses the personal allowance
        and cuts Corporation Tax, and the dividend tax on the rest is lower than
        salary National Insurance plus Income Tax. As profit rises, the
        Corporation Tax rate moves from 19% towards 25% and the personal
        allowance tapers, so the best salary changes and the effective tax rate
        climbs.
      </p>
      <p>
        The difference column is the cost of the April 2026 dividend rise at
        each profit level, assuming the same behaviour. It is not a reason to
        change your mix on its own; the planner tests every salary for your
        actual profit.
      </p>

      <div className="callout">
        Want your own numbers, a pension, or a one-off pot spread over several
        years? <a href={withBase("/")}>Use the planner</a>.
      </div>

      <p style={{ marginTop: 28 }}>
        <a href={withBase("/methodology/")}>Rates, formulas and sources →</a>
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </article>
  );
}
