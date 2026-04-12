import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Github, Star, Users, Flame, BookOpen } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const USERNAME = "lxiscxstillo";

const LANG_COLORS = {
  TypeScript:  "#3178c6",
  JavaScript:  "#f1e05a",
  Python:      "#3572a5",
  Java:        "#b07219",
  HTML:        "#e34c26",
  CSS:         "#563d7c",
  Kotlin:      "#a97bff",
  Go:          "#00add8",
  Rust:        "#dea584",
  Shell:       "#89e051",
  Vue:         "#41b883",
  Dart:        "#00b4ab",
};
const DEFAULT_COLOR = "#6366f1";

const MONTH_NAMES = {
  en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  es: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
};

/* ── helpers ────────────────────────────────────────── */
function calcStreak(contribs) {
  let streak = 0;
  for (let i = contribs.length - 1; i >= 0; i--) {
    if (contribs[i].count > 0) streak++;
    else break;
  }
  return streak;
}

function buildWeeks(contribs) {
  const last = contribs.slice(-364);
  const weeks = [];
  for (let w = 0; w < 52; w++) weeks.push(last.slice(w * 7, w * 7 + 7));
  return { weeks, last };
}

function buildMonthLabels(last) {
  const labels = [];
  let prev = -1;
  last.forEach((day, i) => {
    const m = new Date(day.date).getMonth();
    if (m !== prev) { labels.push({ weekIndex: Math.floor(i / 7), month: m }); prev = m; }
  });
  return labels;
}

/* ── cell color ─────────────────────────────────────── */
function cellColor(level, count, isLight) {
  if (count === 0) return isLight ? "rgba(15,23,42,0.07)" : "rgba(255,255,255,0.06)";
  const lvl = Math.min(level || 1, 4);
  const light = ["", "rgba(99,102,241,0.22)", "rgba(99,102,241,0.48)", "rgba(99,102,241,0.74)", "#4f46e5"];
  const dark  = ["", "rgba(99,102,241,0.28)", "rgba(99,102,241,0.52)", "rgba(99,102,241,0.78)", "#6366f1"];
  return isLight ? light[lvl] : dark[lvl];
}

/* ── stat card ──────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, label, isLight, delay }) => (
  <div
    data-aos="fade-up"
    data-aos-duration="700"
    data-aos-delay={String(delay)}
    className="rounded-2xl p-5 flex flex-col items-center gap-2 text-center"
    style={isLight
      ? { background:"rgba(255,255,255,0.92)", border:"1px solid rgba(99,102,241,0.15)", boxShadow:"0 4px 20px rgba(15,23,42,0.07)" }
      : { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
  >
    <Icon className="w-5 h-5" style={{ color: isLight ? "#4f46e5" : "#818cf8" }} />
    <span className="text-2xl font-bold" style={{ color: isLight ? "#0f172a" : "#f1f5f9" }}>{value}</span>
    <span className="text-xs" style={{ color: isLight ? "#64748b" : "#94a3b8" }}>{label}</span>
  </div>
);

/* ── main component ─────────────────────────────────── */
const GitHubActivity = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [profile,      setProfile]      = useState(null);
  const [totalStars,   setTotalStars]   = useState(0);
  const [topLangs,     setTopLangs]     = useState([]);
  const [contributions,setContributions]= useState([]);
  const [streak,       setStreak]       = useState(0);
  const [totalContribs,setTotalContribs]= useState(0);
  const [loading,      setLoading]      = useState(true);
  const [hasContribs,  setHasContribs]  = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [profRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${USERNAME}`),
        fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
      ]);

      if (!profRes.ok) throw new Error("profile");
      const profData  = await profRes.json();
      const reposData = reposRes.ok ? await reposRes.json() : [];

      // stars
      const stars = Array.isArray(reposData)
        ? reposData.reduce((s, r) => s + (r.stargazers_count || 0), 0)
        : 0;

      // top languages (exclude forks)
      const langMap = {};
      if (Array.isArray(reposData)) {
        reposData.filter(r => !r.fork && r.language).forEach(r => {
          langMap[r.language] = (langMap[r.language] || 0) + 1;
        });
      }
      const langEntries = Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
      const langTotal   = langEntries.reduce((s, [, c]) => s + c, 0);
      const langs = langEntries.map(([name, count]) => ({
        name,
        pct: Math.round((count / langTotal) * 100),
        color: LANG_COLORS[name] || DEFAULT_COLOR,
      }));

      setProfile(profData);
      setTotalStars(stars);
      setTopLangs(langs);

      // contributions — separate try so stats still show if this fails
      try {
        const contribRes = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`
        );
        if (contribRes.ok) {
          const contribData = await contribRes.json();
          const contribs    = contribData.contributions || [];
          setContributions(contribs);
          setStreak(calcStreak(contribs));
          setTotalContribs(contribs.reduce((s, c) => s + c.count, 0));
          setHasContribs(contribs.length > 0);
        }
      } catch (_) { /* heatmap just won't render */ }

    } catch (err) {
      console.error("GitHub fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AOS.init({ once: false, offset: 80 });
    fetchData();
  }, [fetchData]);

  const { weeks, last } = useMemo(
    () => contributions.length ? buildWeeks(contributions) : { weeks: [], last: [] },
    [contributions]
  );
  const monthLabels = useMemo(() => buildMonthLabels(last), [last]);

  if (loading || !profile) return null;

  const cardBg = isLight
    ? { background:"rgba(255,255,255,0.92)", border:"1px solid rgba(99,102,241,0.15)", boxShadow:"0 4px 20px rgba(15,23,42,0.07)" }
    : { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" };

  return (
    <section id="GitHub" className="px-[5%] sm:px-[5%] lg:px-[10%] py-20 md:py-28">

      {/* ── Header ──────────────────────────────────── */}
      <div className="text-center mb-14" data-aos="fade-up" data-aos-duration="800">
        <h2
          className="inline-block text-3xl md:text-5xl font-bold mb-4"
          style={isLight
            ? { backgroundImage:"linear-gradient(45deg,#4f46e5 10%,#7c3aed 93%)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent" }
            : { backgroundImage:"linear-gradient(45deg,#ffffff 10%,#e5e7eb 93%)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent" }}
        >
          {t("github.title")}
        </h2>

        <div className="flex justify-center mb-4">
          <div className="h-1 w-16 rounded-full" style={{ background: isLight ? "linear-gradient(90deg,#4f46e5,#7c3aed)" : "linear-gradient(90deg,#6366f1,#a78bfa)" }} />
        </div>

        <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: isLight ? "#64748b" : "#94a3b8" }}>
          {t("github.subtitle")}
        </p>
      </div>

      {/* ── Stat cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen} value={profile.public_repos}  label={t("github.repos")}     isLight={isLight} delay={0}   />
        <StatCard icon={Star}     value={totalStars}             label={t("github.stars")}     isLight={isLight} delay={80}  />
        <StatCard icon={Users}    value={profile.followers}      label={t("github.followers")} isLight={isLight} delay={160} />
        <StatCard icon={Flame}    value={`${streak}d`}           label={t("github.streak")}    isLight={isLight} delay={240} />
      </div>

      {/* ── Heatmap ─────────────────────────────────── */}
      {hasContribs && (
        <div
          className="rounded-2xl p-6 mb-6"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200"
          style={cardBg}
        >
          {/* top bar */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4" style={{ color: isLight ? "#4f46e5" : "#818cf8" }} />
              <span className="text-sm font-semibold" style={{ color: isLight ? "#0f172a" : "#f1f5f9" }}>
                {totalContribs.toLocaleString()} {t("github.contributions_label")}
              </span>
            </div>
            <a
              href={`https://github.com/${USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: isLight ? "#4f46e5" : "#818cf8" }}
            >
              @{USERNAME} ↗
            </a>
          </div>

          {/* grid — scrollable on mobile */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: "580px" }}>

              {/* month labels */}
              <div className="flex mb-1.5" style={{ paddingLeft: "2px" }}>
                {weeks.map((_, wi) => {
                  const lbl = monthLabels.find(m => m.weekIndex === wi);
                  return (
                    <div key={wi} style={{ width: "12px", marginRight: "2px", flexShrink: 0, height: "12px" }}>
                      {lbl && (
                        <span className="text-[9px] leading-none" style={{ color: isLight ? "#94a3b8" : "#4b5563" }}>
                          {(MONTH_NAMES[lang] || MONTH_NAMES.en)[lbl.month]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* cells */}
              <div className="flex" style={{ gap: "2px" }}>
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col" style={{ gap: "2px" }}>
                    {(week.length ? week : Array(7).fill({ date: "", count: 0, level: 0 })).map((day, di) => (
                      <div
                        key={di}
                        title={day.date ? `${day.date}: ${day.count} contributions` : ""}
                        style={{
                          width: "10px", height: "10px",
                          borderRadius: "2px",
                          backgroundColor: cellColor(day.level, day.count, isLight),
                          transition: "background-color 0.15s",
                          cursor: day.count > 0 ? "default" : undefined,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* legend */}
              <div className="flex items-center gap-1.5 mt-3 justify-end">
                <span className="text-[10px]" style={{ color: isLight ? "#94a3b8" : "#4b5563" }}>{t("github.less")}</span>
                {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: cellColor(l, l, isLight) }} />
                ))}
                <span className="text-[10px]" style={{ color: isLight ? "#94a3b8" : "#4b5563" }}>{t("github.more")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Top languages ───────────────────────────── */}
      {topLangs.length > 0 && (
        <div
          className="rounded-2xl p-6"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="300"
          style={cardBg}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: isLight ? "#0f172a" : "#f1f5f9" }}>
            {t("github.top_languages")}
          </h3>

          {/* segmented bar */}
          <div className="flex rounded-full overflow-hidden mb-4" style={{ height: "10px" }}>
            {topLangs.map(({ name, pct, color }) => (
              <div key={name} style={{ width: `${pct}%`, backgroundColor: color }} title={`${name} ${pct}%`} />
            ))}
          </div>

          {/* legend dots */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {topLangs.map(({ name, pct, color }) => (
              <div key={name} className="flex items-center gap-1.5">
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: color, display: "inline-block", flexShrink: 0 }} />
                <span className="text-xs" style={{ color: isLight ? "#475569" : "#94a3b8" }}>{name}</span>
                <span className="text-xs font-semibold" style={{ color: isLight ? "#0f172a" : "#f1f5f9" }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default GitHubActivity;
