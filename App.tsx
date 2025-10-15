

import React, { useState, useEffect, useRef, useContext, createContext, useMemo } from 'react';
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

const ToastProvider = ({ children }: { children?: React.ReactNode }) => {
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
    const chatRef = useRef<any | null>(null);

    useEffect(() => {
        if (isOpen && !aiRef.current) {
            try {
                aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                chatRef.current = aiRef.current.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: "Você é um assistente de suporte amigável e especialista na plataforma 'Vakinha Fácil', uma solução completa para vaquinhas online no Brasil. Sua missão é responder a todas as perguntas sobre a plataforma, detalhando funcionalidades (dashboard, gestão de usuários, finanças, white-label, suporte), planos de preços (Básico, Premium, White-Label), segurança e o funcionamento geral. Utilize as informações da documentação e da landing page para fornecer respostas precisas, claras e concisas em português do Brasil. Seja proativo ao explicar os benefícios de automação, transparência e segurança. Se não souber a resposta, diga que vai encaminhar para um especialista. Mantenha um tom profissional e cordial.",
                    }
                });
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
            if (!chatRef.current) throw new Error("AI chat client not initialized.");
            
            const response = await chatRef.current.sendMessage({ message: input });

            const aiMessage = { role: 'model' as const, text: response.text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Erro ao gerar conteúdo:", error);
            addToast("Ocorreu um erro ao buscar a resposta.", 'error');
            setMessages(prev => prev.slice(0, prev.length -1));

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

// --- START: SHARED DASHBOARD COMPONENTS ---
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg m-4 animate-modal-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800 font-heading">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                {children}
            </div>
             <style>{`
                @keyframes modal-in {
                    from { transform: translateY(-20px) scale(0.98); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards; }
            `}</style>
        </div>
    );
};

const FormField = ({ label, children }: { label: string; children?: React.ReactNode }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
);

const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white">
        {children}
    </select>
);

const PrimaryButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
     <button {...props} className="bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
        {children}
    </button>
);


interface CardProps {
    children?: React.ReactNode;
    className?: string;
}
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
        {children}
    </div>
);

interface CardTitleProps {
    children?: React.ReactNode;
}
const CardTitle: React.FC<CardTitleProps> = ({ children }) => (
    <h2 className="text-xl font-bold text-gray-800 font-heading mb-4">{children}</h2>
);

const StatCard = ({ title, value, change }: { title: string; value: string | number; change?: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className="flex items-baseline space-x-2 mt-2">
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {change && (
                <span className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {change}
                </span>
            )}
        </div>
    </div>
);

// FIX: Changed wrapping <button> to <div> to prevent nesting buttons, which is invalid HTML and can cause type errors.
const Dropdown = ({ button, children }: { button: React.ReactNode, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
        <div className="relative" ref={ref}>
            <div onClick={() => setIsOpen(!isOpen)}>{button}</div>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <div className="py-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

// FIX: Refactored to use React.FC and explicit prop interface to resolve children prop type error.
interface DropdownItemProps {
    children: React.ReactNode;
    onClick: () => void;
}
const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick }) => (
    <button onClick={onClick} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        {children}
    </button>
);
// --- END: SHARED DASHBOARD COMPONENTS ---


// --- START: GROUP ADMIN DASHBOARD ---
const groupAdminMockData = {
    name: "Viagem para Bahia",
    goal: 10000,
    raised: 7500,
    deadline: "2024-08-30",
    participants: [
        { id: 1, name: "João Silva", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a", status: "Pago", amount: 500, tags: ['Amigo'] },
        { id: 2, name: "Maria Oliveira", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b", status: "Atrasado", amount: 0, tags: ['Família'] },
        { id: 3, name: "Carlos Souza", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c", status: "Pago", amount: 500, tags: ['Colega'] },
        { id: 4, name: "Ana Pereira", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", status: "Pendente", amount: 0, tags: ['Amigo'] },
        { id: 5, name: "Lucas Costa", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e", status: "Pago", amount: 500, tags: ['Amigo'] },
        { id: 6, name: "Juliana Moraes", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f", status: "Pago", amount: 750, tags: ['VIP'] },
        { id: 7, name: "Ricardo Gomes", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g", status: "Pago", amount: 500, tags: [] },
    ],
    payments: [
        { id: 1, name: 'João Silva', date: '2024-07-15', amount: 500, method: 'Pix' },
        { id: 2, name: 'Carlos Souza', date: '2024-07-14', amount: 500, method: 'Cartão' },
        { id: 3, name: 'Lucas Costa', date: '2024-07-12', amount: 500, method: 'Boleto' },
        { id: 4, name: 'Juliana Moraes', date: '2024-07-11', amount: 750, method: 'Pix' },
        { id: 5, name: 'Ricardo Gomes', date: '2024-07-10', amount: 500, method: 'Cartão' },
    ],
    budget: {
        total: 7500,
        spent: 4200,
        items: [
            { id: 1, description: "Passagens Aéreas", category: "Transporte", amount: 3500, date: "2024-07-18", receipt: true },
            { id: 2, description: "Sinal da Pousada", category: "Hospedagem", amount: 700, date: "2024-07-20", receipt: true },
        ],
        categories: { "Transporte": 3500, "Hospedagem": 700 }
    },
    tasks: [
        { id: 1, title: "Reservar hotel", assignedTo: "João Silva", dueDate: "2024-08-01", completed: true },
        { id: 2, title: "Comprar passagens", assignedTo: "Admin", dueDate: "2024-07-25", completed: false },
    ],
    documents: [
        { id: 1, name: "Roteiro da Viagem.pdf", size: "1.2 MB", uploadedBy: "Admin", date: "2024-07-19" },
        { id: 2, name: "Contrato Pousada.docx", size: "350 KB", uploadedBy: "Admin", date: "2024-07-20" },
    ],
    messages: [
        { id: 1, subject: "Lembrete de Pagamento", date: "2024-07-10", content: "Olá pessoal, passando para lembrar que o prazo para o pagamento da nossa vaquinha se encerra em 5 dias!", type: "Enviada" }
    ],
    milestones: [
        { id: 1, name: "50% Arrecadado!", value: 5000, achieved: true },
        { id: 2, name: "75% Arrecadado!", value: 7500, achieved: true },
        { id: 3, name: "Meta Batida!", value: 10000, achieved: false },
    ],
    rewards: [
        { id: 1, name: "Prêmio Top Contribuidor", description: "O maior contribuidor ganha um brinde especial!" }
    ],
    polls: [
        { id: 1, question: "Qual a data da festa de confraternização?", options: [{text: "Sexta-feira (20/12)", votes: 5}, {text: "Sábado (21/12)", votes: 2}], status: "Fechada" }
    ],
    activityFeed: [
         { id: 1, type: "Pagamento", text: "Juliana Moraes pagou R$ 750,00.", time: "2 dias atrás" },
         { id: 2, type: "Participante", text: "Ricardo Gomes entrou no grupo.", time: "3 dias atrás" },
         { id: 3, type: "Mensagem", text: "Você enviou um lembrete para todos.", time: "4 dias atrás" },
    ],
    settings: {
        privacy: 'Invite-only',
        notifications: { email: true, push: false },
        allowInstallments: true,
        automations: {
            paymentReminders: true,
            thankYouMessages: true,
        }
    }
};

const GroupAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Resumo');
    const [data, setData] = useState(groupAdminMockData);

    const tabs = ['Resumo', 'Participantes', 'Pagamentos', 'Orçamento', 'Tarefas', 'Documentos', 'Convites', 'Mensagens', 'Metas e Prêmios', 'Enquetes', 'Relatórios', 'Configurações'];
    
    const renderContent = () => {
        switch(activeTab) {
            case 'Resumo': return <GroupResumoView data={data} />;
            case 'Participantes': return <GroupParticipantesView data={data} setData={setData} />;
            case 'Pagamentos': return <GroupPagamentosView data={data} />;
            case 'Orçamento': return <GroupOrcamentoView data={data} setData={setData} />;
            case 'Tarefas': return <GroupTarefasView data={data} setData={setData} />;
            case 'Documentos': return <GroupDocumentosView data={data} setData={setData} />;
            case 'Convites': return <GroupConvitesView />;
            case 'Mensagens': return <GroupMensagensView data={data} setData={setData} />;
            case 'Metas e Prêmios': return <GroupMetasView data={data} />;
            case 'Enquetes': return <GroupEnquetesView data={data} setData={setData} />;
            case 'Relatórios': return <GroupRelatoriosView />;
            case 'Configurações': return <GroupConfiguracoesView data={data} setData={setData} />;
            default: return null;
        }
    }

    return (
        <main className="bg-slate-50 min-h-screen pt-32 pb-16">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 font-heading">{data.name}</h1>
                    <div className="flex space-x-3">
                         <button onClick={() => setActiveTab('Configurações')} className="bg-white text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block -mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L7.86 6.81c-.46.12-.9.29-1.31.52l-3.23-1.61c-1.48-.74-3.15.5-2.73 2.13l1.58 3.16c.31.62.31 1.33 0 1.95l-1.58 3.16c-.42 1.63 1.25 2.87 2.73 2.13l3.23-1.61c.41.23.85.4 1.31.52l.65 3.64c.38 1.56 2.6 1.56 2.98 0l.65-3.64c.46-.12.9-.29 1.31.52l3.23 1.61c1.48.74 3.15-.5 2.73 2.13l-1.58-3.16a2.035 2.035 0 010-1.95l1.58-3.16c.42 1.63-1.25-2.87-2.73-2.13l-3.23 1.61a4.93 4.93 0 00-1.31-.52L11.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                            Configurar
                        </button>
                        <button onClick={() => setActiveTab('Convites')} className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block -mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>
                            Convidar
                        </button>
                    </div>
                </div>
                
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
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Arrecadado" value={`R$ ${data.raised.toLocaleString('pt-BR')}`} />
                    <StatCard title="Meta" value={`R$ ${data.goal.toLocaleString('pt-BR')}`} />
                    <StatCard title="Participantes" value={data.participants.length} />
                    <StatCard title="Prazo Final" value={new Date(data.deadline).toLocaleDateString('pt-BR')} />
                </div>

                <Card>
                    <CardTitle>Progresso da Vaquinha</CardTitle>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-emerald-500 h-4 rounded-full text-center text-white text-xs" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="mt-4 flex justify-between text-sm font-medium text-gray-600">
                        <span>R$ {data.raised.toLocaleString('pt-BR')} ({progress.toFixed(0)}%)</span>
                        <span>Meta: R$ {data.goal.toLocaleString('pt-BR')}</span>
                    </div>
                </Card>
                <Card>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-sky-600 transition">Enviar Lembrete para Pendentes</button>
                        <button className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition">Solicitar Distribuição</button>
                         <button className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition">Pausar Arrecadação</button>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card>
                    <CardTitle>Atividade Recente</CardTitle>
                    <ul className="space-y-4">
                        {data.activityFeed.map((item: any) => (
                            <li key={item.id} className="flex items-start space-x-3">
                                 <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                 </div>
                                <div>
                                    <p className="text-sm text-gray-700">{item.text}</p>
                                    <p className="text-xs text-gray-500">{item.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
}

const GroupParticipantesView = ({data, setData}: {data: any, setData: Function}) => {
    const { addToast } = useToast();
    const [selected, setSelected] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelect = (id: number) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelected(data.participants.map((p: any) => p.id));
        } else {
            setSelected([]);
        }
    }
    const handleBulkAction = () => {
        if (selected.length === 0) {
            addToast("Selecione pelo menos um participante.", "error");
            return;
        }
        addToast(`Lembrete enviado para ${selected.length} participante(s)!`, 'info');
        setSelected([]);
    }
    
    const handleRegisterPayment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const participantId = parseInt(formData.get('participantId') as string);
        const amount = parseFloat(formData.get('amount') as string);

        setData((prevData: any) => {
            const newParticipants = prevData.participants.map((p: any) =>
                p.id === participantId ? { ...p, status: 'Pago', amount: p.amount + amount } : p
            );
            const newRaised = prevData.raised + amount;
            const newBudgetTotal = prevData.budget.total + amount;
            return { ...prevData, participants: newParticipants, raised: newRaised, budget: { ...prevData.budget, total: newBudgetTotal } };
        });
        
        addToast("Pagamento manual registrado com sucesso!", "success");
        setIsModalOpen(false);
    };

    const statusPill: {[key: string]: string} = {
        "Pago": "bg-emerald-100 text-emerald-800",
        "Atrasado": "bg-red-100 text-red-800",
        "Pendente": "bg-yellow-100 text-yellow-800",
    }
    return (
        <>
        <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center flex-wrap gap-4">
                 <div>
                    <h2 className="text-xl font-bold text-gray-800 font-heading">Painel de Participantes</h2>
                    <input type="text" placeholder="Buscar participante..." className="mt-2 w-full md:w-64 px-3 py-1.5 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="flex items-center gap-2">
                    {selected.length > 0 && (
                        <button onClick={handleBulkAction} className="bg-sky-500 text-white font-semibold px-3 py-1 rounded-md hover:bg-sky-600 text-sm">
                            Enviar Lembrete ({selected.length})
                        </button>
                    )}
                    <button onClick={() => setIsModalOpen(true)} className="bg-white text-gray-700 font-semibold px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">
                        + Registrar Pagamento Manual
                    </button>
                </div>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="p-4 w-4">
                                <input type="checkbox" onChange={handleSelectAll} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            </th>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Valor Contribuído</th>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.participants.map((p: any) => (
                            <tr key={p.id} className={selected.includes(p.id) ? 'bg-emerald-50' : ''}>
                                <td className="p-4">
                                     <input type="checkbox" checked={selected.includes(p.id)} onChange={() => handleSelect(p.id)} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                </td>
                                <td className="p-4 flex items-center">
                                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full mr-4" />
                                    <span className="font-medium text-gray-800 whitespace-nowrap">{p.name}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusPill[p.status]}`}>{p.status}</span>
                                </td>
                                <td className="p-4 font-medium text-gray-700 whitespace-nowrap">R$ {p.amount.toLocaleString('pt-BR')}</td>
                                <td className="p-4 space-x-3">
                                    <button 
                                        onClick={() => addToast(`Lembrete enviado para ${p.name}!`, 'info')}
                                        className="text-emerald-600 hover:text-emerald-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                                        disabled={p.status === 'Pago'}
                                    >
                                        Lembrete
                                    </button>
                                    <button onClick={() => addToast(`Visualizando histórico de ${p.name}.`, "info")} className="text-gray-500 hover:text-gray-700 font-medium">
                                        Histórico
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </Card>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Pagamento Manual">
            <form onSubmit={handleRegisterPayment} className="space-y-4">
                <FormField label="Participante">
                    <Select name="participantId" required>
                        <option value="">Selecione...</option>
                        {data.participants.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </Select>
                </FormField>
                <FormField label="Valor (R$)">
                    <TextInput name="amount" type="number" step="0.01" required placeholder="500,00"/>
                </FormField>
                 <div className="pt-4 flex justify-end">
                    <PrimaryButton type="submit">Registrar</PrimaryButton>
                </div>
            </form>
        </Modal>
        </>
    );
}

const GroupPagamentosView = ({data}: {data: any}) => {
     const { addToast } = useToast();
     const methodPill: {[key: string]: string} = {
        "Pix": "bg-green-100 text-green-800",
        "Cartão": "bg-blue-100 text-blue-800",
        "Boleto": "bg-orange-100 text-orange-800",
    }
    return (
        <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 font-heading">Histórico de Pagamentos</h2>
                <button onClick={() => addToast("Relatório PDF gerado!", "success")} className="text-sm bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-md hover:bg-gray-300">Exportar PDF</button>
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
        </Card>
    );
}

const GroupOrcamentoView = ({ data, setData }: { data: any, setData: Function }) => {
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const spentPercentage = (data.budget.spent / data.budget.total) * 100;
    const remaining = data.budget.total - data.budget.spent;

    const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newExpense = {
            id: Date.now(),
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            amount: parseFloat(formData.get('amount') as string),
            date: new Date().toISOString().split('T')[0],
            receipt: false,
        };
        
        setData((prevData: any) => ({
            ...prevData,
            budget: {
                ...prevData.budget,
                items: [...prevData.budget.items, newExpense],
                spent: prevData.budget.spent + newExpense.amount,
            }
        }));
        
        addToast("Despesa adicionada com sucesso!", "success");
        setIsModalOpen(false);
    };

    return (
        <>
        <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
                <StatCard title="Total Arrecadado" value={`R$ ${data.budget.total.toLocaleString('pt-BR')}`} />
                <StatCard title="Total Gasto" value={`R$ ${data.budget.spent.toLocaleString('pt-BR')}`} />
                <StatCard title="Saldo Disponível" value={`R$ ${remaining.toLocaleString('pt-BR')}`} />
            </div>
            <Card>
                <CardTitle>Balanço do Orçamento</CardTitle>
                 <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-sky-500 h-4 rounded-full" style={{ width: `${spentPercentage}%` }}></div>
                </div>
                <div className="mt-4 flex justify-between text-sm font-medium text-gray-600">
                    <span>Gasto: R$ {data.budget.spent.toLocaleString('pt-BR')}</span>
                    <span>Disponível: R$ {remaining.toLocaleString('pt-BR')}</span>
                </div>
            </Card>
            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 font-heading">Despesas</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg text-sm">+ Adicionar Despesa</button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                            <tr>
                                <th className="p-4">Descrição</th>
                                <th className="p-4">Categoria</th>
                                <th className="p-4">Data</th>
                                <th className="p-4">Valor</th>
                                <th className="p-4">Comprovante</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.budget.items.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="p-4 font-medium text-gray-800">{item.description}</td>
                                    <td className="p-4"><span className="px-2 py-1 bg-slate-200 text-slate-800 rounded-full text-xs font-semibold">{item.category}</span></td>
                                    <td className="p-4 text-gray-600">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4 font-medium text-red-600">- R$ {item.amount.toLocaleString('pt-BR')}</td>
                                    <td className="p-4">
                                        {item.receipt ? <button className="text-emerald-600 hover:underline">Ver</button> : <button className="text-gray-400 cursor-not-allowed">N/A</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </Card>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Nova Despesa">
            <form onSubmit={handleAddExpense} className="space-y-4">
                <FormField label="Descrição"><TextInput name="description" required /></FormField>
                <FormField label="Categoria"><TextInput name="category" required /></FormField>
                <FormField label="Valor (R$)"><TextInput name="amount" type="number" step="0.01" required /></FormField>
                <div className="pt-4 flex justify-end">
                    <PrimaryButton type="submit">Adicionar Despesa</PrimaryButton>
                </div>
            </form>
        </Modal>
        </>
    );
};

const GroupTarefasView = ({ data, setData }: { data: any, setData: Function }) => {
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggleTask = (taskId: number) => {
        setData((prevData: any) => ({
            ...prevData,
            tasks: prevData.tasks.map((t: any) => t.id === taskId ? { ...t, completed: !t.completed } : t),
        }));
    };

    const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newTask = {
            id: Date.now(),
            title: formData.get('title') as string,
            assignedTo: formData.get('assignedTo') as string,
            dueDate: formData.get('dueDate') as string,
            completed: false,
        };
        setData((prevData: any) => ({ ...prevData, tasks: [...prevData.tasks, newTask] }));
        addToast("Tarefa adicionada com sucesso!", "success");
        setIsModalOpen(false);
    };

    return (
        <>
        <Card>
            <div className="flex justify-between items-center mb-4">
                <CardTitle>Lista de Tarefas do Grupo</CardTitle>
                <button onClick={() => setIsModalOpen(true)} className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg text-sm">+ Nova Tarefa</button>
            </div>
            <p className="text-gray-600 mb-6 text-sm">Organize as responsabilidades para que nada seja esquecido.</p>
            <div className="space-y-3">
                {data.tasks.map((task: any) => (
                    <div key={task.id} className="flex items-center p-3 border rounded-lg bg-slate-50">
                        <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id)} className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-4" />
                        <div className="flex-1">
                            <p className={`font-medium text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                            <p className="text-xs text-gray-500">
                                Responsável: {task.assignedTo} | Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <button className="text-gray-400 hover:text-red-500">&hellip;</button>
                    </div>
                ))}
            </div>
        </Card>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Nova Tarefa">
             <form onSubmit={handleAddTask} className="space-y-4">
                <FormField label="Título da Tarefa"><TextInput name="title" required /></FormField>
                <FormField label="Responsável">
                    <Select name="assignedTo" defaultValue="Admin">
                        <option>Admin</option>
                        {data.participants.map((p: any) => <option key={p.id}>{p.name}</option>)}
                    </Select>
                </FormField>
                <FormField label="Prazo"><TextInput name="dueDate" type="date" required /></FormField>
                <div className="pt-4 flex justify-end">
                    <PrimaryButton type="submit">Criar Tarefa</PrimaryButton>
                </div>
            </form>
        </Modal>
        </>
    );
};

const GroupDocumentosView = ({ data, setData }: { data: any, setData: Function }) => {
    const { addToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newDoc = {
                id: Date.now(),
                name: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                uploadedBy: "Admin",
                date: new Date().toISOString().split('T')[0],
            };
            setData((prevData: any) => ({ ...prevData, documents: [...prevData.documents, newDoc] }));
            addToast("Documento enviado com sucesso!", "success");
        }
    };
    
    const handleDelete = (docId: number) => {
        setData((prevData: any) => ({
            ...prevData,
            documents: prevData.documents.filter((d: any) => d.id !== docId),
        }));
        addToast("Documento excluído.", "error");
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <CardTitle>Documentos Compartilhados</CardTitle>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={handleUploadClick} className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1 -mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    Upload
                </button>
            </div>
            <p className="text-gray-600 mb-6 text-sm">Guarde roteiros, contratos e outros arquivos importantes em um só lugar.</p>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">Nome do Arquivo</th>
                            <th className="p-4">Tamanho</th>
                            <th className="p-4">Enviado por</th>
                            <th className="p-4">Data</th>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.documents.map((doc: any) => (
                            <tr key={doc.id}>
                                <td className="p-4 font-medium text-emerald-700 hover:underline cursor-pointer">{doc.name}</td>
                                <td className="p-4 text-gray-600">{doc.size}</td>
                                <td className="p-4 text-gray-600">{doc.uploadedBy}</td>
                                <td className="p-4 text-gray-600">{new Date(doc.date).toLocaleDateString('pt-BR')}</td>
                                <td className="p-4"><button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-700">Excluir</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </Card>
    );
};


const GroupConvitesView = () => {
    const { addToast } = useToast();
    const inviteLink = "https://vakinhafacil.com/join/bahia2024";

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        addToast("Link copiado para a área de transferência!", "success");
    }

    return (
        <Card>
             <CardTitle>Convidar Participantes</CardTitle>
            <p className="text-gray-600 mb-4">Compartilhe o link abaixo com seus amigos para que eles possam participar da vaquinha.</p>
            <div className="flex items-center space-x-2 p-3 bg-slate-100 rounded-lg">
                <input type="text" readOnly value={inviteLink} className="w-full bg-transparent focus:outline-none text-gray-700"/>
                <button onClick={copyLink} className="bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-md hover:bg-gray-300">Copiar</button>
            </div>
             <div className="mt-6 flex flex-wrap gap-4">
                <button className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition min-w-[200px]">Compartilhar no WhatsApp</button>
                <button className="flex-1 bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 transition min-w-[200px]">Enviar por E-mail</button>
            </div>
        </Card>
    );
};

const GroupMensagensView = ({ data, setData }: { data: any, setData: Function }) => {
    const { addToast } = useToast();
    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newMessage = {
            id: Date.now(),
            subject: formData.get('subject') as string,
            content: formData.get('content') as string,
            date: new Date().toISOString().split('T')[0],
            type: "Enviada"
        };
        setData((prevData: any) => ({ ...prevData, messages: [...prevData.messages, newMessage] }));
        addToast("Mensagem enviada para todos os participantes!", "success");
        e.currentTarget.reset();
    };
    return (
        <div className="space-y-8">
            <Card>
                <CardTitle>Enviar Mensagem para o Grupo</CardTitle>
                 <div className="flex items-center space-x-2 mb-4">
                    <button className="text-sm bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-md hover:bg-gray-300">Usar Template</button>
                    <button className="text-sm bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-md hover:bg-gray-300">Agendar Envio</button>
                </div>
                <form onSubmit={handleSendMessage} className="space-y-4">
                    <FormField label="Assunto"><TextInput name="subject" required /></FormField>
                    <FormField label="Mensagem"><TextArea name="content" required /></FormField>
                    <div className="pt-2">
                        <PrimaryButton type="submit">Enviar para Todos</PrimaryButton>
                    </div>
                </form>
            </Card>
            <Card>
                <CardTitle>Histórico de Mensagens</CardTitle>
                <div className="space-y-4">
                    {data.messages.map((msg: any) => (
                        <div key={msg.id} className="p-4 border rounded-lg bg-slate-50">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-gray-800">{msg.subject}</h3>
                                <span className="text-xs text-gray-500">{new Date(msg.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{msg.content}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const GroupMetasView = ({ data }: { data: any }) => {
    const topContributors = [...data.participants]
        .filter((p: any) => p.status === 'Pago')
        .sort((a: any, b: any) => b.amount - a.amount)
        .slice(0, 3);

    return (
        <div className="space-y-8">
            <Card>
                <CardTitle>Metas e Marcos</CardTitle>
                <p className="text-gray-600 mb-4 text-sm">Crie marcos para manter o grupo engajado e motivado a atingir o objetivo.</p>
                <div className="space-y-4">
                    {data.milestones.map((m: any) => (
                         <div key={m.id} className="flex items-center p-3 border rounded-lg">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${m.achieved ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {m.achieved ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{m.name}</p>
                                <p className="text-sm text-gray-500">Meta: R$ {m.value.toLocaleString('pt-BR')}</p>
                            </div>
                            {m.achieved && <span className="text-xs font-bold text-emerald-600">Alcançado!</span>}
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                 <Card>
                    <CardTitle>Prêmios e Recompensas</CardTitle>
                    <p className="text-gray-600 mb-4 text-sm">Ofereça recompensas para os maiores contribuidores e incentive a participação.</p>
                     {data.rewards.map((r: any) => (
                        <div key={r.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="font-semibold text-yellow-800">{r.name}</p>
                            <p className="text-sm text-yellow-700">{r.description}</p>
                        </div>
                     ))}
                </Card>

                <Card>
                    <CardTitle>Ranking de Contribuições</CardTitle>
                    <p className="text-gray-600 mb-4 text-sm">Veja quem são os maiores apoiadores da sua vaquinha.</p>
                    <ul className="space-y-3">
                        {topContributors.map((p: any, index: number) => (
                            <li key={p.id} className="flex items-center">
                                <span className={`font-bold text-lg w-8 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`}>{index + 1}</span>
                                <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full mr-3" />
                                <span className="font-medium text-gray-800 flex-1">{p.name}</span>
                                <span className="font-semibold text-emerald-600">R$ {p.amount.toLocaleString('pt-BR')}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

const GroupEnquetesView = ({ data, setData }: { data: any, setData: Function }) => {
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleCreatePoll = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const options = (formData.get('options') as string)
            .split(',')
            .map(opt => ({ text: opt.trim(), votes: 0 }));
        
        const newPoll = {
            id: Date.now(),
            question: formData.get('question') as string,
            options: options,
            status: "Aberta"
        };
        setData((prevData: any) => ({ ...prevData, polls: [...prevData.polls, newPoll] }));
        addToast("Enquete criada com sucesso!", "success");
        setIsModalOpen(false);
    };

    return (
        <>
        <div className="space-y-8">
            <Card>
                 <div className="flex justify-between items-center mb-4">
                    <CardTitle>Enquetes do Grupo</CardTitle>
                    <button onClick={() => setIsModalOpen(true)} className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition text-sm">
                        + Criar Enquete
                    </button>
                </div>
                <p className="text-gray-600 mb-6 text-sm">Tome decisões em conjunto com os participantes.</p>
                {data.polls.map((poll: any) => (
                    <div key={poll.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-gray-800">{poll.question}</h3>
                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${poll.status === "Fechada" ? "bg-gray-200 text-gray-800" : "bg-green-100 text-green-800"}`}>
                                {poll.status}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {poll.options.map((opt: any, index: number) => {
                                const totalVotes = poll.options.reduce((sum: number, o: any) => sum + o.votes, 0);
                                const percentage = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                                return (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{opt.text}</span>
                                            <span className="text-gray-500">{opt.votes} votos</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-emerald-500 h-2.5 rounded-full" style={{width: `${percentage}%`}}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </Card>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Nova Enquete">
             <form onSubmit={handleCreatePoll} className="space-y-4">
                <FormField label="Pergunta"><TextInput name="question" required /></FormField>
                <FormField label="Opções (separadas por vírgula)">
                    <TextInput name="options" required placeholder="Opção 1, Opção 2, Opção 3"/>
                </FormField>
                <div className="pt-4 flex justify-end">
                    <PrimaryButton type="submit">Criar Enquete</PrimaryButton>
                </div>
            </form>
        </Modal>
        </>
    );
};

const GroupRelatoriosView = () => {
    const { addToast } = useToast();
    const handleExport = (type: string) => {
        addToast(`Relatório ${type} gerado com sucesso!`, 'success');
    };
    return (
        <Card>
            <CardTitle>Exportar Relatórios</CardTitle>
            <p className="text-gray-600 mb-6">Gere relatórios detalhados para sua contabilidade e organização.</p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg bg-slate-50">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Relatório Financeiro Completo</h3>
                    <p className="text-gray-600 text-sm mb-4">Inclui todos os pagamentos, datas, valores e participantes.</p>
                    <div className="flex gap-3">
                        <button onClick={() => handleExport('Financeiro PDF')} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm">Exportar PDF</button>
                        <button onClick={() => handleExport('Financeiro CSV')} className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm">Exportar CSV</button>
                    </div>
                </div>
                <div className="p-6 border rounded-lg bg-slate-50">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Lista de Participantes</h3>
                    <p className="text-gray-600 text-sm mb-4">Lista com nomes, status de pagamento e valores contribuídos.</p>
                     <div className="flex gap-3">
                        <button onClick={() => handleExport('Participantes PDF')} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm">Exportar PDF</button>
                        <button onClick={() => handleExport('Participantes CSV')} className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm">Exportar CSV</button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const GroupConfiguracoesView = ({data, setData}: {data: any, setData: Function}) => {
    const { addToast } = useToast();
    
    const [formState, setFormState] = useState({ name: data.name, goal: data.goal, privacy: data.settings.privacy });
    const [automations, setAutomations] = useState(data.settings.automations);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleAutomationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAutomations(prev => ({ ...prev, [e.target.name]: e.target.checked }));
    }

    const handleSave = () => {
        setData((prevData: any) => ({
            ...prevData,
            name: formState.name,
            goal: formState.goal,
            settings: { ...prevData.settings, privacy: formState.privacy, automations: automations }
        }));
        addToast("Configurações salvas com sucesso!", "success");
    };

    const handleDelete = () => {
        if (window.confirm("Tem certeza que deseja apagar esta vaquinha? Esta ação é irreversível.")) {
            addToast("Vaquinha apagada com sucesso.", "success");
            // In a real app, you would navigate away or reset the state
        }
    }
    return (
        <div className="space-y-8 max-w-3xl">
            <Card>
                <CardTitle>Configurações Gerais</CardTitle>
                <form className="space-y-4">
                     <FormField label="Nome da Vaquinha"><TextInput name="name" value={formState.name} onChange={handleFormChange} /></FormField>
                     <FormField label="Meta (R$)"><TextInput name="goal" type="number" value={formState.goal} onChange={handleFormChange} /></FormField>
                    <FormField label="Privacidade">
                        <div className="mt-2 flex gap-4">
                            <label className="flex items-center">
                                <input type="radio" name="privacy" value="Public" checked={formState.privacy === 'Public'} onChange={handleFormChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"/>
                                <span className="ml-2 text-gray-700">Pública</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="privacy" value="Invite-only" checked={formState.privacy === 'Invite-only'} onChange={handleFormChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"/>
                                <span className="ml-2 text-gray-700">Apenas Convidados</span>
                            </label>
                        </div>
                    </FormField>
                </form>
            </Card>

            <Card>
                <CardTitle>Automações</CardTitle>
                 <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" name="paymentReminders" checked={automations.paymentReminders} onChange={handleAutomationChange} className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-4" />
                        <div>
                            <p className="font-medium text-gray-800">Lembretes de Pagamento</p>
                            <p className="text-xs text-gray-500">Enviar lembretes automáticos para participantes com pagamentos pendentes.</p>
                        </div>
                    </label>
                     <label className="flex items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" name="thankYouMessages" checked={automations.thankYouMessages} onChange={handleAutomationChange} className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-4" />
                        <div>
                            <p className="font-medium text-gray-800">Agradecimentos Automáticos</p>
                            <p className="text-xs text-gray-500">Enviar uma mensagem de agradecimento assim que um pagamento for confirmado.</p>
                        </div>
                    </label>
                </div>
            </Card>

            <Card>
                <CardTitle>Zona de Perigo</CardTitle>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-red-800">Apagar Vaquinha</h4>
                        <p className="text-sm text-red-700">Esta ação não pode ser desfeita. Todos os dados serão perdidos.</p>
                    </div>
                    <button onClick={handleDelete} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition">Apagar</button>
                </div>
            </Card>

            <div className="flex justify-end">
                <PrimaryButton onClick={handleSave}>Salvar Alterações</PrimaryButton>
            </div>
        </div>
    );
};
// --- END: GROUP ADMIN DASHBOARD ---

// --- START: SYSTEM ADMIN DASHBOARD ---
const systemAdminMockData = {
    stats: {
        totalUsers: 1428,
        totalVaquinhas: 356,
        totalRaised: 890543.21,
        monthlyRevenue: 12450.75,
    },
    users: [
        { id: 1, name: "Ana Beatriz", email: "ana.b@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a", plan: "Premium", status: "Ativo", vaquinhas: 5, lastLogin: "2024-07-22T10:00:00Z", joinDate: "2023-01-15T10:00:00Z" },
        { id: 2, name: "Bruno Costa", email: "bruno.c@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b", plan: "Básico", status: "Ativo", vaquinhas: 1, lastLogin: "2024-07-21T15:30:00Z", joinDate: "2023-02-20T10:00:00Z" },
        { id: 3, name: "Carla Dias", email: "carla.d@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c", plan: "White-Label", status: "Suspenso", vaquinhas: 1, lastLogin: "2024-06-10T11:00:00Z", joinDate: "2023-03-10T10:00:00Z" },
        { id: 4, name: "Daniel Alves", email: "daniel.a@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", plan: "Premium", status: "Ativo", vaquinhas: 8, lastLogin: "2024-07-22T09:00:00Z", joinDate: "2023-04-05T10:00:00Z" },
        ...Array.from({ length: 15 }, (_, i) => ({
             id: i + 5,
             name: `Usuário ${i+5}`,
             email: `usuario${i+5}@example.com`,
             avatar: `https://i.pravatar.cc/150?u=user${i+5}`,
             plan: ['Premium', 'Básico', 'White-Label'][i % 3],
             status: ['Ativo', 'Inativo', 'Suspenso'][i % 3],
             vaquinhas: Math.floor(Math.random() * 10),
             lastLogin: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
             joinDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString(),
        }))
    ],
};

const SystemAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Usuários');
    const tabs = ['Resumo', 'Usuários', 'Vaquinhas', 'Financeiro', 'White-Label', 'Suporte'];

    const renderContent = () => {
        switch(activeTab) {
            case 'Resumo': return <SystemResumoView data={systemAdminMockData.stats} />;
            case 'Usuários': return <SystemUsuariosView initialUsers={systemAdminMockData.users} />;
            case 'Vaquinhas': return <SystemVaquinhasView />;
            case 'Financeiro': return <SystemFinanceiroView />;
            case 'White-Label': return <SystemWhiteLabelView />;
            case 'Suporte': return <SystemSuporteView />;
            default: return null;
        }
    }
    
    return (
         <main className="bg-slate-100 min-h-screen pt-32 pb-16">
            <div className="container mx-auto px-6">
                 <div className="mb-8">
                     <h1 className="text-3xl font-bold text-gray-800 font-heading">Painel do Administrador</h1>
                </div>
                 <div className="flex">
                    <aside className="w-64 flex-shrink-0 mr-8">
                        <div className="bg-white p-4 rounded-xl shadow-md">
                             <nav className="space-y-1">
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full text-left flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === tab ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </main>
    )
};

const SystemResumoView = ({ data }: { data: any }) => (
    <div className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total de Usuários" value={data.totalUsers} change="+2% mês" />
            <StatCard title="Total de Vaquinhas" value={data.totalVaquinhas} change="+5% mês" />
            <StatCard title="Total Arrecadado" value={`R$ ${data.totalRaised.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
            <StatCard title="Receita Mensal" value={`R$ ${data.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} change="+1.5% mês"/>
        </div>
        <Card>
            <CardTitle>Visão Geral</CardTitle>
            <p>Placeholder para gráficos e outras informações resumidas.</p>
        </Card>
    </div>
);

// FIX: Refactored to use React.FC and explicit prop interface to resolve children prop type error.
interface SortableHeaderProps {
    children: React.ReactNode;
    sortKey: string;
    sortConfig: any;
    onSort: (key: string) => void;
}
const SortableHeader: React.FC<SortableHeaderProps> = ({ children, sortKey, sortConfig, onSort }) => {
    const isSorted = sortConfig?.key === sortKey;
    const directionIcon = isSorted ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '';
    return (
        <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => onSort(sortKey)}>
            <div className="flex items-center">
                {children}
                <span className="ml-2 text-xs">{directionIcon}</span>
            </div>
        </th>
    );
};

const SystemUsuariosView = ({ initialUsers }: { initialUsers: any[] }) => {
    const { addToast } = useToast();
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [planFilter, setPlanFilter] = useState('Todos');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'name', direction: 'asc'});
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);

    const USERS_PER_PAGE = 8;

    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users
            .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(user => statusFilter === 'Todos' || user.status === statusFilter)
            .filter(user => planFilter === 'Todos' || user.plan === planFilter);
        
        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [users, searchTerm, statusFilter, planFilter, sortConfig]);

    const totalPages = Math.ceil(filteredAndSortedUsers.length / USERS_PER_PAGE);
    const paginatedUsers = filteredAndSortedUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedUsers(e.target.checked ? paginatedUsers.map(u => u.id) : []);
    };
    
    const handleSelect = (id: number) => {
        setSelectedUsers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const openAddUserModal = () => { setEditingUser(null); setIsUserModalOpen(true); };
    const openEditUserModal = (user: any) => { setEditingUser(user); setIsUserModalOpen(true); };
    const openDeleteModal = (user: any) => { setUserToDelete(user); setIsDeleteModalOpen(true); };
    
    const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            plan: formData.get('plan') as string,
            status: formData.get('status') as string,
        };

        if (editingUser) {
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
            addToast("Usuário atualizado!", "success");
        } else {
            const newUser = { id: Date.now(), ...userData, avatar: `https://i.pravatar.cc/150?u=new${Date.now()}`, vaquinhas: 0, lastLogin: new Date().toISOString(), joinDate: new Date().toISOString() };
            setUsers(prev => [newUser, ...prev]);
            addToast("Usuário adicionado!", "success");
        }
        setIsUserModalOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUser = () => {
        if (userToDelete) {
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            addToast(`Usuário ${userToDelete.name} excluído.`, "error");
        }
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Tem certeza que deseja excluir ${selectedUsers.length} usuários?`)) {
            setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
            addToast(`${selectedUsers.length} usuários excluídos.`, 'error');
            setSelectedUsers([]);
        }
    }
    
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('Todos');
        setPlanFilter('Todos');
        addToast('Filtros limpos.', 'info');
    }

    const statusPill: {[key: string]: string} = { "Ativo": "bg-emerald-100 text-emerald-800", "Inativo": "bg-gray-100 text-gray-800", "Suspenso": "bg-red-100 text-red-800" };
    const planPill: {[key: string]: string} = { "Premium": "bg-yellow-100 text-yellow-800", "Básico": "bg-blue-100 text-blue-800", "White-Label": "bg-purple-100 text-purple-800" };

    return (
        <>
        <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b">
                 <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-xl font-bold text-gray-800 font-heading">Gerenciamento de Usuários</h2>
                     <div className="flex gap-2">
                        <button onClick={() => addToast("Relatório CSV exportado!", "success")} className="bg-white text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-sm">Exportar CSV</button>
                        <PrimaryButton onClick={openAddUserModal}>+ Novo Usuário</PrimaryButton>
                    </div>
                </div>
                <div className="mt-4 grid md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Buscar</label>
                        <TextInput type="text" placeholder="Nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option>Todos</option><option>Ativo</option><option>Inativo</option><option>Suspenso</option>
                        </Select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Plano</label>
                        <Select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
                           <option>Todos</option><option>Premium</option><option>Básico</option><option>White-Label</option>
                        </Select>
                    </div>
                </div>
                 {(searchTerm || statusFilter !== 'Todos' || planFilter !== 'Todos') && (
                     <button onClick={clearFilters} className="text-sm text-emerald-600 hover:underline mt-3">Limpar filtros</button>
                 )}
            </div>

            {selectedUsers.length > 0 && (
                <div className="p-4 bg-emerald-50 border-y flex justify-between items-center">
                    <span className="font-medium text-sm text-emerald-800">{selectedUsers.length} usuários selecionados</span>
                    <div className="flex gap-2">
                        <button onClick={() => addToast(`Status de ${selectedUsers.length} usuários atualizado.`, 'info')} className="text-sm bg-white border border-gray-300 text-gray-700 font-semibold px-3 py-1 rounded-md hover:bg-gray-100">Alterar Status</button>
                        <button onClick={handleBulkDelete} className="text-sm bg-red-500 text-white font-semibold px-3 py-1 rounded-md hover:bg-red-600">Excluir</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="p-4 w-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length > 0 && selectedUsers.length === paginatedUsers.length} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" /></th>
                            <SortableHeader sortKey="name" sortConfig={sortConfig} onSort={handleSort}>Usuário</SortableHeader>
                            <SortableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>Status</SortableHeader>
                            <SortableHeader sortKey="plan" sortConfig={sortConfig} onSort={handleSort}>Plano</SortableHeader>
                            <SortableHeader sortKey="joinDate" sortConfig={sortConfig} onSort={handleSort}>Data de Cadastro</SortableHeader>
                            <SortableHeader sortKey="lastLogin" sortConfig={sortConfig} onSort={handleSort}>Último Login</SortableHeader>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {paginatedUsers.length > 0 ? paginatedUsers.map(user => (
                            <tr key={user.id} className={selectedUsers.includes(user.id) ? 'bg-emerald-50' : 'hover:bg-slate-50'}>
                                <td className="p-4"><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleSelect(user.id)} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" /></td>
                                <td className="p-4 flex items-center"><img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3" /><div><div className="font-medium text-gray-800">{user.name}</div><div className="text-xs text-gray-500">{user.email}</div></div></td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusPill[user.status]}`}>{user.status}</span></td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${planPill[user.plan]}`}>{user.plan}</span></td>
                                <td className="p-4 text-gray-600">{new Date(user.joinDate).toLocaleDateString('pt-BR')}</td>
                                <td className="p-4 text-gray-600">{new Date(user.lastLogin).toLocaleDateString('pt-BR')}</td>
                                <td className="p-4">
                                    <Dropdown button={<button className="text-gray-500 hover:text-gray-800 p-1">&#8942;</button>}>
                                        <DropdownItem onClick={() => openEditUserModal(user)}>Editar</DropdownItem>
                                        <DropdownItem onClick={() => addToast(`Impersonando ${user.name}...`, 'info')}>Impersonar</DropdownItem>
                                        <DropdownItem onClick={() => addToast(`Usuário ${user.name} suspenso.`, 'info')}>Suspender</DropdownItem>
                                        <DropdownItem onClick={() => openDeleteModal(user)}>Excluir</DropdownItem>
                                    </Dropdown>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={7} className="text-center p-8 text-gray-500">Nenhum usuário encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 &&
            <div className="p-4 border-t flex justify-between items-center">
                 <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-md text-sm font-medium bg-white border disabled:opacity-50">&laquo; Anterior</button>
                     {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page ? 'bg-emerald-500 text-white' : 'bg-white border'}`}>{page}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md text-sm font-medium bg-white border disabled:opacity-50">Próximo &raquo;</button>
                </div>
            </div>}
        </Card>
        <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title={editingUser ? "Editar Usuário" : "Adicionar Novo Usuário"}>
            <form onSubmit={handleSaveUser} className="space-y-4">
                <FormField label="Nome Completo"><TextInput name="name" defaultValue={editingUser?.name || ''} required /></FormField>
                <FormField label="E-mail"><TextInput name="email" type="email" defaultValue={editingUser?.email || ''} required /></FormField>
                <FormField label="Plano">
                    <Select name="plan" defaultValue={editingUser?.plan || 'Básico'}>
                        <option>Básico</option><option>Premium</option><option>White-Label</option>
                    </Select>
                </FormField>
                 <FormField label="Status">
                    <Select name="status" defaultValue={editingUser?.status || 'Ativo'}>
                        <option>Ativo</option><option>Inativo</option><option>Suspenso</option>
                    </Select>
                </FormField>
                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsUserModalOpen(false)} className="bg-white text-gray-700 font-semibold px-5 py-2 rounded-lg border hover:bg-gray-100">Cancelar</button>
                    <PrimaryButton type="submit">Salvar</PrimaryButton>
                </div>
            </form>
        </Modal>
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Exclusão">
            <p>Tem certeza que deseja excluir o usuário <strong>{userToDelete?.name}</strong>? Esta ação é irreversível.</p>
            <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="bg-white text-gray-700 font-semibold px-5 py-2 rounded-lg border hover:bg-gray-100">Cancelar</button>
                <button onClick={handleDeleteUser} className="bg-red-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-red-600">Excluir</button>
            </div>
        </Modal>
        </>
    );
};

const SubSectionCard = ({ title, children, cta }: { title: string; children?: React.ReactNode; cta?: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 font-heading">{title}</h3>
            {cta}
        </div>
        {children}
    </div>
);

const SystemVaquinhasView = () => (
    <SubSectionCard title="Gerenciamento de Vaquinhas">
        <p className="text-gray-600">Funcionalidade para visualizar, filtrar e gerenciar todas as vaquinhas da plataforma em desenvolvimento.</p>
    </SubSectionCard>
);
const SystemFinanceiroView = () => (
    <SubSectionCard title="Painel Financeiro">
        <p className="text-gray-600">Funcionalidade para visualizar relatórios financeiros, assinaturas e taxas em desenvolvimento.</p>
    </SubSectionCard>
);
const SystemWhiteLabelView = () => (
    <SubSectionCard title="Clientes White-Label">
         <p className="text-gray-600">Funcionalidade para gerenciar clientes white-label, domínios e configurações em desenvolvimento.</p>
    </SubSectionCard>
);
const SystemSuporteView = () => (
    <SubSectionCard title="Tickets de Suporte">
        <p className="text-gray-600">Funcionalidade para visualizar e responder tickets de suporte dos usuários em desenvolvimento.</p>
    </SubSectionCard>
);
// --- END: SYSTEM ADMIN DASHBOARD ---

const App = () => {
    const [userType, setUserType] = useState<null | 'groupAdmin' | 'systemAdmin'>(null);

    const handleGroupAdminLogin = () => setUserType('groupAdmin');
    const handleSystemAdminLogin = () => setUserType('systemAdmin');
    const handleLogout = () => setUserType(null);

    const renderContent = () => {
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
            {renderContent()}
            {userType === null && <AiChatbot />}
        </ToastProvider>
    );
}

export default App;