import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Play, CheckCircle, RefreshCcw, ArrowLeft, Building2, ChevronRight, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useUserProfile } from '@/context/UserProfileContext';

const MOCK_SCENARIOS = [
    {
        id: 'technical-interview',
        title: 'Technical Interview',
        description: 'Mock a high-intensity technical system design or coding interview.',
        type: 'TECHNICAL',
        color: 'from-amber-500/20 to-yellow-600/10',
        border: 'border-amber-500/30',
        tagColor: 'text-amber-400'
    },
    {
        id: 'salary-negotiation',
        title: 'Salary Negotiation',
        description: 'Practice negotiating your salary after receiving an initial offer.',
        type: 'BEHAVIORAL',
        color: 'from-cyan-500/20 to-blue-600/10',
        border: 'border-cyan-500/30',
        tagColor: 'text-cyan-400'
    },
    {
        id: 'difficult-coworker',
        title: 'Handling a Difficult Co-worker',
        description: 'Navigate a scenario where a colleague consistently misses deadlines.',
        type: 'CONFLICT',
        color: 'from-rose-500/20 to-pink-600/10',
        border: 'border-rose-500/30',
        tagColor: 'text-rose-400'
    },
    {
        id: 'leadership-crisis',
        title: 'Leadership in Crisis',
        description: 'Lead your team through an unexpected major production outage.',
        type: 'LEADERSHIP',
        color: 'from-purple-500/20 to-violet-600/10',
        border: 'border-purple-500/30',
        tagColor: 'text-purple-400'
    }
];

const COMPANIES = [
    {
        id: 'google',
        name: 'Google',
        emoji: '🔵',
        culture: 'Data-driven, collaborative, and focused on psychological safety. Values structured thinking and "Googliness".',
        traits: ['Data-driven', 'Collaborative', 'Psychological Safety']
    },
    {
        id: 'amazon',
        name: 'Amazon',
        emoji: '🟠',
        culture: 'Leadership Principles-focused. Values ownership, bias for action, frugality, and customer obsession.',
        traits: ['Leadership Principles', 'Customer-first', 'Ownership']
    },
    {
        id: 'microsoft',
        name: 'Microsoft',
        emoji: '🔷',
        culture: 'Growth mindset culture. Emphasizes empathy, collaboration, inclusivity, and continuous learning.',
        traits: ['Growth Mindset', 'Empathy', 'Inclusive']
    },
    {
        id: 'startup',
        name: 'Startup / Early Stage',
        emoji: '🚀',
        culture: 'Fast-paced, scrappy, and autonomous. Values initiative, wear-many-hats attitude, and speed of execution.',
        traits: ['Autonomous', 'Fast-paced', 'Scrappy']
    },
    {
        id: 'meta',
        name: 'Meta',
        emoji: '🟣',
        culture: 'Move fast, be bold. Values impact, transparency, and building for the long term at massive scale.',
        traits: ['Move Fast', 'Bold Bets', 'Scale']
    },
    {
        id: 'general',
        name: 'General / Any Company',
        emoji: '🌐',
        culture: 'Universal best practices for professional communication and career advancement.',
        traits: ['Universal', 'Adaptable', 'Professional']
    }
];

export default function ScenarioSimulator() {
    const { profile } = useUserProfile();
    const [step, setStep] = useState('select-scenario'); // 'select-scenario' | 'select-company' | 'chat'
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [activeScenario, setActiveScenario] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [customCompany, setCustomCompany] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSelectScenario = (scenario) => {
        setSelectedScenario(scenario);
        setStep('select-company');
    };

    const handleCustomCompanyStart = () => {
        if (!customCompany.trim()) return;
        handleStartScenario({
            id: 'custom',
            name: customCompany,
            emoji: '🏢',
            culture: `A custom professional culture for ${customCompany}.`,
            traits: ['Target Company']
        });
    };

    const handleStartScenario = async (company) => {
        setSelectedCompany(company);
        setStep('chat');
        setIsTyping(true);
        setActiveScenario(selectedScenario);
        setMessages([{
            role: 'system',
            content: `Initializing ${company.name} Style Simulation: ${selectedScenario.title}`
        }]);

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/api/scenario-simulation',
                {
                    scenarioType: selectedScenario.title,
                    targetRole: profile?.careerGoal || 'Professional',
                    company: company.name
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                setMessages([
                    { role: 'system', content: `${company.emoji} ${company.name} Simulation — ${data.data.title}` },
                    { role: 'ai', content: `${data.data.context}\n\n${data.data.challenge}` }
                ]);
            }
        } catch (error) {
            console.error("Failed to start scenario", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "Connection to the AI simulator failed. Please try again."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleReset = () => {
        setStep('select-scenario');
        setSelectedScenario(null);
        setSelectedCompany(null);
        setActiveScenario(null);
        setMessages([]);
        setInputMessage('');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg = { role: 'user', content: inputMessage };
        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const token = localStorage.getItem('token');
            const scenarioTitle = activeScenario?.title || '';
            let persona = 'The Technical Lead';
            if (scenarioTitle.includes('Salary') || scenarioTitle.includes('Counter-Offer')) persona = 'The Hiring Manager';
            if (scenarioTitle.includes('Difficult') || scenarioTitle.includes('Interpersonal') || scenarioTitle.includes('Conflict')) persona = 'The HR Manager';
            if (scenarioTitle.includes('Leadership') || scenarioTitle.includes('Crisis')) persona = 'The Executive Stakeholder';

            const { data } = await axios.post('/api/ai-coach',
                {
                    message: userMsg.content,
                    persona,
                    chatHistory: messages,
                    company: selectedCompany?.name || 'General',
                    companyCulture: selectedCompany?.culture || ''
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                setMessages(prev => [...prev, { role: 'ai', content: data.data.reply }]);
            }
        } catch (error) {
            console.error("AI Coach error", error);
            setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble processing that right now." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const isSimulationComplete = messages.length > 0 && messages[messages.length - 1].content.includes('[Simulation Complete]');

    // ── STEP 1: Select Scenario ──────────────────────────────────────────────
    if (step === 'select-scenario') {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        Career Scenario Simulator
                    </h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">
                        Choose a high-stakes scenario to practice. You&apos;ll then select a target company so the AI replicates their culture and interview style.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                    {MOCK_SCENARIOS.map((scenario) => (
                        <motion.button
                            key={scenario.id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectScenario(scenario)}
                            className={`bg-gradient-to-br ${scenario.color} border ${scenario.border} rounded-xl p-6 text-left group relative overflow-hidden transition-all`}
                        >
                            <div className="space-y-4">
                                <div className={`w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center ${scenario.tagColor}`}>
                                    <Play className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-white mb-1">{scenario.title}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">{scenario.description}</p>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                    <span className={`text-[10px] font-semibold uppercase tracking-widest ${scenario.tagColor}`}>{scenario.type}</span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Select <ChevronRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    // ── STEP 2: Select Company ───────────────────────────────────────────────
    if (step === 'select-company') {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStep('select-scenario')} className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">Step 2 of 2</p>
                        <h2 className="text-xl font-light text-white">
                            Choose Target Company for <span className="text-cyan-400">{selectedScenario?.title}</span>
                        </h2>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-slate-400 text-sm">
                        Select a major tech company to practice their specific culture, or type any company name below.
                    </p>
                    
                    {/* Custom Company Input */}
                    <div className="relative group max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Type any company name (e.g. Netflix, Flipkart, TCS)..."
                            value={customCompany}
                            onChange={(e) => setCustomCompany(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCustomCompanyStart()}
                            className="block w-full pl-10 pr-12 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        />
                        <button
                            onClick={handleCustomCompanyStart}
                            disabled={!customCompany.trim()}
                            className="absolute inset-y-1.5 right-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                        >
                            Start <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {COMPANIES.map((company) => (
                        <motion.button
                            key={company.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStartScenario(company)}
                            className="bg-slate-900/60 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-xl p-5 text-left transition-all group"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">{company.emoji}</span>
                                <div>
                                    <h3 className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{company.name}</h3>
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {company.traits.map(t => (
                                            <span key={t} className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{company.culture}</p>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    // ── STEP 3: Chat Interface ───────────────────────────────────────────────
    return (
        <div className="max-w-4xl mx-auto bg-[#0a0f1e] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[700px] shadow-2xl shadow-purple-900/20">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={handleReset} className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-base">{selectedCompany?.emoji}</span>
                            <h3 className="text-sm font-medium text-white">{activeScenario?.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <p className="text-[10px] text-emerald-400 uppercase tracking-widest">
                                {selectedCompany?.name} Style Simulation Active
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700">
                        <Building2 className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] text-slate-400">{selectedCompany?.name}</span>
                    </div>
                    <button
                        onClick={handleReset}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors flex items-center gap-1.5"
                    >
                        <RefreshCcw className="w-3.5 h-3.5" /> End
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
                        >
                            {msg.role === 'system' ? (
                                <div className="bg-indigo-500/10 text-indigo-300 text-[10px] px-4 py-1.5 rounded-full border border-indigo-500/20 uppercase tracking-widest">
                                    {msg.content}
                                </div>
                            ) : (
                                <div className={`flex gap-3 max-w-[82%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border text-sm ${msg.role === 'user'
                                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                                        : 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                                    }`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-cyan-600/80 text-white rounded-tr-sm'
                                        : 'bg-slate-800 text-gray-200 rounded-tl-sm border border-slate-700'
                                    }`}>
                                        {msg.content.replace(' [Simulation Complete]', '')}
                                        {msg.content.includes('[Simulation Complete]') && (
                                            <span className="inline-flex items-center gap-1.5 ml-2 text-green-400 text-xs font-medium">
                                                <CheckCircle className="w-4 h-4" /> Complete
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-slate-800 border border-slate-700 rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80">
                {isSimulationComplete ? (
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <span className="text-sm text-green-300 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Simulation complete! Well done.
                        </span>
                        <button onClick={handleReset} className="text-xs px-4 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                            Try Another
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            disabled={isTyping}
                            placeholder="Type your response..."
                            className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50 placeholder:text-slate-600"
                        />
                        <button
                            type="submit"
                            disabled={isTyping || !inputMessage.trim()}
                            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
