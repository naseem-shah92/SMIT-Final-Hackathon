"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  Fingerprint,
  Menu,
  Minus,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react";
import "./landing.css";
function Mark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M5 6v20M27 6v20M5 16h22M12 6v7M20 19v7"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
const modules = ["People", "Time & leave", "Payroll", "Talent"];
const faqs = [
  [
    "What can I manage with HCM Master Suite?",
    "Your employee directory, attendance, leave, payroll, recruitment, performance, expenses, documents and HR service desk live in one connected workspace. Start with the workflows you need and bring the rest together as you grow.",
  ],
  [
    "Can employees see everyone’s salary through AI?",
    "No. The copilot uses your signed-in permissions for every data request. Employees can access their own published payslips; authorized payroll and company roles can access the records their role permits. A conversation never grants additional access.",
  ],
  [
    "Is the platform built for teams in Pakistan?",
    "Yes. The existing payroll workflows support PKR, income tax slabs, EOBI, provident fund, loans and final settlements. Configure the policies and settings that apply to your company.",
  ],
  [
    "What happens if the primary AI provider is unavailable?",
    "The copilot tries Groq first and automatically falls back to a configured free OpenRouter model on a timeout, provider error or rate limit. Both providers use the same permission-controlled tools and conversation context.",
  ],
  [
    "Can I keep a conversation and come back later?",
    "Yes. Signed-in users get their own conversation history, with follow-up questions, copy, regenerate and feedback. History is separated by company and access scope.",
  ],
];
function Workspace({ active }: { active: number }) {
  const rows = active === 0
    ? [["SA", "Sara Ahmed", "People Operations", "Active"], [
      "AK",
      "Ali Khan",
      "Engineering",
      "Active",
    ], ["FM", "Fatima Malik", "Finance", "On leave"]]
    : active === 1
    ? [["SA", "Sara Ahmed", "09:02 → 17:34", "Present"], [
      "AK",
      "Ali Khan",
      "08:56 → 17:12",
      "Present",
    ], ["FM", "Fatima Malik", "Annual leave", "Approved"]]
    : active === 2
    ? [["SA", "Sara Ahmed", "PKR 120,000", "Published"], [
      "AK",
      "Ali Khan",
      "PKR 185,000",
      "Published",
    ], ["FM", "Fatima Malik", "PKR 145,000", "Published"]]
    : [["SA", "Product designer", "Design · Full time", "Interview"], [
      "AK",
      "Frontend engineer",
      "Engineering · Full time",
      "Review",
    ], ["FM", "HR executive", "People · Full time", "Offer"]];
  return (
    <div className="lp-workspace">
      <aside>
        <div className="lp-mini-brand">
          <Mark /> HCM
        </div>
        <small>WORKSPACE</small>
        {["Overview", "People", "Attendance", "Payroll", "Recruitment"].map((
          n,
          i,
        ) => (
          <div key={n} className={i === active + 1 ? "selected" : ""}>
            {[
              <BarChart3 key="a" />,
              <Users key="b" />,
              <Clock3 key="c" />,
              <Wallet key="d" />,
              <BriefcaseBusiness key="e" />,
            ][i]}
            <span>{n}</span>
          </div>
        ))}
        <div className="lp-sidebar-bottom">
          <Sparkles /> Ask AI <span>↗</span>
        </div>
      </aside>
      <div className="lp-work-main">
        <div className="lp-work-top">
          <span>
            Workspace / <b>{modules[active]}</b>
          </span>
          <span className="lp-avatar">SA</span>
        </div>
        <div className="lp-work-heading">
          <div>
            <small>YOUR TEAM, CONNECTED</small>
            <h3>
              {[
                "Good morning, Sara",
                "Every hour, accounted for.",
                "Payday. Without the chaos.",
                "Your next great hire.",
              ][active]}
              <span className="lp-greeting">✳</span>
            </h3>
            <p>
              {[
                "A little clarity for a big day ahead.",
                "A clearer view of your team’s working day.",
                "From attendance to a published payslip.",
                "Move the right people to the next step.",
              ][active]}
            </p>
          </div>
          <span className="lp-work-date">
            October 2026 <ChevronDown size={12} />
          </span>
        </div>
        <div className="lp-metrics">
          <div>
            <small>
              {[
                "Total people",
                "Present today",
                "Illustrative net payroll",
                "Open positions",
              ][active]}
            </small>
            <strong>{["128", "116", "PKR 4.8m", "08"][active]}</strong>
            <span>
              <i />{" "}
              {active === 2 ? "Sample payroll run" : "Across your workspace"}
            </span>
          </div>
          <div className="lp-chart">
            <div>
              <small>
                {active === 3 ? "Hiring pipeline" : "Team activity"}
              </small>
              <span>THIS WEEK</span>
            </div>
            <div className="lp-bars" key={active}>
              {[46, 68, 54, 85, 70, 93, 78, 100, 88, 114, 98, 126].map((
                h,
                i,
              ) => (
                <i
                  key={i}
                  style={{ height: h, animationDelay: `${i * .09}s` }}
                />
              ))}
            </div>
            <div className="lp-chart-days">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>
          </div>
        </div>
        <div className="lp-table-heading">
          <b>
            {[
              "People at a glance",
              "Today’s attendance",
              "Published payslips",
              "Hiring pipeline",
            ][active]}
          </b>
          <span>Illustrative workspace</span>
        </div>
        <div className="lp-table">
          {rows.map(([initial, name, title, status], i) => (
            <div key={name}>
              <span className={`lp-avatar tone-${i}`}>{initial}</span>
              <div>
                <b>{name}</b>
                <small>{title}</small>
              </div>
              <span className="lp-status">
                <i />
                {status}
              </span>
              <span>↗</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function LandingPage() {
  const root = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false),
    [active, setActive] = useState(0),
    [role, setRole] = useState(0),
    [faq, setFaq] = useState<number | null>(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".lp-hero [data-intro]", {
          y: 35,
          opacity: 0,
          duration: 1,
          stagger: .12,
          ease: "power3.out",
        });
        gsap.from(".lp-orbit-scene", {
          opacity: 0,
          scale: .85,
          duration: 1.5,
          ease: "power3.out",
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 45,
            opacity: 0,
            duration: .9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          })
        );
        gsap.to(".lp-float", {
          y: -13,
          rotation: 2,
          duration: 3,
          repeat: -1,
          yoyo: true,
          stagger: .5,
          ease: "sine.inOut",
        });
      });
    }, root);
    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);
  return (
    <div ref={root} className="lp">
      <a href="#main" className="lp-skip">Skip to content</a>
      <header className="lp-header">
        <Link href="/" className="lp-logo" aria-label="HCM Master Suite home">
          <span>
            <Mark />
          </span>
          <b>
            HCM<span>Master Suite</span>
          </b>
        </Link>
        <nav
          className={mobile ? "lp-nav is-open" : "lp-nav"}
          aria-label="Main navigation"
        >
          <a href="#platform" onClick={() => setMobile(false)}>
            The platform <ChevronDown size={13} />
          </a>
          <a href="#copilot" onClick={() => setMobile(false)}>
            AI copilot <span className="lp-new">NEW</span>
          </a>
          <a href="#security" onClick={() => setMobile(false)}>
            Built for your team
          </a>
        </nav>
        <div className="lp-header-actions">
          <Link href="/login" className="lp-login">
            Log in <ArrowUpRight size={15} />
          </Link>
          <Link href="/signup" className="lp-button lp-button-small">
            Get started <ArrowRight size={15} />
          </Link>
          <button
            className="lp-mobile-toggle"
            onClick={() => setMobile(!mobile)}
            aria-label="Toggle navigation"
            aria-expanded={mobile}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="lp-hero">
          <div className="lp-hero-copy">
            <a href="#copilot" className="lp-eyebrow" data-intro>
              <span className="lp-live-dot" /> Meet your new HR copilot{" "}
              <ArrowUpRight size={14} />
            </a>
            <h1 data-intro>
              Great people.<br />Less paperwork.<br />
              <em>More possibility.</em>
            </h1>
            <p data-intro>
              The people platform that brings your
              whole<br className="lp-desktop-break" />{" "}
              team together. HR, payroll and an AI
              copilot—<br className="lp-desktop-break" />{" "}
              all working beautifully, as one.
            </p>
            <div className="lp-hero-actions" data-intro>
              <Link href="/signup" className="lp-button">
                Bring your team together <ArrowUpRight size={18} />
              </Link>
              <a href="#platform" className="lp-text-link">
                <span className="lp-play">
                  <Play size={12} fill="currentColor" />
                </span>{" "}
                Explore the platform
              </a>
            </div>
            <div className="lp-hero-note" data-intro>
              <Check size={14} /> One connected workspace <span>·</span>
              <Check size={14} /> Built around your roles
            </div>
          </div>
          <div
            className="lp-orbit-scene"
            aria-label="People, payroll, time and AI connected in one workspace"
          >
            <div className="lp-scene-grid" />
            <div className="lp-orbit orbit-one" />
            <div className="lp-orbit orbit-two" />
            <div className="lp-orbit orbit-three" />
            <div className="lp-axis axis-one" />
            <div className="lp-axis axis-two" />
            <div className="lp-hero-orb">
              <div className="lp-orb-shine" />
              <Mark />
              <span>People at the centre.</span>
            </div>
            <div className="lp-orbit-label label-people lp-float">
              <span>
                <Users size={18} />
              </span>
              <div>
                <small>PEOPLE</small>
                <b>A team. Not a spreadsheet.</b>
              </div>
              <div className="lp-avatar-stack">
                {["SA", "AK", "FM"].map((p, i) => (
                  <i key={p} className={`tone-${i}`}>{p}</i>
                ))}
              </div>
            </div>
            <div className="lp-orbit-label label-pay lp-float">
              <span>
                <CheckCheck size={19} />
              </span>
              <div>
                <small>PAYROLL</small>
                <b>Payday, perfectly in sync.</b>
              </div>
            </div>
            <div className="lp-orbit-label label-ai lp-float">
              <Sparkles size={21} />
              <div>
                <small>YOUR AI COPILOT</small>
                <b>Less searching. More knowing.</b>
              </div>
              <span>↗</span>
            </div>
            <div className="lp-orbit-person person-one">
              SA<span />
            </div>
            <div className="lp-orbit-person person-two">
              AK<span />
            </div>
            <div className="lp-orbit-person person-three">
              FM<span />
            </div>
            <div className="lp-small-spark">✳</div>
            <div className="lp-scene-caption">
              <span className="lp-live-dot" />{" "}
              EVERYTHING CONNECTED. EVERYONE INCLUDED.
            </div>
          </div>
        </section>
        <div className="lp-capability-strip">
          <span>
            One home for<br />
            <b>your entire people journey.</b>
          </span>
          <div>
            <Users size={19} />People & culture
          </div>
          <div>
            <Clock3 size={19} />Time & attendance
          </div>
          <div>
            <Wallet size={19} />Payroll & expenses
          </div>
          <div>
            <BriefcaseBusiness size={19} />Hiring & growth
          </div>
          <span className="lp-strip-star">✳</span>
        </div>
        <section id="platform" className="lp-platform lp-section">
          <div className="lp-section-heading" data-reveal>
            <div>
              <span className="lp-kicker">
                01 / YOUR PEOPLE OPERATING SYSTEM
              </span>
              <h2>
                Everything your team needs.<br />
                <em>Finally, in the same place.</em>
              </h2>
            </div>
            <p>
              From the first offer to the next big milestone.<br />Replace the
              scattered tools with a workspace<br />that sees the whole picture.
            </p>
          </div>
          <div className="lp-product" data-reveal>
            <div
              className="lp-product-tabs"
              role="tablist"
              aria-label="Explore platform modules"
            >
              {modules.map((name, i) => (
                <button
                  key={name}
                  id={`module-tab-${i}`}
                  role="tab"
                  aria-controls="module-panel"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                >
                  <span>0{i + 1}</span>
                  {name}
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </div>
            <div
              id="module-panel"
              role="tabpanel"
              aria-labelledby={`module-tab-${active}`}
            >
              <Workspace active={active} />
            </div>
            <div className="lp-product-bottom">
              <span>
                <span className="lp-live-dot" />{" "}
                A connected view of your working world.
              </span>
              <Link href="/signup">
                Make it your workspace <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <section className="lp-flow lp-section">
          <div className="lp-flow-copy" data-reveal>
            <span className="lp-kicker">LESS ADMIN. MORE MOMENTUM.</span>
            <h2>
              Good work<br />has a <em>flow to it.</em>
            </h2>
            <p>
              A clock-in becomes attendance. Approved leave reaches payroll. A
              new hire becomes part of the team. Your everyday workflows finally
              speak the same language.
            </p>
            <Link href="/signup" className="lp-text-link">
              Connect the dots <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="lp-flow-visual" data-reveal>
            <div className="lp-flow-path" />
            {[[
              Fingerprint,
              "09:00 AM · ATTENDANCE",
              "A good day starts here.",
              "Clock in. Your time is accounted for.",
            ], [
              Clock3,
              "LEAVE · APPROVALS",
              "Time off, without the back-and-forth.",
              "One request. The right approver.",
            ], [
              Wallet,
              "PAYROLL · PAYSLIPS",
              "Every detail makes it to payday.",
              "Attendance, deductions and published payslips.",
            ]].map(([Icon, label, title, desc]) => {
              const I = Icon as typeof Users;
              return (
                <div className="lp-flow-step" key={String(label)}>
                  <span className="lp-step-icon">
                    <I />
                  </span>
                  <div>
                    <small>{String(label)}</small>
                    <h4>{String(title)}</h4>
                    <p>{String(desc)}</p>
                  </div>
                  <Check size={18} />
                </div>
              );
            })}
            <div className="lp-flow-end">
              <span>✳</span> Less chasing. More living.
            </div>
          </div>
        </section>
        <section id="copilot" className="lp-ai-section">
          <div className="lp-ai-inner">
            <div className="lp-ai-copy" data-reveal>
              <span className="lp-kicker">
                <Sparkles size={14} /> INTELLIGENCE, WITH CONTEXT
              </span>
              <h2>
                Your people data.<br />Just a<br />
                <em>conversation away.</em>
              </h2>
              <p>
                Ask a question. Follow a thought. Get an answer from your
                company’s data—with the access that belongs to your role.
              </p>
              <div className="lp-ai-features">
                <span>
                  <Check size={15} /> Remembers the conversation
                </span>
                <span>
                  <Check size={15} /> Respects every role
                </span>
                <span>
                  <Check size={15} /> Grounded in your workspace
                </span>
              </div>
              <Link href="/signup" className="lp-button lp-button-lime">
                Meet your AI copilot <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="lp-ai-demo" data-reveal>
              <div className="lp-ai-demo-top">
                <span>
                  <Sparkles size={18} /> Ask HCM
                </span>
                <small>INTERACTIVE EXAMPLE</small>
              </div>
              <div
                className="lp-role-switch"
                aria-label="Preview AI access by role"
              >
                {["Company owner", "Manager", "Employee"].map((r, i) => (
                  <button
                    key={r}
                    aria-pressed={role === i}
                    onClick={() => setRole(i)}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="lp-demo-question">
                {[
                  "Give me a quick picture of our team.",
                  "Who in my team is on leave today?",
                  "How much annual leave do I have left?",
                ][role]}
              </div>
              <div className="lp-demo-answer" key={role}>
                <span className="lp-ai-symbol">✳</span>
                <div>
                  <p>
                    {[
                      "Here’s a snapshot of your company workspace:",
                      "Here’s the leave picture for your reporting team:",
                      "Here’s your personal annual leave balance:",
                    ][role]}
                  </p>
                  <div className="lp-answer-data">
                    {(role === 0
                      ? [["128", "people"], ["8", "open roles"], [
                        "6",
                        "on leave",
                      ]]
                      : role === 1
                      ? [["12", "in your team"], ["2", "on leave"], [
                        "1",
                        "pending request",
                      ]]
                      : [["20", "allocated"], ["6", "used"], [
                        "14",
                        "available",
                      ]]).map(([n, label]) => (
                        <div key={label}>
                          <strong>{n}</strong>
                          <small>{label}</small>
                        </div>
                      ))}
                  </div>
                  <p>
                    {[
                      "Would you like to explore a department or review this month’s payroll?",
                      "Would you like to check the upcoming week or review the pending request?",
                      "Would you like to see your requests or check the annual leave policy?",
                    ][role]}
                  </p>
                  <span className="lp-answer-source">
                    <ShieldCheck size={12} /> {role === 0
                      ? "Company scope"
                      : role === 1
                      ? "Reporting team scope"
                      : "Your records only"} · Sample data
                  </span>
                </div>
              </div>
              <div className="lp-demo-followup">
                <span>And what about next month?</span>
                <ArrowUpRight size={16} />
              </div>
              <div className="lp-demo-caption">
                <span className="lp-live-dot" />{" "}
                One conversation. The right context.
              </div>
            </div>
          </div>
        </section>
        <section id="security" className="lp-security lp-section">
          <div className="lp-security-visual" data-reveal>
            <div className="lp-security-ring ring-outer" />
            <div className="lp-security-ring ring-inner" />
            <div className="lp-shield">
              <ShieldCheck size={55} strokeWidth={1.2} />
            </div>
            <span className="lp-security-tag tag-owner">
              Company owner <Check size={12} />
            </span>
            <span className="lp-security-tag tag-manager">
              Team manager <Check size={12} />
            </span>
            <span className="lp-security-tag tag-employee">
              Employee <Check size={12} />
            </span>
            <span className="lp-security-caption">
              THE RIGHT ACCESS. AT EVERY LEVEL.
            </span>
          </div>
          <div data-reveal>
            <span className="lp-kicker">02 / TRUST IS PART OF THE PRODUCT</span>
            <h2>
              Open for teamwork.<br />
              <em>Thoughtful about access.</em>
            </h2>
            <p>
              Your owner needs the bigger picture. Your manager needs their
              team. Your employees need their own information. HCM makes room
              for each—with company isolation and permissions enforced at the
              database.
            </p>
            <div className="lp-security-points">
              <span>
                <ShieldCheck size={18} /> Company data stays in its company
              </span>
              <span>
                <Users size={18} /> 14 built-in roles, with scoped access
              </span>
              <span>
                <Fingerprint size={18} />{" "}
                AI uses the same permissions as your workspace
              </span>
            </div>
          </div>
        </section>
        <section className="lp-faq lp-section">
          <div data-reveal>
            <span className="lp-kicker">A LITTLE MORE CLARITY</span>
            <h2>
              Good questions.<br />
              <em>Straight answers.</em>
            </h2>
            <p>Getting to know your next people platform.</p>
            <span className="lp-faq-flower">✳</span>
          </div>
          <div className="lp-faq-list" data-reveal>
            {faqs.map(([q, a], i) => (
              <div className="lp-faq-item" key={q}>
                <button
                  aria-expanded={faq === i}
                  aria-controls={`faq-${i}`}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  {q}
                  {faq === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                <div id={`faq-${i}`} hidden={faq !== i}>
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="lp-final" data-reveal>
          <div className="lp-final-lines" />
          <span className="lp-kicker">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>
            Make room for<br />
            <em>your people.</em>
          </h2>
          <p>Less busywork. More of what you built your team for.</p>
          <Link href="/signup" className="lp-button lp-button-lime">
            Let’s bring it all together <ArrowUpRight size={19} />
          </Link>
          <div className="lp-final-star">✳</div>
        </section>
      </main>
      <footer className="lp-footer">
        <div className="lp-footer-main">
          <div>
            <Link href="/" className="lp-logo">
              <span>
                <Mark />
              </span>
              <b>
                HCM<span>Master Suite</span>
              </b>
            </Link>
            <p>
              A little less admin.<br />A lot more human.
            </p>
          </div>
          <div>
            <small>EXPLORE</small>
            <a href="#platform">The platform</a>
            <a href="#copilot">AI copilot</a>
            <a href="#security">Security & access</a>
          </div>
          <div>
            <small>YOUR WORKSPACE</small>
            <Link href="/signup">
              Create an account <ArrowUpRight size={13} />
            </Link>
            <Link href="/login">
              Sign in <ArrowUpRight size={13} />
            </Link>
            <Link href="/careers">
              Careers portal <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="lp-footer-message">
            Built for the people<br />
            <em>behind the progress.</em>
            <span>PKR ready. People first.</span>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>© {new Date().getFullYear()} HCM Master Suite</span>
          <span>
            <i /> All your people. One connected place.
          </span>
          <a href="#main">Back to the top ↑</a>
        </div>
      </footer>
    </div>
  );
}
