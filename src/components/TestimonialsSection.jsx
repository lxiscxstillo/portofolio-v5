import React, { useEffect, useState, useCallback } from "react";
import { Pin, Quote, Star, Briefcase } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from "../supabase";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

/* ── Single card ─────────────────────────────────── */
const TestimonialCard = ({ comment, isPinned, isLight, index }) => {
  const initials = comment.user_name
    ? comment.user_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const aosAnim =
    index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left";

  return (
    <div
      data-aos={aosAnim}
      data-aos-duration="800"
      data-aos-delay={String((index % 3) * 100)}
      className="relative flex flex-col h-full rounded-2xl p-6 transition-all duration-300 group"
      style={
        isLight
          ? {
              background: isPinned
                ? "rgba(238,242,255,0.95)"
                : "rgba(255,255,255,0.92)",
              border: isPinned
                ? "1px solid rgba(99,102,241,0.30)"
                : "1px solid rgba(99,102,241,0.12)",
              boxShadow: isPinned
                ? "0 8px 32px rgba(99,102,241,0.14)"
                : "0 4px 20px rgba(15,23,42,0.07)",
            }
          : {
              background: isPinned
                ? "rgba(255,255,255,0.10)"
                : "rgba(255,255,255,0.04)",
              border: isPinned
                ? "1px solid rgba(255,255,255,0.25)"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: isPinned ? "0 8px 32px rgba(0,0,0,0.35)" : "none",
            }
      }
    >
      {/* Pinned badge */}
      {isPinned && (
        <div
          className="absolute -top-3 left-5 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={
            isLight
              ? { background: "#4f46e5", color: "#fff" }
              : { background: "rgba(99,102,241,0.85)", color: "#fff" }
          }
        >
          <Pin className="w-3 h-3" />
          <span>Pinned</span>
        </div>
      )}

      {/* Decorative quote */}
      <Quote
        className="absolute top-5 right-5 w-8 h-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{ color: isLight ? "#4f46e5" : "#ffffff" }}
      />

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Quote text */}
      <p
        className="text-sm leading-relaxed italic flex-1 mb-6"
        style={{ color: isLight ? "#475569" : "rgba(209,213,225,0.90)" }}
      >
        &ldquo;{comment.content}&rdquo;
      </p>

      {/* Author */}
      <div
        className="flex items-center gap-3 pt-4 border-t"
        style={{
          borderColor: isLight
            ? "rgba(99,102,241,0.10)"
            : "rgba(255,255,255,0.08)",
        }}
      >
        {comment.profile_image ? (
          <img
            src={comment.profile_image}
            alt={comment.user_name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            style={{
              border: isLight
                ? "2px solid rgba(99,102,241,0.20)"
                : "2px solid rgba(255,255,255,0.15)",
            }}
            loading="lazy"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={
              isLight
                ? {
                    background: "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
                    color: "#4f46e5",
                    border: "2px solid rgba(99,102,241,0.20)",
                  }
                : {
                    background: "linear-gradient(135deg,rgba(99,102,241,0.35),rgba(139,92,246,0.35))",
                    color: "#c4b5fd",
                    border: "2px solid rgba(255,255,255,0.12)",
                  }
            }
          >
            {initials}
          </div>
        )}

        <div className="min-w-0">
          <p
            className="text-sm font-semibold leading-tight truncate"
            style={{ color: isLight ? "#0f172a" : "#f1f5f9" }}
          >
            {comment.user_name}
          </p>
          {(comment.user_role || comment.user_company) && (
            <p
              className="text-xs flex items-center gap-1 mt-0.5 truncate"
              style={{ color: isLight ? "#64748b" : "#94a3b8" }}
            >
              <Briefcase className="w-3 h-3 flex-shrink-0 opacity-60" />
              <span className="truncate">
                {comment.user_role && comment.user_company
                  ? `${comment.user_role} · ${comment.user_company}`
                  : comment.user_role || comment.user_company}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Section ─────────────────────────────────────── */
const TestimonialsSection = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [pinned, setPinned] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = useCallback(async () => {
    try {
      const [pinnedRes, othersRes] = await Promise.all([
        // maybeSingle() returns null instead of 406 when no pinned row exists
        supabase
          .from("portfolio_comments")
          .select("*")
          .eq("is_pinned", true)
          .maybeSingle(),
        supabase
          .from("portfolio_comments")
          .select("*")
          .eq("is_pinned", false)
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      if (pinnedRes.data) setPinned(pinnedRes.data);
      if (othersRes.data) setOthers(othersRes.data);
    } catch (_) {
      /* silent fail — section just won't show */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AOS.init({ once: false, offset: 80 });
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Build ordered list: pinned first, then others
  const all = pinned ? [pinned, ...others] : others;

  // Don't render the section at all if no data yet or nothing to show
  if (loading || all.length === 0) return null;

  return (
    <section
      id="Testimonials"
      className="px-[5%] sm:px-[5%] lg:px-[10%] py-20 md:py-28"
    >
      {/* Header */}
      <div
        className="text-center mb-14"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <h2
          className="inline-block text-3xl md:text-5xl font-bold mb-4"
          style={
            isLight
              ? {
                  backgroundImage: "linear-gradient(45deg, #4f46e5 10%, #7c3aed 93%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
              : {
                  backgroundImage: "linear-gradient(45deg, #ffffff 10%, #e5e7eb 93%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
          }
        >
          {t("testimonials.title")}
        </h2>

        {/* Accent line */}
        <div className="flex justify-center mb-4">
          <div
            className="h-1 w-16 rounded-full"
            style={{
              background: isLight
                ? "linear-gradient(90deg,#4f46e5,#7c3aed)"
                : "linear-gradient(90deg,#6366f1,#a78bfa)",
            }}
          />
        </div>

        <p
          className="text-sm md:text-base max-w-xl mx-auto"
          style={{ color: isLight ? "#64748b" : "#94a3b8" }}
        >
          {t("testimonials.subtitle")}
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {all.map((comment, index) => (
          <TestimonialCard
            key={comment.id}
            comment={comment}
            isPinned={comment.is_pinned}
            isLight={isLight}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
