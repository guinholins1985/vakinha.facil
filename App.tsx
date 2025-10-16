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

            const responseText = response.text;
            const aiMessage = { role: 'model' as const, text: responseText };
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

// --- START: SHARED & UTILITY COMPONENTS ---
const Logo = ({ className }: { className?: string }) => (
    <span className={`font-heading font-bold text-emerald-600 ${className?.includes('w-48') ? 'text-3xl' : 'text-xl'}`}>
        Vakinha Fácil
    </span>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
            <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};
// --- END: SHARED & UTILITY COMPONENTS ---

// --- START: LANDING PAGE COMPONENTS ---
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

const TestimonialsSection = () => ( <section className="py-20 bg-white"><div className="container mx-auto px-6"><SectionTitle>O que nossos clientes dizem</SectionTitle><SectionSubtitle>Milhares de grupos confiam no Vakinha Fácil para organizar suas finanças coletivas com transparência e segurança.</SectionSubtitle><div className="text-center text-gray-500 italic">"O Vakinha Fácil salvou nosso churrasco de final de ano!" - Cliente Satisfeito</div></div></section>);
const SecuritySection = () => ( <section className="py-20 bg-slate-50"><div className="container mx-auto px-6"><SectionTitle>Sua segurança é nossa prioridade</SectionTitle><SectionSubtitle>Utilizamos as melhores práticas de segurança para garantir que seus dados e seu dinheiro estejam sempre protegidos.</SectionSubtitle><div className="text-center text-gray-500">Pagamentos processados com segurança.</div></div></section>);
const PricingSection = ({ onStartCreating }: { onStartCreating: () => void }) => (<section className="py-20 bg-white" id="pricing"><div className="container mx-auto px-6"><SectionTitle>Planos e Preços</SectionTitle><SectionSubtitle>Escolha o plano que melhor se adapta às suas necessidades. Comece gratuitamente e evolua quando precisar.</SectionSubtitle><div className="flex justify-center mt-10"><button onClick={onStartCreating} className="inline-block bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 duration-300 ease-in-out">Ver todos os planos</button></div></div></section>);
const FinalCTASection = ({ onStartCreating }: { onStartCreating: () => void }) => (<section className="py-20 bg-emerald-600 text-white"><div className="container mx-auto px-6 text-center"><h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Pronto para simplificar suas vaquinhas?</h2><p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">Crie sua conta e comece a arrecadar dinheiro em minutos. Sem burocracia, sem estresse.</p><button onClick={onStartCreating} className="bg-white text-emerald-600 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300 ease-in-out">Crie sua vaquinha agora</button></div></section>);
const Footer = () => (<footer className="bg-gray-800 text-gray-400 py-12"><div className="container mx-auto px-6 text-center"><div className="flex justify-center mb-6"><Logo className="w-36" /></div><p className="mb-4">A plataforma completa para vaquinhas online no Brasil.</p><p>&copy; {new Date().getFullYear()} Vakinha Fácil. Todos os direitos reservados.</p></div></footer>);
const LandingPage = ({ onStartCreating }: { onStartCreating: () => void }) => (<><HeroSection onStartCreating={onStartCreating} /><BenefitsSection /><HowItWorksSection /><UseCasesSection /><TestimonialsSection /><SecuritySection /><PricingSection onStartCreating={onStartCreating} /><FinalCTASection onStartCreating={onStartCreating} /><Footer /></>);
const HeroSection = ({ onStartCreating }: { onStartCreating: () => void }) => ( <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-28"><div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#d5f5e3,transparent)]"></div></div><div className="container mx-auto px-6"><div className="grid lg:grid-cols-2 gap-16 items-center"><div className="text-center lg:text-left"><h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tighter font-heading">Junte dinheiro em grupo sem estresse. <span className="text-emerald-600">Tudo automatizado!</span></h1><p className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl mx-auto lg:mx-0">Crie vaquinhas coletivas em 3 passos, convide participantes e acompanhe tudo em tempo real. Sem planilhas, sem dor de cabeça.</p><button onClick={onStartCreating} className="inline-block bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 duration-300 ease-in-out">Comece agora – Grátis por 7 dias</button></div><div className="relative flex justify-center lg:justify-end"><div className="relative w-full max-w-lg"><div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div><div className="absolute top-0 -right-4 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div><div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div><div className="relative"><img src="https://i.imgur.com/gC514Jq.png" alt="Dashboard do App Vakinha Fácil" className="rounded-2xl shadow-2xl w-full h-auto border-4 border-white"/></div></div></div></div></div><style>{` @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } } .animate-blob { animation: blob 7s infinite; } .animation-delay-2000 { animation-delay: 2s; } .animation-delay-4000 { animation-delay: 4s; } `}</style></section>);
interface SectionProps { children?: React.ReactNode; }
const SectionTitle: React.FC<SectionProps> = ({ children }) => (<h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 font-heading">{children}</h2>);
const SectionSubtitle: React.FC<SectionProps> = ({ children }) => (<p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">{children}</p>);
const BenefitsSection = () => { const benefits = [ { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.69-3.182-3.182a8.25 8.25 0 0 0-11.667 0l-3.181 3.182m0 0h-4.992v4.992h4.992v-4.992Z" /></svg>, title: "Automatizado", description: "Cobranças, lembretes e distribuições feitos automaticamente." }, { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-4.43a1.012 1.012 0 0 1 1.433 0l4.43 4.43a1.012 1.012 0 0 1 0 .639l-4.43 4.43a1.012 1.012 0 0 1-1.433 0l-4.43-4.43Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-4.43a1.012 1.012 0 0 1 1.433 0l4.43 4.43a1.012 1.012 0 0 1 0 .639l-4.43 4.43a1.012 1.012 0 0 1-1.433 0l-4.43-4.43Z" /></svg>, title: "Transparente", description: "Todos veem quem pagou e quando. Sem desconfiança." }, { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.978 11.978 0 0 1 12 3c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.482.32-2.895.88-4.144" /></svg>, title: "Seguro", description: "Integração com gateways de pagamento e validação de CPF." }]; return ( <section className="py-20 bg-slate-50"><div className="container mx-auto px-6"><SectionTitle>A forma inteligente de juntar dinheiro em grupo</SectionTitle><SectionSubtitle>Esqueça as planilhas do Excel e os grupos de WhatsApp. O Vakinha Fácil centraliza tudo o que você precisa para organizar coletas de dinheiro.</SectionSubtitle><div className="grid md:grid-cols-3 gap-8">{benefits.map((benefit, index) => ( <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"><div className="flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-5">{benefit.icon}</div><h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{benefit.title}</h3><p className="text-gray-600">{benefit.description}</p></div>))}</div></div></section>);};
const HowItWorksSection = () => { const steps = [ { number: 1, title: 'Crie sua Vaquinha', description: 'Defina o objetivo, valor, e data limite. É super rápido e intuitivo.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg> }, { number: 2, title: 'Convide os Participantes', description: 'Envie um link exclusivo por WhatsApp, e-mail ou redes sociais.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.952a4.5 4.5 0 0 1 6.364 0M10.5 14.25a4.5 4.5 0 1 1 3.182-3.182m-6.364 0a4.5 4.5 0 0 0 6.364 0m-6.364 0 6.364 0M10.5 14.25 12 15.75m-1.5-1.5L9 12.75m3 3-1.5-1.5M15 9.75a4.5 4.5 0 0 1 6.364 0m-6.364 0a4.5 4.5 0 0 0 6.364 0m-6.364 0-6.364 0" /></svg> }, { number: 3, title: 'Acompanhe e Receba', description: 'Veja quem pagou em tempo real e receba o valor total na data combinada.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75" /></svg> }, ]; return ( <section className="py-20 bg-white"><div className="container mx-auto px-6"><SectionTitle>Simples como contar até 3</SectionTitle><SectionSubtitle>Organizar uma vaquinha nunca foi tão fácil. Siga os passos e deixe a mágica acontecer.</SectionSubtitle><div className="relative"><div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200" aria-hidden="true"></div><div className="relative grid md:grid-cols-3 gap-12">{steps.map((step) => ( <div key={step.number} className="text-center bg-white p-6 rounded-lg"><div className="flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-5 mx-auto border-4 border-white">{step.icon}</div><h3 className="text-xl font-bold text-gray-800 mb-2 font-heading">{step.number}. {step.title}</h3><p className="text-gray-600">{step.description}</p></div>))}</div></div></div></section>);};
const UseCasesSection = () => { const cases = [ { title: 'Viagens em grupo', image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Arrecade para passagens, hospedagem e passeios.' }, { title: 'Presentes coletivos', image: 'https://images.unsplash.com/photo-1579412690850-bd41cd068592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Compre aquele presentão de aniversário ou casamento.' }, { title: 'Churrascos e festas', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Divida os custos da carne, bebida e carvão sem estresse.' }, { title: 'Condomínios', image: 'https://images.unsplash.com/photo-1605283176568-9b41fde3613e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Junte dinheiro para reformas, manutenções ou festas.' }, { title: 'Times de esporte', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Pague inscrições em campeonatos e compre uniformes.' }, { title: 'Formaturas', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', description: 'Organize a arrecadação para a festa e a viagem.' }, ]; return ( <section className="py-20 bg-slate-50"><div className="container mx-auto px-6"><SectionTitle>Perfeito para qualquer ocasião</SectionTitle><SectionSubtitle>Seja para uma viagem com amigos, um presente de casamento ou a reforma do condomínio, o Vakinha Fácil é a solução.</SectionSubtitle><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{cases.map((useCase) => ( <div key={useCase.title} className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300"><img src={useCase.image} alt={useCase.title} className="w-full h-48 object-cover" /><div className="p-6"><h3 className="text-xl font-bold text-gray-800 mb-2 font-heading">{useCase.title}</h3><p className="text-gray-600">{useCase.description}</p></div></div>))}</div></div></section>);};
// --- END: LANDING PAGE COMPONENTS ---

// --- START: SYSTEM ADMIN DASHBOARD ---
const SystemAdminSidebar = ({ activeView, setActiveView }: { activeView: string; setActiveView: (view: string) => void; }) => {
    const navItems = [
        { id: 'resumo', label: 'Resumo', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
        { id: 'usuarios', label: 'Usuários', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" /></svg> },
        { id: 'vaquinhas', label: 'Vaquinhas', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { id: 'financeiro', label: 'Financeiro', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg> },
        { id: 'gateways', label: 'Gateways', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
        { id: 'layout', label: 'Layout', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg> },
        { id: 'marketing', label: 'Marketing', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.036 9.283-5.182" /></svg> },
        { id: 'suporte', label: 'Suporte', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { id: 'relatorios', label: 'Relatórios', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        { id: 'seguranca', label: 'Segurança', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.978 11.978 0 0112 3c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.482.32-2.895.88-4.144" /></svg> },
        { id: 'configuracoes', label: 'Configurações', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    ];
    return (
        <aside className="w-64 bg-white shadow-md -mt-20">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Admin</h2>
                <span className="text-sm text-gray-500">Painel do Sistema</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => setActiveView(item.id)}
                        className={`flex items-center w-full px-4 py-2 text-left text-gray-600 rounded-lg transition-colors duration-200 ${ activeView === item.id ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100 hover:text-gray-800' }`}
                    >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

const KpiCard = ({ title, value, icon, change, changeType }: { title: string, value: string, icon: React.ReactNode, change?: string, changeType?: 'increase' | 'decrease' }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className="text-emerald-500 bg-emerald-100 p-3 rounded-full">
                {icon}
            </div>
        </div>
        {change && (
            <div className={`mt-4 text-sm font-medium flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {changeType === 'increase' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                }
                <span>{change}</span>
            </div>
        )}
    </div>
);

const SystemResumoView = () => {
    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800">Resumo da Plataforma</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <KpiCard title="Arrecadação (Mês)" value="R$ 42.5k" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} change="+12%" changeType="increase"/>
                 <KpiCard title="Vaquinhas Ativas" value="132" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                 <KpiCard title="Novos Usuários" value="89" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} change="-3%" changeType="decrease"/>
                 <KpiCard title="Taxa de Conversão" value="4.8%" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>} />
            </div>
             <section className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-gray-700 mb-4">Atividades Recentes</h2>
                 <ul className="space-y-3">
                     <li className="p-3 bg-gray-50 rounded-md">Vaquejada "Churrasco Fim de Ano" atingiu a meta.</li>
                     <li className="p-3 bg-gray-50 rounded-md">Novo saque solicitado por "Viagem para a Praia".</li>
                 </ul>
            </section>
        </div>
    );
};

const mockUsers = [
    { id: 1, name: 'Alice Silva', avatar: `https://i.pravatar.cc/150?u=alice`, email: 'alice.silva@example.com', status: 'Ativo' as const, registrationDate: '2023-10-26', lastLogin: '2024-07-20', role: 'Admin' as const, verificationStatus: 'Verificado' as const, activity: [{ timestamp: '2024-07-20 10:00', action: 'Login no sistema' }, { timestamp: '2024-07-19 15:30', action: 'Aprovou vaquinha #554' }] },
    { id: 2, name: 'Bruno Souza', avatar: `https://i.pravatar.cc/150?u=bruno`, email: 'bruno.souza@example.com', status: 'Ativo' as const, registrationDate: '2023-11-15', lastLogin: '2024-07-18', role: 'Moderador' as const, verificationStatus: 'Verificado' as const, activity: [{ timestamp: '2024-07-18 09:00', action: 'Login no sistema' }] },
    { id: 3, name: 'Carla Lima', avatar: `https://i.pravatar.cc/150?u=carla`, email: 'carla.lima@example.com', status: 'Inativo' as const, registrationDate: '2024-01-05', lastLogin: '2024-06-10', role: 'Comum' as const, verificationStatus: 'Pendente' as const, activity: [{ timestamp: '2024-06-10 14:00', action: 'Login no sistema' }, { timestamp: '2024-06-09 11:20', action: 'Criou a vaquinha "Presente do Chefe"' }] },
    { id: 4, name: 'Daniel Alves', avatar: `https://i.pravatar.cc/150?u=daniel`, email: 'daniel.alves@example.com', status: 'Ativo' as const, registrationDate: '2024-03-22', lastLogin: '2024-07-21', role: 'Comum' as const, verificationStatus: 'Não verificado' as const, activity: [{ timestamp: '2024-07-21 08:30', action: 'Login no sistema' }, { timestamp: '2024-07-21 08:32', action: 'Contribuiu com R$ 50,00 na vaquinha "Festa Junina"' }] },
    { id: 5, name: 'Eduarda Costa', avatar: `https://i.pravatar.cc/150?u=eduarda`, email: 'eduarda.costa@example.com', status: 'Ativo' as const, registrationDate: '2024-05-18', lastLogin: '2024-07-19', role: 'Moderador' as const, verificationStatus: 'Verificado' as const, activity: [{ timestamp: '2024-07-19 18:00', action: 'Login no sistema' }] },
];

const SystemUsuariosView = () => {
    const [users, setUsers] = useState(mockUsers);
    const [modal, setModal] = useState<{type: string | null; data: any | null}>({ type: null, data: null });
    const { addToast } = useToast();

    const handleToggleStatus = (userId: number) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === userId) {
                const newStatus = user.status === 'Ativo' ? 'Inativo' : 'Ativo';
                addToast(`Usuário ${user.name} foi ${newStatus.toLowerCase()}.`);
                return { ...user, status: newStatus };
            }
            return user;
        }));
    };

    const handleSaveProfile = (userId: number, newRole: string, newStatus: string) => {
        setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, role: newRole as any, status: newStatus as any } : user));
        addToast("Perfil do usuário atualizado com sucesso!");
        setModal({ type: null, data: null });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Gestão de Usuários</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input type="text" placeholder="Buscar por nome ou e-mail..." className="input-field col-span-2" />
                    <select className="input-field">
                        <option>Todos Status</option>
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </select>
                    <select className="input-field">
                        <option>Todos Cargos</option>
                        <option>Admin</option>
                        <option>Moderador</option>
                        <option>Comum</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Usuário</th>
                                <th scope="col" className="px-6 py-3">E-mail</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Cargo</th>
                                <th scope="col" className="px-6 py-3">Cadastro</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="w-10 h-10 rounded-full" src={user.avatar} alt={user.name} />
                                            <div className="pl-3">{user.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">{user.registrationDate}</td>
                                    <td className="px-6 py-4">
                                         <div className="relative group">
                                            <button className="text-gray-500 hover:text-gray-700">
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                            </button>
                                             <div className="absolute right-0 z-10 w-48 py-2 mt-2 origin-top-right bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                                 <a href="#" onClick={() => setModal({ type: 'details', data: user })} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ver Detalhes</a>
                                                 <a href="#" onClick={() => setModal({ type: 'edit', data: user })} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar Perfil</a>
                                                 <a href="#" onClick={() => setModal({ type: 'verify', data: user })} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Verificar Conta</a>
                                                 <a href="#" onClick={() => handleToggleStatus(user.id)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{user.status === 'Ativo' ? 'Suspender' : 'Ativar'}</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="flex justify-between items-center pt-4">
                     <span className="text-sm text-gray-700">Mostrando 1 a 5 de {users.length} usuários</span>
                     <div className="inline-flex -space-x-px rounded-md shadow-sm">
                         <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">Anterior</button>
                         <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">Próximo</button>
                     </div>
                </div>
            </div>

            {modal.type === 'edit' && modal.data && (
                <Modal isOpen={true} onClose={() => setModal({ type: null, data: null })} title={`Editar Perfil de ${modal.data.name}`}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(modal.data.id, (e.target as any).role.value, (e.target as any).status.value); }}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Cargo</label>
                                <select id="role" name="role" defaultValue={modal.data.role} className="input-field mt-1">
                                    <option>Comum</option>
                                    <option>Moderador</option>
                                    <option>Admin</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select id="status" name="status" defaultValue={modal.data.status} className="input-field mt-1">
                                    <option>Ativo</option>
                                    <option>Inativo</option>
                                </select>
                            </div>
                            <div className="flex justify-end pt-4 space-x-2">
                                <button type="button" onClick={() => setModal({ type: null, data: null })} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Salvar Alterações</button>
                            </div>
                        </div>
                    </form>
                </Modal>
            )}

            {modal.type === 'details' && modal.data && (
                 <Modal isOpen={true} onClose={() => setModal({ type: null, data: null })} title={`Histórico de ${modal.data.name}`}>
                    <ul className="space-y-2">
                        {modal.data.activity.map((log: any, index: number) => (
                            <li key={index} className="p-3 bg-gray-50 rounded-md">
                                <span className="font-semibold text-gray-700">{log.action}</span>
                                <p className="text-xs text-gray-500">{log.timestamp}</p>
                            </li>
                        ))}
                    </ul>
                 </Modal>
            )}

            {modal.type === 'verify' && modal.data && (
                 <Modal isOpen={true} onClose={() => setModal({ type: null, data: null })} title={`Verificar Conta de ${modal.data.name}`}>
                    <div>
                         <p className="mb-4 text-gray-600">Status atual: <span className="font-bold">{modal.data.verificationStatus}</span></p>
                         <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <p className="font-semibold">Documento de Identidade</p>
                            <div className="mt-2 text-gray-400">[Placeholder para imagem do documento]</div>
                         </div>
                         <div className="flex justify-end pt-4 space-x-2">
                            <button type="button" onClick={() => { addToast('Conta Rejeitada.', 'error'); setModal({ type: null, data: null }); }} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Rejeitar</button>
                            <button type="button" onClick={() => { addToast('Conta Aprovada!', 'success'); setModal({ type: null, data: null }); }} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Aprovar Documento</button>
                        </div>
                    </div>
                 </Modal>
            )}
        </div>
    );
};

const mockVaquinhas = [
    { id: 101, title: "Presente de Casamento Joana e Pedro", creator: "Alice Silva", goal: 5000, raised: 5200, status: 'Encerrada' as const, deadline: '2024-06-30' },
    { id: 102, title: "Viagem da Turma para a Praia", creator: "Bruno Souza", goal: 8000, raised: 3400, status: 'Ativa' as const, deadline: '2024-08-15' },
    { id: 103, title: "Reforma da Sala de Reuniões", creator: "Carla Lima", goal: 2500, raised: 1200, status: 'Pendente' as const, deadline: '2024-09-01' },
    { id: 104, title: "Churrasco de Fim de Ano da Empresa", creator: "Daniel Alves", goal: 1500, raised: 1500, status: 'Ativa' as const, deadline: '2024-12-20' },
];

const SystemVaquinhasView = () => {
    const [vaquinhas, setVaquinhas] = useState(mockVaquinhas);
    const [modal, setModal] = useState<{type: string | null; data: any | null}>({ type: null, data: null });
    const { addToast } = useToast();

    const handleSave = (vaquinhaId: number, newData: any) => {
        setVaquinhas(prev => prev.map(v => v.id === vaquinhaId ? {...v, ...newData} : v));
        addToast("Vaquinha atualizada com sucesso!");
        setModal({type: null, data: null});
    };

    const donors = [{ name: 'Carlos Pereira', amount: 100 }, { name: 'Mariana Costa', amount: 50 }];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Gestão de Vaquinhas</h1>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input type="text" placeholder="Buscar por título ou criador..." className="input-field" />
                    <select className="input-field">
                        <option>Todos Status</option>
                        <option>Ativa</option>
                        <option>Encerrada</option>
                        <option>Pendente</option>
                        <option>Cancelada</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Título</th>
                                <th className="px-6 py-3">Progresso</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Prazo Final</th>
                                <th className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vaquinhas.map(v => (
                                <tr key={v.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{v.title}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                                <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${(v.raised / v.goal) * 100}%` }}></div>
                                            </div>
                                            <span>{((v.raised/v.goal)*100).toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{v.status}</td>
                                    <td className="px-6 py-4">{v.deadline}</td>
                                    <td className="px-6 py-4">
                                         <div className="relative group">
                                            <button className="text-gray-500 hover:text-gray-700">
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                            </button>
                                             <div className="absolute right-0 z-10 w-48 py-2 mt-2 origin-top-right bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                                {v.status === 'Pendente' && <a href="#" onClick={() => setModal({ type: 'analyze', data: v })} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Analisar</a>}
                                                 <a href="#" onClick={() => setModal({ type: 'details', data: v })} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ver Detalhes</a>
                                                 <a href="#" onClick={() => setModal({ type: 'edit', data: v })} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {modal.type === 'analyze' && <Modal isOpen={true} onClose={() => setModal({ type: null, data: null })} title="Analisar Vaquinha">
                <p className="mb-4">Revise os detalhes e aprove ou rejeite a vaquinha.</p>
                <textarea className="input-field w-full" placeholder="Justificativa (obrigatório se rejeitar)"></textarea>
                 <div className="flex justify-end pt-4 space-x-2">
                    <button onClick={() => { addToast('Vaquinha Rejeitada.', 'error'); setModal({ type: null, data: null }); }} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Rejeitar</button>
                    <button onClick={() => { handleSave(modal.data.id, {status: 'Ativa'}); }} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Aprovar</button>
                </div>
            </Modal>}
             {modal.type === 'edit' && <Modal isOpen={true} onClose={() => setModal({ type: null, data: null })} title="Editar Vaquinha">
                 <form onSubmit={(e) => e.preventDefault()}>
                    <input type="number" defaultValue={modal.data.goal} className="input-field mb-2 w-full" placeholder="Meta"/>
                    <input type="date" defaultValue={modal.data.deadline} className="input-field mb-2 w-full" placeholder="Prazo"/>
                    <select defaultValue={modal.data.status} className="input-field w-full">
                         <option>Ativa</option><option>Encerrada</option><option>Cancelada</option>
                    </select>
                    <div className="flex justify-end pt-4"><button type="submit" onClick={() => addToast("Salvo!")} className="px-4 py-2 bg-emerald-500 text-white rounded-lg">Salvar</button></div>
                 </form>
             </Modal>}
              {modal.type === 'details' && <Modal isOpen={true} onClose={() => setModal({ type: null, data: null })} title="Detalhes da Vaquinha">
                 <h3>Lista de Doadores</h3>
                 <ul className="space-y-2 mt-2">{donors.map(d => <li key={d.name} className="flex justify-between p-2 bg-gray-50"><span>{d.name}</span><span>R$ {d.amount.toFixed(2)}</span></li>)}</ul>
                 <div className="flex justify-end pt-4"><button onClick={() => addToast("Exportando relatório...")} className="px-4 py-2 bg-emerald-500 text-white rounded-lg">Exportar (CSV)</button></div>
             </Modal>}
        </div>
    );
};

const SystemFinanceiroView = () => {
    const mockTransactions = [
        { id: 't1', type: 'Pagamento', vaquinha: 'Casamento Joana e Pedro', value: 100, date: '2024-07-20' },
        { id: 't2', type: 'Saque', vaquinha: 'Churrasco Fim de Ano', value: -1500, date: '2024-07-19' },
        { id: 't3', type: 'Taxa', vaquinha: 'Churrasco Fim de Ano', value: -45, date: '2024-07-19' },
    ];
    const mockPending = [ {id: 's1', type: 'Saque', vaquinha: 'Viagem da Turma', value: 3400, user: 'Bruno Souza'}];
    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800">Financeiro</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Receita Bruta (Mês)" value="R$ 12.8k" icon={<span className="text-2xl">💰</span>} />
                <KpiCard title="Taxas da Plataforma" value="R$ 384" icon={<span className="text-2xl">📈</span>} />
                <KpiCard title="Saques Realizados" value="R$ 9.2k" icon={<span className="text-2xl">📤</span>} />
                <KpiCard title="Lucro Líquido (Mês)" value="R$ 384" icon={<span className="text-2xl">💸</span>} />
            </div>
            <section className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-gray-700 mb-4">Solicitações Pendentes</h2>
                 <ul className="space-y-3">
                     {mockPending.map(p => <li key={p.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                         <div>{p.type} para "{p.vaquinha}" - R$ {p.value.toFixed(2)}</div>
                         <div className="space-x-2"><button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Rejeitar</button><button className="px-3 py-1 bg-emerald-500 text-white rounded-md text-sm">Aprovar</button></div>
                     </li>)}
                 </ul>
            </section>
             <section className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-gray-700 mb-4">Histórico de Transações</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr><th>Tipo</th><th>Vaquinha</th><th>Valor</th><th>Data</th></tr>
                        </thead>
                        <tbody>
                            {mockTransactions.map(t => <tr key={t.id}><td>{t.type}</td><td>{t.vaquinha}</td><td>R$ {t.value.toFixed(2)}</td><td>{t.date}</td></tr>)}
                        </tbody>
                    </table>
                 </div>
            </section>
        </div>
    );
};

const mockTickets = [
    { id: 7891, user: 'Ana Paula', subject: 'Problema com saque', category: 'Problemas Técnicos', status: 'Aberto', priority: 'Alta', lastUpdate: '2h atrás' },
    { id: 7892, user: 'Bruno Costa', subject: 'Dúvida sobre taxas', category: 'Dúvidas', status: 'Aguardando', priority: 'Média', lastUpdate: '5h atrás' },
    { id: 7893, user: 'Carla Dias', subject: 'Denúncia de vaquinha', category: 'Denúncias', status: 'Aberto', priority: 'Alta', lastUpdate: '1 dia atrás' },
    { id: 7894, user: 'Daniel Martins', subject: 'Como criar vaquinha recorrente?', category: 'Dúvidas', status: 'Fechado', priority: 'Baixa', lastUpdate: '2 dias atrás' },
];

const mockKnowledgeBase = [
    { id: 1, title: 'Primeiros passos no Vakinha Fácil', category: 'Guias' },
    { id: 2, title: 'Como configurar pagamentos recorrentes', category: 'Tutoriais' },
    { id: 3, title: 'Como solicitar distribuição do valor', category: 'FAQ' },
];

const mockFeedback = [
    { id: 1, user: 'Fernanda Lima', rating: 5, comment: 'Plataforma excelente, muito fácil de usar!', archived: false },
    { id: 2, user: 'Gustavo Borges', rating: 4, comment: 'Gostei, mas gostaria de mais opções de pagamento.', archived: false },
    { id: 3, user: 'Helena Souza', rating: 5, comment: 'O suporte foi muito rápido em resolver meu problema.', archived: true },
];

const SystemSuporteView = () => {
    const [tickets, setTickets] = useState(mockTickets);
    const [knowledgeBase, setKnowledgeBase] = useState(mockKnowledgeBase);
    const [feedback, setFeedback] = useState(mockFeedback);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    const handleArchiveFeedback = (id: number) => {
        setFeedback(prev => prev.map(f => f.id === id ? {...f, archived: true} : f));
        addToast("Feedback arquivado.");
    };

    const handleSaveArticle = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, this would save to a backend
        addToast("Artigo salvo com sucesso!");
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800">Suporte e Atendimento</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Tickets Abertos" value="2" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3m2-9H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V5" /></svg>} />
                <KpiCard title="Resolução 1º Contato" value="85%" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <KpiCard title="Satisfação (CSAT)" value="9.2/10" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <KpiCard title="Chat ao Vivo" value="Online" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} />
            </div>

            <section>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Central de Tickets</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input type="text" placeholder="Buscar por nome ou assunto..." className="input-field" />
                        <select className="input-field"><option>Todas Categorias</option><option>Dúvidas</option><option>Problemas Técnicos</option><option>Denúncias</option></select>
                        <select className="input-field"><option>Todos Status</option><option>Aberto</option><option>Aguardando</option><option>Fechado</option></select>
                        <select className="input-field"><option>Todas Prioridades</option><option>Alta</option><option>Média</option><option>Baixa</option></select>
                    </div>
                    <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Usuário</th>
                                <th scope="col" className="px-6 py-3">Assunto</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Prioridade</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{ticket.id}</td>
                                    <td className="px-6 py-4">{ticket.user}</td>
                                    <td className="px-6 py-4">{ticket.subject}</td>
                                    <td className="px-6 py-4">{ticket.status}</td>
                                    <td className="px-6 py-4">{ticket.priority}</td>
                                    <td className="px-6 py-4"><button className="font-medium text-emerald-600 hover:underline">Ver</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Base de Conhecimento</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <button onClick={() => setIsModalOpen(true)} className="inline-block bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 mb-4">Adicionar Artigo</button>
                        <ul className="space-y-3">{knowledgeBase.map(a => <li key={a.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md"><span>{a.title}</span><div className="space-x-2"><button className="font-medium text-sm text-emerald-600 hover:underline">Editar</button><button className="font-medium text-sm text-red-600 hover:underline">Excluir</button></div></li>)}</ul>
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Feedback dos Usuários</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <ul className="space-y-4">{feedback.filter(f => !f.archived).map(f => <li key={f.id} className="p-4 border rounded-md bg-white hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">{f.user}</p>
                                        <p className="text-sm text-gray-600 mt-1">{f.comment}</p>
                                    </div>
                                    <div className="flex items-center flex-shrink-0 ml-4">
                                        <span className="text-yellow-500 mr-2 flex items-center">{ '★'.repeat(f.rating) }{ '☆'.repeat(5 - f.rating) }</span>
                                        <button onClick={() => handleArchiveFeedback(f.id)} className="text-sm text-gray-500 hover:text-gray-700">Arquivar</button>
                                    </div>
                                </div>
                            </li>)}</ul>
                    </div>
                </section>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Gerenciar Artigo">
                <form onSubmit={handleSaveArticle}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="articleTitle" className="block text-sm font-medium text-gray-700">Título</label>
                            <input type="text" id="articleTitle" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="Como criar uma vaquinha" />
                        </div>
                        <div>
                            <label htmlFor="articleCategory" className="block text-sm font-medium text-gray-700">Categoria</label>
                            <select id="articleCategory" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                                <option>Guias</option>
                                <option>Tutoriais</option>
                                <option>FAQ</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="articleContent" className="block text-sm font-medium text-gray-700">Conteúdo</label>
                            <textarea id="articleContent" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="Descreva o passo a passo..."></textarea>
                        </div>
                        <div className="flex justify-end pt-4 space-x-2">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Salvar Artigo</button>
                        </div>
                    </div>
                </form>
             </Modal>
        </div>
    );
};

const mockCoupons = [
    { id: 1, code: 'BEMVINDO10', discount: '10%', uses: 15, status: 'Ativo', expires: '31/12/2024' },
    { id: 2, code: 'NATAL20', discount: 'R$ 20,00', uses: 42, status: 'Ativo', expires: '25/12/2024' },
    { id: 3, code: 'INVERNOOFF', discount: '5%', uses: 120, status: 'Expirado', expires: '31/08/2024' },
];

const SystemMarketingView = () => {
    const [coupons, setCoupons] = useState(mockCoupons);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const { addToast } = useToast();

    const handleSaveCoupon = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Lógica para salvar o cupom (backend)
        addToast("Cupom salvo com sucesso!");
        setIsCouponModalOpen(false);
    };

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800">Marketing e Engajamento</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Cupons Ativos" value="2" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3m2-9H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V5" /></svg>} />
                <KpiCard title="Usuários por Indicação" value="128" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <KpiCard title="Total em Descontos" value="R$ 875" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                <KpiCard title="Notificações Enviadas" value="2.1k" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} />
            </div>

            <section>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Cupons e Promoções</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <input type="text" placeholder="Buscar por código..." className="input-field w-1/3" />
                        <button onClick={() => setIsCouponModalOpen(true)} className="inline-block bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105">Criar Cupom</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Código</th>
                                    <th scope="col" className="px-6 py-3">Desconto</th>
                                    <th scope="col" className="px-6 py-3">Usos</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Validade</th>
                                    <th scope="col" className="px-6 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map(coupon => (
                                    <tr key={coupon.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-gray-900">{coupon.code}</td>
                                        <td className="px-6 py-4">{coupon.discount}</td>
                                        <td className="px-6 py-4">{coupon.uses}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${coupon.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{coupon.status}</span>
                                        </td>
                                        <td className="px-6 py-4">{coupon.expires}</td>
                                        <td className="px-6 py-4 space-x-2"><button className="font-medium text-emerald-600 hover:underline">Editar</button><button className="font-medium text-red-600 hover:underline">Desativar</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Programa de Indicação</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Recompensa para quem indica</label>
                                <input type="text" defaultValue="R$ 10,00 de crédito" className="input-field mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Recompensa para o indicado</label>
                                <input type="text" defaultValue="5% de desconto na primeira taxa" className="input-field mt-1" />
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-gray-700 font-medium">Status do Programa</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Salvar Configurações</button>
                            </div>
                        </form>
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Integrações</h2>
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">E-mail Marketing</h3>
                                <p className="text-sm text-gray-500">Conectado com Mailchimp</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Gerenciar</button>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">Notificações Push</h3>
                                <p className="text-sm text-gray-500">Conectado com Firebase</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Gerenciar</button>
                        </div>
                    </div>
                </section>
            </div>

            <Modal isOpen={isCouponModalOpen} onClose={() => setIsCouponModalOpen(false)} title="Criar Novo Cupom">
                <form onSubmit={handleSaveCoupon} className="space-y-4">
                    <div>
                        <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700">Código do Cupom</label>
                        <input type="text" id="couponCode" className="input-field mt-1" placeholder="Ex: BEMVINDO15" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="couponType" className="block text-sm font-medium text-gray-700">Tipo de Desconto</label>
                            <select id="couponType" className="input-field mt-1">
                                <option>Percentual (%)</option>
                                <option>Valor Fixo (R$)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="couponValue" className="block text-sm font-medium text-gray-700">Valor</label>
                            <input type="number" id="couponValue" className="input-field mt-1" placeholder="15" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="couponExpiry" className="block text-sm font-medium text-gray-700">Data de Expiração</label>
                        <input type="date" id="couponExpiry" className="input-field mt-1" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={() => setIsCouponModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Salvar Cupom</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

const SystemSegurancaView = () => {
    const mockAccessLogs = [
        { id: 1, user: 'admin@vakinhafacil.com', ip: '187.55.123.1', timestamp: 'Hoje, 14:32', status: 'Sucesso' },
        { id: 2, user: 'moderador@vakinhafacil.com', ip: '201.10.45.98', timestamp: 'Hoje, 11:15', status: 'Sucesso' },
        { id: 3, user: 'invasor@tentativa.com', ip: '104.22.5.109', timestamp: 'Hoje, 09:01', status: 'Falha' },
        { id: 4, user: 'admin@vakinhafacil.com', ip: '187.55.123.1', timestamp: 'Ontem, 20:54', status: 'Sucesso' },
    ];

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800">Segurança e Conformidade</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-xl font-bold text-gray-700 mb-4">Políticas de Segurança</h3>
                     <div className="space-y-4">
                         <div className="flex items-center justify-between">
                             <span className="font-medium text-gray-600">Obrigar 2FA para Admins</span>
                             <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div></label>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-600">Bloqueio após 5 tentativas</span>
                             <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div></label>
                         </div>
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-xl font-bold text-gray-700 mb-4">Backups e Recuperação</h3>
                     <p className="text-gray-600">Status do Backup: <span className="font-semibold text-green-600">Ativo (Diário)</span></p>
                     <p className="text-gray-600 mt-2">Último backup: <span className="font-semibold">Hoje, 03:00</span></p>
                     <button className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm">Testar Restauração</button>
                 </div>
            </div>
            <section>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Log de Acessos</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Usuário</th>
                                    <th className="px-6 py-3">Endereço IP</th>
                                    <th className="px-6 py-3">Data/Hora</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockAccessLogs.map(log => (
                                    <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{log.user}</td>
                                        <td className="px-6 py-4 font-mono">{log.ip}</td>
                                        <td className="px-6 py-4">{log.timestamp}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-semibold ${log.status === 'Sucesso' ? 'text-green-600' : 'text-red-600'}`}>{log.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
             <section>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Conformidade com LGPD</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <p className="text-gray-600 mb-4">Gerencie as solicitações de dados e consentimentos dos usuários para manter a conformidade com a Lei Geral de Proteção de Dados.</p>
                     <div className="flex space-x-4">
                         <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Gerenciar Consentimentos</button>
                         <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Solicitações de Exclusão</button>
                     </div>
                </div>
            </section>
        </div>
    );
};

const SystemRelatoriosView = () => {
    const { addToast } = useToast();
    const handleExport = (type: string) => {
        addToast(`Iniciando exportação de ${type}...`, 'info');
        // Simulate download
    };
    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800">Relatórios e Analytics</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total de Vaquinhas" value="874" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <KpiCard title="Valor Arrecadado Total" value="R$ 1.2M" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                <KpiCard title="Taxa de Conversão Geral" value="5.2%" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>} />
                <KpiCard title="Ticket Médio" value="R$ 85" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>} />
            </div>
             <section>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Exportação de Dados</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <p className="text-gray-600 mb-4">Gere relatórios completos da plataforma em diversos formatos.</p>
                     <div className="flex flex-wrap gap-4">
                         <button onClick={() => handleExport('Usuários (CSV)')} className="px-5 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600">Exportar Usuários (CSV)</button>
                         <button onClick={() => handleExport('Vaquinhas (PDF)')} className="px-5 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600">Exportar Vaquinhas (PDF)</button>
                         <button onClick={() => handleExport('Transações (Excel)')} className="px-5 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600">Exportar Transações (Excel)</button>
                     </div>
                </div>
            </section>
             <section>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Integrações de Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Google Analytics</h3>
                            <p className="text-sm text-green-600 font-semibold">Conectado e Coletando Dados</p>
                        </div>
                        <a href="#" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Ver no GA</a>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Hotjar</h3>
                            <p className="text-sm text-gray-500">Não conectado</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Conectar</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const SystemConfiguracoesView = () => {
    const { addToast } = useToast();
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState({ subject: '', body: '' });

    const emailTemplates = [
        { id: 1, type: 'convite', subject: 'Você foi convidado para a vaquinha {{NOME_VAQUINHA}}!', status: 'Ativo' },
        { id: 2, type: 'lembrete', subject: 'Lembrete: Sua contribuição para {{NOME_VAQUINHA}} está pendente.', status: 'Ativo' },
        { id: 3, type: 'comprovante', subject: 'Recebemos seu pagamento para a vaquinha {{NOME_VAQUINHA}}!', status: 'Ativo' },
    ];

    const handleEditTemplate = (template: { subject: string; body: string; }) => {
        setCurrentTemplate(template);
        setIsEmailModalOpen(true);
    }
    
    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800">Configurações Avançadas</h1>
            
            <section>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Personalização de E-mails</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <p className="text-gray-600 mb-4">Edite os modelos de e-mail enviados pela plataforma.</p>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Tipo</th>
                                    <th className="px-6 py-3">Assunto</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emailTemplates.map(template => (
                                    <tr key={template.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{template.type}</td>
                                        <td className="px-6 py-4">{template.subject.replace(/{{(.*?)}}/g, '<span class="font-mono bg-gray-200 px-1 rounded">$&</span>')}</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{template.status}</span></td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleEditTemplate({ subject: template.subject, body: `Corpo do e-mail para ${template.type}...`})} className="font-medium text-emerald-600 hover:underline">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Configuração de SEO</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">Meta Title</label>
                                <input type="text" id="metaTitle" className="input-field mt-1" defaultValue="Vakinha Fácil - Vaquinhas Coletivas Automatizadas" />
                            </div>
                            <div>
                                <label htmlFor="metaDesc" className="block text-sm font-medium text-gray-700">Meta Description</label>
                                <textarea id="metaDesc" rows={3} className="input-field mt-1">Automatize vaquinhas coletivas em 3 cliques. Transparente, seguro e sem burocracia.</textarea>
                            </div>
                             <div className="flex justify-end pt-2">
                                <button type="submit" onClick={(e) => {e.preventDefault(); addToast("Configurações de SEO salvas!")}} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Salvar SEO</button>
                            </div>
                        </form>
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Integrações Externas (APIs)</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">API do Facebook</label>
                            <input type="text" className="input-field mt-1" placeholder="Chave da API" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">API do Google Sheets</label>
                            <input type="text" className="input-field mt-1" placeholder="Chave da API" />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" onClick={(e) => {e.preventDefault(); addToast("Configurações de API salvas!")}} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Salvar Integrações</button>
                        </div>
                    </div>
                </section>
            </div>
             <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} title="Editar Template de E-mail">
                 <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addToast("Template salvo!"); setIsEmailModalOpen(false); }}>
                    <div>
                        <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700">Assunto</label>
                        <input type="text" id="emailSubject" className="input-field mt-1" defaultValue={currentTemplate.subject} />
                    </div>
                    <div>
                        <label htmlFor="emailBody" className="block text-sm font-medium text-gray-700">Corpo do E-mail</label>
                        <textarea id="emailBody" rows={6} className="input-field mt-1" defaultValue={currentTemplate.body}></textarea>
                        <p className="text-xs text-gray-500 mt-1">{`Use variáveis como {{NOME_USUARIO}} para personalizar.`}</p>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={() => setIsEmailModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Salvar Template</button>
                    </div>
                 </form>
             </Modal>
        </div>
    );
};

const initialGateways = [
  { id: 'mp', name: 'Mercado Pago', logo: 'https://i.imgur.com/t2yQY2Y.png', isActive: true, config: { displayName: 'Cartão de Crédito e Pix', env: 'Produção', publicKey: 'APP_USR-123-abc', fee: '2.99' } },
  { id: 'pagseguro', name: 'PagSeguro', logo: 'https://i.imgur.com/J3y5S2V.png', isActive: true, config: { displayName: 'Cartão e Boleto', env: 'Produção', publicKey: 'PUB_KEY_456', fee: '3.19' } },
  { id: 'stripe', name: 'Stripe', logo: 'https://i.imgur.com/28KJGm8.png', isActive: false, config: { displayName: 'Cartão de Crédito Internacional', env: 'Sandbox', publicKey: '', fee: '3.5' } },
  { id: 'paypal', name: 'PayPal', logo: 'https://i.imgur.com/x5S3iC5.png', isActive: false, config: { displayName: 'PayPal', env: 'Sandbox', publicKey: '', fee: '4.79' } },
  { id: 'picpay', name: 'PicPay', logo: 'https://i.imgur.com/ExV16mr.png', isActive: true, config: { displayName: 'Pague com PicPay', env: 'Produção', publicKey: 'SELLER_TOKEN_789', fee: '2.89' } },
];

const SystemGatewaysView = () => {
    const [gateways, setGateways] = useState(initialGateways);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState<(typeof initialGateways)[0] | null>(null);
    const { addToast } = useToast();

    const handleToggle = (id: string) => {
        setGateways(gateways.map(g => g.id === id ? { ...g, isActive: !g.isActive } : g));
    };

    const openConfig = (gateway: (typeof initialGateways)[0]) => {
        setSelectedGateway(gateway);
        setIsModalOpen(true);
    };

    const handleSaveConfig = (e: React.FormEvent) => {
        e.preventDefault();
        addToast(`Configurações do ${selectedGateway?.name} salvas!`, 'success');
        setIsModalOpen(false);
    };
    
    const testConnection = () => {
        addToast(`Testando conexão com ${selectedGateway?.name}...`, 'info');
        setTimeout(() => {
             addToast(`Conexão com ${selectedGateway?.name} bem-sucedida!`, 'success');
        }, 1500);
    };

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800">Integrações de Gateway de Pagamento</h1>

            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Gerenciar Gateways</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gateways.map(gateway => (
                        <div key={gateway.id} className={`border rounded-lg p-4 flex flex-col justify-between ${gateway.isActive ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200 bg-white'}`}>
                            <div>
                                <div className="flex justify-between items-start">
                                    <img src={gateway.logo} alt={gateway.name} className="h-8 mb-4"/>
                                    <div className="flex items-center">
                                        <span className={`text-xs font-bold mr-2 ${gateway.isActive ? 'text-emerald-700' : 'text-gray-500'}`}>{gateway.isActive ? 'ATIVO' : 'INATIVO'}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={gateway.isActive} onChange={() => handleToggle(gateway.id)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">{gateway.name}</h3>
                                <p className="text-sm text-gray-500">{gateway.config.displayName}</p>
                            </div>
                            <button onClick={() => openConfig(gateway)} className="mt-4 w-full text-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm">Configurar</button>
                        </div>
                    ))}
                </div>
            </section>
            
            {selectedGateway && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Configurar ${selectedGateway.name}`}>
                    <form onSubmit={handleSaveConfig} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome Exibido</label>
                            <input type="text" className="input-field mt-1" defaultValue={selectedGateway.config.displayName}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ambiente</label>
                            <select className="input-field mt-1" defaultValue={selectedGateway.config.env}>
                                <option>Produção</option>
                                <option>Sandbox</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Chave Pública / Client ID</label>
                            <input type="text" className="input-field mt-1" defaultValue={selectedGateway.config.publicKey}/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Chave Privada / Secret Key</label>
                            <input type="password" className="input-field mt-1" defaultValue="************"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Taxa da Plataforma (%)</label>
                            <input type="number" step="0.01" className="input-field mt-1" defaultValue={selectedGateway.config.fee}/>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <button type="button" onClick={testConnection} className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-semibold">Testar Conexão</button>
                            <div className="space-x-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Salvar</button>
                            </div>
                        </div>
                    </form>
                </Modal>
            )}

        </div>
    );
};

const SystemLayoutView = () => {
    const { addToast } = useToast();
    const [headerLinks, setHeaderLinks] = useState(['Início', 'Vaquinhas', 'Como Funciona']);

    const handleSave = () => {
        addToast('Layout salvo com sucesso!', 'success');
    };

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800">Layout do Site</h1>
            
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Banner Principal</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-600">Ativar Banner</span>
                        <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div></label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload da Imagem do Banner</label>
                        <input type="file" className="input-field mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Texto do Banner</label>
                        <input type="text" className="input-field mt-1" placeholder="Crie sua vaquinha online em minutos!"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Link do Banner</label>
                        <input type="url" className="input-field mt-1" placeholder="https://..."/>
                    </div>
                </div>
            </section>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Cabeçalho (Header)</h2>
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Logo do Cabeçalho</label>
                            <input type="file" className="input-field mt-1" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Cor de Fundo</label>
                            <input type="color" defaultValue="#FFFFFF" className="input-field mt-1" />
                        </div>
                    </div>
                </section>
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Rodapé (Footer)</h2>
                     <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Texto do Rodapé</label>
                            <input type="text" className="input-field mt-1" defaultValue="© 2025 Vakinha Fácil. Todos os direitos reservados." />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Cor de Fundo</label>
                            <input type="color" defaultValue="#1F2937" className="input-field mt-1" />
                        </div>
                    </div>
                </section>
            </div>

            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Links de Afiliados</h2>
                {/* Simplified for brevity */}
                <p className="text-gray-600">Gerencie aqui os banners e links de parceiros e afiliados.</p>
                <button className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm">Adicionar Link de Afiliado</button>
            </section>

             <div className="flex justify-end space-x-4 mt-8">
                 <button onClick={() => addToast('Configurações restauradas para o padrão.')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Restaurar Padrões</button>
                 <button onClick={handleSave} className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold">Salvar Alterações</button>
             </div>
        </div>
    );
};


const SystemAdminDashboard = () => {
    const [activeView, setActiveView] = useState('resumo');
    const renderView = () => {
        switch (activeView) {
            case 'resumo': return <SystemResumoView />;
            case 'usuarios': return <SystemUsuariosView />;
            case 'vaquinhas': return <SystemVaquinhasView />;
            case 'financeiro': return <SystemFinanceiroView />;
            case 'gateways': return <SystemGatewaysView />;
            case 'layout': return <SystemLayoutView />;
            case 'marketing': return <SystemMarketingView />;
            case 'suporte': return <SystemSuporteView />;
            case 'seguranca': return <SystemSegurancaView />;
            case 'relatorios': return <SystemRelatoriosView />;
            case 'configuracoes': return <SystemConfiguracoesView />;
            default: return <SystemResumoView />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <SystemAdminSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1">
                <div className="p-8 pt-24">{renderView()}</div>
            </main>
        </div>
    );
};
// --- END: SYSTEM ADMIN DASHBOARD ---

// --- START: GROUP ADMIN DASHBOARD (Placeholder) ---
const GroupAdminDashboard = () => (
    <div className="pt-32 pb-16 container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4">Painel do Gestor de Grupo</h1>
        <p className="mt-4">Esta área é um placeholder para o painel de administração do grupo.</p>
    </div>
);
// --- END: GROUP ADMIN DASHBOARD ---

// --- MAIN APP COMPONENT ---
const App = () => {
    const [userType, setUserType] = useState<string | null>(null);

    const handleLogin = (type: 'groupAdmin' | 'systemAdmin') => {
        setUserType(type);
    };

    const handleLogout = () => {
        setUserType(null);
    };

    const renderContent = () => {
        if (userType === 'systemAdmin') return <SystemAdminDashboard />;
        if (userType === 'groupAdmin') return <GroupAdminDashboard />;
        return <LandingPage onStartCreating={() => handleLogin('groupAdmin')} />;
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
                {renderContent()}
            </main>
            <AiChatbot />
        </ToastProvider>
    );
};

export default App;