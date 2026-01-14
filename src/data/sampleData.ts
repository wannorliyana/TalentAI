// Sample Dataset for TalentAI HR Recruitment Platform

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  status: "new" | "screening" | "interview" | "offer" | "rejected";
  matchScore: number;
  skills: string[];
  experience: string;
  education: string;
  location: string;
  appliedDate: string;
  resumeText?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  salary: string;
  status: "active" | "paused" | "closed";
  candidates: number;
  daysOpen: number;
  description: string;
  requirements: string[];
  postedDate: string;
}

export interface ScreeningResult {
  candidateId: string;
  overallScore: number;
  technicalScore: number;
  experienceScore: number;
  educationScore: number;
  recommendation: "strong_yes" | "yes" | "maybe" | "no";
  strengths: string[];
  concerns: string[];
  summary: string;
  screenedAt: string;
}

export interface DashboardMetrics {
  totalCandidates: number;
  activeJobs: number;
  interviewsScheduled: number;
  offersExtended: number;
  averageTimeToHire: number;
  applicationsTrend: number;
}

// Sample Candidates Dataset
export const sampleCandidates: Candidate[] = [
  {
    id: "cand-001",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    role: "Senior Frontend Developer",
    status: "interview",
    matchScore: 94,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Node.js"],
    experience: "6 years",
    education: "BS Computer Science, Stanford University",
    location: "San Francisco, CA",
    appliedDate: "2026-01-10",
    resumeText: "Experienced frontend developer with expertise in React ecosystem..."
  },
  {
    id: "cand-002",
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    phone: "+1 (555) 234-5678",
    role: "Product Manager",
    status: "screening",
    matchScore: 87,
    skills: ["Product Strategy", "Agile", "User Research", "Data Analysis", "Roadmapping"],
    experience: "8 years",
    education: "MBA, Harvard Business School",
    location: "New York, NY",
    appliedDate: "2026-01-09",
    resumeText: "Strategic product leader with track record of launching successful products..."
  },
  {
    id: "cand-003",
    name: "Elena Rodriguez",
    email: "elena.r@email.com",
    phone: "+1 (555) 345-6789",
    role: "UX Designer",
    status: "new",
    matchScore: 91,
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
    experience: "5 years",
    education: "MFA Design, Rhode Island School of Design",
    location: "Austin, TX",
    appliedDate: "2026-01-12",
    resumeText: "Creative UX designer passionate about accessible and inclusive design..."
  },
  {
    id: "cand-004",
    name: "James Kim",
    email: "james.kim@email.com",
    phone: "+1 (555) 456-7890",
    role: "Backend Engineer",
    status: "offer",
    matchScore: 96,
    skills: ["Python", "Go", "PostgreSQL", "AWS", "Kubernetes", "Microservices"],
    experience: "7 years",
    education: "MS Computer Science, MIT",
    location: "Seattle, WA",
    appliedDate: "2026-01-05",
    resumeText: "Backend specialist with deep expertise in distributed systems..."
  },
  {
    id: "cand-005",
    name: "Priya Sharma",
    email: "priya.s@email.com",
    phone: "+1 (555) 567-8901",
    role: "Data Scientist",
    status: "interview",
    matchScore: 89,
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics", "NLP"],
    experience: "4 years",
    education: "PhD Statistics, UC Berkeley",
    location: "Boston, MA",
    appliedDate: "2026-01-08",
    resumeText: "Data scientist specializing in NLP and predictive modeling..."
  },
  {
    id: "cand-006",
    name: "David Thompson",
    email: "david.t@email.com",
    phone: "+1 (555) 678-9012",
    role: "DevOps Engineer",
    status: "screening",
    matchScore: 85,
    skills: ["Docker", "Kubernetes", "Terraform", "CI/CD", "AWS", "Linux"],
    experience: "5 years",
    education: "BS Information Technology, Georgia Tech",
    location: "Denver, CO",
    appliedDate: "2026-01-11",
    resumeText: "DevOps engineer focused on automation and infrastructure as code..."
  },
  {
    id: "cand-007",
    name: "Aisha Patel",
    email: "aisha.p@email.com",
    phone: "+1 (555) 789-0123",
    role: "Full Stack Developer",
    status: "new",
    matchScore: 88,
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "REST APIs", "Docker"],
    experience: "4 years",
    education: "BS Software Engineering, Carnegie Mellon",
    location: "Chicago, IL",
    appliedDate: "2026-01-13",
    resumeText: "Full stack developer with experience building scalable web applications..."
  },
  {
    id: "cand-008",
    name: "Michael Brown",
    email: "michael.b@email.com",
    phone: "+1 (555) 890-1234",
    role: "Security Engineer",
    status: "interview",
    matchScore: 92,
    skills: ["Penetration Testing", "SIEM", "Cloud Security", "Python", "Compliance"],
    experience: "6 years",
    education: "MS Cybersecurity, NYU",
    location: "Washington, DC",
    appliedDate: "2026-01-07",
    resumeText: "Security professional with expertise in threat detection and incident response..."
  },
  {
    id: "cand-009",
    name: "Lisa Wang",
    email: "lisa.w@email.com",
    phone: "+1 (555) 901-2345",
    role: "Mobile Developer",
    status: "rejected",
    matchScore: 72,
    skills: ["React Native", "Swift", "Kotlin", "Firebase", "REST APIs"],
    experience: "3 years",
    education: "BS Computer Science, UCLA",
    location: "Los Angeles, CA",
    appliedDate: "2026-01-04",
    resumeText: "Mobile developer with experience in cross-platform development..."
  },
  {
    id: "cand-010",
    name: "Ahmad Hassan",
    email: "ahmad.h@email.com",
    phone: "+60 12-345-6789",
    role: "Cloud Architect",
    status: "screening",
    matchScore: 90,
    skills: ["AWS", "Azure", "GCP", "Terraform", "Architecture Design", "Cost Optimization"],
    experience: "9 years",
    education: "MS Cloud Computing, National University of Singapore",
    location: "Kuala Lumpur, Malaysia",
    appliedDate: "2026-01-10",
    resumeText: "Cloud architect with multi-cloud expertise and enterprise experience..."
  },
  {
    id: "cand-011",
    name: "Emma Wilson",
    email: "emma.w@email.com",
    phone: "+1 (555) 012-3456",
    role: "QA Engineer",
    status: "new",
    matchScore: 83,
    skills: ["Selenium", "Cypress", "API Testing", "Test Automation", "Agile", "JIRA"],
    experience: "4 years",
    education: "BS Computer Science, University of Michigan",
    location: "Detroit, MI",
    appliedDate: "2026-01-14",
    resumeText: "QA engineer passionate about quality and test automation..."
  },
  {
    id: "cand-012",
    name: "Carlos Mendez",
    email: "carlos.m@email.com",
    phone: "+1 (555) 123-4568",
    role: "Technical Lead",
    status: "offer",
    matchScore: 95,
    skills: ["System Design", "Team Leadership", "Java", "Microservices", "Mentoring"],
    experience: "10 years",
    education: "MS Software Engineering, Columbia University",
    location: "Miami, FL",
    appliedDate: "2026-01-03",
    resumeText: "Technical leader with experience scaling engineering teams..."
  }
];

// Sample Jobs Dataset
export const sampleJobs: Job[] = [
  {
    id: "job-001",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$150,000 - $180,000",
    status: "active",
    candidates: 24,
    daysOpen: 14,
    description: "We're looking for a Senior Frontend Developer to join our product team and help build the next generation of our platform.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Experience with modern CSS", "Strong communication skills"],
    postedDate: "2025-12-31"
  },
  {
    id: "job-002",
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "full-time",
    salary: "$140,000 - $170,000",
    status: "active",
    candidates: 18,
    daysOpen: 21,
    description: "Join our product team to drive strategy and execution for our core platform features.",
    requirements: ["5+ years product management", "Technical background preferred", "Strong analytical skills", "Excellent stakeholder management"],
    postedDate: "2025-12-24"
  },
  {
    id: "job-003",
    title: "UX Designer",
    department: "Design",
    location: "Austin, TX",
    type: "full-time",
    salary: "$120,000 - $145,000",
    status: "active",
    candidates: 15,
    daysOpen: 7,
    description: "We need a creative UX Designer to help shape the user experience across our product suite.",
    requirements: ["4+ years UX design", "Figma expertise", "User research experience", "Portfolio required"],
    postedDate: "2026-01-07"
  },
  {
    id: "job-004",
    title: "Backend Engineer",
    department: "Engineering",
    location: "Seattle, WA",
    type: "full-time",
    salary: "$160,000 - $190,000",
    status: "active",
    candidates: 32,
    daysOpen: 28,
    description: "Build and scale our backend infrastructure to support millions of users.",
    requirements: ["6+ years backend development", "Python or Go", "Distributed systems experience", "Cloud platform expertise"],
    postedDate: "2025-12-17"
  },
  {
    id: "job-005",
    title: "Data Scientist",
    department: "Data",
    location: "Boston, MA",
    type: "full-time",
    salary: "$140,000 - $165,000",
    status: "active",
    candidates: 12,
    daysOpen: 10,
    description: "Join our data team to build ML models that power our AI-driven features.",
    requirements: ["3+ years data science", "Python and SQL", "Machine learning experience", "Statistics background"],
    postedDate: "2026-01-04"
  },
  {
    id: "job-006",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Denver, CO",
    type: "full-time",
    salary: "$130,000 - $155,000",
    status: "active",
    candidates: 8,
    daysOpen: 5,
    description: "Help us build and maintain our cloud infrastructure and deployment pipelines.",
    requirements: ["4+ years DevOps experience", "Kubernetes expertise", "CI/CD pipelines", "Infrastructure as code"],
    postedDate: "2026-01-09"
  },
  {
    id: "job-007",
    title: "Mobile Developer",
    department: "Engineering",
    location: "Los Angeles, CA",
    type: "full-time",
    salary: "$135,000 - $160,000",
    status: "paused",
    candidates: 20,
    daysOpen: 35,
    description: "Build our mobile applications for iOS and Android platforms.",
    requirements: ["4+ years mobile development", "React Native or native development", "App Store experience", "Performance optimization"],
    postedDate: "2025-12-10"
  },
  {
    id: "job-008",
    title: "Security Engineer",
    department: "Security",
    location: "Washington, DC",
    type: "full-time",
    salary: "$145,000 - $175,000",
    status: "active",
    candidates: 6,
    daysOpen: 12,
    description: "Protect our platform and users by building robust security measures.",
    requirements: ["5+ years security experience", "Penetration testing", "Cloud security", "Compliance knowledge"],
    postedDate: "2026-01-02"
  },
  {
    id: "job-009",
    title: "Cloud Architect",
    department: "Engineering",
    location: "Kuala Lumpur, Malaysia",
    type: "full-time",
    salary: "MYR 15,000 - MYR 22,000",
    status: "active",
    candidates: 10,
    daysOpen: 8,
    description: "Design and implement our multi-cloud architecture strategy.",
    requirements: ["7+ years cloud experience", "Multi-cloud expertise", "Architecture design", "Cost optimization"],
    postedDate: "2026-01-06"
  },
  {
    id: "job-010",
    title: "QA Engineer",
    department: "Quality",
    location: "Remote",
    type: "full-time",
    salary: "$100,000 - $125,000",
    status: "active",
    candidates: 14,
    daysOpen: 3,
    description: "Ensure the quality of our products through comprehensive testing strategies.",
    requirements: ["3+ years QA experience", "Test automation", "API testing", "Agile methodology"],
    postedDate: "2026-01-11"
  },
  {
    id: "job-011",
    title: "Technical Writer",
    department: "Product",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100/hour",
    status: "active",
    candidates: 7,
    daysOpen: 6,
    description: "Create and maintain technical documentation for our developer platform.",
    requirements: ["3+ years technical writing", "API documentation experience", "Developer audience", "Markdown/Git proficiency"],
    postedDate: "2026-01-08"
  },
  {
    id: "job-012",
    title: "Engineering Intern",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "internship",
    salary: "$45/hour",
    status: "closed",
    candidates: 45,
    daysOpen: 60,
    description: "Summer internship program for aspiring software engineers.",
    requirements: ["Currently pursuing CS degree", "Programming fundamentals", "Problem-solving skills", "Team collaboration"],
    postedDate: "2025-11-15"
  }
];

// Sample Screening Results
export const sampleScreeningResults: ScreeningResult[] = [
  {
    candidateId: "cand-001",
    overallScore: 94,
    technicalScore: 96,
    experienceScore: 92,
    educationScore: 95,
    recommendation: "strong_yes",
    strengths: ["Excellent React and TypeScript skills", "Strong educational background", "Proven track record at top companies"],
    concerns: ["May be overqualified for some roles", "Salary expectations might be high"],
    summary: "Outstanding candidate with exceptional frontend expertise. Highly recommended for senior positions.",
    screenedAt: "2026-01-11T10:30:00Z"
  },
  {
    candidateId: "cand-002",
    overallScore: 87,
    technicalScore: 82,
    experienceScore: 92,
    educationScore: 88,
    recommendation: "yes",
    strengths: ["Strong product leadership experience", "MBA from top school", "Cross-functional collaboration skills"],
    concerns: ["Limited technical depth", "No startup experience"],
    summary: "Solid product management candidate with enterprise experience. Good fit for established product teams.",
    screenedAt: "2026-01-10T14:15:00Z"
  },
  {
    candidateId: "cand-004",
    overallScore: 96,
    technicalScore: 98,
    experienceScore: 95,
    educationScore: 96,
    recommendation: "strong_yes",
    strengths: ["Deep backend expertise", "Distributed systems knowledge", "MIT education", "Leadership potential"],
    concerns: ["None identified"],
    summary: "Exceptional backend engineer. Top-tier candidate who should be prioritized for offer.",
    screenedAt: "2026-01-06T09:00:00Z"
  },
  {
    candidateId: "cand-005",
    overallScore: 89,
    technicalScore: 91,
    experienceScore: 85,
    educationScore: 95,
    recommendation: "yes",
    strengths: ["PhD-level statistical expertise", "Strong ML skills", "Research background"],
    concerns: ["Limited industry experience", "May need mentorship initially"],
    summary: "Promising data scientist with strong academic foundation. Would benefit from senior team members.",
    screenedAt: "2026-01-09T11:45:00Z"
  },
  {
    candidateId: "cand-008",
    overallScore: 92,
    technicalScore: 94,
    experienceScore: 90,
    educationScore: 93,
    recommendation: "strong_yes",
    strengths: ["Comprehensive security skills", "Incident response experience", "Compliance expertise"],
    concerns: ["Higher salary expectations"],
    summary: "Highly qualified security engineer. Would strengthen our security posture significantly.",
    screenedAt: "2026-01-08T16:20:00Z"
  },
  {
    candidateId: "cand-009",
    overallScore: 72,
    technicalScore: 70,
    experienceScore: 68,
    educationScore: 80,
    recommendation: "no",
    strengths: ["Mobile development foundation", "Cross-platform experience"],
    concerns: ["Limited experience for senior role", "Gaps in portfolio", "Communication concerns in interview"],
    summary: "Does not meet the experience requirements for the current role. Consider for junior positions.",
    screenedAt: "2026-01-05T13:30:00Z"
  },
  {
    candidateId: "cand-012",
    overallScore: 95,
    technicalScore: 94,
    experienceScore: 98,
    educationScore: 92,
    recommendation: "strong_yes",
    strengths: ["10 years experience", "Team leadership", "System design expertise", "Mentoring skills"],
    concerns: ["May want to move to management track"],
    summary: "Exceptional technical leader. Perfect for tech lead or principal engineer roles.",
    screenedAt: "2026-01-04T10:00:00Z"
  }
];

// Dashboard Metrics
export const sampleDashboardMetrics: DashboardMetrics = {
  totalCandidates: 156,
  activeJobs: 11,
  interviewsScheduled: 23,
  offersExtended: 5,
  averageTimeToHire: 28,
  applicationsTrend: 12.5
};

// Helper functions to get data
export const getCandidateById = (id: string): Candidate | undefined => {
  return sampleCandidates.find(c => c.id === id);
};

export const getJobById = (id: string): Job | undefined => {
  return sampleJobs.find(j => j.id === id);
};

export const getScreeningResultByCandidateId = (candidateId: string): ScreeningResult | undefined => {
  return sampleScreeningResults.find(s => s.candidateId === candidateId);
};

export const getCandidatesByStatus = (status: Candidate["status"]): Candidate[] => {
  return sampleCandidates.filter(c => c.status === status);
};

export const getActiveJobs = (): Job[] => {
  return sampleJobs.filter(j => j.status === "active");
};

export const getRecentCandidates = (limit: number = 5): Candidate[] => {
  return [...sampleCandidates]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, limit);
};
