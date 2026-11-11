import type { Metadata } from "next";
import { TAX_YEARS, SOURCES, TAX_YEAR_ORDER } from "@/lib/tax-config";
import { formatGBP } from "@/lib/format";
import { siteUrl, withBase } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Methodology, rates and sources",
  description:
    "Every rate DrawDesk uses for 2025/26 and 2026/27, the formulas behind the planner, and the assumptions that limit it. Checked against GOV.UK on 11 November 2026.",
  alternates: { canonical: `${siteUrl}/methodology/` },
};

function P(pence: number): string {
  return formatGBP(pence, 0);
}

export default function MethodologyPage() {
  const cfg = TAX_YEARS["2026/27"];

  return (
    <article className="methodology">
      <p className="eyebrow">Methodology</p>
      <h1>Every number, and where it comes from</h1>
      <p className="lead">
        DrawDesk is deliberately small: one director, England, Wales and
        Northern Ireland, salary, dividends and employer pension. Here is the
        whole model so you can check it.
      </p>

      <div className="disclaimer">
        <strong>Not tax advice.</strong> DrawDesk is general information. It
        does not know your other income, benefits in kind, student loan, company
        losses, associated companies, or your residency. Check anything that
        matters with a qualified adviser before you act.
      </div>

      <h2>Rates used for 2026/27</h2>
      <p>
        Last reviewed{" "}
        <strong>
          {new Date(cfg.verifiedOn).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </strong>
        . Source links are at the bottom of this page and each rate below maps to
        one of them.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col" className="num">
              2025/26
            </th>
            <th scope="col" className="num">
              2026/27
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Personal allowance</td>
            <td className="num">{P(TAX_YEARS["2025/26"].personalAllowance)}</td>
            <td className="num">{P(cfg.personalAllowance)}</td>
          </tr>
          <tr>
            <td>Personal allowance taper starts</td>
            <td className="num">{P(TAX_YEARS["2025/26"].taperStart)}</td>
            <td className="num">{P(cfg.taperStart)}</td>
          </tr>
          <tr>
            <td>Basic rate band ends</td>
            <td className="num">{P(TAX_YEARS["2025/26"].basicTop)}</td>
            <td className="num">{P(cfg.basicTop)}</td>
          </tr>
          <tr>
            <td>Higher rate band ends</td>
            <td className="num">{P(TAX_YEARS["2025/26"].higherTop)}</td>
            <td className="num">{P(cfg.higherTop)}</td>
          </tr>
          <tr>
            <td>Dividend allowance</td>
            <td className="num">{P(TAX_YEARS["2025/26"].dividendAllowance)}</td>
            <td className="num">{P(cfg.dividendAllowance)}</td>
          </tr>
          {(["basic", "higher", "additional"] as const).map((band) => (
            <tr key={`div-${band}`}>
              <td>Dividend rate, {band}</td>
              {TAX_YEAR_ORDER.map((year) => (
                <td className="num" key={`${band}-${year}`}>
                  {(TAX_YEARS[year].dividendRates[band] * 100).toFixed(2)}%
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td>Employee NI: 8% from / 2% above</td>
            <td className="num" colSpan={2}>
              {P(cfg.employeeNI.primary)} / {P(cfg.employeeNI.upper)}
            </td>
          </tr>
          <tr>
            <td>Employer NI: 15% above</td>
            <td className="num" colSpan={2}>
              {P(cfg.employerNI.threshold)}
            </td>
          </tr>
          <tr>
            <td>Corporation Tax</td>
            <td className="num" colSpan={2}>
              19% up to {P(cfg.corporationTax.smallLimit)}; 25% above{" "}
              {P(cfg.corporationTax.mainLimit)}; marginal relief between
            </td>
          </tr>
        </tbody>
      </table>

      <h2>The model</h2>
      <p>
        Salary and employer pension are paid first out of profit. Employer
        National Insurance is 15% of salary above the secondary threshold. What
        remains is taxable profit, and Corporation Tax is charged on it. The
        post-tax profit is the pot available for dividends.
      </p>
      <div className="formula">{`employer NI = 15% × max(0, salary − £5,000)
taxable profit = profit − salary − employer NI − pension
Corporation Tax = 19% up to £50,000
                = 25% above £250,000
                = 25% − 1.5% × (£250,000 − profit) in between
dividends = taxable profit − Corporation Tax (minus anything retained)

personal allowance = £12,570 − 50% × max(0, income − £100,000)
Income Tax on salary = 20% / 40% / 45% by band
employee NI = 8% between £12,570 and £50,270, then 2%
dividend tax = 0% on the £500 allowance, then 10.75% / 35.75% / 39.35%
take-home = salary − Income Tax − employee NI + dividends − dividend tax`}</div>

      <h3>Salary search</h3>
      <p>
        We test affordable salaries from £0 to the most the profit can fund, in
        £50 steps, then refine the best region in £1 steps. The salary that
        leaves the highest take-home wins. Ties go to the lower salary. The
        search is deterministic and runs in your browser.
      </p>

      <h3>One-off spreading</h3>
      <p>
        The spreading model assumes the company earns the profit once. It pays
        the optimal salary in year one, then pays the remaining pot as dividends
        across the chosen number of tax years, filling the basic-rate band each
        year and draining the balance in the final year. Later years are assumed
        to use {cfg.label} rates and to have no salary or other income.
      </p>

      <h2>Assumptions and exclusions</h2>
      <ul>
        <li>One director, owning all the shares, with no other income.</li>
        <li>England, Wales or Northern Ireland. Scottish bands are not modelled.</li>
        <li>
          No Employment Allowance: a company whose only paid employee is a
          single director cannot claim it.
        </li>
        <li>No student loan, child benefit charge, benefits in kind or IR35.</li>
        <li>No associated companies, losses, or retained profits from earlier years.</li>
        <li>Pension contributions are employer contributions, capped at £60,000 and at profit; the annual allowance taper is not modelled.</li>
        <li>Salary and pension are limited to what the year&apos;s profit can fund.</li>
        <li>Dividends are assumed to be legally declared from available profits.</li>
        <li>Figures are rounded to the penny, line by line.</li>
      </ul>

      <h2>Checking the result</h2>
      <p>
        The £60,000 worked example on the home page matches the published
        examples from two independent UK calculators as at 11 November 2026. The
        engine has automated tests for published reference cases, zero profit,
        affordability, year-on-year comparison, pension deductibility and
        multi-year totals.
      </p>

      <h2>Sources</h2>
      <ul>
        {SOURCES.map((source) => (
          <li key={source.url}>
            <a href={source.url} rel="noopener noreferrer">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <p>
        Rates change. If a GOV.UK page above no longer matches this table, the
        table is wrong — tell us and we will fix it before anything else.
      </p>

      <p style={{ marginTop: 28 }}>
        <a href={withBase("/")}>← Back to the planner</a>
      </p>
    </article>
  );
}
