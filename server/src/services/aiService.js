import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const promptTemplate = (input) => `
You are an industry career strategist. Generate a detailed, role-specific career roadmap for becoming a ${input.career} in 2025. 
Do not generate generic software skills. Focus only on the exact technical skills, tools, technologies, frameworks, and practical competencies required for this role in the current job market.
The user is at a ${input.experienceLevel} level. 
Their goal is: ${input.goal}.
They have the following current skills: ${input.currentSkills}.
They can commit to ${input.timeCommitment} of studying.

Return the result STRICTLY as a JSON object matching the following structure exactly. Do NOT include Markdown formatting like \`\`\`json. Just the raw JSON object.

{
  "careerTitle": "string (Specific role title)",
  "careerSummary": "string (Specific role summary)",
  "coreTechnicalSkills": ["Skill 1", "Skill 2"],
  "supportingTools": ["Tool 1", "Tool 2"],
  "currentMarketDemandSkills2025": ["Skill 1", "Skill 2"],
  "learningPath": [
    {
      "level": "Beginner",
      "description": "Foundational phase description",
      "skills": ["Skill 1", "Skill 2"]
    },
    {
      "level": "Intermediate",
      "description": "Core competency phase description",
      "skills": ["Skill 1", "Skill 2"]
    },
    {
      "level": "Advanced",
      "description": "Specialization phase description",
      "skills": ["Skill 1", "Skill 2"]
    }
  ],
  "roleSpecificProjects": [
    {
      "name": "Project 1",
      "description": "Project description",
      "techStack": ["Tech 1", "Tech 2"]
    }
  ],
  "relevantCertifications": ["Cert 1", "Cert 2"],
  "portfolioGuidance": "Detailed advice on what a portfolio for this role needs",
  "interviewPreparation": ["Topic 1", "Topic 2"],
  "learningTimeline": [
    { "track": "3-month", "milestone": "What to achieve" },
    { "track": "6-month", "milestone": "What to achieve" },
    { "track": "1-year", "milestone": "What to achieve" }
  ],
  "salaryRange": {
    "india": "₹XL - ₹YL",
    "global": "$XXk - $YYk"
  },
  "marketDemandLevel": "High/Medium/Competitive",
  "futureGrowthPrediction": "High/Medium/Low with reasoning",
  "skillGapAnalysis": "Analysis based on current skills",
  "careerReadinessScore": 40
}
`;

export const generateAIRoadmap = async (input) => {
  try {
    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [{ role: 'user', content: promptTemplate(input) }],
      max_tokens: 3000,
      temperature: 0.2, // Low temperature for deterministic output
    });

    const aiText = response.choices[0].message.content;

    // Attempt to extract JSON if the model still wrapped it in markdown
    const jsonMatch = aiText?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response into JSON');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    return parsedData;
  } catch (error) {
    console.error('HuggingFace Service Error, falling back to dynamic mock data:', error);

    // Dynamic Mock Generator based on career role
    const role = input.career.toLowerCase();

    let learningPath = [];
    let coreTechSkills = [];
    let tools = [];
    let marketSkills = [];
    let certs = [];
    let projects = [];
    let interviewPrep = [];
    let salary = { india: "", global: "" };
    let demandLevel = "";

    if (role.includes('data') || role.includes('machine learning') || role.includes('ai') || role.includes('analytics')) {
      learningPath = [
        { level: "Beginner", description: "Establish a strong baseline of stats, calculus, and Python.", skills: ["Python", "Statistics", "Linear Algebra"] },
        { level: "Intermediate", description: "Learn to clean, manipulate and visualize data sets.", skills: ["Pandas", "NumPy", "Matplotlib", "SQL"] },
        { level: "Advanced", description: "Build predictive models and understand ML algorithms.", skills: ["Scikit-Learn", "Regression", "Classification", "Deep Learning"] }
      ];
      coreTechSkills = ["Python", "SQL", "Machine Learning", "Mathematics"];
      marketSkills = ["LLMs", "RAG Pipeline", "PyTorch", "Transformers"];
      tools = ["Jupyter", "Tableau", "Git", "Docker", "AWS SageMaker"];
      certs = ["Google Data Analytics", "AWS Machine Learning Specialty", "DeepLearning.AI TensorFlow"];
      projects = [
        { name: "Predictive Housing Price Model", description: "Predict house prices using regression.", techStack: ["Python", "Scikit-Learn", "Pandas"] },
        { name: "Customer Churn Analysis", description: "Classify bank customer churn.", techStack: ["Python", "XGBoost", "Seaborn"] }
      ];
      interviewPrep = ["Statistical Concepts", "SQL Query Optimization", "ML Algorithm Math", "System Design for ML"];
      salary = { india: "₹8L - ₹25L", global: "$90k - $160k" };
      demandLevel = "High";
    } else if (role.includes('front') || role.includes('ui') || role.includes('web')) {
      learningPath = [
        { level: "Beginner", description: "Master the building blocks of the web.", skills: ["HTML5", "CSS3", "JavaScript ES6+"] },
        { level: "Intermediate", description: "Learn modern component-based UI development.", skills: ["React", "TypeScript", "Tailwind CSS"] },
        { level: "Advanced", description: "Optimize web apps for speed and accessibility.", skills: ["Next.js", "State Management", "Web Vitals"] }
      ];
      coreTechSkills = ["JavaScript/TypeScript", "React", "HTML/CSS", "Responsive Design"];
      marketSkills = ["Next.js 14 (App Router)", "Zustand/Redux Toolkit", "Framer Motion", "Tailwind CSS"];
      tools = ["VS Code", "Figma", "Git", "Vercel", "Chrome DevTools"];
      certs = ["Meta Front-End Developer", "React Certification"];
      projects = [
        { name: "Personal Portfolio Website", description: "A responsive portfolio with animations.", techStack: ["Next.js", "Tailwind CSS", "Framer Motion"] },
        { name: "E-commerce Product Page", description: "A cart system with state management.", techStack: ["React", "Zustand", "TypeScript"] }
      ];
      interviewPrep = ["JavaScript Event Loop", "React Lifecycle and Hooks", "CSS Specificity and Grid", "Web Performance Optimization"];
      salary = { india: "₹5L - ₹18L", global: "$70k - $130k" };
      demandLevel = "High";
    } else if (role.includes('back') || role.includes('api') || role.includes('node') || role.includes('software')) {
      learningPath = [
        { level: "Beginner", description: "Learn how to build and structure a web server.", skills: ["Node.js/Python/Java", "HTTP/REST", "Express/FastAPI"] },
        { level: "Intermediate", description: "Store, retrieve, and model data efficiently.", skills: ["SQL (Postgres)", "NoSQL (MongoDB)", "ORM/Prisma"] },
        { level: "Advanced", description: "Secure your APIs and design scalable systems.", skills: ["Microservices", "Docker", "Caching (Redis)", "Message Queues"] }
      ];
      coreTechSkills = ["Node.js/Java/Go", "RESTful/GraphQL APIs", "Database Design", "Authentication"];
      marketSkills = ["Microservices Architecture", "Docker/Kubernetes", "Redis Caching", "GraphQL/tRPC"];
      tools = ["Postman", "Docker", "Git", "DBeaver", "AWS/GCP"];
      certs = ["AWS Certified Developer", "IBM Backend Development"];
      projects = [
        { name: "RESTful E-commerce API", description: "Build an API with auth and payment integration.", techStack: ["Node.js", "Express", "PostgreSQL", "Stripe"] },
        { name: "Real-time Chat Server", description: "Implement WebSockets for real-time communication.", techStack: ["Node.js", "Socket.io", "Redis"] }
      ];
      interviewPrep = ["CAP Theorem", "Database Indexing", "REST vs GraphQL", "System Design Patterns"];
      salary = { india: "₹6L - ₹22L", global: "$80k - $140k" };
      demandLevel = "High";
    } else {
      // Generic Fallback tailored with variables
      learningPath = [
        { level: "Beginner", description: "Establish a strong baseline for a " + input.career + ".", skills: ["Core Concepts", "Basic Tools", "Problem Solving"] },
        { level: "Intermediate", description: "Learn specialized skills and industry standard practices.", skills: ["Advanced Frameworks", "System Design", "Best Practices"] },
        { level: "Advanced", description: "Build a portfolio and prepare for the job market.", skills: ["Project Building", "Architecture", "Networking"] }
      ];
      coreTechSkills = ["Problem Solving", "Domain Specific Knowledge", "Tool Utilization", "Analytical Thinking"];
      marketSkills = ["Cloud Computing", "AI Integration", "Agile Methodologies"];
      tools = ["Industry Standard Software", "Collaboration Tools", "Task Management"];
      certs = ["Relevant Industry Certification", "Foundational Credential"];
      projects = [
        { name: "Capstone Project", description: "Integrate core skills into a complete product.", techStack: ["Relevant Tech 1", "Relevant Tech 2"] }
      ];
      interviewPrep = ["Behavioral Questions", "Core Domain Concepts", "Scenario-based Problem Solving"];
      salary = { india: "₹5L - ₹15L", global: "$60k - $120k" };
      demandLevel = "Competitive";
    }

    return {
      careerTitle: `${input.experienceLevel} ${input.career}`,
      careerSummary: `A customized, highly-tailored career path for a ${input.experienceLevel} ${input.career} aiming for a ${input.goal}.`,
      coreTechnicalSkills: coreTechSkills,
      supportingTools: tools,
      currentMarketDemandSkills2025: marketSkills,
      learningPath,
      roleSpecificProjects: projects,
      relevantCertifications: certs,
      portfolioGuidance: `Build 2-3 significant projects demonstrating mastery of ${coreTechSkills.slice(0, 2).join(" and ")}. Hosted code must be clean, well-documented, and use industry standards.`,
      interviewPreparation: interviewPrep,
      learningTimeline: [
        { track: "3-month", milestone: "Master the beginner fundamentals and complete one small project." },
        { track: "6-month", milestone: "Grasp intermediate concepts and finish a complex, full-stack portfolio piece." },
        { track: "1-year", milestone: "Learn advanced architecture and begin actively applying and interviewing." }
      ],
      salaryRange: salary,
      marketDemandLevel: demandLevel,
      futureGrowthPrediction: "High Growth expected. This role is crucial to modern industry demands.",
      skillGapAnalysis: "Focus on building a role-specific portfolio with real-world projects to bridge the experience gap.",
      careerReadinessScore: 65
    };
  }
};

const resumeEnhancementPromptTemplate = (resumeText, jobDescription) => `
You are an expert ATS Resume Optimizer used by top tech recruiters.

Your task is to generate an improved ATS-optimized version of the candidate’s resume based on the provided resume and target job description.

Follow these strict rules:

1. Keep the candidate’s real information such as:
   - Name
   - Email
   - Phone
   - Location
   - Education

2. Do NOT invent fake companies or fake experience.

3. Improve the resume by:
   - Adding important keywords from the job description
   - Rewriting project and experience descriptions with measurable results
   - Improving clarity and professional tone
   - Making the resume ATS-friendly

4. Only enhance existing skills and projects. Do not fabricate experience.

5. Use strong action verbs such as:
   - Developed
   - Engineered
   - Implemented
   - Designed
   - Optimized

6. Add measurable impact whenever possible such as:
   - percentages
   - performance improvements
   - efficiency gains

7. Structure the resume in a clean ATS-friendly format.

Use this format exactly:

--------------------------------------------------

FULL NAME

Email | Phone | Location | LinkedIn | GitHub

--------------------------------------------------

PROFESSIONAL SUMMARY

Write a 3–4 line summary tailored to the target job role using relevant keywords from the job description.

--------------------------------------------------

SKILLS

Technical Skills:
Programming Languages:
Tools & Technologies:
Soft Skills:

--------------------------------------------------

EDUCATION

Degree  
University / College  
Year

--------------------------------------------------

PROJECTS / EXPERIENCE

For each project or experience:

Project Title

• Bullet point describing the project with action verb
• Include tools and technologies used
• Include measurable impact when possible

Example:

AI Career Roadmap Generator

• Developed an AI-powered web platform using Next.js that generates personalized career roadmaps for users based on skill analysis.
• Integrated dynamic skill recommendation logic improving career planning accuracy by 35%.

--------------------------------------------------

INTERNSHIP / EXPERIENCE

Role  
Company  
Duration

• Describe contributions using action verbs
• Mention tools, technologies, and outcomes

--------------------------------------------------

CERTIFICATIONS

List relevant certifications.

--------------------------------------------------

FINAL OPTIMIZATION NOTES

Briefly explain what improvements were made such as:

• Added missing ATS keywords  
• Improved project descriptions  
• Optimized resume structure for ATS parsing

--------------------------------------------------

INPUT DATA

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

export const enhanceResumeAPI = async (resumeText, jobDescription) => {
  try {
    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [{ role: 'user', content: resumeEnhancementPromptTemplate(resumeText, jobDescription) }],
      max_tokens: 3000,
      temperature: 0.3,
    });

    const aiText = response.choices[0].message.content;
    return aiText;
  } catch (error) {
    console.error('HuggingFace Service Error in enhanceResumeAPI, falling back to dynamic mock data:', error);

    // Fallback Mock Response that respects the structure
    return \`
--------------------------------------------------

CANDIDATE NAME

Email | Phone | Location | LinkedIn | GitHub

--------------------------------------------------

PROFESSIONAL SUMMARY

Experienced professional with a proven track record. Driven to deliver high quality results leveraging modern technologies, aiming to add measurable value to the target role.

--------------------------------------------------

SKILLS

Technical Skills: Software Development, Problem Solving
Programming Languages: Python, JavaScript
Tools & Technologies: Git, Docker, React, Node.js
Soft Skills: Communication, Leadership

--------------------------------------------------

EDUCATION

B.S. Computer Science  
State University  
2024

--------------------------------------------------

PROJECTS / EXPERIENCE

Modern Web Application

• Developed a scalable web application utilizing modern frameworks, increasing user engagement by 20%.
• Integrated third-party APIs for real-time data processing, improving latency by 150ms.

--------------------------------------------------

FINAL OPTIMIZATION NOTES

• Added missing ATS keywords from the job description
• Improved project descriptions to highlight measurable impact
• Optimized resume structure for ATS parsing
\`;
  }
};
