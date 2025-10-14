import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- START: TOAST NOTIFICATION SYSTEM ---
interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

interface ToastContextType {
    addToast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    };
    
    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] space-y-2">
                {toasts.map(toast => (
                    <div key={toast.id} className={`flex items-center px-4 py-3 rounded-lg shadow-2xl text-white animate-toast-in ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           {toast.type === 'success' 
                           ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                           : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />}
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
                            <a href="#" className="hidden sm:inline-block bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105">
                                Criar Vaquinha
                            </a>
                        </>
                    )}
                </div>
            </nav>
        </div>
    </header>
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
                    <a href="#" className="inline-block bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 duration-300 ease-in-out">
                        Comece agora – Grátis por 7 dias
                    </a>
                </div>
                
                <div className="relative flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-lg">
                        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                        <div className="relative">
                           <img
                                src="https://picsum.photos/seed/app-dashboard/800/600"
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
    children: React.ReactNode;
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
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>,
            title: "Autenticação Segura",
            description: "Acesso seguro para administradores do sistema com Google Auth e autenticação de dois fatores (2FA)."
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

const SupportSection = () => {
    const supportFeatures = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-1.423.237c-.16.026-.321.037-.482.037h-.538c-.29.004-.574 0-.857-.011a6.379 6.379 0 0 1-.942-.093l-1.353-.346c-.255-.065-.515-.095-.778-.095h-.942c-.263 0-.523.03-.778.095l-1.353.346a6.379 6.379 0 0 1-.942.093h-.857c-.283-.011-.567-.015-.857-.011h-.538c-.16 0-.321.011-.482.037l-1.423-.