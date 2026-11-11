"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildPlan,
  compareYears,
  marginalRoutes,
  optimiseSalary,
  type Horizon,
} from "@/lib/engine";
import { formatGBP, formatPercent, formatSignedGBP, poundsToPence } from "@/lib/format";
import { DEFAULT_SCENARIO, parseScenario, toSearch, type Scenario } from "@/lib/url-state";
import { TAX_YEAR_ORDER, type TaxYear } from "@/lib/tax-config";
import { withBase } from "@/lib/seo";

const MAX_PROFIT = 1_000_000;
const MAX_PENSION = 60_000;

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export default function Planner() {
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [pensionOpen, setPensionOpen] = useState(false);

  useEffect(() => {
    const parsed = parseScenario(window.location.search);
    setScenario(parsed.scenario);
    setInvalid(parsed.invalid);
    setPensionOpen(parsed.scenario.pension > 0);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const query = toSearch(scenario);
    window.history.replaceState(null, "", `${window.location.pathname}${query}`);
  }, [scenario, ready]);

  const profitPence = poundsToPence(scenario.profit);
  const pensionPence = poundsToPence(scenario.pension);

  const { best } = useMemo(
    () => optimiseSalary(profitPence, pensionPence, scenario.year),
    [profitPence, pensionPence, scenario.year]
  );

  const plan = useMemo(
    () =>
      scenario.horizon > 1
        ? buildPlan(profitPence, pensionPence, scenario.horizon, scenario.year, "spread")
        : null,
    [profitPence, pensionPence, scenario.horizon, scenario.year]
  );

  const routes = useMemo(
    () => marginalRoutes(profitPence, pensionPence, scenario.year),
    [profitPence, pensionPence, scenario.year]
  );

  const years = useMemo(
    () => compareYears(profitPence, pensionPence),
    [profitPence, pensionPence]
  );

  const otherYear: TaxYear = scenario.year === "2026/27" ? "2025/26" : "2026/27";
  const other = scenario.year === "2026/27" ? years.previous : years.current;
  const thisYear = scenario.year === "2026/27" ? years.current : years.previous;
  const delta = thisYear.takeHome - other.takeHome;

  const update = (patch: Partial<Scenario>) =>
    setScenario((current) => ({ ...current, ...patch }));

  const setProfit = (raw: string) => {
    const value = raw === "" ? 0 : Number(raw);
    const profit = clamp(value, 0, MAX_PROFIT);
    update({ profit, pension: Math.min(scenario.pension, profit) });
  };

  const setPension = (raw: string) => {
    const value = raw === "" ? 0 : Number(raw);
    update({ pension: clamp(value, 0, Math.min(MAX_PENSION, scenario.profit)) });
  };

  const setHorizon = (horizon: Horizon) => update({ horizon, strategy: "spread" });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  const segments = [
    { key: "take", value: Math.max(0, best.takeHome), color: "var(--primary)", label: "You keep" },
    { key: "tax", value: Math.max(0, best.totalTax), color: "#9a8a72", label: "Tax" },
    { key: "pension", value: Math.max(0, best.pension), color: "var(--accent)", label: "Pension" },
  ].filter((s) => s.value > 0);
  const segmentTotal = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div className="workspace">
      <form className="panel controls" onSubmit={(e) => e.preventDefault()}>
        <h2>Your company</h2>
        <p className="hint">One director, England, Wales or Northern Ireland.</p>

        <div className="field">
          <label htmlFor="profit">Company profit before your pay</label>
          <div className="money">
            <span className="symbol" aria-hidden="true">
              £
            </span>
            <input
              id="profit"
              name="profit"
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_PROFIT}
              step={1000}
              value={scenario.profit}
              onChange={(e) => setProfit(e.target.value)}
              aria-describedby="profit-help"
            />
          </div>
          <span className="sub" id="profit-help">
            After business costs, before salary, pension and Corporation Tax.
          </span>
        </div>

        <div className="field">
          <span className="label" id="year-label">
            Tax year
          </span>
          <div className="segmented" role="group" aria-labelledby="year-label">
            {TAX_YEAR_ORDER.map((year) => (
              <button
                key={year}
                type="button"
                aria-pressed={scenario.year === year}
                onClick={() => update({ year })}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="check" htmlFor="pension-toggle">
            <input
              id="pension-toggle"
              type="checkbox"
              checked={pensionOpen}
              onChange={(e) => {
                setPensionOpen(e.target.checked);
                if (!e.target.checked) update({ pension: 0 });
              }}
            />
            <span>
              Add an employer pension contribution
              <span className="sub">Deductible, no NI, no Income Tax now.</span>
            </span>
          </label>
        </div>

        {pensionOpen ? (
          <div className="field">
            <label htmlFor="pension">Employer pension</label>
            <div className="money">
              <span className="symbol" aria-hidden="true">
                £
              </span>
              <input
                id="pension"
                name="pension"
                type="number"
                inputMode="numeric"
                min={0}
                max={Math.min(MAX_PENSION, scenario.profit)}
                step={1000}
                value={scenario.pension}
                onChange={(e) => setPension(e.target.value)}
              />
            </div>
            <span className="sub">Capped at £60,000 and at your profit.</span>
          </div>
        ) : null}

        <div className="field">
          <span className="label" id="horizon-label">
            Planning a one-off pot?
          </span>
          <div className="horizon" role="group" aria-labelledby="horizon-label">
            {[1, 3, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={scenario.horizon === n}
                onClick={() => setHorizon(n as Horizon)}
              >
                {n === 1 ? "Just this year" : `Spread over ${n} years`}
              </button>
            ))}
          </div>
          <span className="sub" style={{ marginTop: 8 }}>
            Spreading a single pot across tax years uses more than one set of bands.
          </span>
        </div>

        {invalid.length > 0 ? (
          <p className="note" role="status">
            Some shared values were adjusted: {invalid.join(", ")}.
          </p>
        ) : null}

        <p className="assume">
          We assume one director, no Employment Allowance, no other income, and
          that salary and pension are funded by this year&apos;s profit.
        </p>
      </form>

      <div className="results">
        <section className="hero-card" aria-labelledby="result-title">
          <p className="kicker" id="result-title">
            Best mix for {scenario.year}
          </p>
          <p className="takehome">{formatGBP(best.takeHome, 0)}</p>
          <p className="taxline">
            {formatGBP(best.totalTax)} goes to tax ·{" "}
            {formatPercent(best.effectiveRate)} of profit
          </p>
          <div className="hero-stats">
            <div>
              <span>Salary</span>
              <strong>{formatGBP(best.salary, 0)}</strong>
            </div>
            <div>
              <span>Dividends</span>
              <strong>{formatGBP(best.dividends, 0)}</strong>
            </div>
            <div>
              <span>Pension</span>
              <strong>{formatGBP(best.pension, 0)}</strong>
            </div>
          </div>
          {delta !== 0 ? (
            <p className="delta">
              {formatSignedGBP(delta)} vs {otherYear} at the same profit
            </p>
          ) : null}
        </section>

        <section className="card" aria-labelledby="split-title">
          <h3 id="split-title">Where the profit goes</h3>
          <p className="card-sub">
            {formatGBP(best.profit, 0)} of company profit, before any retained
            profit.
          </p>
          <div className="split" role="img" aria-label={segments
            .map((s) => `${s.label} ${formatGBP(s.value, 0)}`)
            .join(", ")}>
            {segments.map((segment) => (
              <i
                key={segment.key}
                style={{
                  width: `${(segment.value / segmentTotal) * 100}%`,
                  background: segment.color,
                }}
              />
            ))}
          </div>
          <div className="legend">
            {segments.map((segment) => (
              <span key={segment.key}>
                <b style={{ background: segment.color }} aria-hidden="true" />
                {segment.label} {formatGBP(segment.value, 0)}
              </span>
            ))}
          </div>
        </section>

        <section className="card" aria-labelledby="breakdown-title">
          <h3 id="breakdown-title">The workings</h3>
          <p className="card-sub">
            Every line this year, to the penny. Corporation Tax is paid by the
            company; the rest by you.
          </p>
          <div className="scroll">
            <table>
              <caption className="visually-hidden" style={{ position: "absolute", left: -9999 }}>
                Breakdown of company profit and personal tax for {scenario.year}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Line</th>
                  <th scope="col" className="num">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Salary</td>
                  <td className="num">{formatGBP(best.salary)}</td>
                </tr>
                <tr>
                  <td>Dividends</td>
                  <td className="num">{formatGBP(best.dividends)}</td>
                </tr>
                <tr>
                  <td>Employer National Insurance</td>
                  <td className="num">{formatGBP(best.employerNI)}</td>
                </tr>
                <tr>
                  <td>Corporation Tax</td>
                  <td className="num">{formatGBP(best.corporationTax)}</td>
                </tr>
                <tr>
                  <td>Income Tax on salary</td>
                  <td className="num">{formatGBP(best.incomeTax)}</td>
                </tr>
                <tr>
                  <td>Employee National Insurance</td>
                  <td className="num">{formatGBP(best.employeeNI)}</td>
                </tr>
                <tr>
                  <td>Dividend Tax</td>
                  <td className="num">{formatGBP(best.dividendTax)}</td>
                </tr>
                <tr className="total">
                  <td>Total tax</td>
                  <td className="num">{formatGBP(best.totalTax)}</td>
                </tr>
                <tr className="total">
                  <td>You keep</td>
                  <td className="num">{formatGBP(best.takeHome)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="card" aria-labelledby="marginal-title">
          <h3 id="marginal-title">The next £1,000</h3>
          <p className="card-sub">
            If the company earned £1,000 more, where should it go? Net cash to
            you, after every tax.
          </p>
          <div className="scroll">
            <table className="wide">
              <thead>
                <tr>
                  <th scope="col">Route</th>
                  <th scope="col" className="num">
                    Cash now
                  </th>
                  <th scope="col" className="num">
                    Into pension
                  </th>
                  <th scope="col" className="num">
                    Total value
                  </th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.key}>
                    <td>
                      <strong>{route.label}</strong>
                      <span className="sub">{route.note}</span>
                    </td>
                    <td className="num">{formatSignedGBP(route.cashDelta)}</td>
                    <td className="num">
                      {route.pensionDelta > 0 ? formatGBP(route.pensionDelta) : "—"}
                    </td>
                    <td className="num">{formatSignedGBP(route.valueDelta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="note">
            A company pension is the only route that escapes both National
            Insurance and Income Tax today, but the money is locked until
            pension age.
          </p>
        </section>

        {plan ? (
          <section className="card" aria-labelledby="plan-title">
            <h3 id="plan-title">Spread over {scenario.horizon} years</h3>
            <p className="card-sub">
              One pot, paid as dividends across {scenario.horizon} tax years.
              Salary is paid in year one only; later years use the personal
              allowance and basic band again, with no salary or other income
              assumed.
            </p>
            {plan.totalTakeHome > plan.extractAllTakeHome ? (
              <p className="savings">
                {formatGBP(plan.totalTakeHome - plan.extractAllTakeHome, 0)} more
                than taking it all at once
              </p>
            ) : (
              <div className="callout">
                This pot already fits inside one year&apos;s basic-rate band, so
                spreading it over {scenario.horizon} years adds nothing. Increase
                the profit to see a saving.
              </div>
            )}
            {plan.totalTakeHome > plan.extractAllTakeHome ? (
            <div className="scroll">
              <table className="wide">
                <thead>
                  <tr>
                    <th scope="col">Year</th>
                    <th scope="col" className="num">
                      Salary
                    </th>
                    <th scope="col" className="num">
                      Dividends
                    </th>
                    <th scope="col" className="num">
                      Tax
                    </th>
                    <th scope="col" className="num">
                      You keep
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plan.rows.map((row) => (
                    <tr key={row.yearIndex}>
                      <td>Year {row.yearIndex}</td>
                      <td className="num">{formatGBP(row.salary, 0)}</td>
                      <td className="num">{formatGBP(row.dividends, 0)}</td>
                      <td className="num">{formatGBP(row.totalTax, 0)}</td>
                      <td className="num">{formatGBP(row.takeHome, 0)}</td>
                    </tr>
                  ))}
                  <tr className="total">
                    <td>Total</td>
                    <td className="num">—</td>
                    <td className="num">
                      {formatGBP(plan.rows.reduce((s, r) => s + r.dividends, 0), 0)}
                    </td>
                    <td className="num">{formatGBP(plan.totalTax, 0)}</td>
                    <td className="num">{formatGBP(plan.totalTakeHome, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            ) : null}
            <div className="callout">
              All at once: <strong>{formatGBP(plan.extractAllTakeHome, 0)}</strong>{" "}
              in your pocket. Spread over {scenario.horizon} years:{" "}
              <strong>{formatGBP(plan.totalTakeHome, 0)}</strong>. Future years
              reuse {scenario.year} rates.
            </div>
            <div className="actions">
              <button className="btn" type="button" onClick={copyLink}>
                Copy this plan link
              </button>
              <span className="status" role="status">
                {copied ? "Link copied." : ""}
              </span>
            </div>
          </section>
        ) : (
          <div className="actions">
            <button className="btn ghost" type="button" onClick={copyLink}>
              Copy this result link
            </button>
            <span className="status" role="status">
              {copied ? "Link copied." : ""}
            </span>
          </div>
        )}

        <p className="note">
          Estimates only. DrawDesk does not know your other income, benefits,
          student loan, or company losses. Read the{" "}
          <a href={withBase("/methodology/")}>methodology and sources</a>.
        </p>
      </div>
    </div>
  );
}
