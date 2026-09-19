export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  year: string;
  github: string;
  live?: string;
  technologies: string[];
  features: string[];

  problem: {
    title: string;
    description: string;
  };

  solution: {
    title: string;
    description: string;
  };
};

export const projects: Project[] = [
    {
    slug: "finsight-ai",
    title: "FinSight AI",
    shortDescription:
        "An AI-driven financial research agent designed to bring multiple financial research tools into one intelligent platform.",
    description:
        "FinSight AI is an intelligent financial research platform that combines financial data, analysis and AI-powered research into a single workflow. The system is designed to help users research companies using their stock ticker and generate useful insights from financial information.",
    category: "AI / Financial Research",
    year: "2026",
    github: "https://github.com/aknidhi/FinResearch-AI",
    live: "",
    technologies: [
        "Python",
        "AI / LLM",
        "Financial APIs",
        "Data Analysis",
        "Agentic AI",
    ],
    features: [
        "Stock comparison",
        "Financial research",
        "Technical indicators",
        "Portfolio analysis",
        "AI-generated reports",
        "Research history",
        "AI chat follow-up",
        "Downloadable reports",
    ],

    problem: {
        title: "Financial research can become fragmented.",
        description:
        "Investors and researchers often need to move between different sources for market prices, technical data, fundamentals, news and portfolio information. FinSight AI brings these research tasks into one workspace.",
    },

    solution: {
        title: "Research through a single interface.",
        description:
        "A ticker-based workflow lets users enter a global market symbol and explore different research views from the same application.",
    },
    },

  {
    slug: "janvoice-ai",
    title: "Janvoice AI",
    shortDescription:
      "An AI-powered platform designed to bring government complaint management into a single dashboard.",
    description:
      "Janvoice AI is designed as a centralized platform where users can manage and track government-related complaints from one place. The system focuses on simplifying complaint submission, management and information access through an intelligent dashboard.",
    category: "AI / Civic Technology",
    year: "2026",
    github: "https://github.com/aknidhi/janvoice-ai",
    live: "",
    technologies: [
      "AI",
      "Dashboard",
      "Data Management",
      "Agentic AI",
    ],
    features: [
      "Centralized complaint management",
      "Single dashboard",
      "Complaint tracking",
      "AI-assisted workflow",
      "Data management",
      "User-friendly interface",
    ],
    problem: {
    title: "Government complaints can be difficult to manage across different channels.",
    description:
        "Citizens may need to use different platforms or departments to submit and follow up on complaints. This can make the process harder to track and understand.",
    },

    solution: {
    title: "A single dashboard for complaint management.",
    description:
        "Janvoice AI brings complaint submission, management and tracking into one centralized interface, with AI-assisted features designed to simplify the workflow.",
    },
  },
];