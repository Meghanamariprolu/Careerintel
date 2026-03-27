export const buildCurriculum = (goal, level) => {
    // Generate specialized data based on goal
    const isData = goal.includes("Data") || goal.includes("Machine Learning") || goal.includes("AI");
    const isBackend = goal.includes("Backend") || goal.includes("Cloud") || goal.includes("Site") || goal.includes("DevOps");
    const isCyber = goal.includes("Cyber") || goal.includes("Hacker");
    
    let tools = ["VS Code", "Git", "Docker"];
    let skills = [];
    if (isData) {
        tools = ["Python", "Jupyter", "PyTorch", "TensorFlow", "SQL", "Pandas", "Scikit-Learn"];
        skills = ["Data wrangling", "Neural Network Architecture", "Statistical Modeling", "Data Visualization", "Model Deployment"];
    } else if (isBackend) {
        tools = ["Node.js", "Go", "Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis"];
        skills = ["Microservices Architecture", "API Design", "Distributed Systems", "Cloud Provisioning", "CI/CD Deployment"];
    } else if (isCyber) {
        tools = ["Kali Linux", "Wireshark", "Metasploit", "Burp Suite", "Nmap", "Bash"];
        skills = ["Penetration Testing", "Threat Intel", "Network Analytics", "Vulnerability Assessment", "Secure Architecture"];
    } else {
        tools = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Figma", "Redux", "Jest"];
        skills = ["Component Architecture", "State Management", "Responsive UI/UX", "Frontend Performance", "Accessibility (a11y)"];
    }

    return {
        total_learning_duration: level === "Beginner" ? "6 Months" : "3 Months",
        job_ready_skills: skills,
        portfolio_projects: [
            `Enterprise-scale ${goal} application covering end-to-end deployment`,
            `Open-source contribution demonstrating ${tools[0]} and ${tools[2]} mastery`,
            `Specialized portfolio piece highlighting ${skills[0]} and robust engineering`
        ],
        weekly_timeline: [
            { weeks: "1-2", focus: "Foundation and Core Principles" },
            { weeks: "3-5", focus: "Advanced Tooling & Frameworks" },
            { weeks: "6-8", focus: "Architecture & Deployment Validation" }
        ],
        learning_route: [
            {
                module_number: 1,
                module_title: `Foundations of ${goal}`,
                level: level,
                duration: "2 Weeks",
                concepts: ["Syntax Basics", "Core Paradigms", "Development Environment Setup", "Version Control", "Problem Solving Frameworks"],
                tools: [tools[0], tools[1], "Git"],
                videos: [
                    { title: `${goal} Full Crash Course (FreeCodeCamp)`, url: "https://www.youtube.com/@freecodecamp" },
                    { title: `Harvard CS50 / Stanford Fundamentals`, url: "https://www.youtube.com/@cs50" },
                    { title: `In-depth Tutorial on ${tools[0]}`, url: "https://www.youtube.com/results?search_query=" + tools[0] + "+tutorial" }
                ],
                practice_tasks: [
                    `Configure your primary local development environment with ${tools[0]}`,
                    `Push your first repository mapping out your learning pathway`,
                    `Complete basic algorithmic challenges utilizing core syntax`
                ],
                mini_project: `Build a CLI or rudimentary visual application incorporating your first toolchain.`
            },
            {
                module_number: 2,
                module_title: `Core Engineering & Architecture`,
                level: "Intermediate",
                duration: "3 Weeks",
                concepts: ["State Management", "Advanced Data Structures", "API Integration", "Security Hygiene", "Performance Profiling"],
                tools: [tools[2], tools[3], tools[0]],
                videos: [
                    { title: `Advanced Engineering Patterns (Traversy Media)`, url: "https://www.youtube.com/@TraversyMedia" },
                    { title: `Building Scalable Apps with ${tools[2]}`, url: "https://www.youtube.com/results?search_query=" + tools[2] + "+crash+course" },
                    { title: `Industry Standard Clean Code (Programming with Mosh)`, url: "https://www.youtube.com/@programmingwithmosh" }
                ],
                practice_tasks: [
                    `Refactor a legacy script into a robust, object-oriented or functional application`,
                    `Integrate external data flows using APIs or secure database connections`,
                    `Write your first suite of unit tests verifying functional logic`
                ],
                mini_project: `Develop a multi-layer application demonstrating authentication and state synchronization.`
            },
            {
                module_number: 3,
                module_title: `Advanced ${tools[0]} Workflows`,
                level: "Advanced",
                duration: "3 Weeks",
                concepts: [skills[0], skills[1], "Asynchronous Operations", "Memory Management", "Orchestration"],
                tools: [tools[4], tools[5], tools[1]],
                videos: [
                    { title: `The Advanced ${goal} Architect (Fireship)`, url: "https://www.youtube.com/@Fireship" },
                    { title: `System Design & Architecture (ByteByteGo)`, url: "https://www.youtube.com/@ByteByteGo" },
                    { title: `Deep Dive: ${skills[1]}`, url: "https://www.youtube.com/results?search_query=" + skills[1] }
                ],
                practice_tasks: [
                    `Implement an advanced capability (e.g., caching, neural networks, robust state)`,
                    `Analyze performance bottlenecks and resolve using concurrent architecture`,
                    `Establish a continuous integration pipeline`
                ],
                mini_project: `Produce a high-performance system serving multiple real-time operations securely.`
            },
            {
                module_number: 4,
                module_title: `Enterprise-Scale Practices`,
                level: "Expert",
                duration: "2 Weeks",
                concepts: [skills[2], skills[3], "Micro-optimizations", "Code Reviews", "System Auditing"],
                tools: tools.slice(0, 6),
                videos: [
                    { title: `Enterprise ${goal} Optimization Strategies`, url: "https://www.youtube.com/results?search_query=enterprise+" + goal },
                    { title: `Cloud Deployment & Scaling Masterclass`, url: "https://www.youtube.com/@freecodecamp" },
                    { title: `Real-world Developer Case Studies`, url: "https://www.youtube.com/@TechLead" }
                ],
                practice_tasks: [
                    `Execute a full structural audit on a previous project`,
                    `Deploy your application to a production-grade cloud ecosystem`,
                    `Document system architecture and deployment protocols`
                ],
                mini_project: `Launch a fully scaled, cloud-hosted platform complete with monitoring and logging.`
            },
            {
                module_number: 5,
                module_title: `Capstone & Market Readiness`,
                level: "Expert",
                duration: "2 Weeks",
                concepts: [skills[4], "Mock Interviews", "Portfolio Optimization", "Open Source Collaboration", "System Design Interviews"],
                tools: tools,
                videos: [
                    { title: `Cracking the Coding Interview / NeetCode`, url: "https://www.youtube.com/@NeetCode" },
                    { title: `Building an Outstanding Dev Portfolio`, url: "https://www.youtube.com/@KevinPowell" },
                    { title: `Tech Negotiation & Market Strategy`, url: "https://www.youtube.com/@ALifeEngineered" }
                ],
                practice_tasks: [
                    `Consolidate all projects into a professional showcase portfolio`,
                    `Complete 5 mock interviews focusing on System Design and behavioral alignment`,
                    `Contribute a meaningful PR to a major open source organization`
                ],
                mini_project: `Final Capstone: A production-ready, peer-reviewed application that functions as your main resume centerpiece.`
            }
        ]
    };
};
