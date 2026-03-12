import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const promptTemplate = (input) => `
You are an industry career strategist. Generate a detailed, role-specific career roadmap for becoming a ${input.career} in 2025. 
Do not generate generic software skills. Focus only on the exact technical skills, tools, technologies, frameworks, and practical competencies required for this role in the current job market.
The user is at a ${input.experienceLevel} level. 
Their goal is: ${input.goal}.
The user's current skills: ${input.currentSkills}.
They can commit to ${input.timeCommitment} of studying.

Return the result STRICTLY as a JSON object matching the following structure exactly. Do NOT include Markdown formatting like \`\`\`json. Just the raw JSON object.

{
  "careerTitle": "string",
  "careerSummary": "string",
  "coreTechnicalSkills": ["string"],
  "supportingTools": ["string"],
  "currentMarketDemandSkills2025": ["string"],
  "learningPath": [{ "level": "string", "description": "string", "skills": ["string"] }],
  "roleSpecificProjects": [{ "name": "string", "description": "string", "techStack": ["string"] }],
  "relevantCertifications": ["string"],
  "portfolioGuidance": "string",
  "interviewPreparation": ["string"],
  "learningTimeline": [{ "track": "string", "milestone": "string" }],
  "salaryRange": { "india": "string", "global": "string" },
  "marketDemandLevel": "string",
  "futureGrowthPrediction": "string",
  "skillGapAnalysis": "string",
  "careerReadinessScore": number
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
    let learningPath = [], coreTechSkills = [], tools = [], marketSkills = [], certs = [], projects = [], interviewPrep = [], salary = { india: "", global: "" }, demandLevel = "";

    if (role.includes('data') || role.includes('machine learning') || role.includes('ai')) {
      learningPath = [
        { level: "Beginner", description: "Stats, calculus, and Python basics.", skills: ["Python", "Statistics", "Calculus"] },
        { level: "Intermediate", description: "Data manipulation and visualization.", skills: ["Pandas", "Matplotlib", "SQL"] },
        { level: "Advanced", description: "ML models and Deep learning.", skills: ["Scikit-Learn", "Deep Learning", "Transformers"] }
      ];
      coreTechSkills = ["Python", "SQL", "Machine Learning"];
      marketSkills = ["LLMs", "RAG Pipeline", "Generative AI"];
      tools = ["Jupyter", "Docker", "AWS"];
      certs = ["Google Data Analytics", "AWS Machine Learning"];
      projects = [{ name: "Predictive Model", description: "Churn prediction.", techStack: ["Python", "XGBoost"] }];
      interviewPrep = ["Statistical Concepts", "SQL", "ML Algorithms"];
      salary = { india: "₹8L - ₹25L", global: "$90k - $160k" };
      demandLevel = "High";
    } else {
        // Simple fallback
        learningPath = [{ level: "Beginner", description: "Foundations.", skills: ["Core Concepts"] }];
        coreTechSkills = ["Problem Solving"];
        marketSkills = ["AI Tools"];
        tools = ["Git"];
        certs = ["Standard Certification"];
        projects = [{ name: "Capstone Project", description: "Full implementation.", techStack: ["Tech 1", "Tech 2"] }];
        interviewPrep = ["Technical Basics"];
        salary = { india: "₹5L - ₹15L", global: "$60k - $120k" };
        demandLevel = "Competitive";
    }

    return {
      careerTitle: `${input.experienceLevel} ${input.career}`,
      careerSummary: `Custom path for ${input.career}.`,
      coreTechnicalSkills: coreTechSkills,
      supportingTools: tools,
      currentMarketDemandSkills2025: marketSkills,
      learningPath,
      roleSpecificProjects: projects,
      relevantCertifications: certs,
      portfolioGuidance: "Build real projects.",
      interviewPreparation: interviewPrep,
      learningTimeline: [{ track: "6-month", milestone: "Full competency." }],
      salaryRange: salary,
      marketDemandLevel: demandLevel,
      futureGrowthPrediction: "High Growth.",
      skillGapAnalysis: "Bridging the gap with projects.",
      careerReadinessScore: 65
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
