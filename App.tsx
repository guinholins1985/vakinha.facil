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


const Logo = ({ className }: { className?: string }) => (
    <img 
        src="https://i.ibb.co/c8SgX2N/logo-vakinha.png"
        alt="Vakinha Fácil Logo"
        className={className}
    />
);

const Header = ({ userType, onGroupAdminLogin, onSystemAdminLogin, onLogout }: { userType: string | null, onGroupAdminLogin: () => void, onSystemAdminLogin: () => void, onLogout: () => void }) => (
    <header className="absolute top-0 left-0 right-0 z-20 bg-slate-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
            <nav className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Logo className="w-48" />
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
                            <button onClick={onGroupAdminLogin} className="hidden sm:inline-block bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105">
                                Criar Vaquinha
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </div>
    </header>
);

const LandingPage = ({ onStartCreating }: { onStartCreating: () => void }) => (
    <>
        <HeroSection onStartCreating={onStartCreating} />
        <BenefitsSection />
        <HowItWorksSection />
        <UseCasesSection />
        <TestimonialsSection />
        <SecuritySection />
        <PricingSection onStartCreating={onStartCreating} />
        <FinalCTASection onStartCreating={onStartCreating} />
        <Footer />
    </>
);

const HeroSection = ({ onStartCreating }: { onStartCreating: () => void }) => (
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
                    <button onClick={onStartCreating} className="inline-block bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 duration-300 ease-in-out">
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


const PricingSection = ({ onStartCreating }: { onStartCreating: () => void }) => {
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
                            <button onClick={onStartCreating} className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${plan.popular ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const FinalCTASection = ({ onStartCreating }: { onStartCreating: () => void }) => (
    <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 font-heading">
                Pronto para eliminar a burocracia das suas vaquinhas?
            </h2>
            <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
                Crie sua conta e comece a usar a plataforma hoje mesmo. Seus primeiros 7 dias são por nossa conta!
            </p>
             <button onClick={onStartCreating} className="inline-block bg-white text-emerald-600 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-50 transition-transform transform hover:scale-105 duration-300 ease-in-out">
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
                        <Logo className="w-28" />
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
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
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
    <input {...props} className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${props.className}`} />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${props.className}`} />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
);

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...props} className="block text-sm font-medium text-gray-700 mb-1" />
);

const Button = ({ children, onClick, className = '', variant = 'primary', disabled }: { children?: React.ReactNode, onClick?: () => void, className?: string, variant?: 'primary' | 'secondary' | 'danger', disabled?: boolean }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };
    return <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</button>;
};

const PageTitle = ({ children, actions }: { children?: React.ReactNode, actions?: React.ReactNode }) => (
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

    const handleItemClick = () => {
        setIsOpen(false);
    }
    
    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{button}</div>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {React.Children.map(children, child => {
                            if (React.isValidElement(child)) {
                                const originalOnClick = child.props.onClick || (() => {});
                                return React.cloneElement(child, { onClick: () => { originalOnClick(); handleItemClick(); } } as any);
                            }
                            return child;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

interface DropdownItemProps {
    onClick?: () => void;
    children?: React.ReactNode;
}
const DropdownItem: React.FC<DropdownItemProps> = ({ onClick = () => {}, children }) => (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">{children}</a>
);

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
  const pages = useMemo(() => {
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push('...');
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

      if (currentPage < totalPages - 2) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  }, [currentPage, totalPages]);

  return (
    <div className="flex justify-between items-center mt-6">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="secondary"
      >
        Anterior
      </Button>
      <div className="hidden sm:flex items-center space-x-2">
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
       <span className="sm:hidden text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
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
                    <Button variant="primary">
                        + Nova Vaquinha
                    </Button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[640px]">
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
    </div>
);
// --- END: GROUP ADMIN DASHBOARD ---


// --- START: SYSTEM ADMIN DASHBOARD ---
type SystemAdminTab = 'Resumo' | 'Usuários' | 'Vaquinhas' | 'Financeiro' | 'White-Label' | 'Suporte' | 'Integrações Gateway' | 'Configurações';

type User = {
    id: number;
    name: string;
    email: string;
    plan: 'Pro' | 'Flexível' | 'White-Label';
    role: 'Admin' | 'Moderador' | 'Comum';
    verificationStatus: 'Verificado' | 'Pendente' | 'Rejeitado';
    status: 'Ativo' | 'Suspenso';
    vaquinhas: number;
    lastLogin: string;
    joinDate: string;
};

const UserEditModal = ({ isOpen, onClose, onSave, user }: { isOpen: boolean, onClose: () => void, onSave: (user: User) => void, user: User | null }) => {
    const [formData, setFormData] = useState<Omit<User, 'id' | 'vaquinhas' | 'lastLogin' | 'joinDate' | 'verificationStatus'>>({
        name: '',
        email: '',
        plan: 'Flexível',
        status: 'Ativo',
        role: 'Comum'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                plan: user.plan,
                status: user.status,
                role: user.role,
            });
        } else {
            // Reset for new user
            setFormData({ name: '', email: '', plan: 'Flexível', status: 'Ativo', role: 'Comum' });
        }
    }, [user, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.email) {
            return;
        }
        
        const userToSave: User = {
            ...(user || { id: Date.now(), vaquinhas: 0, lastLogin: new Date().toISOString().split('T')[0], joinDate: new Date().toISOString().split('T')[0], verificationStatus: 'Pendente' }),
            ...formData,
        };
        onSave(userToSave);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={user ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit}>Salvar</Button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="plan">Plano</Label>
                        <Select id="plan" name="plan" value={formData.plan} onChange={handleChange}>
                            <option value="Flexível">Flexível</option>
                            <option value="Pro">Pro</option>
                            <option value="White-Label">White-Label</option>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="role">Cargo</Label>
                        <Select id="role" name="role" value={formData.role} onChange={handleChange}>
                            <option value="Comum">Comum</option>
                            <option value="Moderador">Moderador</option>
                            <option value="Admin">Admin</option>
                        </Select>
                    </div>
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select id="status" name="status" value={formData.status} onChange={handleChange}>
                        <option value="Ativo">Ativo</option>
                        <option value="Suspenso">Suspenso</option>
                    </Select>
                </div>
            </div>
        </Modal>
    );
};

const VerificationModal = ({ isOpen, onClose, onVerify, user }: { isOpen: boolean, onClose: () => void, onVerify: (userId: number, status: 'Verificado' | 'Rejeitado') => void, user: User | null }) => {
    if (!user) return null;
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Verificação de Conta: ${user.name}`}
            footer={
                <>
                    <Button variant="danger" onClick={() => onVerify(user.id, 'Rejeitado')}>Rejeitar</Button>
                    <Button variant="primary" onClick={() => onVerify(user.id, 'Verificado')}>Aprovar</Button>
                </>
            }
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600">Analise o documento abaixo para confirmar a identidade do usuário.</p>
                <div>
                    <img src="https://i.imgur.com/gTf7F4j.png" alt="Documento de exemplo" className="rounded-lg border w-full"/>
                </div>
                <div className="text-xs bg-gray-100 p-2 rounded">
                    <p><strong>Nome:</strong> {user.name}</p>
                    <p><strong>E-mail:</strong> {user.email}</p>
                </div>
            </div>
        </Modal>
    );
};

const ActivityLogModal = ({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: User | null }) => {
    if (!user) return null;
    const activities = [
        { icon: '💸', text: `Contribuiu com R$ 50,00 na vaquinha "Viagem para a Praia 2024"`, date: '2024-07-20 14:30' },
        { icon: '🎉', text: `Criou a vaquinha "Aniversário da Carla"`, date: '2024-07-18 10:15' },
        { icon: '✉️', text: `Convidou 3 novos participantes para "Aniversário da Carla"`, date: '2024-07-18 10:20' },
        { icon: '💳', text: `Atualizou o método de pagamento`, date: '2024-07-15 09:00' },
        { icon: '🔒', text: `Realizou login no sistema`, date: '2024-07-21 11:00' },
    ];
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Histórico de Atividades: ${user.name}`}
            footer={<Button variant="secondary" onClick={onClose}>Fechar</Button>}
        >
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 bg-slate-50 rounded-md">
                        <span className="text-xl">{activity.icon}</span>
                        <div>
                            <p className="text-sm text-gray-800">{activity.text}</p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};


const SystemAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<SystemAdminTab>('Resumo');

    const renderContent = () => {
        switch (activeTab) {
            case 'Resumo': return <SystemResumoView setActiveTab={setActiveTab}/>;
            case 'Usuários': return <SystemUsuariosView />;
            case 'Vaquinhas': return <SystemVaquinhasView />;
            case 'Financeiro': return <SystemFinanceiroView />;
            case 'White-Label': return <SystemWhiteLabelView setActiveTab={setActiveTab} />;
            case 'Suporte': return <SystemSuporteView />;
            case 'Integrações Gateway': return <SystemIntegracoesView />;
            case 'Configurações': return <SystemConfiguracoesView setActiveTab={setActiveTab} />;
            default: return <SystemResumoView setActiveTab={setActiveTab}/>;
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
        { name: 'Integrações Gateway', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1.5 1.5 0 00-1.5 1.5v1.25a.75.75 0 01-1.5 0V3.5A3.5 3.5 0 0110 0a3.5 3.5 0 013.5 3.5v1.25a.75.75 0 01-1.5 0V3.5A1.5 1.5 0 0010 2zM5.625 5.313a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 0l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 010-1.06l1.69-1.69H2.75a.75.75 0 010-1.5h4.564l-1.69-1.69zm8.75 0a.75.75 0 011.06 0l1.06 1.06a.75.75 0 010 1.06l-1.69 1.69h4.564a.75.75 0 010 1.5h-4.563l1.69 1.69a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06l3.5-3.5zM10 18a1.5 1.5 0 001.5-1.5v-1.25a.75.75 0 011.5 0v1.25a3.5 3.5 0 01-3.5 3.5a3.5 3.5 0 01-3.5-3.5v-1.25a.75.75 0 011.5 0v1.25A1.5 1.5 0 0010 18z" clipRule="evenodd" /></svg>},
        { name: 'Configurações', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg> },
    ];

    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4">
                <div className="flex items-center space-x-3">
                    <Logo className="w-24" />
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
const SystemResumoView = ({ setActiveTab }: { setActiveTab: (tab: SystemAdminTab) => void }) => {
    const { addToast } = useToast();
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    
    const chartData = useMemo(() => {
        const data: { [key: string]: number } = {};
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            data[dateString] = Math.random() * 500 + 100; // Mock daily revenue
        }
        return Object.entries(data).map(([date, revenue]) => ({ date, revenue })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, []);

    const recentActivities = [
        { id: 1, text: "Nova vaquinha 'Formatura 2025' atingiu 50% da meta.", time: "há 15 minutos", type: "success" },
        { id: 2, text: "Saque de R$ 800 solicitado para a vaquinha 'Presente do Chefe'.", time: "há 1 hora", type: "warning" },
        { id: 3, text: "Novo usuário 'joana.darc@email.com' se cadastrou no plano Pro.", time: "há 3 horas", type: "info" },
        { id: 4, text: "Ticket de suporte #790 aberto: 'Problema com login'.", time: "há 5 horas", type: "danger" },
    ];

    const activityIcons = {
        success: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
        warning: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.22 2.85-1.22 3.486 0l5.58 10.795a2 2 0 01-1.743 2.906H4.42a2 2 0 01-1.743-2.906l5.58-10.795zM10 12a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" /></svg>,
        info: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>,
        danger: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
    };

    return (
        <div>
            <PageTitle>Dashboard Principal</PageTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Arrecadação Total (Mês)" value={formatCurrency(12870)} change="+15% vs mês anterior" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                <StatCard title="Vaquinhas Ativas" value="89" change="+5 novas hoje" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="Novos Usuários (Mês)" value="128" change="+32 na última semana" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="Taxa de Conversão" value="4.2%" change="Meta: 5%" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                     <RevenueChart data={chartData} />
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
                        <div className="flex flex-col space-y-3">
                            <Button onClick={() => addToast('Abrindo formulário de nova vaquinha...', 'info')}>+ Criar Nova Vaquinha</Button>
                            <Button variant="secondary" onClick={() => addToast('Gerando relatório financeiro...', 'info')}>Gerar Relatório</Button>
                            <Button variant="secondary" onClick={() => setActiveTab('Suporte')}>Ver Tickets de Suporte</Button>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Alertas e Atividades Recentes</h3>
                        <ul className="space-y-4">
                            {recentActivities.map(activity => (
                                <li key={activity.id} className="flex items-start space-x-3">
                                    <div>{activityIcons[activity.type as keyof typeof activityIcons]}</div>
                                    <div>
                                        <p className="text-sm text-gray-700">{activity.text}</p>
                                        <p className="text-xs text-gray-400">{activity.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Usuarios View ---
const SystemUsuariosView = () => {
    const initialUsers: User[] = useMemo(() => [
        { id: 1, name: 'Ana Silva', email: 'ana.silva@example.com', plan: 'Pro', role: 'Admin', verificationStatus: 'Verificado', status: 'Ativo', vaquinhas: 5, lastLogin: '2024-07-21', joinDate: '2023-01-15' },
        { id: 2, name: 'Bruno Costa', email: 'bruno.costa@example.com', plan: 'Flexível', role: 'Comum', verificationStatus: 'Pendente', status: 'Ativo', vaquinhas: 1, lastLogin: '2024-07-20', joinDate: '2023-02-20' },
        { id: 3, name: 'Carla Dias', email: 'carla.dias@example.com', plan: 'Pro', role: 'Comum', verificationStatus: 'Verificado', status: 'Suspenso', vaquinhas: 12, lastLogin: '2024-05-10', joinDate: '2023-03-10' },
        { id: 4, name: 'Daniel Alves', email: 'daniel.alves@example.com', plan: 'White-Label', role: 'Admin', verificationStatus: 'Verificado', status: 'Ativo', vaquinhas: 3, lastLogin: '2024-07-21', joinDate: '2023-04-05' },
        { id: 5, name: 'Eduarda Lima', email: 'eduarda.lima@example.com', plan: 'Pro', role: 'Moderador', verificationStatus: 'Verificado', status: 'Ativo', vaquinhas: 8, lastLogin: '2024-07-19', joinDate: '2023-05-12' },
        { id: 6, name: 'Felipe Mendes', email: 'felipe.mendes@example.com', plan: 'Flexível', role: 'Comum', verificationStatus: 'Rejeitado', status: 'Suspenso', vaquinhas: 2, lastLogin: '2024-06-01', joinDate: '2023-06-18' },
        { id: 7, name: 'Gabriela Souza', email: 'gabriela.souza@example.com', plan: 'Pro', role: 'Comum', verificationStatus: 'Pendente', status: 'Ativo', vaquinhas: 20, lastLogin: '2024-07-22', joinDate: '2023-07-25' },
        { id: 8, name: 'Heitor Oliveira', email: 'heitor.oliveira@example.com', plan: 'White-Label', role: 'Admin', verificationStatus: 'Verificado', status: 'Ativo', vaquinhas: 6, lastLogin: '2024-07-20', joinDate: '2023-08-30' },
    ], []);

    const { addToast } = useToast();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [planFilter, setPlanFilter] = useState('Todos');
    const [roleFilter, setRoleFilter] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
    const [isActivityModalOpen, setActivityModalOpen] = useState(false);
    
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const ITEMS_PER_PAGE = 5;

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'Todos' || user.status === statusFilter) &&
            (planFilter === 'Todos' || user.plan === planFilter) &&
            (roleFilter === 'Todos' || user.role === roleFilter)
        );
    }, [users, searchTerm, statusFilter, planFilter, roleFilter]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage, ITEMS_PER_PAGE]);

    const handleOpenModal = (modal: 'edit' | 'verify' | 'activity', user: User | null) => {
        setSelectedUser(user);
        if (modal === 'edit') setEditModalOpen(true);
        if (modal === 'verify') setVerificationModalOpen(true);
        if (modal === 'activity') setActivityModalOpen(true);
    };

    const handleSaveUser = (userToSave: User) => {
        if (selectedUser) {
            setUsers(users.map(u => u.id === userToSave.id ? userToSave : u));
            addToast('Usuário atualizado com sucesso!', 'success');
        } else {
            setUsers([userToSave, ...users]);
            addToast('Usuário adicionado com sucesso!', 'success');
        }
        setEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleVerifyUser = (userId: number, verificationStatus: 'Verificado' | 'Rejeitado') => {
        setUsers(users.map(u => {
            if (u.id === userId) {
                addToast(`Conta de ${u.name} foi ${verificationStatus.toLowerCase()}.`, 'info');
                return { ...u, verificationStatus };
            }
            return u;
        }));
        setVerificationModalOpen(false);
    };

    const handleToggleStatus = (userId: number) => {
        setUsers(users.map(u => {
            if (u.id === userId) {
                const newStatus = u.status === 'Ativo' ? 'Suspenso' : 'Ativo';
                addToast(`Status de ${u.name} alterado para ${newStatus}.`, 'info');
                return { ...u, status: newStatus };
            }
            return u;
        }));
    };

    const handleDeleteUser = (userId: number, userName: string) => {
        if (window.confirm(`Tem certeza que deseja deletar o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
            setUsers(users.filter(u => u.id !== userId));
            addToast(`Usuário ${userName} deletado.`, 'success');
        }
    };
    
    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('Todos');
        setPlanFilter('Todos');
        setRoleFilter('Todos');
        setCurrentPage(1);
    }
    
    const verificationBadges: { [key in User['verificationStatus']]: string } = {
        Verificado: 'bg-emerald-100 text-emerald-800',
        Pendente: 'bg-yellow-100 text-yellow-800',
        Rejeitado: 'bg-red-100 text-red-800',
    };

    return (
        <div>
            <PageTitle actions={<Button variant="primary" onClick={() => handleOpenModal('edit', null)}>+ Novo Usuário</Button>}>
                Gerenciamento de Usuários
            </PageTitle>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <Input
                        placeholder="Buscar por nome ou e-mail..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="sm:col-span-2"
                    />
                     <Select value={planFilter} onChange={e => setPlanFilter(e.target.value as any)}>
                        <option value="Todos">Todos os Planos</option>
                        <option value="Flexível">Flexível</option>
                        <option value="Pro">Pro</option>
                        <option value="White-Label">White-Label</option>
                    </Select>
                     <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)}>
                        <option value="Todos">Todos os Cargos</option>
                        <option value="Comum">Comum</option>
                        <option value="Moderador">Moderador</option>
                        <option value="Admin">Admin</option>
                    </Select>
                </div>
                
                 <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b">
                                <th className="p-4 font-semibold text-gray-600">Usuário</th>
                                <th className="p-4 font-semibold text-gray-600">Cargo</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Verificação</th>
                                <th className="p-4 font-semibold text-gray-600">Último Login</th>
                                <th className="p-4 font-semibold text-gray-600"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map(user => (
                                <tr key={user.id} className="border-b hover:bg-slate-50">
                                    <td className="p-4">
                                        <p className="font-medium text-gray-800">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </td>
                                    <td className="p-4">{user.role}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${verificationBadges[user.verificationStatus]}`}>
                                            {user.verificationStatus}
                                        </span>
                                    </td>
                                    <td className="p-4">{new Date(user.lastLogin).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4 text-right">
                                        <Dropdown
                                            button={
                                                <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                                </button>
                                            }
                                        >
                                            <DropdownItem onClick={() => handleOpenModal('edit', user)}>Editar</DropdownItem>
                                            <DropdownItem onClick={() => handleOpenModal('activity', user)}>Ver Histórico</DropdownItem>
                                            {user.verificationStatus === 'Pendente' && <DropdownItem onClick={() => handleOpenModal('verify', user)}>Verificar Conta</DropdownItem>}
                                            <DropdownItem onClick={() => handleToggleStatus(user.id)}>{user.status === 'Ativo' ? 'Suspender' : 'Ativar'}</DropdownItem>
                                            <DropdownItem onClick={() => handleDeleteUser(user.id, user.name)}>Deletar</DropdownItem>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {paginatedUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="mb-2">Nenhum usuário encontrado.</p>
                        <Button variant="secondary" onClick={handleClearFilters}>Limpar Filtros</Button>
                    </div>
                 )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
            </div>

            <UserEditModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleSaveUser} user={selectedUser} />
            <VerificationModal isOpen={isVerificationModalOpen} onClose={() => setVerificationModalOpen(false)} onVerify={handleVerifyUser} user={selectedUser} />
            <ActivityLogModal isOpen={isActivityModalOpen} onClose={() => setActivityModalOpen(false)} user={selectedUser} />

        </div>
    );
};


// --- Vaquinhas View ---
type Vaquinha = {
    id: number;
    name: string;
    creator: string;
    goal: number;
    collected: number;
    status: 'Ativa' | 'Concluída' | 'Cancelada' | 'Planejando';
    participants: number;
    creationDate: string;
};

// FIX: Define mock vaquinhas data in a shared constant to be used by multiple components.
const initialVaquinhasData: Vaquinha[] = [
    { id: 101, name: 'Viagem para a Praia 2024', creator: 'Ana Silva', goal: 5000, collected: 3750, status: 'Ativa', participants: 15, creationDate: '2024-06-01' },
    { id: 102, name: 'Presente Surpresa do Chefe', creator: 'Bruno Costa', goal: 800, collected: 800, status: 'Concluída', participants: 22, creationDate: '2024-05-15' },
    { id: 103, name: 'Fundo de Formatura 2025', creator: 'Gabriela Souza', goal: 25000, collected: 12500, status: 'Ativa', participants: 45, creationDate: '2024-03-10' },
    { id: 104, name: 'Compra de Equipamento Fotográfico', creator: 'Daniel Alves', goal: 3500, collected: 1200, status: 'Cancelada', participants: 8, creationDate: '2024-04-20' },
    { id: 105, name: 'Churrasco de Fim de Ano da Empresa', creator: 'Eduarda Lima', goal: 1500, collected: 0, status: 'Planejando', participants: 0, creationDate: '2024-07-20' },
    { id: 106, name: 'Ajuda Custo - Maratona de SP', creator: 'Felipe Mendes', goal: 2000, collected: 2000, status: 'Concluída', participants: 30, creationDate: '2024-02-01' },
    { id: 107, name: 'Rateio Aluguel Casa de Campo', creator: 'Ana Silva', goal: 2400, collected: 1800, status: 'Ativa', participants: 6, creationDate: '2024-07-05' },
    { id: 108, name: 'Projeto Social - Cestas Básicas', creator: 'Heitor Oliveira', goal: 10000, collected: 9500, status: 'Ativa', participants: 120, creationDate: '2024-06-15' },
];

const SystemVaquinhasView = () => {
    const initialVaquinhas: Vaquinha[] = useMemo(() => initialVaquinhasData, []);

    const { addToast } = useToast();
    const [vaquinhas, setVaquinhas] = useState<Vaquinha[]>(initialVaquinhas);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    
    const ITEMS_PER_PAGE = 5;

    const filteredVaquinhas = useMemo(() => {
        return vaquinhas.filter(v =>
            (v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.creator.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'Todos' || v.status === statusFilter)
        );
    }, [vaquinhas, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredVaquinhas.length / ITEMS_PER_PAGE);

    const paginatedVaquinhas = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredVaquinhas.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredVaquinhas, currentPage]);

    const handleToggleStatus = (vaquinhaId: number) => {
        setVaquinhas(vaquinhas.map(v => {
            if (v.id === vaquinhaId) {
                const newStatus = v.status === 'Ativa' ? 'Cancelada' : 'Ativa';
                addToast(`Status de "${v.name}" alterado para ${newStatus}.`, 'info');
                return { ...v, status: newStatus };
            }
            return v;
        }));
    };
    
    const handleDelete = (vaquinhaId: number, vaquinhaName: string) => {
        if (window.confirm(`Tem certeza que deseja deletar a vaquinha "${vaquinhaName}"?`)) {
            setVaquinhas(vaquinhas.filter(v => v.id !== vaquinhaId));
            addToast(`Vaquinha "${vaquinhaName}" deletada.`, 'success');
        }
    };
    
    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('Todos');
        setCurrentPage(1);
    }
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    const statusBadges: { [key in Vaquinha['status']]: string } = {
        Ativa: 'bg-emerald-100 text-emerald-800',
        Concluída: 'bg-sky-100 text-sky-800',
        Cancelada: 'bg-red-100 text-red-800',
        Planejando: 'bg-gray-100 text-gray-800',
    };

    return (
        <div>
            <PageTitle>Gerenciamento de Vaquinhas</PageTitle>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                        placeholder="Buscar por nome ou criador..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="md:col-span-2"
                    />
                    <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="Todos">Todos os Status</option>
                        <option value="Ativa">Ativa</option>
                        <option value="Concluída">Concluída</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="Planejando">Planejando</option>
                    </Select>
                </div>
                
                 <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[720px]">
                        <thead>
                            <tr className="bg-slate-50 border-b">
                                <th className="p-4 font-semibold text-gray-600">Vaquinha</th>
                                <th className="p-4 font-semibold text-gray-600">Progresso</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Participantes</th>
                                <th className="p-4 font-semibold text-gray-600">Data de Criação</th>
                                <th className="p-4 font-semibold text-gray-600"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedVaquinhas.map(v => (
                                <tr key={v.id} className="border-b hover:bg-slate-50">
                                    <td className="p-4">
                                        <p className="font-medium text-gray-800">{v.name}</p>
                                        <p className="text-sm text-gray-500">Criado por: {v.creator}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-700">
                                                {formatCurrency(v.collected)} / {formatCurrency(v.goal)}
                                            </span>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min((v.collected / v.goal) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadges[v.status]}`}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">{v.participants}</td>
                                    <td className="p-4">{new Date(v.creationDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4 text-right">
                                        <Dropdown
                                            button={
                                                <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                                </button>
                                            }
                                        >
                                            <DropdownItem onClick={() => addToast('Funcionalidade de detalhes em desenvolvimento.', 'info')}>Ver Detalhes</DropdownItem>
                                            <DropdownItem onClick={() => handleToggleStatus(v.id)}>
                                                {v.status === 'Ativa' ? 'Suspender' : 'Reativar'}
                                            </DropdownItem>
                                            <DropdownItem onClick={() => handleDelete(v.id, v.name)}>Deletar</DropdownItem>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {paginatedVaquinhas.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="mb-2">Nenhuma vaquinha encontrada.</p>
                        <Button variant="secondary" onClick={handleClearFilters}>Limpar Filtros</Button>
                    </div>
                 )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
            </div>
        </div>
    );
};


// --- Financeiro View ---
type Transaction = {
    id: string;
    date: string;
    vaquinhaName: string;
    type: 'Contribuição' | 'Saque' | 'Taxa';
    status: 'Concluído' | 'Pendente' | 'Falhou';
    amount: number;
};

const RevenueChart = ({ data }: { data: { date: string, revenue: number }[] }) => {
    const maxValue = Math.max(...data.map(d => d.revenue));
    const chartHeight = 200;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Receita (Últimos 30 dias)</h3>
            <div className="flex justify-between items-end h-full" style={{ height: `${chartHeight}px` }}>
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col justify-end items-center group relative px-1">
                        <div 
                            className="w-full bg-emerald-300 hover:bg-emerald-500 rounded-t-md transition-colors"
                            style={{ height: `${(item.revenue / maxValue) * 100}%` }}
                        />
                        <span className="text-xs text-gray-500 mt-2">{new Date(item.date).getDate()}</span>
                        <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {new Date(item.date).toLocaleDateString('pt-BR')}: {`R$ ${item.revenue.toFixed(2)}`}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const SystemFinanceiroView = () => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    
    const ITEMS_PER_PAGE = 10;

    const initialTransactions: Transaction[] = useMemo(() => {
        const transactions: Transaction[] = [];
        const vaquinhaNames = ['Viagem Praia', 'Formatura 2025', 'Projeto Social', 'Presente do Chefe', 'Aluguel Casa Campo'];
        const types: Transaction['type'][] = ['Contribuição', 'Saque', 'Taxa'];
        const statuses: Transaction['status'][] = ['Concluído', 'Pendente', 'Falhou'];
        
        for (let i = 0; i < 50; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const type = types[Math.floor(Math.random() * 2)]; // Bias towards contributions
            let amount;
            if (type === 'Contribuição') amount = Math.random() * 200 + 20;
            else if (type === 'Saque') amount = Math.random() * 5000 + 500;
            else amount = Math.random() * 10 + 1;
            
            transactions.push({
                id: `tr_${Date.now()}_${i}`,
                date: date.toISOString(),
                vaquinhaName: vaquinhaNames[Math.floor(Math.random() * vaquinhaNames.length)],
                type,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                amount,
            });
             if (type === 'Contribuição' && Math.random() > 0.1) {
                transactions.push({
                    id: `tr_fee_${Date.now()}_${i}`,
                    date: date.toISOString(),
                    vaquinhaName: transactions[transactions.length - 1].vaquinhaName,
                    type: 'Taxa',
                    status: 'Concluído',
                    amount: transactions[transactions.length - 1].amount * 0.03,
                });
            }
        }
        return transactions;
    }, []);
    
    const [transactions] = useState<Transaction[]>(initialTransactions);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t =>
            (t.vaquinhaName.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (typeFilter === 'Todos' || t.type === typeFilter) &&
            (statusFilter === 'Todos' || t.status === statusFilter)
        );
    }, [transactions, searchTerm, typeFilter, statusFilter]);

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

    const kpiData = useMemo(() => {
        return {
            grossRevenue: transactions.filter(t => t.type === 'Contribuição' && t.status === 'Concluído').reduce((acc, t) => acc + t.amount, 0),
            platformFees: transactions.filter(t => t.type === 'Taxa' && t.status === 'Concluído').reduce((acc, t) => acc + t.amount, 0),
            pendingWithdrawals: transactions.filter(t => t.type === 'Saque' && t.status === 'Pendente').reduce((acc, t) => acc + t.amount, 0),
            // FIX: Use shared initialVaquinhasData to calculate average ticket per vaquinha.
            avgTicket: transactions.filter(t => t.type === 'Contribuição').reduce((acc, t) => acc + t.amount, 0) / (initialVaquinhasData.length || 1),
        }
    }, [transactions]);
    
     const chartData = useMemo(() => {
        const data: { [key: string]: number } = {};
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            data[dateString] = 0;
        }
        transactions.forEach(t => {
            if (t.type === 'Taxa' && t.status === 'Concluído') {
                const dateString = t.date.split('T')[0];
                if (data[dateString] !== undefined) {
                    data[dateString] += t.amount;
                }
            }
        });
        return Object.entries(data).map(([date, revenue]) => ({ date, revenue })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [transactions]);

    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    
    const statusBadges: { [key in Transaction['status']]: string } = {
        Concluído: 'bg-emerald-100 text-emerald-800',
        Pendente: 'bg-yellow-100 text-yellow-800',
        Falhou: 'bg-red-100 text-red-800',
    };
    
    return (
        <div>
            <PageTitle actions={<Button variant="primary" onClick={() => addToast('Relatório exportado com sucesso!', 'success')}>Exportar Relatório</Button>}>
                Painel Financeiro
            </PageTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Receita Bruta Total" value={formatCurrency(kpiData.grossRevenue)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                <StatCard title="Taxas da Plataforma" value={formatCurrency(kpiData.platformFees)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="Saques Pendentes" value={formatCurrency(kpiData.pendingWithdrawals)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Ticket Médio / Vaquinha" value={formatCurrency(kpiData.avgTicket)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
            </div>
            
            <div className="mb-8">
                <RevenueChart data={chartData} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Transações</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <Input placeholder="Buscar por vaquinha ou ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="md:col-span-2" />
                    <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="Todos">Todos os Tipos</option>
                        <option value="Contribuição">Contribuição</option>
                        <option value="Saque">Saque</option>
                        <option value="Taxa">Taxa</option>
                    </Select>
                    <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="Todos">Todos os Status</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Falhou">Falhou</option>
                    </Select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[720px]">
                        <thead>
                           <tr className="bg-slate-50 border-b">
                                <th className="p-4 font-semibold text-gray-600">Data</th>
                                <th className="p-4 font-semibold text-gray-600">Vaquinha</th>
                                <th className="p-4 font-semibold text-gray-600">Tipo</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTransactions.map(t => (
                                <tr key={t.id} className="border-b hover:bg-slate-50">
                                    <td className="p-4 text-sm text-gray-600">{new Date(t.date).toLocaleString('pt-BR')}</td>
                                    <td className="p-4 font-medium text-gray-800">{t.vaquinhaName}</td>
                                    <td className="p-4 text-sm text-gray-600">{t.type}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadges[t.status]}`}>{t.status}</span>
                                    </td>
                                    <td className={`p-4 text-right font-semibold ${t.type === 'Saque' ? 'text-red-600' : 'text-gray-800'}`}>
                                        {t.type === 'Saque' ? '-' : ''}{formatCurrency(t.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {paginatedTransactions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Nenhuma transação encontrada.</p>
                    </div>
                 )}
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
            </div>
        </div>
    );
};


// --- White-Label View ---
type WhiteLabelClient = {
    id: number;
    clientName: string;
    domain: string;
    status: 'Ativo' | 'Inativo' | 'Pendente';
    plan: 'Essencial' | 'Crescimento' | 'Empresarial';
    startDate: string;
};

const initialWhiteLabelClients: WhiteLabelClient[] = [
    { id: 1, clientName: 'Agência de Formaturas SonhoReal', domain: 'formaturas.sonhoreal.com', status: 'Ativo', plan: 'Empresarial', startDate: '2023-04-05' },
    { id: 2, clientName: 'Condomínio Vila das Flores', domain: 'condominio.viladasflores.com', status: 'Ativo', plan: 'Crescimento', startDate: '2023-08-30' },
    { id: 3, clientName: 'ONG Mãos que Ajudam', domain: 'doacoes.maosqueajudam.org', status: 'Inativo', plan: 'Essencial', startDate: '2023-02-10' },
    { id: 4, clientName: 'Startup InovaTech', domain: 'projetos.inovatech.io', status: 'Pendente', plan: 'Crescimento', startDate: '2024-07-20' },
];

const WhiteLabelClientModal = ({ isOpen, onClose, onSave, client }: { isOpen: boolean, onClose: () => void, onSave: (client: WhiteLabelClient) => void, client: WhiteLabelClient | null }) => {
    const [formData, setFormData] = useState<Omit<WhiteLabelClient, 'id' | 'startDate'>>({
        clientName: '', domain: '', status: 'Ativo', plan: 'Essencial'
    });

    useEffect(() => {
        if (client) {
            setFormData({ clientName: client.clientName, domain: client.domain, status: client.status, plan: client.plan });
        } else {
            setFormData({ clientName: '', domain: '', status: 'Ativo', plan: 'Essencial' });
        }
    }, [client, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        if (!formData.clientName || !formData.domain) return;
        const clientToSave: WhiteLabelClient = {
            ...(client || { id: Date.now(), startDate: new Date().toISOString().split('T')[0] }),
            ...formData
        };
        onSave(clientToSave);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={client ? 'Gerenciar Cliente White-Label' : 'Novo Cliente White-Label'}
            footer={<><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button variant="primary" onClick={handleSubmit}>Salvar</Button></>}
        >
            <div className="space-y-4">
                <div><Label htmlFor="clientName">Nome do Cliente</Label><Input id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} required /></div>
                <div><Label htmlFor="domain">Domínio</Label><Input id="domain" name="domain" value={formData.domain} onChange={handleChange} placeholder="cliente.seusite.com" required /></div>
                <div><Label htmlFor="plan">Plano</Label><Select id="plan" name="plan" value={formData.plan} onChange={handleChange}><option value="Essencial">Essencial</option><option value="Crescimento">Crescimento</option><option value="Empresarial">Empresarial</option></Select></div>
                <div><Label htmlFor="status">Status</Label><Select id="status" name="status" value={formData.status} onChange={handleChange}><option value="Ativo">Ativo</option><option value="Inativo">Inativo</option><option value="Pendente">Pendente</option></Select></div>
            </div>
        </Modal>
    );
};

const SystemWhiteLabelView = ({ setActiveTab }: { setActiveTab: (tab: SystemAdminTab) => void }) => {
    const [clients, setClients] = useState<WhiteLabelClient[]>(initialWhiteLabelClients);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<WhiteLabelClient | null>(null);
    const { addToast } = useToast();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const filteredClients = useMemo(() => {
        return clients.filter(c =>
            (c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || c.domain.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'Todos' || c.status === statusFilter)
        );
    }, [clients, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredClients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredClients, currentPage]);
    
    const handleSave = (client: WhiteLabelClient) => {
        if (selectedClient) {
            setClients(clients.map(c => c.id === client.id ? client : c));
            addToast('Cliente atualizado!', 'success');
        } else {
            setClients([client, ...clients]);
            addToast('Novo cliente adicionado!', 'success');
        }
        setIsModalOpen(false);
        setSelectedClient(null);
    };

    const handleOpenModal = (client: WhiteLabelClient | null) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };
    
    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('Todos');
        setCurrentPage(1);
    }

    const statusBadges: { [key in WhiteLabelClient['status']]: string } = {
        Ativo: 'bg-emerald-100 text-emerald-800',
        Inativo: 'bg-red-100 text-red-800',
        Pendente: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <div>
            <PageTitle actions={<Button variant="primary" onClick={() => handleOpenModal(null)}>+ Novo Cliente</Button>}>
                Clientes White-Label
            </PageTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total de Clientes" value={clients.length.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                <StatCard title="Clientes Ativos" value={clients.filter(c => c.status === 'Ativo').length.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Receita Mensal (MRR)" value="R$ 1.250" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                <StatCard title="Receita Anual Estimada" value="R$ 15.000" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input placeholder="Buscar por cliente ou domínio..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="md:col-span-2" />
                    <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="Todos">Todos os Status</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                        <option value="Pendente">Pendente</option>
                    </Select>
                </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[640px]">
                        <thead>
                            <tr className="bg-slate-50 border-b">
                                <th className="p-4 font-semibold text-gray-600">Cliente</th>
                                <th className="p-4 font-semibold text-gray-600">Domínio</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Plano</th>
                                <th className="p-4 font-semibold text-gray-600"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedClients.map(client => (
                                <tr key={client.id} className="border-b hover:bg-slate-50">
                                    <td className="p-4 font-medium text-gray-800">{client.clientName}</td>
                                    <td className="p-4 text-gray-600"><a href={`http://${client.domain}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 hover:underline">{client.domain}</a></td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadges[client.status]}`}>{client.status}</span></td>
                                    <td className="p-4 text-gray-600">{client.plan}</td>
                                    <td className="p-4 text-right"><Button variant="secondary" onClick={() => handleOpenModal(client)}>Gerenciar</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>

                 {paginatedClients.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="mb-2">Nenhum cliente encontrado.</p>
                        <Button variant="secondary" onClick={handleClearFilters}>Limpar Filtros</Button>
                    </div>
                 )}
                 {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

            </div>
            <WhiteLabelClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} client={selectedClient} />
        </div>
    );
};


// --- Suporte View ---
type Ticket = {
  id: number;
  subject: string;
  user: { name: string; email: string };
  status: 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  lastUpdate: string;
  messages: { author: string; text: string; date: string }[];
};

const initialTickets: Ticket[] = [
    { id: 789, subject: 'Dúvida sobre saque', user: { name: 'Bruno Costa', email: 'bruno.costa@example.com' }, status: 'Aberto', priority: 'Alta', lastUpdate: '2024-07-22T10:00:00Z', messages: [{ author: 'Bruno Costa', text: 'Não estou conseguindo realizar o saque da minha vaquinha. O sistema apresenta um erro genérico. Podem me ajudar?', date: '2024-07-22T10:00:00Z' }] },
    { id: 788, subject: 'Problema com pagamento', user: { name: 'Ana Silva', email: 'ana.silva@example.com' }, status: 'Em Andamento', priority: 'Média', lastUpdate: '2024-07-22T11:30:00Z', messages: [{ author: 'Ana Silva', text: 'Um dos participantes da minha vaquinha informou que não consegue pagar com cartão de crédito. A transação é recusada sem motivo aparente.', date: '2024-07-21T14:00:00Z' }, { author: 'Suporte', text: 'Olá Ana, estamos verificando o que pode ter acontecido com nosso gateway de pagamento. Manteremos você informada.', date: '2024-07-22T11:30:00Z' }] },
    { id: 787, subject: 'Como criar vaquinha white-label?', user: { name: 'Daniel Alves', email: 'daniel.alves@example.com' }, status: 'Resolvido', priority: 'Baixa', lastUpdate: '2024-07-21T18:00:00Z', messages: [{ author: 'Daniel Alves', text: 'Olá, tenho interesse em contratar o plano white-label e gostaria de saber mais detalhes sobre a customização.', date: '2024-07-20T09:00:00Z' }, { author: 'Suporte', text: 'Claro, Daniel! Encaminhei a documentação completa com todas as opções de personalização para o seu e-mail.', date: '2024-07-21T18:00:00Z' }] },
    { id: 786, subject: 'Sugestão de funcionalidade', user: { name: 'Gabriela Souza', email: 'gabriela.souza@example.com' }, status: 'Fechado', priority: 'Baixa', lastUpdate: '2024-07-20T15:00:00Z', messages: [{ author: 'Gabriela Souza', text: 'Seria ótimo ter uma opção para exportar a lista de participantes em PDF.', date: '2024-07-19T12:00:00Z' }, { author: 'Suporte', text: 'Excelente sugestão, Gabriela! Já encaminhamos para nossa equipe de produto. Agradecemos o feedback!', date: '2024-07-20T15:00:00Z' }] },
];

const TicketDetailModal = ({ isOpen, onClose, ticket, onReply }: { isOpen: boolean, onClose: () => void, ticket: Ticket | null, onReply: (ticketId: number, reply: string) => void }) => {
    const [reply, setReply] = useState('');
    if (!ticket) return null;

    useEffect(() => {
        if (!isOpen) {
            setReply('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reply.trim()) return;
        onReply(ticket.id, reply);
        setReply('');
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Ticket #${ticket.id}: ${ticket.subject}`}
            footer={<><Button variant="secondary" onClick={onClose}>Fechar</Button><Button variant="primary" onClick={handleSubmit} disabled={!reply.trim()}>Enviar Resposta</Button></>}
        >
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {ticket.messages.map((msg, index) => (
                    <div key={index} className={`p-3 rounded-lg ${msg.author === 'Suporte' ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                        <p className="font-bold text-sm text-gray-800">{msg.author}</p>
                        <p className="text-sm text-gray-600 mt-1">{msg.text}</p>
                        <p className="text-xs text-gray-400 text-right mt-2">{new Date(msg.date).toLocaleString('pt-BR')}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t">
                <Label htmlFor="reply">Sua Resposta</Label>
                <Textarea id="reply" value={reply} onChange={e => setReply(e.target.value)} rows={4} placeholder="Digite sua resposta aqui..."/>
            </div>
        </Modal>
    );
};


const SystemSuporteView = () => {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [priorityFilter, setPriorityFilter] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const { addToast } = useToast();

    const ITEMS_PER_PAGE = 5;

    const filteredTickets = useMemo(() => tickets.filter(t => 
        (t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'Todos' || t.status === statusFilter) &&
        (priorityFilter === 'Todos' || t.priority === priorityFilter)
    ), [tickets, searchTerm, statusFilter, priorityFilter]);

    const paginatedTickets = useMemo(() => filteredTickets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filteredTickets, currentPage]);
    const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);

    const handleReply = (ticketId: number, reply: string) => {
        setTickets(tickets.map(t => t.id === ticketId ? {
            ...t,
            messages: [...t.messages, { author: 'Suporte', text: reply, date: new Date().toISOString() }],
            status: 'Em Andamento',
            lastUpdate: new Date().toISOString(),
        } : t));
        setSelectedTicket(null);
        addToast(`Resposta enviada para o ticket #${ticketId}`, 'success');
    };
    
    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('Todos');
        setPriorityFilter('Todos');
        setCurrentPage(1);
    }

    const statusBadges: { [key in Ticket['status']]: string } = { Aberto: 'bg-yellow-100 text-yellow-800', 'Em Andamento': 'bg-sky-100 text-sky-800', Resolvido: 'bg-emerald-100 text-emerald-800', Fechado: 'bg-gray-100 text-gray-800' };
    const priorityBadges: { [key in Ticket['priority']]: string } = { Baixa: 'bg-gray-100 text-gray-800', Média: 'bg-sky-100 text-sky-800', Alta: 'bg-yellow-100 text-yellow-800', Urgente: 'bg-red-100 text-red-800' };

    return (
        <div>
            <PageTitle>Central de Suporte</PageTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Tickets Abertos" value={tickets.filter(t=>t.status==='Aberto').length.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3m-3-4h3m0 0h4m-4 0a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2v-3z" /></svg>} />
                <StatCard title="Resolvidos Hoje" value="3" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Tempo Médio de Resposta" value="2h 15m" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Satisfação do Cliente" value="96%" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input placeholder="Buscar por assunto, nome, e-mail..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="md:col-span-1" />
                    <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="Todos">Todos os Status</option><option value="Aberto">Aberto</option><option value="Em Andamento">Em Andamento</option><option value="Resolvido">Resolvido</option><option value="Fechado">Fechado</option>
                    </Select>
                    <Select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                        <option value="Todos">Todas as Prioridades</option><option value="Baixa">Baixa</option><option value="Média">Média</option><option value="Alta">Alta</option><option value="Urgente">Urgente</option>
                    </Select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[720px]">
                        <thead><tr className="bg-slate-50 border-b"><th className="p-4 font-semibold text-gray-600">Ticket</th><th className="p-4 font-semibold text-gray-600">Usuário</th><th className="p-4 font-semibold text-gray-600">Status</th><th className="p-4 font-semibold text-gray-600">Prioridade</th><th className="p-4 font-semibold text-gray-600">Última Atualização</th><th className="p-4 font-semibold text-gray-600"></th></tr></thead>
                        <tbody>
                            {paginatedTickets.map(t => (
                                <tr key={t.id} className="border-b hover:bg-slate-50">
                                    <td className="p-4"><p className="font-medium text-gray-800">#{t.id}</p><p className="text-sm text-gray-500 truncate" style={{maxWidth: '200px'}}>{t.subject}</p></td>
                                    <td className="p-4"><p className="font-medium text-gray-800">{t.user.name}</p><p className="text-sm text-gray-500">{t.user.email}</p></td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadges[t.status]}`}>{t.status}</span></td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityBadges[t.priority]}`}>{t.priority}</span></td>
                                    <td className="p-4 text-sm text-gray-600">{new Date(t.lastUpdate).toLocaleString('pt-BR')}</td>
                                    <td className="p-4 text-right"><Button variant="secondary" onClick={() => setSelectedTicket(t)}>Ver Detalhes</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {paginatedTickets.length === 0 && <div className="text-center py-12 text-gray-500"><p className="mb-2">Nenhum ticket encontrado.</p><Button variant="secondary" onClick={handleClearFilters}>Limpar Filtros</Button></div>}
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações do Zendesk</h2>
                <p className="text-gray-600 mb-6 -mt-2">Gerencie as configurações da sua integração com o Zendesk, conforme o plano de implementação.</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SubSectionCard
                        title="Canais de Atendimento"
                        description="Pontos de contato com o cliente."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>}
                    >
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between items-center"><span>E-mail: <code className="text-xs">suporte@vakinhafacil.com.br</code></span><span className="font-semibold text-emerald-600">Ativo</span></li>
                            <li className="flex justify-between items-center"><span>Chat ao vivo (WhatsApp via Twilio)</span><span className="font-semibold text-emerald-600">Ativo</span></li>
                            <li className="flex justify-between items-center"><span>Formulário de Contato no Site</span><span className="font-semibold text-emerald-600">Ativo</span></li>
                        </ul>
                    </SubSectionCard>

                    <SubSectionCard
                        title="Fluxo de Atendimento"
                        description="Automações e respostas padrão (macros)."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>}
                    >
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-gray-700">Resposta Automática</h4>
                                <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded mt-1 italic">"Olá [Nome], Obrigado por entrar em contato! Sua solicitação (ID: #[Ticket ID]) foi recebida. Respondemos em até 24 horas."</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700">Respostas Padrão</h4>
                                <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1">
                                    <li>Como criar uma vaquinha?</li>
                                    <li>Como convidar participantes?</li>
                                    <li>Como receber o dinheiro?</li>
                                </ul>
                            </div>
                        </div>
                    </SubSectionCard>

                    <SubSectionCard
                        title="Integrações"
                        description="Conecte o suporte a outras ferramentas."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8a1 1 0 000 2h1.586l-1.293 1.293a1 1 0 101.414 1.414L8.414 11H10a1 1 0 100-2H8.414l1.707-1.707A1 1 0 008.707 6L7 7.707V6.5A1 1 0 005 6v2z" /><path d="M15 12a1 1 0 100-2h-1.586l1.293-1.293a1 1 0 10-1.414-1.414L11.586 9H10a1 1 0 100 2h1.586l-1.707 1.707a1 1 0 001.414 1.414L13 12.293V13.5a1 1 0 102 0v-1.5z" /></svg>}
                    >
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between items-center">
                                <span>Notificações no Slack</span>
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Conectado</span>
                            </li>
                             <li className="flex justify-between items-center">
                                <span>Twilio (WhatsApp)</span>
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Conectado</span>
                            </li>
                        </ul>
                    </SubSectionCard>

                    <SubSectionCard
                        title="Base de Conhecimento"
                        description="Gerencie artigos de ajuda para os usuários."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0-2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>}
                    >
                        <div className="space-y-2 text-sm">
                            <p className="font-semibold text-gray-700">Principais Artigos:</p>
                            <ul className="list-disc list-inside text-gray-600">
                                <li>Primeiros passos no Vakinha Fácil</li>
                                <li>Como configurar pagamentos recorrentes</li>
                                <li>Como solicitar a distribuição do valor</li>
                            </ul>
                            <div className="pt-2">
                                <Button variant="secondary" onClick={() => addToast('Abrindo gerenciador de artigos...', 'info')}>
                                    Gerenciar Artigos
                                </Button>
                            </div>
                        </div>
                    </SubSectionCard>
                </div>
            </div>

            <TicketDetailModal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} ticket={selectedTicket} onReply={handleReply} />
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
    { id: 'mercadopago', name: 'Mercado Pago', logo: 'https://logospng.org/download/mercado-pago/logo-mercado-pago-2048.png', description: 'Solução de pagamentos popular na América Latina.', status: 'available', apiKey: '', secretKey: '' },
    { id: 'pagseguro', name: 'PagBank (PagSeguro)', logo: 'https://logospng.org/download/pagseguro/logo-pagseguro-4096.png', description: 'Gateway de pagamentos pioneiro no Brasil.', status: 'available', apiKey: '', secretKey: '' },
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
                    {gateway.status === 'connected' && <Button variant="danger" onClick={handleDisconnect}>Desconectar</Button>}
                    <div className="flex-grow" />
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
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
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleConfigureClick(gateway)}
                                        className="flex-1"
                                    >
                                        {gateway.status === 'connected' ? 'Gerenciar' : 'Configurar'}
                                    </Button>
                                    {gateway.status === 'connected' && gateway.id !== activeGatewayId && (
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

// --- Configurações View ---
const SystemConfiguracoesView = ({ setActiveTab }: { setActiveTab: (tab: SystemAdminTab) => void }) => {
    const { addToast } = useToast();

    // Mock data and state for dynamic settings
    const [dynamicFees, setDynamicFees] = useState([
        { id: 1, startDate: '2024-12-01', endDate: '2024-12-31', fixedFee: 25.00, percentFee: 5.0 },
        { id: 2, startDate: '2025-01-01', endDate: '2025-01-31', fixedFee: 20.00, percentFee: 3.0 },
    ]);
    const [plans, setPlans] = useState([
        { id: 'basic', name: 'Básico', monthlyFee: 0, vaquinhaLimit: 1, maxValue: 5000 },
        { id: 'premium', name: 'Premium', monthlyFee: 19.90, vaquinhaLimit: 999, maxValue: 20000 },
    ]);
    const [currencies, setCurrencies] = useState([
        { code: 'BRL', name: 'Real Brasileiro', active: true },
        { code: 'USD', name: 'Dólar Americano', active: false },
        { code: 'EUR', name: 'Euro', active: false },
    ]);
    const [languages, setLanguages] = useState([
        { code: 'pt-BR', name: 'Português (Brasil)', active: true },
        { code: 'es-ES', name: 'Espanhol', active: false },
        { code: 'en-US', name: 'Inglês', active: false },
    ]);
    const [emailTemplates, setEmailTemplates] = useState([
        { id: 'invite', type: 'Convite de Vaquinha', subject: 'Você foi convidado para a vaquinha: {{vaquinha_nome}}', active: true },
        { id: 'reminder', type: 'Lembrete de Pagamento', subject: 'Lembrete: Sua contribuição para {{vaquinha_nome}}', active: true },
        { id: 'receipt', type: 'Comprovante de Pagamento', subject: 'Seu pagamento para {{vaquinha_nome}} foi confirmado', active: true },
    ]);
    const [security, setSecurity] = useState({
        minPasswordLength: 8,
        requireUppercase: true,
        requireNumber: true,
        force2faForAdmins: true,
        lockoutAttempts: 5,
    });

    const [isFeeModalOpen, setFeeModalOpen] = useState(false);
    const [isPlanModalOpen, setPlanModalOpen] = useState(false);
    const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);
    const [editingTemplate, setEditingTemplate] = useState<any>(null);

    const handleSave = (section: string) => {
        addToast(`${section} salvas com sucesso!`, 'success');
        // Close any open modals
        setFeeModalOpen(false);
        setPlanModalOpen(false);
        setTemplateModalOpen(false);
    };

    const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
    );

    return (
        <div>
            <PageTitle>Configurações Globais</PageTitle>
            <div className="space-y-8">
                {/* Financial Settings */}
                <SubSectionCard
                    title="Taxas, Planos e Moedas"
                    description="Defina as regras financeiras da plataforma."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.692a2.5 2.5 0 00-1.167-.417c-.334 0-.652.093-.923.267v-1.692c.22.071.408.164.566.267zM11.567 7.151c.22-.071.408-.164.567-.267v1.692c-.27-.174-.59-.267-.923-.267a2.5 2.5 0 00-1.167.417v-1.692c.22.071.409.164.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.88.756 1 1 0 10.76 1.852A2.5 2.5 0 0110 8.5v1.077a1 1 0 00.822.982.5.5 0 01.178.634 2.5 2.5 0 01-2.44 2.308 1 1 0 10-.5 1.936 4.5 4.5 0 004.366-4.112V9.5a1 1 0 00-1-1V5z" clipRule="evenodd" /></svg>}
                >
                    <div className="space-y-6">
                        {/* Dynamic Fees */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-700">Taxas Dinâmicas</h4>
                                <Button variant="secondary" onClick={() => setFeeModalOpen(true)}>+ Adicionar Período</Button>
                            </div>
                            <div className="text-sm border rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50"><tr className="text-left text-gray-600"><th className="p-2 font-medium">Período</th><th className="p-2 font-medium">Taxa Fixa</th><th className="p-2 font-medium">Taxa %</th></tr></thead>
                                    <tbody>{dynamicFees.map(f => <tr key={f.id} className="border-t"><td className="p-2">{new Date(f.startDate).toLocaleDateString('pt-BR')} - {new Date(f.endDate).toLocaleDateString('pt-BR')}</td><td className="p-2">R$ {f.fixedFee.toFixed(2)}</td><td className="p-2">{f.percentFee.toFixed(1)}%</td></tr>)}</tbody>
                                </table>
                            </div>
                        </div>
                        {/* Plan Limits */}
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Limites por Plano</h4>
                            <div className="text-sm border rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50"><tr className="text-left text-gray-600"><th className="p-2 font-medium">Plano</th><th className="p-2 font-medium">Limite Vaquinhas</th><th className="p-2 font-medium">Valor Máx. / Vaquinha</th><th className="p-2 font-medium">Ação</th></tr></thead>
                                    <tbody>{plans.map(p => <tr key={p.id} className="border-t"><td className="p-2 font-semibold">{p.name}</td><td className="p-2">{p.vaquinhaLimit === 999 ? 'Ilimitado' : p.vaquinhaLimit}</td><td className="p-2">R$ {p.maxValue.toFixed(2)}</td><td className="p-2"><Button variant="secondary" className="py-1 px-2 text-xs" onClick={() => { setEditingPlan(p as any); setPlanModalOpen(true); }}>Editar</Button></td></tr>)}</tbody>
                                </table>
                            </div>
                        </div>
                        {/* Currencies */}
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Moedas Múltiplas</h4>
                            <div className="space-y-2">{currencies.map(c => <div key={c.code} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md"><span className="text-gray-700">{c.name} ({c.code})</span><Toggle checked={c.active} onChange={() => setCurrencies(currencies.map(curr => curr.code === c.code ? {...curr, active: !curr.active} : curr))} /></div>)}</div>
                            <div className="pt-4"><Button onClick={() => handleSave('Configurações financeiras')}>Salvar Seção</Button></div>
                        </div>
                    </div>
                </SubSectionCard>

                {/* Personalization & Localization */}
                <SubSectionCard
                    title="Personalização e Comunicação"
                    description="Gerencie idiomas e templates de e-mail."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>}
                >
                     <div className="space-y-6">
                        {/* Languages */}
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Idiomas Múltiplos</h4>
                            <div className="space-y-2">{languages.map(l => <div key={l.code} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md"><span className="text-gray-700">{l.name}</span><Toggle checked={l.active} onChange={() => setLanguages(languages.map(lang => lang.code === l.code ? {...lang, active: !lang.active} : lang))} /></div>)}</div>
                        </div>
                        {/* Email Templates */}
                        <div>
                             <h4 className="font-semibold text-gray-700 mb-2">Templates de E-mail</h4>
                             <div className="text-sm border rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50"><tr className="text-left text-gray-600"><th className="p-2 font-medium">Tipo</th><th className="p-2 font-medium">Assunto</th><th className="p-2 font-medium">Ação</th></tr></thead>
                                    <tbody>{emailTemplates.map(t => <tr key={t.id} className="border-t"><td className="p-2">{t.type}</td><td className="p-2 truncate" style={{maxWidth: '200px'}}>{t.subject}</td><td className="p-2"><Button variant="secondary" className="py-1 px-2 text-xs" onClick={() => { setEditingTemplate(t as any); setTemplateModalOpen(true); }}>Editar</Button></td></tr>)}</tbody>
                                </table>
                            </div>
                        </div>
                        <div className="pt-2"><Button onClick={() => handleSave('Configurações de comunicação')}>Salvar Seção</Button></div>
                     </div>
                </SubSectionCard>

                 {/* Security & System */}
                <SubSectionCard
                    title="Segurança e Sistema"
                    description="Defina políticas de segurança e backups."
                     icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.066 11.954 11.954 0 0110 18.056a11.954 11.954 0 017.834-12.99 11.954 11.954 0 01-7.834-3.122zM10 4a1 1 0 011 1v5a1 1 0 11-2 0V5a1 1 0 011-1zm0 8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>}
                >
                     <div className="space-y-6">
                        {/* Security Policies */}
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Políticas de Segurança</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center"><Label htmlFor="minPasswordLength">Tamanho mínimo da senha</Label><Input id="minPasswordLength" type="number" value={security.minPasswordLength} onChange={(e) => setSecurity({...security, minPasswordLength: parseInt(e.target.value)})} className="w-20"/></div>
                                <div className="flex justify-between items-center"><p>Exigir maiúsculas e números</p><Toggle checked={security.requireUppercase} onChange={(e) => setSecurity({...security, requireUppercase: e.target.checked})}/></div>
                                <div className="flex justify-between items-center"><p>2FA obrigatório para admins</p><Toggle checked={security.force2faForAdmins} onChange={(e) => setSecurity({...security, force2faForAdmins: e.target.checked})}/></div>
                                <div className="flex justify-between items-center"><Label htmlFor="lockoutAttempts">Bloquear após N tentativas</Label><Input id="lockoutAttempts" type="number" value={security.lockoutAttempts} onChange={(e) => setSecurity({...security, lockoutAttempts: parseInt(e.target.value)})} className="w-20"/></div>
                            </div>
                        </div>
                         {/* Backups */}
                         <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Backups Automáticos</h4>
                            <div className="text-sm p-3 bg-gray-50 rounded-md">
                                <p><strong>Status:</strong> <span className="text-emerald-600 font-semibold">Ativo</span></p>
                                <p><strong>Frequência:</strong> Diariamente às 03:00</p>
                                <p><strong>Destino:</strong> AWS S3 (Bucket: `vakinha-facil-backups`)</p>
                            </div>
                        </div>
                        <div className="pt-2"><Button onClick={() => handleSave('Configurações de segurança')}>Salvar Seção</Button></div>
                     </div>
                </SubSectionCard>

                 {/* Links to other sections */}
                <SubSectionCard
                    title="Domínios Personalizados"
                    description="Gerencie domínios para clientes White-Label."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>}
                >
                    <p className="text-sm text-gray-600 mb-4">A configuração de domínios, certificados SSL e DNS é gerenciada na seção White-Label.</p>
                    <Button variant="secondary" onClick={() => setActiveTab('White-Label')}>
                        Gerenciar Domínios
                    </Button>
                </SubSectionCard>

            </div>

             {/* Modals */}
             <Modal isOpen={isFeeModalOpen} onClose={() => setFeeModalOpen(false)} title="Adicionar Período de Taxa" footer={<><Button variant="secondary" onClick={() => setFeeModalOpen(false)}>Cancelar</Button><Button variant="primary" onClick={() => handleSave('Taxas dinâmicas')}>Salvar</Button></>}>
                <div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>Data Início</Label><Input type="date"/></div><div><Label>Data Fim</Label><Input type="date"/></div></div><div><Label>Taxa Fixa (R$)</Label><Input type="number" placeholder="25.00"/></div><div><Label>Taxa Percentual (%)</Label><Input type="number" placeholder="5.0"/></div></div>
             </Modal>

             <Modal isOpen={isPlanModalOpen} onClose={() => setPlanModalOpen(false)} title={`Editar Plano: ${editingPlan?.name}`} footer={<><Button variant="secondary" onClick={() => setPlanModalOpen(false)}>Cancelar</Button><Button variant="primary" onClick={() => handleSave('Limites do plano')}>Salvar</Button></>}>
                <div className="space-y-4"><div><Label>Limite de Vaquinhas (999 para ilimitado)</Label><Input type="number" defaultValue={editingPlan?.vaquinhaLimit}/></div><div><Label>Valor Máximo por Vaquinha (R$)</Label><Input type="number" defaultValue={editingPlan?.maxValue}/></div></div>
             </Modal>

             <Modal isOpen={isTemplateModalOpen} onClose={() => setTemplateModalOpen(false)} title={`Editar Template: ${editingTemplate?.type}`} footer={<><Button variant="secondary" onClick={() => setTemplateModalOpen(false)}>Cancelar</Button><Button variant="primary" onClick={() => handleSave('Template de e-mail')}>Salvar</Button></>}>
                 <div className="space-y-4"><div><Label>Assunto do E-mail</Label><Input defaultValue={editingTemplate?.subject}/></div><div><Label>Corpo do E-mail</Label><Textarea rows={8} placeholder="Edite o conteúdo do e-mail aqui. Em um ambiente real, este seria um editor WYSIWYG."/>
                 {/* FIX: The double curly braces were being parsed as JSX objects. Wrapping the string in a JSX expression with quotes (`{''}`) treats it as a literal string. */}
                 <p className="text-xs text-gray-500 mt-1">{'Variáveis disponíveis: `{{vaquinha_nome}}`, `{{nome_usuario}}`, `{{link_vaquinha}}`.'}</p></div></div>
             </Modal>
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
            default: return <LandingPage onStartCreating={handleGroupAdminLogin} />;
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