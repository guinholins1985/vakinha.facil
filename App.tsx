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


const Logo = ({ className }: { className?: string }) => {
    let textSize = 'text-xl'; // default
    if (className?.includes('w-48')) textSize = 'text-3xl';
    if (className?.includes('w-28')) textSize = 'text-xl';
    if (className?.includes('w-24')) textSize = 'text-lg';

    return (
        <span className={`font-heading font-bold text-emerald-600 ${textSize}`}>
            Vakinha Fácil
        </span>
    );
};


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

// FIX: Added placeholder components for missing sections.
const TestimonialsSection = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <SectionTitle>O que nossos clientes dizem</SectionTitle>
            <SectionSubtitle>Milhares de grupos confiam no Vakinha Fácil para organizar suas finanças coletivas com transparência e segurança.</SectionSubtitle>
            {/* Placeholder content */}
            <div className="text-center text-gray-500 italic">"O Vakinha Fácil salvou nosso churrasco de final de ano!" - Cliente Satisfeito</div>
        </div>
    </section>
);

const SecuritySection = () => (
    <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
            <SectionTitle>Sua segurança é nossa prioridade</SectionTitle>
            <SectionSubtitle>Utilizamos as melhores práticas de segurança para garantir que seus dados e seu dinheiro estejam sempre protegidos.</SectionSubtitle>
             {/* Placeholder content */}
             <div className="text-center text-gray-500">Pagamentos processados com segurança.</div>
        </div>
    </section>
);

const PricingSection = ({ onStartCreating }: { onStartCreating: () => void }) => (
    <section className="py-20 bg-white" id="pricing">
        <div className="container mx-auto px-6">
            <SectionTitle>Planos e Preços</SectionTitle>
            <SectionSubtitle>Escolha o plano que melhor se adapta às suas necessidades. Comece gratuitamente e evolua quando precisar.</SectionSubtitle>
            <div className="flex justify-center mt-10">
                <button onClick={onStartCreating} className="inline-block bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 duration-300 ease-in-out">
                    Ver todos os planos
                </button>
            </div>
        </div>
    </section>
);

const FinalCTASection = ({ onStartCreating }: { onStartCreating: () => void }) => (
    <section className="py-20 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Pronto para simplificar suas vaquinhas?</h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
                Crie sua conta e comece a arrecadar dinheiro em minutos. Sem burocracia, sem estresse.
            </p>
            <button onClick={onStartCreating} className="bg-white text-emerald-600 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300 ease-in-out">
                Crie sua vaquinha agora
            </button>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-800 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
            <div className="flex justify-center mb-6">
                <Logo className="w-36" />
            </div>
            <p className="mb-4">A plataforma completa para vaquinhas online no Brasil.</p>
            <p>&copy; {new Date().getFullYear()} Vakinha Fácil. Todos os direitos reservados.</p>
        </div>
    </footer>
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

// FIX: Completed the UseCasesSection component.
const UseCasesSection = () => {
    const cases = [
        { title: 'Viagens em grupo', image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Arrecade para passagens, hospedagem e passeios.' },
        { title: 'Presentes coletivos', image: 'https://images.unsplash.com/photo-1579412690850-bd41cd068592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Compre aquele presentão de aniversário ou casamento.' },
        { title: 'Churrascos e festas', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Divida os custos da carne, bebida e carvão sem estresse.' },
        { title: 'Condomínios', image: 'https://images.unsplash.com/photo-1605283176568-9b41fde3613e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Junte dinheiro para reformas, manutenções ou festas.' },
        { title: 'Times de esporte', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Pague inscrições em campeonatos e compre uniformes.' },
        { title: 'Formaturas', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Organize a arrecadação para a festa e a viagem.' },
    ];
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <SectionTitle>Perfeito para qualquer ocasião</SectionTitle>
                <SectionSubtitle>
                    Seja para uma viagem com amigos, um presente de casamento ou a reforma do condomínio, o Vakinha Fácil é a solução.
                </SectionSubtitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cases.map((useCase) => (
                        <div key={useCase.title} className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
                             <img src={useCase.image} alt={useCase.title} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2 font-heading">{useCase.title}</h3>
                                <p className="text-gray-600">{useCase.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// FIX: Added the main App component and exported it as default. This fixes the error in index.tsx
const App = () => {
    const [userType, setUserType] = useState<string | null>(null);

    const handleLogin = (type: 'groupAdmin' | 'systemAdmin') => {
        setUserType(type);
    };

    const handleLogout = () => {
        setUserType(null);
    };
    
    return (
        <ToastProvider>
            <Header 
                userType={userType} 
                onGroupAdminLogin={() => handleLogin('groupAdmin')}
                onSystemAdminLogin={() => handleLogin('systemAdmin')}
                onLogout={handleLogout}
            />
            <main>
                {userType ? (
                     <div className="pt-32 pb-16 container mx-auto px-6">
                        <h1 className="text-4xl font-bold mb-4">Painel de Controle</h1>
                        <p className="text-lg text-gray-700">Bem-vindo, {userType === 'groupAdmin' ? 'Gestor de Grupo' : 'Admin do Sistema'}!</p>
                        <p className="mt-4">Esta área é um placeholder para o painel de administração da sua conta.</p>
                        <button onClick={handleLogout} className="mt-8 bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition-colors">
                            Sair
                        </button>
                    </div>
                ) : (
                    <LandingPage onStartCreating={() => handleLogin('groupAdmin')} />
                )}
            </main>
            <AiChatbot />
        </ToastProvider>
    );
};

export default App;
