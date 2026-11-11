import type { Metadata } from "next";
import Planner from "@/components/Planner";
import { siteUrl, withBase } from "@/lib/seo";
import { SOURCES } from "@/lib/tax-config";

export const metadata: Metadata = {
  title: "Director Salary vs Dividend Planner 2026/27 — DrawDesk",
  description:
    "Find the best salary, dividend and pension mix for your limited company. 2025/26 and 2026/27 rates, a one-off extraction plan, and every rate sourced. Free, no signup.",
  alternates: { canonical: `${siteUrl}/` },
};

const faqs = [
  {
    q: "What is the best director salary for 2026/27?",
    a: "For a one-director company with no other income, £12,570 is usually the best salary. It uses the personal allowance, so there is no Income Tax or employee National Insurance on it, and the company deducts the salary and its employer National Insurance from profit before Corporation Tax. The calculator checks every affordable salary for your profit rather than assuming that answer.",
  },
  {
    q: "Is it better to take salary or dividends in 2026/27?",
    a: "It depends on the profit and the Corporation Tax rate. At the small profits rate, dividends usually still win above the personal allowance. At the main 25% rate, salary can beat dividends for higher-rate directors because the dividend rates rose to 10.75% and 35.75% from April 2026. DrawDesk tests both and shows the difference.",
  },
  {
    q: "How much dividend can I take tax-free in 2026/27?",
    a: "The dividend allowance is £500, and dividends within it still count towards your tax bands. If your salary is below the £12,570 personal allowance, unused allowance can shelter more dividend income, but taking no salary can cost you a qualifying year for the State Pension.",
  },
  {
    q: "Should I take a dividend or pay into a pension?",
    a: "For profit you do not need to spend now, an employer pension contribution is usually the most tax-efficient route: it is deductible for Corporation Tax, carries no National Insurance, and no Income Tax is paid until you draw it. The trade-off is that the money is locked until pension age and subject to the annual allowance.",
  },
  {
    q: "Can I spread a large dividend over more than one tax year?",
    a: "Yes, if the company has enough retained profit and the dividends are properly declared. Each tax year brings a fresh personal allowance, dividend allowance and basic-rate band, so spreading a one-off pot can reduce the dividend tax. DrawDesk models a one-off pot over one, three or five years.",
  },
  {
    q: "Does DrawDesk work for Scotland or two directors?",
    a: "Not yet. Version 1 covers one director in England, Wales or Northern Ireland. Scottish income tax bands, the Employment Allowance for two-director companies, student loans and child benefit are on the roadmap and deliberately excluded so the numbers shown are ones we can stand behind.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "DrawDesk",
  url: `${siteUrl}/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  description:
    "A free planner that finds the best salary, dividend and pension mix for a UK limited company director, for 2025/26 and 2026/27, including a one-off extraction plan.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  featureList: [
    "Best salary and dividend split",
    "2025/26 and 2026/27 comparison",
    "Employer pension",
    "One-off dividend spreading",
    "Shareable result links",
  ],
};

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">2026/27 · England, Wales &amp; Northern Ireland</p>
        <h1>What should you draw from your company?</h1>
        <p className="lede">
          Enter your profit. DrawDesk finds the salary, dividend and pension mix
          that leaves you with the most — this year, and if you are spreading a
          one-off pot, the next few.
        </p>
        <p className="meta">
          <span>Free, no signup</span>
          <span>Every rate sourced</span>
          <span>No email, no sales call</span>
        </p>
      </section>

      <Planner />

      <section className="three" aria-labelledby="why-title">
        <h2 id="why-title" className="section-h2" style={{ gridColumn: "1 / -1" }}>
          Not another single-year calculator
        </h2>
        <div className="feature">
          <span className="n">1</span>
          <h3>The best mix, not a guess</h3>
          <p>
            We test every affordable salary against your profit, then pay the
            rest as dividends. No assumed £12,570 if a different salary leaves
            you more.
          </p>
        </div>
        <div className="feature">
          <span className="n">2</span>
          <h3>Pension in the same model</h3>
          <p>
            An employer pension is deductible and NI-free. Add it and see the
            cash you give up next to the pension you gain, in one place.
          </p>
        </div>
        <div className="feature">
          <span className="n">3</span>
          <h3>One pot, several years</h3>
          <p>
            Closing up or taking a large dividend? Spread the same pot across
            tax years and see how much the extra bands and allowances save.
          </p>
        </div>
      </section>

      <section className="example" aria-labelledby="example-title">
        <div>
          <h2 id="example-title">£60,000, worked through</h2>
          <p>
            A one-director company with £60,000 of profit in 2026/27. DrawDesk
            pays a £12,570 salary, which costs the company £1,135.50 in employer
            National Insurance.
          </p>
          <p>
            That leaves £46,294.50 of taxable profit, so Corporation Tax is
            £8,795.96 and £37,498.54 is available as dividends. Dividend tax is
            £3,977.34. The director keeps{" "}
            <strong>£46,091.20</strong> — 76.8% of the profit.
          </p>
          <p>
            The same profit in 2025/26 kept more, because the basic and higher
            dividend rates were two points lower. The year switch shows the
            difference at your own profit level.
          </p>
        </div>
        <div className="card">
          <h3>What the £60,000 becomes</h3>
          <p className="card-sub">2026/27, one director, no pension.</p>
          <table>
            <tbody>
              <tr>
                <td>Salary</td>
                <td className="num">£12,570.00</td>
              </tr>
              <tr>
                <td>Dividends</td>
                <td className="num">£37,498.54</td>
              </tr>
              <tr>
                <td>Corporation Tax</td>
                <td className="num">£8,795.96</td>
              </tr>
              <tr>
                <td>Employer NI</td>
                <td className="num">£1,135.50</td>
              </tr>
              <tr>
                <td>Dividend tax</td>
                <td className="num">£3,977.34</td>
              </tr>
              <tr className="total">
                <td>You keep</td>
                <td className="num">£46,091.20</td>
              </tr>
            </tbody>
          </table>
          <p className="note">
            Matches the worked example published by two independent UK
            calculators, checked 11 November 2026.
          </p>
        </div>
      </section>

      <section className="faq" id="faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Questions directors ask</h2>
        {faqs.map((faq) => (
          <details key={faq.q}>
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </section>

      <section className="sources" aria-label="Sources">
        <p>
          Rates from GOV.UK:{" "}
          {SOURCES.map((source, index) => (
            <span key={source.url}>
              <a href={source.url} rel="noopener noreferrer">
                {source.label}
              </a>
              {index < SOURCES.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
        <p>
          <a href={withBase("/methodology/")}>How the model works →</a>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
    </>
  );
}
