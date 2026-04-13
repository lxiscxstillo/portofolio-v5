import React, { useEffect, useState, useCallback } from "react";

import { supabase } from "../supabase";

import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext";
import { useTheme as useAppTheme } from "../context/ThemeContext";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";


const ToggleButton = ({ onClick, isShowingMore }) => {
  const { t } = useLanguage();
  const { theme: appTheme } = useAppTheme();
  const isLight = appTheme === 'light';

  return (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-sm
      font-medium
      transition-all
      duration-300
      ease-in-out
      flex
      items-center
      gap-2
      rounded-md
      border
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
    style={isLight ? {
      color: '#475569',
      background: 'rgba(99,102,241,0.06)',
      borderColor: 'rgba(99,102,241,0.16)',
    } : {
      color: '#cbd5e1',
      background: 'rgba(255,255,255,0.05)',
      borderColor: 'rgba(255,255,255,0.10)',
    }}
    onMouseEnter={e => {
      if (isLight) {
        e.currentTarget.style.color = '#0f172a';
        e.currentTarget.style.background = 'rgba(99,102,241,0.10)';
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.22)';
      } else {
        e.currentTarget.style.color = '#ffffff';
        e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
      }
    }}
    onMouseLeave={e => {
      if (isLight) {
        e.currentTarget.style.color = '#475569';
        e.currentTarget.style.background = 'rgba(99,102,241,0.06)';
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.16)';
      } else {
        e.currentTarget.style.color = '#cbd5e1';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
      }
    }}
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? t('portfolio.see_less') : t('portfolio.see_more')}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform
          duration-300
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span
      className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
      style={{ background: isLight ? 'rgba(99,102,241,0.40)' : 'rgba(203,213,225,0.50)' }}
    />
  </button>
  );
};


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";
const techStacks = [
  { icon: `${CDN}/typescript/typescript-original.svg`, language: "TypeScript", descKey: "techstack.typescript" },
  { icon: `${CDN}/python/python-original.svg`, language: "Python", descKey: "techstack.python" },
  { icon: `${CDN}/java/java-original.svg`, language: "Java", descKey: "techstack.java" },
  { icon: `${CDN}/javascript/javascript-original.svg`, language: "JavaScript", descKey: "techstack.javascript" },
  { icon: `${CDN}/html5/html5-original.svg`, language: "HTML", descKey: "techstack.html" },
  { icon: `${CDN}/css3/css3-original.svg`, language: "CSS", descKey: "techstack.css" },
  { icon: `${CDN}/react/react-original.svg`, language: "React", descKey: "techstack.react" },
  { icon: `${CDN}/nextjs/nextjs-original.svg`, language: "Next.js", descKey: "techstack.nextjs" },
  { icon: `${CDN}/angular/angular-original.svg`, language: "Angular", descKey: "techstack.angular" },
  { icon: `${CDN}/nodejs/nodejs-original.svg`, language: "Node.js", descKey: "techstack.nodejs" },
  { icon: `${CDN}/fastapi/fastapi-original.svg`, language: "FastAPI", descKey: "techstack.fastapi" },
  { icon: `${CDN}/django/django-plain.svg`, language: "Django", descKey: "techstack.django" },
  { icon: `${CDN}/spring/spring-original.svg`, language: "Spring Boot", descKey: "techstack.spring" },
  { icon: `${CDN}/postgresql/postgresql-original.svg`, language: "PostgreSQL", descKey: "techstack.postgresql" },
  { icon: `${CDN}/firebase/firebase-original.svg`, language: "Firebase", descKey: "techstack.firebase" },
  { icon: `${CDN}/supabase/supabase-original.svg`, language: "Supabase", descKey: "techstack.supabase" },
  { icon: `${CDN}/docker/docker-original.svg`, language: "Docker", descKey: "techstack.docker" },
  { icon: `${CDN}/tailwindcss/tailwindcss-original.svg`, language: "Tailwind CSS", descKey: "techstack.tailwind" },
  { icon: "vercel.svg", language: "Vercel", descKey: "techstack.vercel" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const { theme: appTheme } = useAppTheme();
  const isLight = appTheme === 'light';
  const { t } = useLanguage();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);


  const fetchData = useCallback(async () => {
    try {
      // Mengambil data dari Supabase secara paralel
      const [projectsResponse, certificatesResponse] = await Promise.all([
        supabase.from("projects").select("*").order('id', { ascending: false }),
        supabase.from("certificates").select("*").order('id', { ascending: false }), 
      ]);

      // Error handling untuk setiap request
      if (projectsResponse.error) throw projectsResponse.error;
      if (certificatesResponse.error) throw certificatesResponse.error;

      // Supabase mengembalikan data dalam properti 'data'
      const projectData = projectsResponse.data || [];
      const certificateData = certificatesResponse.data || [];

      setProjects(projectData);
      setCertificates(certificateData);

      // Store in localStorage (fungsionalitas ini tetap dipertahankan)
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);



  useEffect(() => {
    // Coba ambil dari localStorage dulu untuk laod lebih cepat
    const cachedProjects = localStorage.getItem('projects');
    const cachedCertificates = localStorage.getItem('certificates');

    if (cachedProjects && cachedCertificates) {
        setProjects(JSON.parse(cachedProjects));
        setCertificates(JSON.parse(cachedCertificates));
    }
    
    fetchData(); // Tetap panggil fetchData untuk sinkronisasi data terbaru
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  // Sisa dari komponen (return statement) tidak ada perubahan
  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#0A0A0A] overflow-hidden" id="Portofolio">
      {/* Header section - unchanged */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] to-[#e5e7eb]">
          <span style={isLight ? {
            color: '#1e293b',
            backgroundImage: 'linear-gradient(45deg, #4f46e5 10%, #7c3aed 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          } : {
            color: '#ffffff',
            backgroundImage: 'linear-gradient(45deg, #ffffff 10%, #e5e7eb 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {t('portfolio.title')}
          </span>
        </h2>
        <p
          className="max-w-2xl mx-auto text-sm md:text-base mt-2"
          style={{ color: isLight ? '#64748b' : '#94a3b8' }}
        >
          {t('portfolio.subtitle')}
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: isLight ? "rgba(255,255,255,0.70)" : "transparent",
            border: isLight ? "1px solid rgba(99,102,241,0.15)" : "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            backdropFilter: isLight ? "blur(16px)" : undefined,
            boxShadow: isLight ? "0 4px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(15,23,42,0.05)" : undefined,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isLight
                ? "linear-gradient(180deg, rgba(99,102,241,0.03) 0%, rgba(139,92,246,0.03) 100%)"
                : "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: isLight ? "#64748b" : "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: isLight ? "#1e293b" : "#ffffff",
                  backgroundColor: isLight ? "rgba(99,102,241,0.08)" : "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                },
                "&.Mui-selected": {
                  color: isLight ? "#4f46e5" : "#fff",
                  background: isLight
                    ? "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))"
                    : "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: isLight
                    ? "0 4px 15px -3px rgba(99,102,241,0.20)"
                    : "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t('portfolio.tab_projects')}
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t('portfolio.tab_certificates')}
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t('portfolio.tab_techstack')}
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={project.img}
                      Title={project.title}
                      Description={project.description}
                      Link={project.link}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <Certificate ImgSertif={certificate.img} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="w-full pb-[5%]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} description={t(stack.descKey)} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}