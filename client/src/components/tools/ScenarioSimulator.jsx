import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Play, CheckCircle, RefreshCcw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_SCENARIOS = [
    {
        id: 'salary-negotiation',
        title: 'Salary Negotiation',
        description: 'Practice negotiating your salary after receiving an initial offer.',
        initialPrompt: "Congratulations! We'd like to offer you the Senior Developer role with a starting salary of $110,000. How does that sound to you?",
        type: 'behavioral'
    },
    {
        id: 'difficult-coworker',
        title: 'Handling a Difficult Co-worker',
        description: 'Navigate a scenario where a colleague consistently misses deadlines.',
        initialPrompt: "Hey, I know I'm late with my part of the project again. I've just been so swamped. Can you cover for me this one last time?",
        type: 'conflict'
    },
    {
        id: 'leadership-crisis',
        title: 'Leadership in Crisis',
        description: 'Lead your team through an unexpected major production outage.',
        initialPrompt: "URGENT: The main database has gone down and customer transactions are failing. You're the lead on call. What's your first move?",
        type: 'leadership'
    }
];

// Mock AI responses based on keywords or general flow
const generateMockResponse = (input, scenarioId, interactionCount) => {
    const lowerInput = input.toLowerCase();

    if (scenarioId === 'salary-negotiation') {
        if (interactionCount === 1) {
            if (lowerInput.includes('more') || lowerInput.includes('higher') || lowerInput.includes('compete') || lowerInput.includes('expect')) {
                return "We have a little flexibility in our budget. What number did you have in mind based on your experience?";
            }
            return "I hear you. We think $110k is a very competitive offer for this market. Are you open to discussing other benefits if the base salary is fixed?";
        } else if (interactionCount === 2) {
            return "That's a fair point. Let me take that back to the team, but if we can meet you halfway at $115k, would you be ready to sign today?";
        } else {
            return "Great discussion. This demonstrates good negotiation skills! [Simulation Complete]";
        }
    }

    if (scenarioId === 'difficult-coworker') {
        if (interactionCount === 1) {
            if (lowerInput.includes('no') || lowerInput.includes("can't") || lowerInput.includes('help')) {
                return "I understand you're busy too. But if we don't finish this, it looks bad on both of us. Are you sure you can't help me out?";
            }
            return "Thanks so much, I promise this is the last time. I owe you one!";
        } else {
            return "Setting boundaries is hard but important! [Simulation Complete]";
        }
    }

    if (interactionCount > 3) {
        return "Excellent leadership displayed here. You prioritized communication and rapid response! [Simulation Complete]";
    }

    return "That's an interesting approach. How would you handle the immediate pushback from your team on that decision?";
};


export default function ScenarioSimulator() {
    const [activeScenario, setActiveScenario] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleStartScenario = (scenario) => {
        setActiveScenario(scenario);
        setMessages([
            { role: 'system', content: `Starting Scenario: ${scenario.title}` },
            { role: 'ai', content: scenario.initialPrompt }
        ]);
    };

    const handleEndScenario = () => {
        setActiveScenario(null);
        setMessages([]);
        setInputMessage('');
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg = { role: 'user', content: inputMessage };
        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsTyping(true);

        // Filter user messages to count interactions for mock logic
        const userInteractionCount = messages.filter(m => m.role === 'user').length + 1;

        // Simulate network delay for AI response
        setTimeout(() => {
            const aiResponseText = generateMockResponse(userMsg.content, activeScenario.id, userInteractionCount);
            setMessages(prev => [...prev, { role: 'ai', content: aiResponseText }]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1000); // 1.5s to 2.5s delay
    };

    if (!activeScenario) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl  text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        Career Scenario Simulator
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Choose a high-stakes scenario below and roleplay your responses with our behavioral AI. Practice makes perfect when it comes to vital career conversations.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_SCENARIOS.map((scenario) => (
                        <motion.div
                            key={scenario.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 relative overflow-hidden group cursor-pointer"
                            onClick={() => handleStartScenario(scenario)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-center text-cyan-400">
                                    <Play className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl  text-white mb-2">{scenario.title}</h3>
                                    <p className="text-sm text-slate-300">{scenario.description}</p>
                                </div>
                                <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                                    <span className="text-xs  text-purple-400 uppercase tracking-wider">{scenario.type}</span>
                                    <span className="text-sm text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Start <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    const isSimulationComplete = messages.length > 0 && messages[messages.length - 1].content.includes('[Simulation Complete]');

    return (
        <div className="max-w-4xl mx-auto bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[700px] shadow-2xl shadow-purple-900/20">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleEndScenario}
                        className="text-slate-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h3 className="text-lg  text-white">{activeScenario.title}</h3>
                        <p className="text-xs text-cyan-400">AI Simulator Active</p>
                    </div>
                </div>
                <button
                    onClick={handleEndScenario}
                    className="text-sm px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors flex items-center gap-2"
                >
                    <RefreshCcw className="w-4 h-4" /> End
                </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
                        >
                            {msg.role === 'system' ? (
                                <div className="bg-purple-500/10 text-purple-300 text-xs px-4 py-1.5 rounded-full border border-purple-500/20">
                                    {msg.content}
                                </div>
                            ) : (
                                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${msg.role === 'user'
                                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                                            : 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                                        }`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={`rounded-xl px-4 py-3 text-sm flex items-center ${msg.role === 'user'
                                            ? 'bg-cyan-600 text-white rounded-tr-sm'
                                            : 'bg-slate-800 text-gray-200 rounded-tl-sm border border-slate-700'
                                        }`}>
                                        {msg.content.replace(' [Simulation Complete]', '')}
                                        {msg.content.includes('[Simulation Complete]') && (
                                            <CheckCircle className="w-5 h-5 text-green-400 ml-3 inline" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="flex gap-3 max-w-[80%] flex-row">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-slate-800 border border-slate-700 rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={isSimulationComplete || isTyping}
                        placeholder={isSimulationComplete ? "Simulation completed." : "Type your response..."}
                        className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isSimulationComplete || isTyping || !inputMessage.trim()}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white p-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
