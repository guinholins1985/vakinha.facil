

import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- START: TOAST NOTIFICATION SYSTEM ---
interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    };
    
    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const toastConfig = {
        success: { bg: 'bg-emerald-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        error: { bg: 'bg-red-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        info: { bg: 'bg-sky-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] space-y-3">
                {toasts.map(toast => (
                    <div key={toast.id} className={`flex items-center px-4 py-3 rounded-lg shadow-2xl text-white animate-toast-in ${toastConfig[toast.type].bg}`}>
                        <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           {toastConfig[toast.type].icon}
                        </svg>
                        <span className="font-medium">{toast.message}</span>
                    </div>
                ))}
            </div>
             <style>{`
                @keyframes toast-in {
                    from { transform: translateX(calc(100% + 1.5rem)); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-toast-in { animation: toast-in 0.5s cubic-bezier(0.21, 1.02, 0.73, 1) forwards; }
            `}</style>
        </ToastContext.Provider>
    );
};

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
// --- END: TOAST NOTIFICATION SYSTEM ---

// --- START: AI CHATBOT ---
const AiChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContentRef = useRef<HTMLDivElement>(null);
    const { addToast } = useToast();
    const aiRef = useRef<GoogleGenAI | null>(null);

    useEffect(() => {
        if (isOpen && !aiRef.current) {
            try {
                aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                setMessages([{ role: 'model', text: 'Olá! Sou o assistente virtual do Vakinha Fácil. Como posso ajudar?' }]);
            } catch (error) {
                console.error("Erro ao inicializar a API Gemini:", error);
                addToast("Não foi possível conectar ao assistente.", 'error');
                setIsOpen(false);
            }
        }
    }, [isOpen, addToast]);

    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!aiRef.current) throw new Error("AI client not initialized.");
            
            const chat = aiRef.current.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "Você é um assistente de suporte amigável e especialista na plataforma 'Vakinha Fácil', uma solução completa para vaquinhas online no Brasil. Sua missão é responder a todas as perguntas sobre a plataforma, detalhando funcionalidades (dashboard, gestão de usuários, finanças, white-label, suporte), planos de preços (Básico, Premium, White-Label), segurança e o funcionamento geral. Utilize as informações da documentação e da landing page para fornecer respostas precisas, claras e concisas em português do Brasil. Seja proativo ao explicar os benefícios de automação, transparência e segurança. Se não souber a resposta, diga que vai encaminhar para um especialista. Mantenha um tom profissional e cordial.",
                },
                history: messages.map(m => ({
                    role: m.role,
                    parts: [{ text: m.text }]
                })),
            });

            const response = await chat.sendMessage({ message: input });

            const aiMessage = { role: 'model' as const, text: response.text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Erro ao gerar conteúdo:", error);
            addToast("Ocorreu um erro ao buscar a resposta.", 'error');
            setMessages(prev => prev.filter(m => m !== userMessage));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 z-50"
                aria-label="Abrir chat de ajuda"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.897 5.515 5 6.934V22l5.34-4.005C17.697 17.852 22 14.481 22 10c0-4.411-4.486-8-10-8zm-2.5 9.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm5 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z"></path></svg>
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col z-40 animate-toast-in">
                    <header className="bg-emerald-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <h3 className="font-bold text-lg">Assistente Virtual</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-75 text-2xl font-bold">&times;</button>
                    </header>
                    <div ref={chatContentRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                                    <div className="flex items-center space-x-1">
                                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Digite sua dúvida..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                disabled={isLoading}
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 disabled:bg-gray-400" disabled={isLoading || !input.trim()}>
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};
// --- END: AI CHATBOT ---


const LogoIcon = () => (
    <svg className="w-9 h-9 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const Header = ({ userType, onGroupAdminLogin, onSystemAdminLogin, onLogout }: { userType: string | null, onGroupAdminLogin: () => void, onSystemAdminLogin: () => void, onLogout: () => void }) => (
    <header className="absolute top-0 left-0 right-0 z-20 bg-slate-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
            <nav className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <LogoIcon />
                    <span className="text-2xl font-bold text-gray-800 tracking-tight font-heading">Vakinha Fácil</span>
                </div>
                <div className="flex items-center space-x-4">
                    {userType ? (
                        <>
                             <span className="hidden sm:inline text-gray-600 font-medium">
                                {userType === 'groupAdmin' ? 'Painel do Gestor' : 'Painel do Sistema'}
                             </span>
                             <button onClick={onLogout} className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Sair</button>
                        </>
                    ) : (
                         <>
                            <button onClick={onSystemAdminLogin} className="text-sm text-gray-500 hover:text-emerald-600 font-medium transition-colors">Admin do Sistema</button>
                            <button onClick={onGroupAdminLogin} className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Entrar</button>
                            <button className="hidden sm:inline-block bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105">
                                Criar Vaquinha
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </div>
    </header>
);

const LandingPage = () => (
    <>
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <UseCasesSection />
        <TestimonialsSection />
        <SecuritySection />
        <PricingSection />
        <FinalCTASection />
        <Footer />
    </>
);

const HeroSection = () => (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-28">
         <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#d5f5e3,transparent)]"></div>
        </div>
        <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tighter font-heading">
                        Junte dinheiro em grupo sem estresse. <span className="text-emerald-600">Tudo automatizado!</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl mx-auto lg:mx-0">
                        Crie vaquinhas coletivas em 3 passos, convide participantes e acompanhe tudo em tempo real. Sem planilhas, sem dor de cabeça.
                    </p>
                    <button className="inline-block bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 duration-300 ease-in-out">
                        Comece agora – Grátis por 7 dias
                    </button>
                </div>
                
                <div className="relative flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-lg">
                        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                        <div className="relative">
                           <img
                                src="https://i.imgur.com/gC514Jq.png"
                                alt="Dashboard do App Vakinha Fácil"
                                className="rounded-2xl shadow-2xl w-full h-auto border-4 border-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
    </section>
);

// FIX: Made children optional to resolve widespread TypeScript errors.
interface SectionProps {
    children?: React.ReactNode;
}
const SectionTitle: React.FC<SectionProps> = ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 font-heading">{children}</h2>
);

const SectionSubtitle: React.FC<SectionProps> = ({ children }) => (
    <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">{children}</p>
);

const BenefitsSection = () => {
    const benefits = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.69-3.182-3.182a8.25 8.25 0 0 0-11.667 0l-3.181 3.182m0 0h-4.992v4.992h4.992v-4.992Z" /></svg>,
            title: "Automatizado",
            description: "Cobranças, lembretes e distribuições feitos automaticamente."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-4.43a1.012 1.012 0 0 1 1.433 0l4.43 4.43a1.012 1.012 0 0 1 0 .639l-4.43 4.43a1.012 1.012 0 0 1-1.433 0l-4.43-4.43Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-4.43a1.012 1.012 0 0 1 1.433 0l4.43 4.43a1.012 1.012 0 0 1 0 .639l-4.43 4.43a1.012 1.012 0 0 1-1.433 0l-4.43-4.43Z" /></svg>,
            title: "Transparente",
            description: "Todos veem quem pagou e quando. Sem desconfiança."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" /></svg>,
            title: "Seguro",
            description: "Validação de CPF e pagamentos via Mercado Pago/PicPay."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>,
            title: "Flexível",
            description: "Use para viagens, presentes, poupança ou qualquer objetivo."
        }
    ];

    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto px-6">
                <SectionTitle>Por que Vakinha Fácil?</SectionTitle>
                <SectionSubtitle>Tudo que você precisa para organizar suas finanças em grupo, sem complicação.</SectionSubtitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-5">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 font-heading">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HowItWorksSection = () => {
    const steps = [
        { title: "Crie sua vaquinha", description: "Defina valor, prazo e participantes." },
        { title: "Convide seus amigos", description: "Via WhatsApp, e-mail ou link." },
        { title: "Acompanhe tudo", description: "Dashboard em tempo real." },
        { title: "Receba o dinheiro", description: "Distribuição automática." },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle>Como Funciona</SectionTitle>
                <SectionSubtitle>Em poucos passos, sua vaquinha está no ar e pronta para arrecadar.</SectionSubtitle>
                <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
                    <div className="grid md:grid-cols-4 gap-16 relative">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-emerald-500 text-emerald-600 rounded-full text-2xl font-bold mb-4 z-10 relative font-heading">{index + 1}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 font-heading">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const UseCasesSection = () => {
    const useCases = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
            title: "Viagens em Grupo",
            description: "Junte dinheiro para aquela viagem dos sonhos com os amigos, sem estresse e com total transparência."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A3.375 3.375 0 0 0 12 1.5v3.375m0 0c-1.353 0-2.656.32-3.865.901M12 4.875c1.353 0 2.656.32 3.865.901M12 4.875v1.125m-3.865.901a3.375 3.375 0 0 0-2.267 4.996m2.267-4.996c.024.012.047.025.07.038m-2.267 4.996a3.375 3.375 0 0 1 2.267 4.996m0 0a3.375 3.375 0 0 0 3.79-1.85m-3.79 1.85a3.375 3.375 0 0 1 3.79 1.85M9.135 18.091c.143-.243.27-.497.387-.762m-.387.762a3.375 3.375 0 0 0-3.238-1.42M12 18.091c-.117-.265-.244-.519-.387-.762m.387.762a3.375 3.375 0 0 1 3.238-1.42m-6.476 1.42a3.375 3.375 0 0 1-3.238-1.42m6.476 1.42a3.375 3.375 0 0 0 3.238-1.42m-3.238-1.42c-.024-.012-.047-.025-.07-.038M12 15.375a3.375 3.375 0 0 0-2.267-4.996m2.267 4.996c-.024-.012-.047-.025-.07-.038m2.267-4.996a3.375 3.375 0 0 1 2.267-4.996m0 0c.024.012.047.025.07.038m2.267-4.996a3.375 3.375 0 0 0-2.267-4.996" /></svg>,
            title: "Eventos e Presentes",
            description: "Organize formaturas, festas ou a compra daquele presente de casamento de forma simples e organizada."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 0 9 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 12.75-2.625-2.625M3.75 12.75 1.125 15.375M21 12.75v5.25a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25v-5.25M3.75 12.75c0-3.314 2.686-6 6-6s6 2.686 6 6M4.5 6.75a3.75 3.75 0 0 1 7.5 0m7.5 0a3.75 3.75 0 0 0-7.5 0" /></svg>,
            title: "Times e Clubes",
            description: "Gerencie mensalidades, compre uniformes e pague campeonatos do seu time ou clube sem dor de cabeça."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5M5.25 6h13.5m-13.5 0V21m13.5 0V6m0 0V4.5m-13.5 0V3m0 1.5v-1.5m13.5 0v1.5m-10.5-1.5h7.5" /></svg>,
            title: "Condomínios",
            description: "Arrecade fundos para melhorias, reformas ou o fundo de reserva do seu condomínio de forma transparente."
        }
    ];

    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto px-6">
                <SectionTitle>Perfeito para todos os tipos de grupos</SectionTitle>
                <SectionSubtitle>Desde o churrasco de fim de ano até a compra de um presente coletivo, o Vakinha Fácil simplifica qualquer arrecadação.</SectionSubtitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {useCases.map((useCase, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-5">
                                {useCase.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 font-heading">{useCase.title}</h3>
                            <p className="text-gray-600">{useCase.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "Com o Vakinha Fácil, juntamos R$ 5.000 para nossa viagem em 3 meses! Foi incrível ver tudo funcionando no automático.",
            name: "Maria, SP",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
        },
        {
            quote: "Nunca foi tão fácil gerenciar as finanças do nosso time de futebol. Acabou a desconfiança e a inadimplência. Recomendo!",
            name: "Carlos, RJ",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e"
        }
    ];

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6">
                <SectionTitle>O que nossos usuários dizem</SectionTitle>
                <SectionSubtitle>Histórias de sucesso de quem já confia na nossa plataforma.</SectionSubtitle>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-slate-50 p-8 rounded-xl shadow-lg">
                            <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                            <div className="flex items-center">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="font-bold text-gray-800 font-heading">{testimonial.name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const SecuritySection = () => {
    const securityFeatures = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" /></svg>,
            title: "Validação de CPF",
            description: "Integração com Serasa Experian ou Receita Federal para garantir a identidade dos participantes."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
            title: "Criptografia",
            description: "Dados sensíveis protegidos com SSL/TLS e AES-256, os mesmos padrões de segurança de grandes bancos."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C6.095 4.01 5.25 4.973 5.25 6.108V18.25c0 1.243.87 2.25 1.969 2.25H18A2.25 2.25 0 0 0 20.25 18.25v-1.171c0-.621-.504-1.125-1.125-1.125H9.75l-3-3m0 0h3.75" /></svg>,
            title: "Conformidade com a LGPD",
            description: "Plataforma 100% conforme com a Lei Geral de Proteção de Dados, garantindo sua privacidade."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>,
            title: "Backup Automático",
            description: "Dados salvos diariamente e de forma segura na nuvem da AWS S3 para que nada seja perdido."
        }
    ];

    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto px-6">
                <SectionTitle>Segurança e Conformidade</SectionTitle>
                <SectionSubtitle>Utilizamos as melhores práticas e tecnologias para garantir que seus dados e transações estejam sempre protegidos.</SectionSubtitle>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-12 max-w-4xl mx-auto">
                    {securityFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 text-emerald-600">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1 font-heading">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const PricingSection = () => {
     const plans = [
        {
            name: "Básico",
            price: "Grátis",
            description: "Ideal para vaquinhas pontuais e grupos pequenos.",
            features: ["1 vaquinha ativa por vez", "Até 20 participantes", "Taxa de 5% sobre o valor arrecadado"],
            cta: "Começar Agora",
            primary: false,
        },
        {
            name: "Premium",
            price: "R$ 19,90",
            period: "/mês",
            description: "Perfeito para gestores de grupos recorrentes.",
            features: ["Vaquinhas ilimitadas", "Participantes ilimitados", "Taxas de 3% sobre o valor", "Suporte prioritário"],
            cta: "Experimente Grátis",
            primary: true,
        },
        {
            name: "White-Label",
            price: "R$ 300",
             period: "/mês",
            description: "Use nossa plataforma com a sua própria marca.",
            features: ["Plataforma personalizada", "Domínio próprio", "Seu próprio modelo de negócio", "Suporte dedicado"],
            cta: "Saiba Mais",
            primary: false,
        },
    ];
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle>Planos flexíveis para cada necessidade</SectionTitle>
                <SectionSubtitle>Comece de graça e evolua conforme seu grupo cresce. Sem burocracia, sem surpresas.</SectionSubtitle>
                <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
                    {plans.map((plan, index) => (
                        <div key={index} className={`rounded-2xl p-8 border ${plan.primary ? 'bg-gray-900 text-white border-emerald-500 shadow-2xl scale-105' : 'bg-slate-50 border-gray-200'}`}>
                            <h3 className={`text-2xl font-bold font-heading ${plan.primary ? 'text-emerald-400' : 'text-emerald-600'}`}>{plan.name}</h3>
                            <p className={`mt-2 mb-6 ${plan.primary ? 'text-gray-300' : 'text-gray-600'}`}>{plan.description}</p>
                            <p className="text-5xl font-extrabold font-heading mb-1">
                                {plan.price}
                                {plan.period && <span className="text-lg font-medium">{plan.period}</span>}
                            </p>
                            <ul className="mt-8 space-y-4">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center space-x-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 flex-shrink-0 ${plan.primary ? 'text-emerald-400' : 'text-emerald-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full mt-10 font-bold py-3 rounded-lg transition-colors duration-300 ${plan.primary ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-white hover:bg-gray-100 text-emerald-600 border border-gray-200'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FinalCTASection = () => (
    <section className="py-20 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 font-heading">Pronto para começar?</h2>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
                Crie sua primeira vaquinha em menos de 5 minutos e descubra como é fácil organizar as finanças do seu grupo.
            </p>
            <button className="bg-white text-emerald-600 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300 ease-in-out">
                Criar minha vaquinha grátis
            </button>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <LogoIcon />
                        <span className="text-2xl font-bold text-white tracking-tight font-heading">Vakinha Fácil</span>
                    </div>
                    <p>Automatize vaquinhas coletivas em 3 cliques. Transparente, seguro e sem burocracia.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 font-heading">Links Rápidos</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-emerald-400 transition-colors">Funcionalidades</a></li>
                        <li><a href="#" className="hover:text-emerald-400 transition-colors">Preços</a></li>
                        <li><a href="#" className="hover:text-emerald-400 transition-colors">Suporte</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 font-heading">Legal</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-emerald-400 transition-colors">Termos de Uso</a></li>
                        <li><a href="#" className="hover:text-emerald-400 transition-colors">Política de Privacidade</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Vakinha Fácil. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
);

// --- START: GROUP ADMIN DASHBOARD ---
const GroupAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Resumo');
    const tabs = ['Resumo', 'Participantes', 'Pagamentos', 'Convites', 'Mensagens', 'Relatórios', 'Configurações'];
    const mockData = {
        name: "Viagem para Bahia",
        goal: 10000,
        raised: 7500,
        participants: [
            { id: 1, name: "João Silva", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a", status: "Pago", amount: 500 },
            { id: 2, name: "Maria Oliveira", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b", status: "Atrasado", amount: 0 },
            { id: 3, name: "Carlos Souza", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c", status: "Pago", amount: 500 },
            { id: 4, name: "Ana Pereira", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", status: "Pendente", amount: 0 },
            { id: 5, name: "Lucas Costa", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e", status: "Pago", amount: 500 },
        ],
        payments: [
            { id: 1, name: 'João Silva', date: '2024-07-15', amount: 500, method: 'Pix' },
            { id: 2, name: 'Carlos Souza', date: '2024-07-14', amount: 500, method: 'Cartão' },
            { id: 3, name: 'Lucas Costa', date: '2024-07-12', amount: 500, method: 'Boleto' },
        ],
        messages: [
            { id: 1, subject: "Lembrete de Pagamento", date: "2024-07-10", content: "Olá pessoal, passando para lembrar que o prazo para o pagamento da nossa vaquinha se encerra em 5 dias!" }
        ]
    };
    
    const renderContent = () => {
        switch(activeTab) {
            case 'Resumo':
                return <GroupResumoView data={mockData} />;
            case 'Participantes':
                return <GroupParticipantesView data={mockData} />;
            case 'Pagamentos':
                return <GroupPagamentosView data={mockData} />;
            case 'Convites':
                return <GroupConvitesView />;
            case 'Mensagens':
                return <GroupMensagensView data={mockData} />;
            case 'Relatórios':
                return <GroupRelatoriosView />;
            case 'Configurações':
                return <GroupConfiguracoesView data={mockData} />;
            default:
                return null;
        }
    }

    return (
        <main className="bg-slate-50 min-h-screen pt-32 pb-16">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 font-heading">{mockData.name}</h1>
                    <div className="flex space-x-3">
                         <button onClick={() => setActiveTab('Configurações')} className="bg-white text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block -mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L7.86 6.81c-.46.12-.9.29-1.31.52l-3.23-1.61c-1.48-.74-3.15.5-2.73 2.13l1.58 3.16c.31.62.31 1.33 0 1.95l-1.58 3.16c-.42 1.63 1.25 2.87 2.73 2.13l3.23-1.61c.41.23.85.4 1.31.52l.65 3.64c.38 1.56 2.6 1.56 2.98 0l.65-3.64c.46-.12.9-.29 1.31-.52l3.23 1.61c1.48.74 3.15-.5 2.73-2.13l-1.58-3.16a2.035 2.035 0 010-1.95l1.58-3.16c.42 1.63-1.25-2.87-2.73-2.13l-3.23 1.61a4.93 4.93 0 00-1.31-.52L11.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                            Configurar
                        </button>
                        <button onClick={() => setActiveTab('Convites')} className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block -mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>
                            Convidar
                        </button>
                    </div>
                </div>
                
                 {/* Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto">
                        {tabs.map(tab => (
                             <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {renderContent()}

            </div>
        </main>
    );
};

const GroupResumoView = ({data}: {data: any}) => {
    const progress = (data.raised / data.goal) * 100;
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Valor Arrecadado" value={`R$ ${data.raised.toLocaleString('pt-BR')}`} />
                <StatCard title="Meta Final" value={`R$ ${data.goal.toLocaleString('pt-BR')}`} />
                <StatCard title="Participantes" value={data.participants.length} />
                <StatCard title="Progresso" value={`${progress.toFixed(0)}%`} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                 <h2 className="text-xl font-bold text-gray-800 font-heading mb-4">Progresso da Vaquinha</h2>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-emerald-500 h-4 rounded-full text-center text-white text-xs" style={{ width: `${progress}%` }}>
                        {progress.toFixed(0)}%
                    </div>
                </div>
                 <div className="mt-4 flex justify-between text-sm font-medium text-gray-600">
                    <span>R$ {data.raised.toLocaleString('pt-BR')}</span>
                    <span>R$ {data.goal.toLocaleString('pt-BR')}</span>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 font-heading mb-4">Ações Rápidas</h2>
                <div className="flex flex-wrap gap-4">
                     <button className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-sky-600 transition">Enviar Lembrete a Todos</button>
                     <button className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition">Solicitar Distribuição</button>
                </div>
            </div>
        </div>
    );
}

const GroupParticipantesView = ({data}: {data: any}) => {
    const { addToast } = useToast();
    const statusPill: {[key: string]: string} = {
        "Pago": "bg-emerald-100 text-emerald-800",
        "Atrasado": "bg-red-100 text-red-800",
        "Pendente": "bg-yellow-100 text-yellow-800",
    }
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800 font-heading">Painel de Participantes</h2>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Valor Contribuído</th>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.participants.map((p: any) => (
                            <tr key={p.id}>
                                <td className="p-4 flex items-center">
                                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full mr-4" />
                                    <span className="font-medium text-gray-800 whitespace-nowrap">{p.name}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusPill[p.status]}`}>{p.status}</span>
                                </td>
                                <td className="p-4 font-medium text-gray-700 whitespace-nowrap">R$ {p.amount.toLocaleString('pt-BR')}</td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => addToast(`Lembrete enviado para ${p.name}!`, 'info')}
                                        className="text-emerald-600 hover:text-emerald-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                                        disabled={p.status === 'Pago'}
                                    >
                                        Lembrete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    );
}

const GroupPagamentosView = ({data}: {data: any}) => {
     const methodPill: {[key: string]: string} = {
        "Pix": "bg-green-100 text-green-800",
        "Cartão": "bg-blue-100 text-blue-800",
        "Boleto": "bg-orange-100 text-orange-800",
    }
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 font-heading">Histórico de Pagamentos</h2>
                <button className="text-sm bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-md hover:bg-gray-300">Exportar PDF</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">Participante</th>
                            <th className="p-4">Data</th>
                            <th className="p-4">Valor</th>
                            <th className="p-4">Método</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                         {data.payments.map((p: any) => (
                             <tr key={p.id}>
                                <td className="p-4 font-medium text-gray-800 whitespace-nowrap">{p.name}</td>
                                <td className="p-4 text-gray-600 whitespace-nowrap">{new Date(p.date).toLocaleDateString('pt-BR')}</td>
                                <td className="p-4 font-medium text-gray-700 whitespace-nowrap">R$ {p.amount.toLocaleString('pt-BR')}</td>
                                 <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${methodPill[p.method]}`}>{p.method}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const GroupConvitesView = () => {
    const { addToast } = useToast();
    const inviteLink = "https://vakinhafacil.com/join/bahia2024";

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        addToast("Link copiado para a área de transferência!", "success");
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-md">
             <h2 className="text-xl font-bold text-gray-800 font-heading mb-4">Convidar Participantes</h2>
            <p className="text-gray-600 mb-4">Compartilhe o link abaixo com seus amigos para que eles possam participar da vaquinha.</p>
            <div className="flex items-center space-x-2 p-3 bg-slate-100 rounded-lg">
                <input type="text" readOnly value={inviteLink} className="w-full bg-transparent focus:outline-none text-gray-700"/>
                <button onClick={copyLink} className="bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-md hover:bg-gray-300">Copiar</button>
            </div>
             <div className="mt-6 flex flex-wrap gap-4">
                <button className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition min-w-[200px]">Compartilhar no WhatsApp</button>
                <button className="flex-1 bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 transition min-w-[200px]">Enviar por E-mail</button>
            </div>
        </div>
    );
};

const GroupMensagensView = ({ data }: { data: any }) => {
    const { addToast } = useToast();
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        addToast("Mensagem enviada para todos os participantes!", "success");
        const form = e.target as HTMLFormElement;
        form.reset();
    };
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 font-heading mb-6">Enviar Mensagem para o Grupo</h2>
                <form onSubmit={handleSendMessage} className="space-y-4">
                    <div>
                        <label htmlFor="messageSubject" className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                        <input type="text" id="messageSubject" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                    <div>
                        <label htmlFor="messageContent" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                        <textarea id="messageContent" rows={4} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"></textarea>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition">Enviar para Todos</button>
                    </div>
                </form>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b"><h2 className="text-xl font-bold text-gray-800 font-heading">Histórico de Mensagens</h2></div>
                <div className="p-6 space-y-4">
                    {data.messages.map((msg: any) => (
                        <div key={msg.id} className="p-4 border rounded-lg bg-slate-50">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-gray-800">{msg.subject}</h3>
                                <span className="text-xs text-gray-500">{msg.date}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{msg.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const GroupRelatoriosView = () => {
    const { addToast } = useToast();
    return (
        <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 font-heading mb-6">Gerar Relatórios</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Relatório de Pagamentos</h3>
                    <p className="text-sm text-gray-600 mb-3">Exporte um extrato completo com todas as transações da vaquinha.</p>
                    <div className="flex items-center gap-4">
                        <button onClick={() => addToast("Exportando relatório PDF...", "info")} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition">Exportar PDF</button>
                        <button onClick={() => addToast("Exportando relatório CSV...", "info")} className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition">Exportar CSV</button>
                    </div>
                </div>
                 <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Relatório de Participantes</h3>
                    <p className="text-sm text-gray-600 mb-3">Exporte uma lista de todos os participantes com seus status de pagamento.</p>
                     <div className="flex items-center gap-4">
                        <button onClick={() => addToast("Exportando relatório PDF...", "info")} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition">Exportar PDF</button>
                        <button onClick={() => addToast("Exportando relatório CSV...", "info")} className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition">Exportar CSV</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GroupConfiguracoesView = ({ data }: { data: any }) => {
    const { addToast } = useToast();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToast("Configurações salvas com sucesso!", "success");
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 font-heading mb-6">Configurações da Vaquinha</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="vakinhaName" className="block text-sm font-medium text-gray-700 mb-1">Nome da Vaquinha</label>
                    <input type="text" id="vakinhaName" defaultValue={data.name} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                    <label htmlFor="vakinhaGoal" className="block text-sm font-medium text-gray-700 mb-1">Meta de Arrecadação (R$)</label>
                    <input type="number" id="vakinhaGoal" defaultValue={data.goal} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <fieldset>
                    <legend className="text-sm font-medium text-gray-700 mb-2">Gerenciar Notificações</legend>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input id="email-notif" type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                            <label htmlFor="email-notif" className="ml-2 block text-sm text-gray-900">Notificações por E-mail</label>
                        </div>
                        <div className="flex items-center">
                            <input id="sms-notif" type="checkbox" className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                            <label htmlFor="sms-notif" className="ml-2 block text-sm text-gray-900">Notificações por SMS</label>
                        </div>
                    </div>
                </fieldset>
                <div className="pt-4">
                    <button type="submit" className="bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition">Salvar Alterações</button>
                </div>
            </form>
        </div>
    );
};
// --- END: GROUP ADMIN DASHBOARD ---

// --- START: SYSTEM ADMIN DASHBOARD ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-toast-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-800 font-heading">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}

const SystemAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
    const [isWhiteLabelModalOpen, setIsWhiteLabelModalOpen] = useState<boolean>(false);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
    const [transactionToRefund, setTransactionToRefund] = useState<any>(null);
    const { addToast } = useToast();

    const tabs = ["Dashboard", "Usuários", "Vaquinhas", "Financeiro", "White-Label", "Suporte", "Marketing", "Logs", "Configurações"];
    
    const mockData = {
        stats: {
            revenue: 15340.50,
            activeVakinhas: 257,
            activeUsers: 1245,
            defaultRate: 12.5,
            newUsers: 42,
            churnRate: 2.1
        },
        monthlyRevenue: [3, 4, 6, 8, 7, 9, 11, 10, 12, 14, 13, 15.3],
        revenueByModel: [
            { name: 'Taxas (5%)', value: 9140.50 },
            { name: 'Assinaturas', value: 5000 },
            { name: 'White-Label', value: 1200 },
        ],
        transactions: [
             { id: 'TXN1001', date: '2024-07-20', type: 'Taxa Vaquinha', value: 50.00, status: 'Aprovado' },
             { id: 'TXN1002', date: '2024-07-20', type: 'Assinatura', value: 19.90, status: 'Aprovado' },
             { id: 'TXN1003', date: '2024-07-19', type: 'White-Label', value: 300.00, status: 'Aprovado' },
             { id: 'TXN1004', date: '2024-07-19', type: 'Taxa Vaquinha', value: 120.00, status: 'Pendente' },
        ],
        conversionFunnel: [
            { stage: 'Visitantes', value: 10000 },
            { stage: 'Cadastros', value: 1500 },
            { stage: 'Criação de Vaquinha', value: 300 },
            { stage: 'Pagamento', value: 250 },
        ],
        users: [
            { id: 1, name: "Ana Beatriz", email: "ana.b@example.com", type: "Admin Grupo", status: "Ativo", date: "2023-10-15", vakinhas: 2 },
            { id: 2, name: "Bruno Gomes", email: "bruno.g@example.com", type: "Participante", status: "Ativo", date: "2023-10-14", vakinhas: 0 },
            { id: 3, name: "Carla Dias", email: "carla.d@example.com", type: "Admin Grupo", status: "Bloqueado", date: "2023-10-12", vakinhas: 1 },
             { id: 4, name: "Daniel Alves", email: "daniel.a@example.com", type: "Admin Grupo", status: "Ativo", date: "2023-10-11", vakinhas: 5 },
        ],
        vakinhas: [
            { id: 1, name: "Formatura TI 2024", admin: "Carlos Souza", status: "Ativa", raised: 5400, goal: 12000 },
            { id: 2, name: "Viagem de Férias", admin: "Juliana Lima", status: "Finalizada", raised: 8000, goal: 8000 },
            { id: 3, name: "Presente Casamento", admin: "Marcos Andrade", status: "Risco", raised: 900, goal: 2000 },
        ],
        whiteLabelClients: [
            { id: 1, company: "Eventos Master", plan: "Premium", status: "Ativa", since: "2023-08-01" },
            { id: 2, company: "Clube do Bairro FC", plan: "Básico", status: "Ativa", since: "2023-09-20" },
        ],
        supportTickets: [
            {id: 1, subject: "Problema com pagamento", user: "Ana Beatriz", priority: "Alta", status: "Aberto"},
            {id: 2, subject: "Dúvida sobre taxas", user: "Lucas Mendes", priority: "Média", status: "Respondido"},
            {id: 3, subject: "Sugestão de funcionalidade", user: "Mariana Costa", priority: "Baixa", status: "Fechado"},
        ],
        announcements: [
            {id: 1, title: "Novas Funcionalidades!", audience: "Todos os Usuários", date: "2024-07-01"}
        ],
        activityLogs: [
            {id: 1, timestamp: "2024-07-21 10:00:00", user: "admin@vakinhafacil.com", action: "LOGIN_SUCCESS", details: "IP: 192.168.1.1"},
            {id: 2, timestamp: "2024-07-21 09:45:12", user: "carla.d@example.com", action: "USER_BLOCKED", details: "Admin action by admin@vakinhafacil.com"},
            {id: 3, timestamp: "2024-07-21 09:30:05", user: "daniel.a@example.com", action: "VAKINHA_CREATED", details: "ID: VK589, Goal: R$5000"},
        ]
    };

    const handleViewUser = (user: any) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    }
    const handleBlockUser = (user: any) => {
        addToast(`Usuário ${user.name} bloqueado com sucesso!`, 'error');
    }
    
    const handleAddWhiteLabel = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addToast("Novo cliente White-Label adicionado!", "success");
        setIsWhiteLabelModalOpen(false);
    }
    
    const handleOpenRefundModal = (transaction: any) => {
        setTransactionToRefund(transaction);
        setIsRefundModalOpen(true);
    };

    const handleConfirmRefund = () => {
        addToast(`Reembolso de R$${transactionToRefund?.value.toFixed(2)} processado para TXN ${transactionToRefund?.id}!`, 'success');
        setIsRefundModalOpen(false);
        setTransactionToRefund(null);
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <DashboardView data={mockData} />;
            case 'Usuários':
                return <UsersView users={mockData.users} onView={handleViewUser} onBlock={handleBlockUser} />;
            case 'Vaquinhas':
                 return <VakinhasView vakinhas={mockData.vakinhas} />;
            case 'Financeiro':
                 return <FinanceiroView data={mockData} onRefund={handleOpenRefundModal} />;
            case 'White-Label':
                 return <WhiteLabelView clients={mockData.whiteLabelClients} onAdd={() => setIsWhiteLabelModalOpen(true)} />;
            case 'Suporte':
                 return <SuporteView tickets={mockData.supportTickets} />;
            case 'Marketing':
                 return <MarketingView announcements={mockData.announcements} />;
            case 'Logs':
                 return <ActivityLogsView logs={mockData.activityLogs} />;
             case 'Configurações':
                 return <ConfiguracoesView />;
            default:
                return <Card><h2 className="text-xl font-semibold text-gray-500">Seção de {activeTab} em construção.</h2></Card>;
        }
    };
    
    return (
        <main className="bg-slate-100 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6">
                 <div className="lg:flex lg:space-x-8">
                    {/* Sidebar */}
                    <aside className="lg:w-1/4 mb-8 lg:mb-0">
                        <div className="bg-white p-4 rounded-xl shadow-md sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">Painel do Sistema</h2>
                            <nav className="space-y-1">
                                {tabs.map(tab => (
                                    <button 
                                        key={tab} 
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center space-x-3 ${activeTab === tab ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:bg-slate-100'}`}
                                    >
                                        <span className="w-6 h-6">{getIconForTab(tab)}</span>
                                        <span>{tab}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>
                    {/* Content */}
                    <div className="lg:w-3/4">
                        {renderContent()}
                    </div>
                </div>
                 <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title={`Detalhes de ${selectedUser?.name}`}>
                    {selectedUser && (
                        <div className="space-y-3">
                            <p><strong>ID:</strong> {selectedUser.id}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Tipo:</strong> {selectedUser.type}</p>
                            <p><strong>Status:</strong> {selectedUser.status}</p>
                            <p><strong>Data de Cadastro:</strong> {selectedUser.date}</p>
                             <p><strong>Vaquinhas Criadas:</strong> {selectedUser.vakinhas}</p>
                        </div>
                    )}
                </Modal>
                <Modal isOpen={isWhiteLabelModalOpen} onClose={() => setIsWhiteLabelModalOpen(false)} title="Adicionar Novo Cliente White-Label">
                   <form className="space-y-4" onSubmit={handleAddWhiteLabel}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                            <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Plano</label>
                            <select required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                                <option>Básico</option>
                                <option>Premium</option>
                            </select>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <button type="submit" className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition">Adicionar Cliente</button>
                        </div>
                   </form>
                </Modal>
                <Modal isOpen={isRefundModalOpen} onClose={() => setIsRefundModalOpen(false)} title="Confirmar Reembolso">
                    {transactionToRefund && (
                        <div>
                            <p className="mb-4">
                                Você tem certeza que deseja reembolsar a transação <strong>{transactionToRefund.id}</strong> no valor de <strong>R$ {transactionToRefund.value.toFixed(2)}</strong>?
                            </p>
                             <div className="flex justify-end gap-3">
                                <button onClick={() => setIsRefundModalOpen(false)} className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition">Cancelar</button>
                                <button onClick={handleConfirmRefund} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition">Confirmar Reembolso</button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </main>
    );
};

const getIconForTab = (tabName: string) => {
    const icons: {[key: string]: React.ReactNode} = {
        Dashboard: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>,
        Usuários: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-4.982.972.972 0 0 0-.056-1.022c-.18-.282-.514-.455-.865-.455H3.522a.872.872 0 0 0-.51.158l-1.573.945M8.422 12.311a.5.5 0 0 0-.447.276l-1.573 2.825a.5.5 0 0 0 .447.724H19.5a.5.5 0 0 0 .447-.724l-1.573-2.825a.5.5 0 0 0-.447-.276H8.422ZM8 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>,
        Vaquinhas: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
        Financeiro: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" /></svg>,
        "White-Label": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.47 2.118 2.25 2.25 0 0 0-1.994 2.195c-.035.987.462 1.898 1.386 2.303a2.408 2.408 0 0 0 2.132-.083A2.25 2.25 0 0 1 8.25 21a2.25 2.25 0 0 0 2.25-2.25c0-1.152-.26-2.243-.72-3.222Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.75c0-1.152-.26-2.243-.72-3.222s-1.068-1.745-1.82-2.496a5.25 5.25 0 0 0-7.424 0M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
        Suporte: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>,
        Marketing: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25h3.32c.688 0 1.25.562 1.25 1.25s-.562 1.25-1.25 1.25h-3.32zM12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.96 12.558c-.22.623-.36 1.286-.36 1.942 0 1.24.363 2.41 1 3.428" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.4 12.558c.22.623.36 1.286.36 1.942 0 1.24-.363 2.41-1 3.428" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.35 0-2.65-.25-3.8-.7" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21c1.35 0 2.65-.25 3.8-.7" /></svg>,
        Logs: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
        Configurações: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.11a12.007 12.007 0 0 1 2.59 0c.55.103 1.02.568 1.11 1.11m-4.8 0a12.006 12.006 0 0 0-2.59 0c-.55-.103-1.02-.568-1.11-1.11m4.8 0A12.006 12.006 0 0 1 12 3.75c.62 0 1.213.04 1.794.11m-3.588 0A12.006 12.006 0 0 0 12 3.75c-.62 0-1.213.04-1.794.11m0 0a11.955 11.955 0 0 0-2.649 1.513c-.493.36-1.112.36-1.605 0A11.955 11.955 0 0 0 3.825 4.05m14.35 0a11.955 11.955 0 0 0-2.649-1.513c-.493-.36-1.112.36-1.605 0A11.955 11.955 0 0 0 12.45 4.05m-3.6 13.95m5.4 0a11.955 11.955 0 0 1-2.649 1.513c-.493.36-1.112.36-1.605 0A11.955 11.955 0 0 1 8.55 18m3.6 0a11.955 11.955 0 0 0-2.649-1.513c-.493-.36-1.112.36-1.605 0A11.955 11.955 0 0 0 3.825 18m14.35 0a11.955 11.955 0 0 0-2.649-1.513c-.493-.36-1.112.36-1.605 0a11.955 11.955 0 0 0-2.25 1.513M12 12.75h.008v.008H12v-.008Z" /></svg>
    };
    return icons[tabName] || null;
}

const DashboardView = ({ data }: { data: any }) => {
    const maxRevenue = Math.max(...data.monthlyRevenue);

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Receita Total (mês)" value={`R$ ${data.stats.revenue.toLocaleString('pt-BR')}`} />
                <StatCard title="Vaquinhas Ativas" value={data.stats.activeVakinhas} />
                <StatCard title="Usuários Ativos" value={data.stats.activeUsers} />
                <StatCard title="Novos Usuários (mês)" value={data.stats.newUsers} />
                 <StatCard title="Inadimplência Média" value={`${data.stats.defaultRate}%`} />
                <StatCard title="Taxa de Churn (mês)" value={`${data.stats.churnRate}%`} />
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                 {/* Revenue Chart */}
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 font-heading mb-4">Receita Mensal (em milhares de R$)</h3>
                    <div className="flex items-end h-64 space-x-2">
                        {data.monthlyRevenue.map((rev: number, index: number) => (
                            <div key={index} className="flex-1 flex flex-col items-center justify-end">
                                <div 
                                    className="w-full bg-emerald-400 hover:bg-emerald-500 rounded-t-md transition-all"
                                    style={{ height: `${(rev / maxRevenue) * 100}%` }}
                                    title={`Mês ${index+1}: R$${(rev*1000).toLocaleString('pt-BR')}`}
                                ></div>
                                <span className="text-xs text-gray-500 mt-1">{index+1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Funnel Chart */}
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                     <h3 className="text-lg font-bold text-gray-800 font-heading mb-4">Funil de Conversão</h3>
                     <div className="space-y-3">
                        {data.conversionFunnel.map((item: any, index: number) => {
                            const conversionRate = index > 0 ? (item.value / data.conversionFunnel[index-1].value) * 100 : 100;
                            return (
                                <div key={item.stage}>
                                    <div className="flex justify-between text-sm font-medium text-gray-600">
                                        <span>{item.stage}</span>
                                        <span>{item.value.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                         <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${item.value / data.conversionFunnel[0].value * 100}%` }}></div>
                                    </div>
                                    {index > 0 && <p className="text-xs text-right text-gray-500 mt-1">{conversionRate.toFixed(1)}% de conversão</p>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
const StatCard = ({ title, value }: { title: string, value: string | number }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

// FIX: Made children optional to resolve widespread TypeScript errors.
const Card = ({children}: {children?: React.ReactNode}) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        {children}
    </div>
);
// FIX: Made children optional to resolve widespread TypeScript errors.
const CardTitle = ({children}: {children?: React.ReactNode}) => (
    <h2 className="text-xl font-bold text-gray-800 font-heading mb-4">
        {children}
    </h2>
);

const UsersView = ({ users, onView, onBlock }: { users: any[], onView: (user: any) => void, onBlock: (user: any) => void }) => (
    <Card>
        <CardTitle>Gerenciar Usuários</CardTitle>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                    <tr>
                        <th className="p-4">Nome</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Data Cadastro</th>
                        <th className="p-4">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {users.map(u => (
                        <tr key={u.id}>
                            <td className="p-4 font-medium text-gray-800 whitespace-nowrap">{u.name}</td>
                            <td className="p-4 text-gray-600 whitespace-nowrap">{u.email}</td>
                            <td className="p-4 text-gray-600">{u.type}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{u.status}</span>
                            </td>
                            <td className="p-4 text-gray-600 whitespace-nowrap">{u.date}</td>
                            <td className="p-4 space-x-2 whitespace-nowrap">
                                <button onClick={() => onView(u)} className="text-sm text-sky-600 hover:text-sky-800 font-medium">Detalhes</button>
                                <button onClick={() => onBlock(u)} className="text-sm text-red-600 hover:text-red-800 font-medium">Bloquear</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const VakinhasView = ({ vakinhas }: { vakinhas: any[] }) => (
    <Card>
        <CardTitle>Gerenciar Vaquinhas</CardTitle>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                    <tr>
                        <th className="p-4">Nome da Vaquinha</th>
                        <th className="p-4">Admin</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Progresso</th>
                        <th className="p-4">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {vakinhas.map(v => (
                        <tr key={v.id}>
                            <td className="p-4 font-medium text-gray-800 whitespace-nowrap">{v.name}</td>
                            <td className="p-4 text-gray-600 whitespace-nowrap">{v.admin}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800' : v.status === 'Finalizada' ? 'bg-sky-100 text-sky-800' : 'bg-yellow-100 text-yellow-800'}`}>{v.status}</span>
                            </td>
                            <td className="p-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(v.raised / v.goal) * 100}%` }}></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-1 block">R$ {v.raised.toLocaleString('pt-BR')} / {v.goal.toLocaleString('pt-BR')}</span>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                                <button className="text-sm text-sky-600 hover:text-sky-800 font-medium">Ver Detalhes</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const FinanceiroView = ({ data, onRefund }: { data: any, onRefund: (transaction: any) => void }) => {
    const totalRevenue = data.revenueByModel.reduce((acc: number, item: any) => acc + item.value, 0);
    const colors = ['#10b981', '#3b82f6', '#f59e0b'];

    return (
        <div className="space-y-8">
            <Card>
                <CardTitle>Receita por Modelo</CardTitle>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                         <div className="relative w-full h-64">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-800">R$ {totalRevenue.toLocaleString('pt-BR')}</span>
                            </div>
                           <svg viewBox="0 0 36 36" className="w-full h-full">
                                {(() => {
                                    let accumulated = 0;
                                    return data.revenueByModel.map((item: any, index: number) => {
                                        const percentage = (item.value / totalRevenue) * 100;
                                        const strokeDasharray = `${percentage} ${100 - percentage}`;
                                        const strokeDashoffset = -accumulated;
                                        accumulated += percentage;
                                        return <circle key={index} cx="18" cy="18" r="15.9155" fill="transparent" stroke={colors[index]} strokeWidth="3" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} transform="rotate(-90 18 18)" />;
                                    });
                                })()}
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {data.revenueByModel.map((item: any, index: number) => (
                            <div key={item.name} className="flex items-center">
                                <span className="w-4 h-4 rounded-full mr-3" style={{backgroundColor: colors[index]}}></span>
                                <div className="flex justify-between w-full">
                                    <span className="text-gray-600">{item.name}</span>
                                    <span className="font-bold text-gray-800">R$ {item.value.toLocaleString('pt-BR')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
            <Card>
                 <CardTitle>Últimas Transações</CardTitle>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                         <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                             <tr>
                                 <th className="p-4">ID</th>
                                 <th className="p-4">Data</th>
                                 <th className="p-4">Tipo</th>
                                 <th className="p-4">Valor</th>
                                 <th className="p-4">Status</th>
                                 <th className="p-4">Ações</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-200">
                            {data.transactions.map((t: any) => (
                                <tr key={t.id}>
                                    <td className="p-4 font-mono text-xs text-gray-500">{t.id}</td>
                                    <td className="p-4 text-gray-600">{t.date}</td>
                                    <td className="p-4 font-medium text-gray-800">{t.type}</td>
                                    <td className="p-4 font-medium text-gray-800">R$ {t.value.toFixed(2).replace('.', ',')}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>{t.status}</span>
                                    </td>
                                    <td className="p-4">
                                        {t.status === 'Aprovado' && (
                                            <button onClick={() => onRefund(t)} className="text-sm text-red-600 hover:text-red-800 font-medium">Reembolsar</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                     </table>
                  </div>
            </Card>
        </div>
    );
};
const WhiteLabelView = ({ clients, onAdd }: { clients: any[], onAdd: () => void }) => {
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 font-heading">Clientes White-Label</h2>
                <button onClick={onAdd} className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition">
                    + Adicionar Cliente
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">Empresa</th>
                            <th className="p-4">Plano</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Cliente Desde</th>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {clients.map(c => (
                            <tr key={c.id}>
                                <td className="p-4 font-medium text-gray-800">{c.company}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.plan === 'Premium' ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-800'}`}>{c.plan}</span></td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{c.status}</span></td>
                                <td className="p-4 text-gray-600">{c.since}</td>
                                <td className="p-4">
                                    <button className="text-sm text-sky-600 hover:text-sky-800 font-medium">Ver Detalhes</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
const SuporteView = ({ tickets }: { tickets: any[] }) => {
    const priorityPill: {[key: string]: string} = {
        "Alta": "bg-red-100 text-red-800",
        "Média": "bg-yellow-100 text-yellow-800",
        "Baixa": "bg-sky-100 text-sky-800",
    }
     const statusPill: {[key: string]: string} = {
        "Aberto": "bg-red-100 text-red-800",
        "Respondido": "bg-sky-100 text-sky-800",
        "Fechado": "bg-gray-100 text-gray-800",
    }
    return (
        <Card>
            <CardTitle>Tickets de Suporte</CardTitle>
            <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">Assunto</th>
                            <th className="p-4">Usuário</th>
                            <th className="p-4">Prioridade</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                       {tickets.map(t => (
                            <tr key={t.id}>
                                <td className="p-4 font-medium text-gray-800">{t.subject}</td>
                                <td className="p-4 text-gray-600">{t.user}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityPill[t.priority]}`}>{t.priority}</span></td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusPill[t.status]}`}>{t.status}</span></td>
                                <td className="p-4 space-x-2 whitespace-nowrap">
                                    <button className="text-sm text-sky-600 hover:text-sky-800 font-medium">Responder</button>
                                    <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">Fechar</button>
                                </td>
                            </tr>
                       ))}
                    </tbody>
                 </table>
            </div>
        </Card>
    );
};

const MarketingView = ({ announcements }: { announcements: any[] }) => {
    const { addToast } = useToast();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToast("Anúncio enviado com sucesso!", "success");
        (e.target as HTMLFormElement).reset();
    };
    return (
        <div className="space-y-8">
            <Card>
                <CardTitle>Nova Campanha de Marketing</CardTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título do Anúncio</label>
                        <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Público Alvo</label>
                        <select required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                            <option>Todos os Usuários</option>
                            <option>Apenas Gestores de Grupo</option>
                            <option>Apenas Participantes</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mensagem</label>
                        <textarea rows={5} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"></textarea>
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button type="submit" className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition">Enviar Anúncio</button>
                    </div>
               </form>
            </Card>
            <Card>
                <CardTitle>Campanhas Anteriores</CardTitle>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                            <tr>
                                <th className="p-4">Título</th>
                                <th className="p-4">Público</th>
                                <th className="p-4">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {announcements.map(a => (
                                <tr key={a.id}>
                                    <td className="p-4 font-medium text-gray-800">{a.title}</td>
                                    <td className="p-4 text-gray-600">{a.audience}</td>
                                    <td className="p-4 text-gray-600">{a.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const ActivityLogsView = ({ logs }: { logs: any[] }) => {
    return (
        <Card>
            <CardTitle>Logs de Atividade do Sistema</CardTitle>
            <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Usuário</th>
                            <th className="p-4">Ação</th>
                            <th className="p-4">Detalhes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                       {logs.map(log => (
                            <tr key={log.id}>
                                <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                                <td className="p-4 text-sm font-medium text-gray-800 whitespace-nowrap">{log.user}</td>
                                <td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">{log.action}</span></td>
                                <td className="p-4 text-sm text-gray-600 font-mono">{log.details}</td>
                            </tr>
                       ))}
                    </tbody>
                 </table>
            </div>
        </Card>
    );
};


const ConfiguracoesView = () => {
    const { addToast } = useToast();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToast("Configurações salvas com sucesso!", "success");
    };

    return (
        <Card>
            <CardTitle>Configurações Globais</CardTitle>
            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                {/* Section 1: Taxas */}
                <div className="pt-8">
                    <h3 className="text-lg font-semibold text-gray-800">Taxas da Plataforma</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Taxa Fixa por Vaquinha (R$)</label>
                            <input type="number" defaultValue="20" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Taxa Percentual (%)</label>
                            <input type="number" step="0.1" defaultValue="5" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"/>
                        </div>
                    </div>
                </div>

                {/* Section 2: Limites */}
                <div className="pt-8">
                    <h3 className="text-lg font-semibold text-gray-800">Limites</h3>
                     <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor Máximo por Vaquinha (R$)</label>
                            <input type="number" defaultValue="10000" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"/>
                        </div>
                    </div>
                </div>

                {/* Section 3: Integrações */}
                 <div className="pt-8">
                    <h3 className="text-lg font-semibold text-gray-800">Integrações de Pagamento</h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mercado Pago Access Token</label>
                            <input type="password" defaultValue="************" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">PicPay Seller Token</label>
                            <input type="password" defaultValue="************" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                    </div>
                </div>
                
                <div className="pt-8 flex justify-end">
                    <button type="submit" className="bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition">Salvar Configurações</button>
                </div>
            </form>
        </Card>
    );
};


// --- END: SYSTEM ADMIN DASHBOARD ---

export default function App() {
    const [userType, setUserType] = useState<string | null>(null);

    const handleGroupAdminLogin = () => setUserType('groupAdmin');
    const handleSystemAdminLogin = () => setUserType('systemAdmin');
    const handleLogout = () => setUserType(null);
    
    const renderPage = () => {
        switch (userType) {
            case 'groupAdmin':
                return <GroupAdminDashboard />;
            case 'systemAdmin':
                return <SystemAdminDashboard />;
            default:
                return <LandingPage />;
        }
    };

    return (
        <ToastProvider>
            <Header
                userType={userType}
                onGroupAdminLogin={handleGroupAdminLogin}
                onSystemAdminLogin={handleSystemAdminLogin}
                onLogout={handleLogout}
            />
            {renderPage()}
            {!userType && <AiChatbot />}
        </ToastProvider>
    );
}