import React, { useState, useEffect, memo, useMemo } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, UserCheck } from "lucide-react"
import { supabase } from "../supabase"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useLanguage } from "../context/LanguageContext"

const Header = memo(() => {
  const { t } = useLanguage();
  return (
    <div className="text-center lg:mb-8 mb-2 px-[5%]">
      <div className="inline-block relative group">
        <h2
          className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] to-[#e5e7eb]"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          {t('about.title')}
        </h2>
      </div>
      <p
        className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
        data-aos="zoom-in-up"
        data-aos-duration="800"
      >
        <Sparkles className="w-5 h-5 text-[#ffffff]" />
        {t('about.subtitle')}
        <Sparkles className="w-5 h-5 text-[#ffffff]" />
      </p>
    </div>
  );
});

const PHOTOS = [
  "/Photo.jpeg",  "/Photo2.jpeg",  "/Photo3.jpeg",  "/Photo4.jpeg",
  "/Photo5.jpeg", "/Photo6.jpeg",  "/Photo7.jpeg",  "/Photo8.jpeg",
  "/Photo9.jpeg", "/Photo10.jpeg", "/Photo11.jpeg", "/Photo12.jpeg",
  "/Photo13.jpeg","/Photo14.jpeg", "/Photo15.jpeg", "/Photo16.jpeg",
  "/Photo17.jpeg",
];

const ProfileImage = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % PHOTOS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
      <div className="relative group" data-aos="fade-up" data-aos-duration="1000">
        <div className="absolute -inset-6 opacity-[15%] z-0 hidden sm:block">
          <div className="absolute inset-0 bg-white rounded-full blur-3xl animate-spin-slower" />
        </div>

        <div className="relative">
          <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] transform transition-all duration-700 group-hover:scale-105 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-gray-400/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />

            {PHOTOS.map((photo, index) => (
              <img
                key={photo}
                src={photo}
                alt="Luis Esteban Castillo Pedroza"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  index === currentIndex ? "opacity-100 ease-out" : "opacity-0 ease-in"
                }`}
                loading="eager"
              />
            ))}

            <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000 delay-100" />
              <div className="absolute inset-0 rounded-full border-8 border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const StatCard = memo(({ icon: Icon, color, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
    <div className="relative z-10 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <span
          className="text-4xl font-bold text-white"
          data-aos="fade-up-left"
          data-aos-duration="1500"
          data-aos-anchor-placement="top-bottom"
        >
          {value}
        </span>
      </div>

      <div>
        <p
          className="text-sm uppercase tracking-wider text-gray-300 mb-2"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-anchor-placement="top-bottom"
        >
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p
            className="text-xs text-gray-400"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-anchor-placement="top-bottom"
          >
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

const AboutPage = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const { t } = useLanguage();

  const YearExperience = useMemo(() => {
    const startDate = new Date("2024-01-01");
    const today = new Date();
    return today.getFullYear() - startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const [{ count: projectCount }, { count: certCount }] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
      ]);
      setTotalProjects(projectCount ?? 0);
      setTotalCertificates(certCount ?? 0);
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const initAOS = () => { AOS.init({ once: false }); };
    initAOS();
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAOS, 250);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#ffffff] to-[#e5e7eb]",
      value: totalProjects,
      label: t('about.stat_projects'),
      description: t('about.stat_projects_desc'),
      animation: "fade-right",
    },
    {
      icon: Award,
      color: "from-[#e5e7eb] to-[#ffffff]",
      value: totalCertificates,
      label: t('about.stat_certs'),
      description: t('about.stat_certs_desc'),
      animation: "fade-up",
    },
    {
      icon: Globe,
      color: "from-[#ffffff] to-[#e5e7eb]",
      value: YearExperience,
      label: t('about.stat_exp'),
      description: t('about.stat_exp_desc'),
      animation: "fade-left",
    },
  ], [totalProjects, totalCertificates, YearExperience, t]);

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0"
      id="About"
      itemScope
      itemType="https://schema.org/Person"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] to-[#e5e7eb]">
                {t('about.greeting')}
              </span>
              <span
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
                itemProp="name"
              >
                Luis Castillo
              </span>
            </h2>

            <p
              className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              {t('about.bio_1')}
              <br /><br />
              {t('about.bio_2')}
              <br /><br />
              {t('about.bio_3')}
            </p>

            {/* Quote */}
            <div
              className="relative bg-gradient-to-br from-[#ffffff]/5 via-transparent to-[#e5e7eb]/5 border border-[#ffffff]/30 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
              data-aos="fade-up"
              data-aos-duration="1700"
            >
              <div className="absolute top-2 right-4 w-16 h-16 bg-gradient-to-r from-[#ffffff]/20 to-[#e5e7eb]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-gradient-to-r from-[#e5e7eb]/20 to-[#ffffff]/20 rounded-full blur-lg"></div>
              <div className="absolute top-3 left-4 text-[#ffffff] opacity-30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm relative z-10 pl-6">
                "{t('about.quote')}"
              </blockquote>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 lg:px-0 w-full">
              <a href="/luis_castillo_cv.pdf" target="_blank" rel="noopener noreferrer" className="w-full lg:w-auto">
                <button
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg bg-white text-black font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 shadow-lg"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> {t('about.btn_cv')}
                </button>
              </a>
              <a href="#Portofolio" className="w-full lg:w-auto">
                <button
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border border-[#ffffff]/50 text-[#ffffff] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 hover:bg-[#ffffff]/10"
                >
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" /> {t('about.btn_projects')}
                </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slower {
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        .animate-pulse-slow  { animation: pulse 3s infinite; }
        .animate-spin-slower { animation: spin-slower 8s linear infinite; }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);
