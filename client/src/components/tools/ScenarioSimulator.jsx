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
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="text-left space-y-1">
                    <h2 className="text-sm  font-bold st text-white/10 italic">Simulation Pipeline</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                    {MOCK_SCENARIOS.map((scenario) => (
                        <motion.button
                            key={scenario.id}
                            whileHover={{ scale: 1.01, y: -1 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSelectScenario(scenario)}
                            className={`bg-white/[0.01] border ${scenario.border.split(' ')[0]} border-white/5 rounded-lg p-3 text-left group relative overflow-hidden transition-all shadow-xl`}
                        >
                            <div className="space-y-3">
                                <div className={`w-7 h-7 rounded-md bg-black/30 flex items-center justify-center ${scenario.tagColor}`}>
                                    <Play className="w-2.5 h-2.5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors  ">{scenario.title}</h3>
                                    <p className="text-sm text-white/70 leading-normal font-medium  st line-clamp-2 mt-1 italic">{scenario.description}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className={`text-sm font-bold  st ${scenario.tagColor} border border-white/5 px-1.5 py-0.5 rounded-md`}>{scenario.type}</span>
                                    <span className="text-sm text-white/60 flex items-center gap-1 group-hover:translate-x-1 transition-transform group-hover:text-white">
                                        Sync <ChevronRight className="w-2.5 h-2.5" />
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
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => setStep('select-scenario')} className="text-white/70 hover:text-white transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <div>
                        <p className="text-sm text-white/10  font-bold st">Phase 02/02</p>
                        <h2 className="text-sm font-bold text-white/70  st italic">
                            Target Ecosystem: <span className="text-cyan-400/40">{selectedScenario?.title}</span>
                        </h2>
                    </div>
                </div>

                <div className="space-y-2">
                    {/* Custom Company Input */}
                    <div className="relative group max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <Building2 className="h-3.5 w-3.5 text-white/10 group-focus-within:text-cyan-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Custom Organization Mapping..."
                            value={customCompany}
                            onChange={(e) => setCustomCompany(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCustomCompanyStart()}
                            className="block w-full pl-8 pr-20 py-2 bg-white/[0.01] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-white/60"
                        />
                        <button
                            onClick={handleCustomCompanyStart}
                            disabled={!customCompany.trim()}
                            className="absolute inset-y-1 right-1 px-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 disabled:bg-white/5 disabled:text-white/10 text-cyan-400 rounded text-sm font-bold  st transition-all flex items-center gap-1 border border-cyan-500/20 shadow-xl"
                        >
                            Sync <ChevronRight className="h-2.5 w-2.5" />
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                    {COMPANIES.map((company) => (
                        <motion.button
                            key={company.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleStartScenario(company)}
                            className="bg-white/[0.01] border border-white/5 hover:border-cyan-500/10 hover:bg-cyan-500/[0.02] rounded-lg p-3 text-left transition-all group shadow-xl"
                        >
                            <div className="flex items-start gap-2.5 mb-2">
                                <span className="text-lg opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">{company.emoji}</span>
                                <div>
                                    <h3 className="text-sm font-bold text-white/70 group-hover:text-cyan-400 transition-colors  ">{company.name}</h3>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {company.traits.map(t => (
                                            <span key={t} className="text-sm px-1.5 py-0.5 bg-white/5 text-white/10 rounded  font-bold ">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-white/10 leading-tight line-clamp-2  font-bold font-medium italic st">{company.culture}</p>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    // ── STEP 3: Chat Interface ───────────────────────────────────────────────
    return (
        <div className="max-w-4xl mx-auto bg-white/[0.01] border border-white/5 rounded-lg overflow-hidden flex flex-col h-[520px] shadow-2xl backdrop-blur-3xl">
            {/* Chat Header */}
            <div className="p-3 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={handleReset} className="text-white/70 hover:text-white transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm opacity-40">{selectedCompany?.emoji}</span>
                            <h3 className="text-sm font-bold text-white/70  ">{activeScenario?.title}</h3>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse opacity-50" />
                            <p className="text-sm text-emerald-500/40  font-bold st">
                                {selectedCompany?.name} ACTIVE SIMULATION
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded border border-white/5 text-white/10">
                        <Building2 className="w-2.5 h-2.5 text--400" />
                        <span className="text-sm  font-bold st">{selectedCompany?.name}</span>
                    </div>
                    <button
                        onClick={handleReset}
                        className="text-sm font-bold  st px-2 py-0.5 bg-red-500/5 hover:bg-red-500/10 text-red-500/40 rounded transition-all border border-red-500/10"
                    >
                        Terminate
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
                        >
                            {msg.role === 'system' ? (
                                <div className="bg-white/5 border border-white/5 text-white/10 text-sm px-2 py-0.5 rounded-full  font-bold st">
                                    {msg.content}
                                </div>
                            ) : (
                                <div className={`flex gap-2.5 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border text-sm ${msg.role === 'user'
                                        ? 'bg-cyan-500/5 border-cyan-500/10 text-cyan-500/30'
                                        : 'bg-indigo-500/5 border-indigo-500/10 text-indigo-500/30'
                                    }`}>
                                        {msg.role === 'user' ? <User className="w-2.5 h-2.5" /> : <Bot className="w-2.5 h-2.5" />}
                                    </div>
                                    <div className={`rounded-lg px-2.5 py-1.5 text-sm md:text-sm leading-relaxed font-medium ${msg.role === 'user'
                                        ? 'bg-cyan-500/[0.03] border border-cyan-500/10 text-white/70'
                                        : 'bg-white/[0.01] text-white/70 border border-white/5 italic'
                                    }`}>
                                        {msg.content.replace(' [Simulation Complete]', '')}
                                        {msg.content.includes('[Simulation Complete]') && (
                                            <span className="inline-flex items-center gap-1 ml-1.5 text-emerald-500/40 text-sm font-bold  st">
                                                <CheckCircle className="w-2.5 h-2.5" /> Complete
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex gap-2.5 max-w-[80%]">
                                <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <Bot className="w-3 h-3" />
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-lg px-3 py-2 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* InputArea */}
            <div className="p-3 border-t border-white/5 bg-white/[0.01]">
                {isSimulationComplete ? (
                    <div className="flex items-center justify-between p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                        <span className="text-sm text-emerald-500/40 font-bold  st flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" /> Simulation Protocol Complete.
                        </span>
                        <button onClick={handleReset} className="text-sm font-bold  st px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500/60 rounded hover:bg-emerald-500/20 transition-colors">
                            Next Scenario
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            disabled={isTyping}
                            placeholder="Input Simulation Response..."
                            className="flex-1 bg-black/40 border border-white/5 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/30 transition-all disabled:opacity-50 placeholder:text-white/60"
                        />
                        <button
                            type="submit"
                            disabled={isTyping || !inputMessage.trim()}
                            className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 px-4 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center border border-cyan-500/20 shadow-xl"
                        >
                            <Send className="w-3 h-3" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
