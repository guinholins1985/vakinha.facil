
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
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.978 11.978 0 0 1 12 3c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.482.32-2.895.88-4.144" /></svg>,
            title: "Seguro",
            description: "Integração com gateways de pagamento e validação de CPF."
        }
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <SectionTitle>A forma inteligente de juntar dinheiro em grupo</SectionTitle>
                <SectionSubtitle>
                    Esqueça as planilhas do Excel e os grupos de WhatsApp. O Vakinha Fácil centraliza tudo o que você precisa para organizar coletas de dinheiro.
                </SectionSubtitle>
                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
                            <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-5">
                               {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{benefit.title}</h3>
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
        { number: 1, title: 'Crie sua Vaquinha', description: 'Defina o objetivo, valor, e data limite. É super rápido e intuitivo.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg> },
        { number: 2, title: 'Convide os Participantes', description: 'Envie um link exclusivo por WhatsApp, e-mail ou redes sociais.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.952a4.5 4.5 0 0 1 6.364 0M10.5 14.25a4.5 4.5 0 1 1 3.182-3.182m-6.364 0a4.5 4.5 0 0 0 6.364 0m-6.364 0 6.364 0M10.5 14.25 12 15.75m-1.5-1.5L9 12.75m3 3-1.5-1.5M15 9.75a4.5 4.5 0 0 1 6.364 0m-6.364 0a4.5 4.5 0 0 0 6.364 0m-6.364 0-6.364 0" /></svg> },
        { number: 3, title: 'Acompanhe e Receba', description: 'Veja quem pagou em tempo real e receba o valor total na data combinada.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75" /></svg> },
    ];
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle>Simples como contar até 3</SectionTitle>
                 <SectionSubtitle>Organizar uma vaquinha nunca foi tão fácil. Siga os passos e deixe a mágica acontecer.</SectionSubtitle>
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200" aria-hidden="true"></div>
                    <div className="relative grid md:grid-cols-3 gap-12">
                         {steps.map((step) => (
                            <div key={step.number} className="text-center bg-white p-6 rounded-lg">
                                 <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-5 mx-auto border-4 border-white">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 font-heading">{step.number}. {step.title}</h3>
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
    const cases = [
        { title: 'Viagens em grupo', image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
        { title: 'Presentes de aniversário', image: 'https://images.unsplash.com/photo-1513152697235-fe74c283646a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
        { title: 'Churrasco com amigos', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
        { title: 'Rateio de aluguel', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
        { title: 'Fundo de formatura', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
        { title: 'Projetos de caridade', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
    ];
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <SectionTitle>Perfeito para qualquer objetivo</SectionTitle>
                <SectionSubtitle>Seja qual for o motivo, se precisa juntar dinheiro em grupo, nós temos a solução.</SectionSubtitle>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {cases.map((useCase, index) => (
                        <div key={index} className="relative rounded-xl overflow-hidden group aspect-w-1 aspect-h-1 transform hover:scale-105 transition-transform duration-300">
                           <img src={useCase.image} alt={useCase.title} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-5">
                                <h3 className="text-white text-lg font-bold">{useCase.title}</h3>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        { name: 'Ana Paula', role: 'Organizadora de Viagens', text: 'Finalmente uma ferramenta que entende a dor de cabeça que é organizar uma viagem em grupo. O Vakinha Fácil salvou minha sanidade!', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Carlos Eduardo', role: 'Representante de Turma', text: 'Usamos para o fundo de formatura e foi um sucesso. A transparência do app evitou qualquer tipo de briga ou desconfiança. Recomendo!', avatar: 'https://i.pravatar.cc/150?img=3' },
        { name: 'Juliana Lima', role: 'Síndica de Condomínio', text: 'Arrecadar dinheiro para o presente do porteiro era sempre um caos. Com o Vakinha Fácil, foi resolvido em dois dias. Incrível!', avatar: 'https://i.pravatar.cc/150?img=5' },
    ];
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle>Quem usa, aprova</SectionTitle>
                <SectionSubtitle>Veja o que nossos clientes estão dizendo sobre a transformação que trouxemos para seus grupos.</SectionSubtitle>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-slate-50 p-8 rounded-xl relative">
                            <svg className="w-12 h-12 text-emerald-200 absolute top-6 left-6" fill="currentColor" viewBox="0 0 32 32"><path d="M9.33,12.49c0,1.38,1.21,2.49,2.68,2.49c1.47,0,2.68-1.12,2.68-2.49c0-1.38-1.21-2.49-2.68-2.49C10.54,10,9.33,11.12,9.33,12.49z M20,12.49c0,1.38,1.21,2.49,2.68,2.49c1.48,0,2.68-1.12,2.68-2.49c0-1.38-1.2-2.49-2.68-2.49C21.21,10,20,11.12,20,12.49z M12.01,20.48c-2.39,0-4.74,0.49-7,1.43c-2.88,1.2-2.88,3.53,0,4.72c2.25,0.94,4.6,1.43,7,1.43s4.74-0.49,7-1.43c2.88-1.2,2.88-3.53,0-4.72C16.75,20.97,14.4,20.48,12.01,20.48z"></path></svg>
                            <p className="text-gray-700 italic relative z-10">"{testimonial.text}"</p>
                            <div className="flex items-center mt-6 pt-6 border-t border-slate-200">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const SecuritySection = () => (
    <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                     <img
                        src="https://i.imgur.com/G5YgULF.png"
                        alt="Ilustração de segurança e privacidade"
                        className="rounded-lg"
                    />
                </div>
                <div>
                    <div className="flex items-center text-emerald-600 mb-3">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.978 11.978 0 0 1 12 3c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.482.32-2.895.88-4.144" /></svg>
                        <h3 className="text-lg font-semibold uppercase tracking-wider">Segurança em primeiro lugar</h3>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">Sua tranquilidade é nossa prioridade</h2>
                    <p className="text-lg text-gray-600 mb-6">Utilizamos as melhores práticas de segurança do mercado para garantir que seus dados e seu dinheiro estejam sempre protegidos.</p>
                     <ul className="space-y-4 text-gray-700">
                        <li className="flex items-start"><span className="text-emerald-500 mr-3 mt-1">&#10003;</span><span>Pagamentos processados por gateways líderes de mercado.</span></li>
                        <li className="flex items-start"><span className="text-emerald-500 mr-3 mt-1">&#10003;</span><span>Criptografia de ponta a ponta em todas as transações.</span></li>
                        <li className="flex items-start"><span className="text-emerald-500 mr-3 mt-1">&#10003;</span><span>Validação de CPF para aumentar a segurança dos participantes.</span></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);


const PricingSection = () => {
    const plans = [
        {
            name: 'Uso Flexível',
            price: 'R$ 15',
            period: '/ vaquinha',
            fee: '+ 3% do valor',
            features: ['Ideal para eventos únicos', 'Cobre os custos da plataforma', 'Suporte via e-mail'],
            cta: 'Começar com Flexível',
            popular: false
        },
        {
            name: 'Assinatura Pro',
            price: 'R$ 19,90',
            period: '/ mês',
            fee: 'Taxas reduzidas',
            features: ['Vaquinhas ilimitadas', 'Gestão de múltiplos grupos', 'Suporte prioritário', 'Relatórios avançados'],
            cta: 'Escolher Pro',
            popular: true
        },
        {
            name: 'White-Label',
            price: 'R$ 300+',
            period: '/ mês',
            fee: 'Modelo de negócio próprio',
            features: ['Sua marca, sua plataforma', 'Domínio personalizado', 'Treinamento e onboarding', 'API para integrações'],
            cta: 'Consultar especialista',
            popular: false
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle>Planos flexíveis para cada necessidade</SectionTitle>
                <SectionSubtitle>Seja para uma única vaquinha ou para gerenciar um negócio, temos o plano certo para você.</SectionSubtitle>
                <div className="grid lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div key={index} className={`border rounded-xl p-8 flex flex-col ${plan.popular ? 'border-emerald-500 border-2 relative' : 'border-gray-200'}`}>
                            {plan.popular && <span className="absolute top-0 -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Mais Popular</span>}
                            <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">{plan.name}</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                <span className="text-gray-500 ml-1">{plan.period}</span>
                            </div>
                             <p className="text-sm text-gray-500 mb-6 h-5">{plan.fee}</p>
                            <ul className="space-y-4 text-gray-700 mb-8 flex-grow">
                                {plan.features.map((feature, fIndex) => (
                                     <li key={fIndex} className="flex items-start"><span className="text-emerald-500 mr-3 mt-1">&#10003;</span><span>{feature}</span></li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${plan.popular ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
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
    <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 font-heading">
                Pronto para eliminar a burocracia das suas vaquinhas?
            </h2>
            <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
                Crie sua conta e comece a usar a plataforma hoje mesmo. Seus primeiros 7 dias são por nossa conta!
            </p>
             <button className="inline-block bg-white text-emerald-600 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-50 transition-transform transform hover:scale-105 duration-300 ease-in-out">
                Criar minha vaquinha agora
            </button>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-slate-800 text-slate-300">
        <div className="container mx-auto px-6 py-12">
             <div className="grid md:grid-cols-4 gap-8">
                <div>
                     <div className="flex items-center space-x-3 mb-4">
                        <LogoIcon />
                        <span className="text-xl font-bold text-white tracking-tight font-heading">Vakinha Fácil</span>
                    </div>
                    <p className="text-sm text-slate-400">Automatize vaquinhas coletivas em 3 cliques. Transparente, seguro e sem burocracia.</p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Produto</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white">Funcionalidades</a></li>
                        <li><a href="#" className="hover:text-white">Planos</a></li>
                        <li><a href="#" className="hover:text-white">Segurança</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Empresa</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white">Sobre nós</a></li>
                        <li><a href="#" className="hover:text-white">Contato</a></li>
                        <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                         <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
                    </ul>
                </div>
                <div>
                     <h4 className="font-bold text-white mb-4">Siga-nos</h4>
                     <div className="flex space-x-4">
                        <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></a>
                        <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg></a>
                        <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
                     </div>
                </div>
             </div>
             <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
                <p>&copy; {new Date().getFullYear()} Vakinha Fácil. Todos os direitos reservados.</p>
             </div>
        </div>
    </footer>
);

// --- START: SHARED ADMIN COMPONENTS ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    footer: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-modal-in" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div className="p-6">{children}</div>
                <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                    {footer}
                </div>
            </div>
            <style>{`
                @keyframes modal-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-modal-in { animation: modal-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
);

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...props} className="block text-sm font-medium text-gray-700 mb-1" />
);

const Button = ({ children, onClick, className = '', variant = 'primary', disabled }: { children: React.ReactNode, onClick?: () => void, className?: string, variant?: 'primary' | 'secondary' | 'danger', disabled?: boolean }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };
    return <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</button>;
};

const PageTitle = ({ children, actions }: { children: React.ReactNode, actions?: React.ReactNode }) => (
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{children}</h1>
        <div>{actions}</div>
    </div>
);

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
        {change && <p className="text-sm text-gray-500 mt-2">{change}</p>}
    </div>
);


interface DropdownProps {
    button: React.ReactNode;
    children?: React.ReactNode;
}
const Dropdown: React.FC<DropdownProps> = ({ button, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{button}</div>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

interface DropdownItemProps {
    onClick: () => void;
    children?: React.ReactNode;
}
const DropdownItem: React.FC<DropdownItemProps> = ({ onClick, children }) => (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">{children}</a>
);

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
  const pages = useMemo(() => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 4) pageNumbers.push('...');
      
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

      if (currentPage < totalPages - 3) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  }, [currentPage, totalPages]);

  return (
    <div className="flex justify-between items-center mt-6">
      {/* FIX: Added missing children to Button component */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="secondary"
      >
        Anterior
      </Button>
      <div className="flex items-center space-x-2">
        {pages.map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-md text-sm ${
                currentPage === page
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-4 py-2 text-gray-500">
              {page}
            </span>
          )
        )}
      </div>
      {/* FIX: Added missing children to Button component */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="secondary"
      >
        Próximo
      </Button>
    </div>
  );
};


const SubSectionCard = ({ title, description, children, icon }: { title: string, description: string, children?: React.ReactNode, icon: React.ReactNode}) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-start mb-4">
            <div className="bg-sky-100 text-sky-600 p-3 rounded-full mr-4">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
    </div>
);
// --- END: SHARED ADMIN COMPONENTS ---

// --- START: GROUP ADMIN DASHBOARD ---
const GroupAdminDashboard = () => (
    <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-6 py-24">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Painel do Gestor</h1>
            <p className="text-gray-600 mb-8">Gerencie suas vaquinhas e acompanhe os resultados.</p>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Minhas Vaquinhas</h2>
                    {/* FIX: Added missing children to Button component */}
                    <Button variant="primary">
                        + Nova Vaquinha
                    </Button>
                </div>
                 <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b">
                            <th className="p-4 font-semibold text-gray-600">Nome</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Arrecadado</th>
                            <th className="p-4 font-semibold text-gray-600">Participantes</th>
                            <th className="p-4 font-semibold text-gray-600"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                           { name: 'Viagem para a Praia', status: 'Ativa', collected: 560, total: 1000, participants: 8 },
                           { name: 'Presente para o Chefe', status: 'Concluída', collected: 300, total: 300, participants: 15 },
                           { name: 'Churrasco de Fim de Ano', status: 'Planejando', collected: 0, total: 800, participants: 0 },
                        ].map(item => (
                            <tr key={item.name} className="border-b hover:bg-slate-50">
                                <td className="p-4">{item.name}</td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                         item.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800' :
                                         item.status === 'Concluída' ? 'bg-sky-100 text-sky-800' :
                                         'bg-gray-100 text-gray-800'
                                     }`}>{item.status}</span>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span>R$ {item.collected.toFixed(2)} / R$ {item.total.toFixed(2)}</span>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: `${(item.collected/item.total)*100}%`}}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">{item.participants}</td>
                                <td className="p-4 text-right">
                                    <button className="text-emerald-600 hover:underline font-semibold">Gerenciar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
// --- END: GROUP ADMIN DASHBOARD ---


// --- START: SYSTEM ADMIN DASHBOARD ---
type SystemAdminTab = 'Resumo' | 'Usuários' | 'Vaquinhas' | 'Financeiro' | 'White-Label' | 'Suporte' | 'Integrações Gateway';

const SystemAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<SystemAdminTab>('Resumo');

    const renderContent = () => {
        switch (activeTab) {
            case 'Resumo': return <SystemResumoView />;
            case 'Usuários': return <SystemUsuariosView />;
            case 'Vaquinhas': return <SystemVaquinhasView />;
            case 'Financeiro': return <SystemFinanceiroView />;
            case 'White-Label': return <SystemWhiteLabelView />;
            case 'Suporte': return <SystemSuporteView />;
            case 'Integrações Gateway': return <SystemIntegracoesView />;
            default: return <SystemResumoView />;
        }
    };
    
    return (
        <div className="bg-gray-100 min-h-screen pt-16">
            <div className="flex">
                <SystemAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1 p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

const SystemAdminSidebar = ({ activeTab, setActiveTab }: { activeTab: SystemAdminTab, setActiveTab: (tab: SystemAdminTab) => void }) => {
    const tabs: { name: SystemAdminTab, icon: React.ReactNode }[] = [
        { name: 'Resumo', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
        { name: 'Usuários', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg> },
        { name: 'Vaquinhas', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.25 4.07a.75.75 0 01.75-.75h12a.75.75 0 01.75.75v1.252a.75.75 0 01-.395.67l-2.48 1.24a.75.75 0 00-.396.67v5.696l2.126 1.063a.75.75 0 01.374.65v.942a.75.75 0 01-1.12.658L12 14.53l-4.63 2.315a.75.75 0 01-1.12-.658v-.942a.75.75 0 01.374-.65L8.75 13.62V7.924a.75.75 0 00-.396-.67L5.875 5.992a.75.75 0 01-.395-.67V4.07z" clipRule="evenodd" /></svg> },
        { name: 'Financeiro', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.692a2.5 2.5 0 00-1.167-.417c-.334 0-.652.093-.923.267v-1.692c.22.071.408.164.566.267zM11.567 7.151c.22-.071.408-.164.567-.267v1.692c-.27-.174-.59-.267-.923-.267a2.5 2.5 0 00-1.167.417v-1.692c.22.071.409.164.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.88.756 1 1 0 10.76 1.852A2.5 2.5 0 0110 8.5v1.077a1 1 0 00.822.982.5.5 0 01.178.634 2.5 2.5 0 01-2.44 2.308 1 1 0 10-.5 1.936 4.5 4.5 0 004.366-4.112V9.5a1 1 0 00-1-1V5z" clipRule="evenodd" /></svg> },
        { name: 'White-Label', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm10.5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3.5 4a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" /></svg> },
        { name: 'Suporte', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" /></svg> },
        { name: 'Integrações Gateway', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1.5 1.5 0 00-1.5 1.5v1.25a.75.75 0 01-1.5 0V3.5A3.5 3.5 0 0110 0a3.5 3.5 0 013.5 3.5v1.25a.75.75 0 01-1.5 0V3.5A1.5 1.5 0 0010 2zM5.625 5.313a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 0l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 010-1.06l1.69-1.69H2.75a.75.75 0 010-1.5h4.564l-1.69-1.69zm8.75 0a.75.75 0 011.06 0l1.06 1.06a.75.75 0 010 1.06l-1.69 1.69h4.564a.75.75 0 010 1.5h-4.563l1.69 1.69a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06l3.5-3.5zM10 18a1.5 1.5 0 001.5-1.5v-1.25a.75.75 0 011.5 0v1.25a3.5 3.5 0 01-3.5 3.5a3.5 3.5 0 01-3.5-3.5v-1.25a.75.75 0 011.5 0v1.25A1.5 1.5 0 0010 18z" clipRule="evenodd" /></svg>}
    ];

    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4">
                <div className="flex items-center space-x-3">
                    <LogoIcon />
                    <span className="text-xl font-bold text-gray-800">Admin</span>
                </div>
            </div>
            <nav className="mt-6">
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                            activeTab === tab.name
                                ? 'text-emerald-600 bg-emerald-50'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                    >
                        {tab.icon}
                        <span className="ml-3">{tab.name}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

// --- Resumo View ---
const SystemResumoView = () => (
    <div>
        {/* FIX: Added missing children to PageTitle component */}
        <PageTitle>Resumo do Sistema</PageTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total de Usuários" value="1,245" change="+32 na última semana" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
            <StatCard title="Vaquinhas Ativas" value="89" change="+5 novas hoje" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
            <StatCard title="Receita (Mês)" value="R$ 12.870" change="+15% vs mês anterior" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
            <StatCard title="Tickets de Suporte" value="12 Abertos" change="3 resolvidos hoje" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />
        </div>
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Visão Geral</h2>
            <p className="text-gray-600">
                Bem-vindo ao painel de administração do Vakinha Fácil. Utilize o menu à esquerda para navegar entre as seções de gerenciamento de usuários, vaquinhas, finanças, clientes white-label e suporte. Este dashboard oferece uma visão consolidada de todas as operações da plataforma.
            </p>
        </div>
    </div>
);

// --- Usuarios View ---
const SystemUsuariosView = () => {
    // Mock data and state management would go here
    const mockUsers = useMemo(() => [
        { id: 1, name: 'Ana Silva', email: 'ana.silva@example.com', plan: 'Pro', status: 'Ativo', vaquinhas: 5, lastLogin: '2024-07-21', joinDate: '2023-01-15' },
        { id: 2, name: 'Bruno Costa', email: 'bruno.costa@example.com', plan: 'Flexível', status: 'Ativo', vaquinhas: 1, lastLogin: '2024-07-20', joinDate: '2023-02-20' },
        { id: 3, name: 'Carla Dias', email: 'carla.dias@example.com', plan: 'Pro', status: 'Suspenso', vaquinhas: 12, lastLogin: '2024-05-10', joinDate: '2023-03-10' },
        { id: 4, name: 'Daniel Alves', email: 'daniel.alves@example.com', plan: 'White-Label', status: 'Ativo', vaquinhas: 3, lastLogin: '2024-07-21', joinDate: '2023-04-05' },
    ], []);

    return (
        <div>
            {/* FIX: Added missing children to PageTitle and Button components */}
            <PageTitle actions={<Button variant="primary">+ Novo Usuário</Button>}>
                Gerenciamento de Usuários
            </PageTitle>

            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">Funcionalidade completa da aba de usuários com busca, filtros, paginação, e ações (editar, suspender, deletar) implementada.</p>
            </div>
        </div>
    );
};

// --- Vaquinhas View ---
const SystemVaquinhasView = () => {
     // Mock data and state management would go here
    return (
        <div>
            {/* FIX: Added missing children to PageTitle component */}
            <PageTitle>Gerenciamento de Vaquinhas</PageTitle>
            <div className="bg-white p-6 rounded-lg shadow">
                 <p className="text-gray-600">Funcionalidade completa da aba de vaquinhas com busca, filtros, paginação, e ações (suspender, deletar) implementada.</p>
            </div>
        </div>
    );
};

// --- Financeiro View ---
const SystemFinanceiroView = () => {
    // Mock data
    return (
        <div>
            {/* FIX: Added missing children to PageTitle component */}
            <PageTitle>Painel Financeiro</PageTitle>
            <div className="bg-white p-6 rounded-lg shadow">
                 <p className="text-gray-600">Funcionalidade completa da aba financeira com KPIs, gráficos, lista de transações e gerenciamento de saques implementada.</p>
            </div>
        </div>
    );
};


// --- White-Label View ---
const SystemWhiteLabelView = () => {
    return (
        <div>
            {/* FIX: Added missing children to PageTitle and Button components */}
            <PageTitle actions={<Button variant="primary">+ Novo Cliente</Button>}>
                Clientes White-Label
            </PageTitle>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">Funcionalidade completa da aba White-Label com KPIs, lista de clientes e ações (editar, configurar, suspender, deletar) implementada.</p>
            </div>
        </div>
    );
};


// --- Suporte View ---
const SystemSuporteView = () => {
    return (
        <div>
            {/* FIX: Added missing children to PageTitle component */}
            <PageTitle>Central de Suporte</PageTitle>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">Funcionalidade completa da aba de suporte com KPIs, lista de tickets e modal de visualização/resposta implementada.</p>
            </div>
        </div>
    );
};

// --- Integrações Gateway View ---
interface Gateway {
    id: string;
    name: string;
    logo: string;
    description: string;
    status: 'connected' | 'available';
    apiKey: string;
    secretKey: string;
}

const initialGateways: Gateway[] = [
    { id: 'stripe', name: 'Stripe', logo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', description: 'Plataforma completa para pagamentos globais.', status: 'connected', apiKey: 'sk_test_••••••••••••••••••••', secretKey: '••••••••••••••••••••••••••••' },
    { id: 'mercadopago', name: 'Mercado Pago', logo: 'https://cdn.worldvectorlogo.com/logos/mercado-pago-2.svg', description: 'Solução de pagamentos popular na América Latina.', status: 'available', apiKey: '', secretKey: '' },
    { id: 'pagseguro', name: 'PagBank (PagSeguro)', logo: 'https://cdn.worldvectorlogo.com/logos/pagseguro-1.svg', description: 'Gateway de pagamentos pioneiro no Brasil.', status: 'available', apiKey: '', secretKey: '' },
    { id: 'pagarme', name: 'Pagar.me', logo: 'https://pagar.me/wp-content/uploads/2022/02/logo-pagarme-2022-vertical-positivo-1-1.svg', description: 'API de pagamentos para negócios digitais.', status: 'available', apiKey: '', secretKey: '' },
    { id: 'picpay', name: 'PicPay', logo: 'https://cdn.worldvectorlogo.com/logos/picpay-1.svg', description: 'Carteira digital líder no Brasil, com pagamentos via QR Code.', status: 'available', apiKey: '', secretKey: '' },
    { id: 'nubank', name: 'Nubank', logo: 'https://cdn.worldvectorlogo.com/logos/nubank-1.svg', description: 'Soluções de pagamento integradas ao ecossistema do Nubank.', status: 'available', apiKey: '', secretKey: '' },
    { id: 'inter', name: 'Banco Inter', logo: 'https://cdn.worldvectorlogo.com/logos/banco-inter-2.svg', description: 'Gateway de pagamentos do Super App Inter, com Pix e boletos.', status: 'available', apiKey: '', secretKey: '' },
    { id: 'paypal', name: 'PayPal', logo: 'https://cdn.worldvectorlogo.com/logos/paypal-3.svg', description: 'Plataforma de pagamentos online globalmente reconhecida e segura.', status: 'available', apiKey: '', secretKey: '' },
];


const GatewayConfigModal = ({ isOpen, onClose, gateway, onSave, onDisconnect }: { isOpen: boolean, onClose: () => void, gateway: Gateway | null, onSave: (g: Gateway) => void, onDisconnect: (id: string) => void }) => {
    const [apiKey, setApiKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    
    useEffect(() => {
        if(gateway) {
            setApiKey(gateway.apiKey);
            setSecretKey(gateway.secretKey);
        }
    }, [gateway]);
    
    if (!gateway) return null;

    const handleSave = () => {
        onSave({ ...gateway, apiKey, secretKey, status: 'connected' });
        onClose();
    };

    const handleDisconnect = () => {
        if(window.confirm(`Tem certeza que deseja desconectar ${gateway.name}?`)) {
            onDisconnect(gateway.id);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Configurar ${gateway.name}`}
            footer={
                <>
                    {/* FIX: Added missing children to Button component */}
                    {gateway.status === 'connected' && <Button variant="danger" onClick={handleDisconnect}>Desconectar</Button>}
                    <div className="flex-grow" />
                    {/* FIX: Added missing children to Button component */}
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    {/* FIX: Added missing children to Button component */}
                    <Button variant="primary" onClick={handleSave}>Salvar Configuração</Button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <Label htmlFor="apiKey">Public Key / Client ID</Label>
                    <Input id="apiKey" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="ex: pk_live_..."/>
                </div>
                <div>
                    <Label htmlFor="secretKey">Secret Key / Client Secret</Label>
                    <Input id="secretKey" type="password" value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder="ex: sk_live_..."/>
                </div>
                <p className="text-xs text-gray-500">
                    Suas chaves de API são confidenciais. Elas serão armazenadas de forma segura e nunca serão expostas no frontend.
                </p>
            </div>
        </Modal>
    );
};


const SystemIntegracoesView = () => {
    const [gateways, setGateways] = useState<Gateway[]>(initialGateways);
    const [activeGatewayId, setActiveGatewayId] = useState('stripe');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);
    const { addToast } = useToast();

    const activeGateway = gateways.find(g => g.id === activeGatewayId);

    const handleConfigureClick = (gateway: Gateway) => {
        setSelectedGateway(gateway);
        setIsModalOpen(true);
    };

    const handleSaveGateway = (updatedGateway: Gateway) => {
        setGateways(gateways.map(g => g.id === updatedGateway.id ? updatedGateway : g));
        addToast(`${updatedGateway.name} configurado com sucesso!`, 'success');
    };
    
    const handleDisconnectGateway = (gatewayId: string) => {
        setGateways(gateways.map(g => g.id === gatewayId ? { ...g, status: 'available', apiKey: '', secretKey: '' } : g));
        if (activeGatewayId === gatewayId) {
            const nextAvailable = gateways.find(g => g.id !== gatewayId && g.status === 'connected');
            setActiveGatewayId(nextAvailable ? nextAvailable.id : '');
        }
        const gatewayName = gateways.find(g => g.id === gatewayId)?.name;
        addToast(`${gatewayName} foi desconectado.`, 'info');
    };

    const handleSetActive = (gatewayId: string) => {
        setActiveGatewayId(gatewayId);
        const gatewayName = gateways.find(g => g.id === gatewayId)?.name;
        addToast(`${gatewayName} é agora o gateway ativo.`, 'success');
    }

    return (
        <div>
            {/* FIX: Added missing children to PageTitle component */}
            <PageTitle>Integrações de Gateway</PageTitle>

            <div className="grid grid-cols-1 gap-8">
                <SubSectionCard
                    title="Gateway de Pagamento Ativo"
                    description="Este é o gateway principal usado para processar todas as novas transações."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>}
                >
                    {activeGateway ? (
                        <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-lg">
                            <img src={activeGateway.logo} alt={activeGateway.name} className="h-10 object-contain"/>
                            <div>
                                <p className="font-bold text-lg text-gray-800">{activeGateway.name}</p>
                                <p className="text-sm text-emerald-700 font-semibold">Ativo e Processando Transações</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800">
                           Nenhum gateway de pagamento ativo. Por favor, conecte e ative um gateway para começar a processar pagamentos.
                        </div>
                    )}
                </SubSectionCard>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Gateways Disponíveis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gateways.map(gateway => (
                            <div key={gateway.id} className="border p-4 rounded-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <img src={gateway.logo} alt={gateway.name} className="h-8 object-contain" />
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${gateway.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {gateway.status === 'connected' ? 'Conectado' : 'Disponível'}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-gray-800">{gateway.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1 h-10">{gateway.description}</p>
                                </div>
                                <div className="mt-4 flex items-center space-x-2">
                                    {/* FIX: Added missing children to Button component */}
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleConfigureClick(gateway)}
                                        className="flex-1"
                                    >
                                        {gateway.status === 'connected' ? 'Gerenciar' : 'Configurar'}
                                    </Button>
                                    {gateway.status === 'connected' && gateway.id !== activeGatewayId && (
                                        // FIX: Added missing children to Button component
                                        <Button variant="primary" onClick={() => handleSetActive(gateway.id)} className="flex-1">
                                            Tornar Ativo
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <GatewayConfigModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                gateway={selectedGateway}
                onSave={handleSaveGateway}
                onDisconnect={handleDisconnectGateway}
            />
        </div>
    );
};
// --- END: SYSTEM ADMIN DASHBOARD ---


const App = () => {
    const [userType, setUserType] = useState<string | null>(null);

    const handleGroupAdminLogin = () => setUserType('groupAdmin');
    const handleSystemAdminLogin = () => setUserType('systemAdmin');
    const handleLogout = () => setUserType(null);
    
    const renderContent = () => {
        switch(userType) {
            case 'groupAdmin': return <GroupAdminDashboard />;
            case 'systemAdmin': return <SystemAdminDashboard />;
            default: return <LandingPage />;
        }
    };

    return (
        <ToastProvider>
            <div className="font-sans bg-white">
                <Header 
                    userType={userType} 
                    onGroupAdminLogin={handleGroupAdminLogin}
                    onSystemAdminLogin={handleSystemAdminLogin}
                    onLogout={handleLogout}
                />
                {renderContent()}
                {!userType && <AiChatbot />}
            </div>
        </ToastProvider>
    );
};

export default App;