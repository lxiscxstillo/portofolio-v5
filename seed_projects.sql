-- Seed: Luis Castillo Portfolio Projects
-- Run this in Supabase Dashboard → SQL Editor → New Query

INSERT INTO projects (title, description, img, link, github, tech_stack, features, is_published)
VALUES

(
  'WhatsApp Sales Agent',
  'Autonomous AI sales agent connected to WhatsApp. Qualifies real estate prospects, extracts key data, detects purchase intent and escalates to human agents when the lead is ready. Built with a multi-service architecture deployed on Railway and Fly.io.',
  'https://opengraph.githubassets.com/1/lxiscxstillo/whatsapp-sales-agent',
  'https://frontend-rho-one-21.vercel.app/dashboard',
  'https://github.com/lxiscxstillo/whatsapp-sales-agent',
  '["Python", "LangGraph", "FastAPI", "Node.js", "Next.js", "PostgreSQL", "Docker", "Groq LLM", "WPPConnect", "LangSmith"]',
  '["LangGraph StateGraph with 7 autonomous nodes", "Groq llama-3.3-70b LLM for lead classification", "WhatsApp integration via WPPConnect Server", "Lead dashboard with conversation history", "Automatic human handoff when lead qualifies", "Multi-service Docker deployment on Railway"]',
  true
),

(
  'Cobamovil',
  'Full-stack mobile application with an Angular 20 frontend and a Spring Boot 3.5 backend. Features complete JWT authentication, role-based access control, user management with pagination, and OpenAPI documentation.',
  'https://opengraph.githubassets.com/1/lxiscxstillo/cobamovil-backend',
  'https://cobamovil-frontend.vercel.app/',
  'https://github.com/lxiscxstillo/cobamovil-backend',
  '["Angular", "TypeScript", "Spring Boot", "Java", "JWT", "Spring Security", "PostgreSQL", "JPA/Hibernate", "Flyway", "Docker", "OpenAPI/Swagger"]',
  '["JWT authentication with BCrypt password encryption", "Role-based access control (USER / ADMIN)", "CRUD user management with pagination and search", "Flyway versioned database migrations", "OpenAPI / Swagger API documentation", "Angular SPA with reactive forms and services"]',
  true
),

(
  'Defect Insights',
  'AI-powered manufacturing defect analysis dashboard. Import CSV data, run descriptive statistics and Monte Carlo simulations, and get actionable AI insights powered by Google Gemini via Firebase Genkit.',
  'https://opengraph.githubassets.com/1/lxiscxstillo/Defect-Insights',
  'https://defect-insights.vercel.app',
  'https://github.com/lxiscxstillo/Defect-Insights',
  '["Next.js", "TypeScript", "Firebase", "Google Genkit AI", "Gemini", "Recharts", "Tailwind CSS", "shadcn/ui", "Zod"]',
  '["CSV manufacturing defect data import", "Descriptive statistics (mean, median, std dev, range)", "Monte Carlo simulation engine", "AI insights powered by Google Gemini via Genkit", "Interactive Recharts data visualizations", "Dark-themed dashboard UI with shadcn/ui"]',
  true
),

(
  'MathScope',
  'Interactive mathematical function visualization tool. Plot 2D and 3D functions in real time, analyze gradients, and explore mathematical surfaces with an intuitive control panel powered by math.js and Genkit AI.',
  'https://opengraph.githubassets.com/1/lxiscxstillo/MathScope',
  'https://math-scope.vercel.app',
  'https://github.com/lxiscxstillo/MathScope',
  '["Next.js", "TypeScript", "Firebase", "Google Genkit AI", "math.js", "Tailwind CSS", "shadcn/ui"]',
  '["2D mathematical function plotting", "3D surface rendering with gradient analysis", "Real-time function evaluation via math.js", "AI-assisted function suggestions via Genkit", "Interactive control panel with tabbed navigation", "Responsive visualization panels"]',
  true
),

(
  'Portfolio V5',
  'Personal portfolio site with a public-facing showcase and a protected admin dashboard. Built with React and Vite, powered by Supabase for auth, real-time data, and storage. Features smooth animations and a clean dark design.',
  'https://opengraph.githubassets.com/1/lxiscxstillo/portofolio-v5',
  'https://lxiscxstillo.vercel.app',
  'https://github.com/lxiscxstillo/portofolio-v5',
  '["React", "TypeScript", "Vite", "Supabase", "Tailwind CSS", "Framer Motion", "AOS", "GSAP"]',
  '["Admin dashboard for managing projects and certificates", "Supabase auth with role-based access (admin/user)", "Real-time comments with Supabase Realtime subscriptions", "Project image storage via Supabase Storage buckets", "3D card flip tech stack showcase", "Deployed on Vercel with SPA routing"]',
  true
),

(
  'Pruebas Unitarias con Jest',
  'React application built for learning and practicing unit testing with Jest and Vitest, with continuous integration via GitHub Actions. Includes multiple interactive component exercises covering common testing patterns.',
  'https://opengraph.githubassets.com/1/lxiscxstillo/Pruebas_unitarias_jest-main',
  'https://pruebas-unitarias-jest-main.vercel.app',
  'https://github.com/lxiscxstillo/Pruebas_unitarias_jest-main',
  '["React", "TypeScript", "Vite", "Jest", "GitHub Actions", "CI/CD"]',
  '["Unit tests for multiplication tables component", "Unit converter with edge case coverage", "Password validator with regex testing", "Click counter state testing", "Todo list CRUD testing", "GitHub Actions CI/CD pipeline for automated testing"]',
  true
);
