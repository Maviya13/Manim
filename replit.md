# ManimAI Animation Studio

## Overview

ManimAI is a SaaS platform that generates educational Manim animations from natural language prompts. Users describe the animation they want, and a multi-agent AI pipeline (powered by Google Gemini) plans, generates, validates, and renders Manim Python code to produce MP4 videos.

The application follows a client-server architecture with a React frontend and Express backend. It uses a multi-agent system where specialized AI agents handle different stages of the animation generation pipeline: scene planning, code generation, validation, and orchestration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled via Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Design System**: Linear + Vercel inspired design with focus on workflow clarity and professional polish

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Design**: RESTful JSON API under `/api` prefix
- **AI Integration**: Google Gemini AI (`@google/genai`) for the multi-agent pipeline
- **Build Process**: esbuild for server bundling, Vite for client bundling

### Multi-Agent Pipeline
The core feature uses four specialized AI agents that process animation requests sequentially:
1. **Scene Planner Agent**: Analyzes prompts and creates structured animation blueprints
2. **Code Generator Agent**: Converts scene plans into valid Manim Python code
3. **Validation Agent**: Reviews code for errors and educational effectiveness
4. **Orchestrator Agent**: Manages execution flow and rendering pipeline

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with Zod validation via `drizzle-zod`
- **Storage**: Currently uses in-memory storage (`MemStorage` class) with interface ready for database migration
- **Session**: PostgreSQL session store available via `connect-pg-simple`

### Key Data Models
- **AnimationJob**: Tracks the full lifecycle of an animation request including status, logs, scene plan, generated code, validation results, and video URL
- **AgentLog**: Records activity from each agent during pipeline execution
- **ScenePlan**: Structured blueprint output from the planning agent
- **ValidationResult**: Code review output with errors, warnings, and suggestions

## External Dependencies

### AI Services
- **Google Gemini AI**: Primary LLM for all agents (gemini-2.5-flash model), requires `GEMINI_API_KEY` environment variable

### Database
- **PostgreSQL**: Required for production data persistence, configured via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migration tooling (`db:push` script)

### Key NPM Packages
- `@google/genai`: Google Generative AI SDK
- `drizzle-orm` / `drizzle-zod`: Database ORM and schema validation
- `@tanstack/react-query`: Async state management
- `@radix-ui/*`: Accessible UI primitives
- `wouter`: Client-side routing
- `zod`: Runtime type validation
- `express-session` / `connect-pg-simple`: Session management