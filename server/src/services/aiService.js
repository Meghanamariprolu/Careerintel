import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const promptTemplate = (input) => `
You are a Senior AI Product Engineer, Full Stack Developer, and UX Architect.
Your task is to generate a COMPLETE intelligent career learning system roadmap for a student.

INPUT:
Selected Career Role: ${input.career}
User Experience Level: ${input.experienceLevel}
Goal: ${input.goal}

OBJECTIVES:
1. Generate 6–8 sequential learning modules.
2. For each module include: title, level, duration, concepts, tools, free YouTube videos (title/url), practice tasks, and a mini project.
3. Design a WEEKLY learning timeline (e.g., Week 1-2: Basics, etc.).
4. Suggest 3–5 real-world portfolio projects with title, features, tech stack, and GitHub folder structure.
5. List specific skills to track (0-100% progress).
6. Recommend job-ready skills and free platforms.

INSTRUCTIONS:
- Modules must be sequential.
- The roadmap must automatically adapt to the role.
- Design a Coursera-like UI structure.

Return the result STRICTLY as a JSON object. Do NOT include any text before or after the JSON.

OUTPUT FORMAT (STRICT JSON):
{
  "role": "${input.career}",
  "total_learning_duration": "string",
  "weekly_timeline": [
    { "weeks": "1-2", "focus": "Basics" },
    { "weeks": "3-4", "focus": "Intermediate" },
    { "weeks": "5-6", "focus": "Advanced" }
  ],
  "learning_route": [
    {
      "module_number": 1,
      "module_title": "string",
      "level": "string",
      "duration": "string",
      "concepts": ["string"],
      "tools": ["string"],
      "videos": [{ "title": "string", "url": "string" }],
      "practice_tasks": ["string"],
      "mini_project": "string",
      "is_locked": false
    }
  ],
  "skills_tracking": [
    { "skill": "string", "progress": 0 }
  ],
  "portfolio_projects": [
     {
      "name": "string",
      "description": "string",
      "techStack": ["string"],
      "features": ["string"],
      "github_structure": ["string"]
    }
  ],
  "job_ready_skills": ["string"],
  "recommended_free_platforms": ["string"],
  "job_readiness_score": 0,
  "learning_platform_ui_design": {
    "pages": ["string"],
    "navigation_structure": ["string"],
    "dashboard_layout": "string",
    "module_page_layout": "string",
    "progress_tracking_features": ["string"],
    "recommended_color_theme": "Background: #0F172A, Primary: #8B5CF6, Accent: #22D3EE"
  }
}
`;

export const generateAIRoadmap = async (input) => {
  try {
    if (!process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY.includes('YOUR_')) {
        throw new Error('API Key not set');
    }
    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [{ role: 'user', content: promptTemplate(input) }],
      max_tokens: 3000,
      temperature: 0.2,
    });

    const aiText = response.choices[0].message.content;
    const jsonMatch = aiText?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse AI response into JSON');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('HuggingFace Service Error, falling back to dynamic mock data:', error);
    // Dynamic Mock Generator based on career role
    const role = input.career.toLowerCase();
    let learning_route = [], job_ready_skills = [], platforms = [], projects = [];

    if (role.includes('data') || role.includes('machine learning') || role.includes('ai') || role.includes('llm')) {
      learning_route = [
        { 
          module_number: 1, 
          module_title: "Foundations of AI & Python", 
          level: "Beginner", 
          duration: "4 Weeks",
          concepts: ["Variables", "Loops", "Data Structures", "NumPy"],
          tools: ["Python", "VS Code"],
          videos: [{ title: "Python for Data Science", url: "https://youtube.com/watch?v=rfscVS0vtbw" }],
          practice_tasks: ["Build a calculator", "Data cleaning exercise"],
          mini_project: "Simple Linear Regression Model"
        },
        { 
          module_number: 2, 
          module_title: "Neural Architectures", 
          level: "Intermediate", 
          duration: "6 Weeks",
          concepts: ["Backpropagation", "CNNs", "RNNs"],
          tools: ["PyTorch", "TensorFlow"],
          videos: [{ title: "Neural Networks Explained", url: "https://youtube.com/watch?v=aircAruvnKk" }],
          practice_tasks: ["MNIST Digit Classification"],
          mini_project: "Image Classifier"
        }
      ];
      job_ready_skills = ["Python", "PyTorch", "Transformers", "SQL"];
      platforms = ["DeepLearning.AI", "Hugging Face"];
      projects = [{ name: "LLM Fine-tuner", description: "Fine-tune Mistral on medical data.", techStack: ["Python", "Peft", "BitsAndBytes"] }];
    } else {
        learning_route = [
          { 
            module_number: 1, 
            module_title: "Core Development Basics", 
            level: "Beginner", 
            duration: "3 Weeks",
            concepts: ["HTML/CSS", "JavaScript Basics"],
            tools: ["Git", "Chrome DevTools"],
            videos: [{ title: "Web Dev for Beginners", url: "https://youtube.com/watch?v=mU6anWqZJcc" }],
            practice_tasks: ["Static landing page"],
            mini_project: "Personal Portfolio Site"
          }
        ];
        job_ready_skills = ["JavaScript", "React", "Git"];
        platforms = ["FreeCodeCamp", "YouTube"];
        projects = [{ name: "E-commerce Hub", description: "Full-stack marketplace.", techStack: ["React", "Node.js", "MongoDB"] }];
    }

    return {
      role: input.career,
      total_learning_duration: "6 Months",
      learning_route,
      portfolio_projects: projects,
      job_ready_skills,
      recommended_free_platforms: platforms,
      learning_platform_ui_design: {
        pages: ["Dashboard", "Roadmap", "Projects"],
        navigation_structure: ["Sidebar", "Progress Bar"],
        dashboard_layout: "Grid System",
        module_page_layout: "Single Column with Video Player",
        progress_tracking_features: ["Streak", "Skill Badges"],
        recommended_color_theme: "Dark Mode with Electric Purple"
      }
    };
  }
};

const resumeEnhancementPromptTemplate = (resumeText, jobDescription) => `
You are an expert ATS Resume Optimizer.
Enhance the candidate's resume for the following job description. Keep personal details intact. Do not invent experience.
RESUME: ${resumeText}
JOB DESCRIPTION: ${jobDescription}
Return formatted as: PROFESSIONAL SUMMARY, SKILLS, EDUCATION, PROJECTS.
`;

export const enhanceResumeAPI = async (resumeText, jobDescription) => {
  try {
    if (!process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY.includes('YOUR_')) {
        throw new Error('API Key not set');
    }
    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [{ role: 'user', content: resumeEnhancementPromptTemplate(resumeText, jobDescription) }],
      max_tokens: 3000,
      temperature: 0.3,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('HuggingFace Service Error in enhanceResumeAPI:', error);
    return "Enhanced Summary: Proven technical professional with expertise in " + (jobDescription || "the target field") + ". \nSkills: Optimization, Strategy, Implementation.\n(Note: Fallback response due to API connection issues)";
  }
};

const scenarioPromptTemplate = (message, persona, chatHistory, company, companyCulture) => `
You are an expert career coach acting as "${persona}" at ${company}.
${companyCulture ? `Company Culture: ${companyCulture}` : ''}
Your responses should reflect ${company}'s specific culture, values, and interview/evaluation style.
Scenario Context: ${chatHistory.filter(m => m.role === 'system').map(m => m.content).join('\n')}
Roleplay History: ${chatHistory.filter(m => m.role !== 'system').map(m => `${m.role === 'ai' ? 'COACH' : 'CANDIDATE'}: ${m.content}`).join('\n')}
CANDIDATE'S MESSAGE: "${message}"
Respond in character as someone from ${company}, concise (1-2 sentences), reflecting their culture.
`;

const coachPromptTemplate = (message, persona, chatHistory, userContext) => `
You are an expert career architect acting as "${persona}".
Your role is to guide the user based on their specific profile and career goals.
USER CONTEXT:
${JSON.stringify(userContext, null, 2)}

CHAT HISTORY:
${chatHistory.filter(m => m.role !== 'system').map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

USER QUESTION: "${message}"

Respond concisely (2-4 sentences max). Give highly practical, personalized, and actionable tech career advice. Incorporate the user's specific context (their skills, goal, and portfolio) natively into your answer without explicitly reciting their resume. Reflect the unique tone of "${persona}".
`;

export const generateCoachResponse = async (message, persona, chatHistory, userContext = {}) => {
  try {
    if (!process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY.includes('YOUR_')) {
        throw new Error('API Key not set');
    }
    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [{ role: 'user', content: coachPromptTemplate(message, persona, chatHistory, userContext) }],
      max_tokens: 350,
      temperature: 0.6,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Coach Response Fallback:', error);
    
    // Dynamic Fallback relying on user context and persona
    const goal = userContext.careerGoal || 'career goal';
    const skills = userContext.currentSkills?.join(', ') || 'current skills';
    const projects = userContext.portfolioProjects?.length || 0;
    
    if (persona === 'The Strategist') {
        return `To maximize ROI towards becoming a ${goal}, you need to pivot from just knowing ${skills} to applying them in high-visibility contexts. Since you have ${projects} portfolio projects, I recommend optimizing the most technical one to showcase system-level thinking.`;
    }
    if (persona === 'The Visionary') {
        return `The industry is moving rapidly. For a ${goal}, the standard stack of ${skills} is becoming commoditized. Start looking at how AI agents or emerging architectures can be integrated into your next project. It's about future-proofing your trajectory.`;
    }
    if (persona === 'The Commander') {
        return `Let's stick to execution. You say you want to be a ${goal}. You currently claim to know ${skills} and have ${projects} projects. Identify your weakest skill, allocate 2 hours to it today, and report back. No excuses.`;
    }
    
    return `Based on your goal of becoming a ${goal}, take a data-driven approach. Evaluate your progress with ${skills} and build towards your next milestone.`;
  }
};

export const generateScenarioResponse = async (message, persona, chatHistory, company = 'General', companyCulture = '') => {
  try {
    if (!process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY.includes('YOUR_')) {
        throw new Error('API Key not set');
    }
    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [{ role: 'user', content: scenarioPromptTemplate(message, persona, chatHistory, company, companyCulture) }],
      max_tokens: 200,
      temperature: 0.7,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Scenario Response Fallback:', error);
    
    const lowerMsg = message.toLowerCase();
    const co = (company || 'General').toLowerCase();

    // ── Company-Aware Hiring Manager Responses ──
    if (persona === 'The Hiring Manager') {
        const isSalaryTopic = lowerMsg.includes('salary') || lowerMsg.includes('pay') || lowerMsg.includes('compensation') || lowerMsg.includes('$');
        
        if (co.includes('amazon')) {
            if (isSalaryTopic) return "At Amazon, total compensation includes significant RSUs that vest over 4 years. The base is fixed for this band, but the equity upside is substantial. Does the overall package work for you?";
            return "Interesting. At Amazon, we evaluate candidates heavily on our Leadership Principles. Can you give me a specific example using the STAR method of a time you showed 'Bias for Action'?";
        }
        if (co.includes('google')) {
            if (isSalaryTopic) return "At Google, compensation is data-driven and benchmarked against market ranges. A $150k request is within the P50 band for this role. Can you walk me through the data you used to arrive at that number?";
            return "That's a thoughtful response. At Google, we value 'Googliness'—intellectual humility and collaboration. How would you describe the last time you changed your opinion based on new data?";
        }
        if (co.includes('microsoft')) {
            if (isSalaryTopic) return "Microsoft's philosophy is a growth mindset around compensation—we tie increases to demonstrated impact. That number is reasonable. Can you help me connect your skills to the business impact you'd drive here?";
            return "We love that perspective. At Microsoft, empathy is a core value. Tell me about a time you had to lead with empathy in a difficult situation with a stakeholder.";
        }
        if (co.includes('startup')) {
            if (isSalaryTopic) return "Cash is tight at this stage, but we're offering meaningful equity. The $150k might be stretch—could you consider $130k cash with 0.5% equity that could be worth 10x at our Series B?";
            return "We move fast here. Tell me—have you ever had to make a major product decision with incomplete information? What was the outcome?";
        }
        if (co.includes('meta')) {
            if (isSalaryTopic) return "Meta benchmarks at the 75th percentile for top performers. That number is achievable but tied to your impact tier. How do you quantify the impact you've driven at scale?";
            return "Meta values bold bets. Tell me about the riskiest decision you've made professionally—what did you learn?";
        }
        // General fallback
        if (isSalaryTopic) return "We want to be competitive. $150k is above our current range for this level. Is there flexibility, perhaps tied to a performance milestone bonus after 6 months?";
        return "I appreciate your enthusiasm. What specifically about this role aligns with your 5-year career trajectory?";
    }

    // ── Company-Aware HR Manager Responses ──
    if (persona === 'The HR Manager') {
        if (co.includes('amazon')) {
            return "At Amazon, we handle conflict through our Leadership Principle of 'Disagree and Commit'. After you voice your concern, can you commit to the team's direction even if you disagree?";
        }
        if (co.includes('google')) {
            return "Google's culture relies on psychological safety. How would you create a space where this colleague feels safe enough to be honest about why they're missing deadlines?";
        }
        if (co.includes('startup')) {
            return "In a startup, we can't afford repeated misses. This is a direct conversation situation. What's your plan for the next 48 hours to get the project back on track?";
        }
        return "How have you typically approached giving direct feedback to a teammate who isn't meeting expectations, while keeping the relationship intact?";
    }

    // ── Company-Aware Technical Lead / Crisis Responses ──
    if (persona === 'The Technical Lead') {
        if (co.includes('amazon')) return "Given our 'Customer Obsession' principle—what's your first action to communicate the outage to affected customers, before you even start diagnosing root cause?";
        if (co.includes('google')) return "Data first—what metrics are you pulling right now to isolate if this is a database issue or a cascading service failure? Walk me through your diagnostic approach.";
        if (co.includes('startup')) return "We have no on-call runbook. You own this. What are the first 3 commands you're running and who are you calling in the next 5 minutes?";
        return "Good instinct. Now—how are you delegating tasks to the team while you manage the incident bridge?";
    }
    
    if (persona === 'The Executive Stakeholder') {
        if (co.includes('amazon')) return "The board will want to see this framed through a Customer Obsession lens. What's the direct customer impact right now, and what's your 2-pizza team doing about it?";
        if (co.includes('meta')) return "We move fast, but not at the cost of trust. What's the bold call you're making right now to stop the bleeding, even if it means rolling back a week of work?";
        return "From a business perspective—what's the estimated revenue loss per minute of this outage, and what's your worst-case timeline to restore service?";
    }

    return "That's a thoughtful approach. How would you adapt that strategy if the situation escalated further?";
  }
};
