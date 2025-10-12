
import React, { useState } from 'react';

const LogoIcon = () => (
    <svg className="w-9 h-9 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
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

// FIX: Defined a reusable 'SectionProps' interface for components requiring children to resolve TypeScript errors. This improves code clarity and resolves potential type inference issues.
interface SectionProps {
    children: React.ReactNode;
}
// FIX: Explicitly typing the component with React.FC to resolve a TypeScript error where the 'children' prop was not being correctly inferred at the call sites.
const SectionTitle: React.FC<SectionProps> = ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 font-heading">{children}</h2>
);

// FIX: Explicitly typing the component with React.FC to resolve a TypeScript error where the 'children' prop was not being correctly inferred at the call sites.
const SectionSubtitle: React.FC<SectionProps> = ({ children }) => (
    <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">{children}</p>
);

const BenefitsSection = () => {
    const benefits = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.69-3.182-3.182a8.25 8.25 0 0 0-11.667 0l-3.181 3.182m0 0h-4.992v4.992h4.992v-4.992Z" /></svg>,
            title: "Automatizado",
            description: "Cobranças, lembretes e distribuições feitos automaticamente."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-4.43a1.012 1.012 0 0 1 1.433 0l4.43 4.43a1.012 1.012 0 0 1 0 .639l-4.43 4.43a1.012 1.012 0 0 1-1.433 0l-4.43-4.43Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-4.43a1.012 1.012 0 0 1 1.433 0l4.43 4.43a1.012 1.012 0 0 1 0 .639l-4.43 4.43a1.012 1.012 0 0 1-1.433 0l-4.43-4.43Z" /></svg>,
            title: "Transparente",
            description: "Todos veem quem pagou e quando. Sem desconfiança."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" /></svg>,
            title: "Seguro",
            description: "Validação de CPF e pagamentos via Mercado Pago/PicPay."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>,
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
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
            title: "Viagens em Grupo",
            description: "Junte dinheiro para aquela viagem dos sonhos com os amigos, sem estresse e com total transparência."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A3.375 3.375 0 0 0 12 1.5v3.375m0 0c-1.353 0-2.656.32-3.865.901M12 4.875c1.353 0 2.656.32 3.865.901M12 4.875v1.125m-3.865.901a3.375 3.375 0 0 0-2.267 4.996m2.267-4.996c.024.012.047.025.07.038m-2.267 4.996a3.375 3.375 0 0 1 2.267 4.996m0 0a3.375 3.375 0 0 0 3.79-1.85m-3.79 1.85a3.375 3.375 0 0 1 3.79 1.85M9.135 18.091c.143-.243.27-.497.387-.762m-.387.762a3.375 3.375 0 0 0-3.238-1.42M12 18.091c-.117-.265-.244-.519-.387-.762m.387.762a3.375 3.375 0 0 1 3.238-1.42m-6.476 1.42a3.375 3.375 0 0 1-3.238-1.42m6.476 1.42a3.375 3.375 0 0 0 3.238-1.42m-3.238-1.42c-.024-.012-.047-.025-.07-.038M12 15.375a3.375 3.375 0 0 0-2.267-4.996m2.267 4.996c-.024-.012-.047-.025-.07-.038m2.267-4.996a3.375 3.375 0 0 1 2.267-4.996m0 0c.024.012.047.025.07.038m2.267-4.996a3.375 3.375 0 0 0-2.267-4.996" /></svg>,
            title: "Eventos e Presentes",
            description: "Organize formaturas, festas ou a compra daquele presente de casamento de forma simples e organizada."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 0 9 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 12.75-2.625-2.625M3.75 12.75 1.125 15.375M21 12.75v5.25a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25v-5.25M3.75 12.75c0-3.314 2.686-6 6-6s6 2.686 6 6M4.5 6.75a3.75 3.75 0 0 1 7.5 0m7.5 0a3.75 3.75 0 0 0-7.5 0" /></svg>,
            title: "Times e Clubes",
            description: "Gerencie mensalidades, compre uniformes e pague campeonatos do seu time ou clube sem dor de cabeça."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5M5.25 6h13.5m-13.5 0V21m13.5 0V6m0 0V4.5m-13.5 0V3m0 1.5v-1.5m13.5 0v1.5m-10.5-1.5h7.5" /></svg>,
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
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" /></svg>,
            title: "Validação de CPF",
            description: "Integração com Serasa Experian ou Receita Federal para garantir a identidade dos participantes."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
            title: "Criptografia",
            description: "Dados sensíveis protegidos com SSL/TLS e AES-256, os mesmos padrões de segurança de grandes bancos."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C6.095 4.01 5.25 4.973 5.25 6.108V18.25c0 1.243.87 2.25 1.969 2.25H18A2.25 2.25 0 0 0 20.25 18.25v-1.171c0-.621-.504-1.125-1.125-1.125H9.75l-3-3m0 0h3.75" /></svg>,
            title: "Conformidade com a LGPD",
            description: "Plataforma 100% conforme com a Lei Geral de Proteção de Dados, garantindo sua privacidade."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>,
            title: "Backup Automático",
            description: "Dados salvos diariamente e de forma segura na nuvem da AWS S3 para que nada seja perdido."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>,
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
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-1.423.237c-.16.026-.321.037-.482.037h-.538c-.29.004-.574 0-.857-.011a6.379 6.379 0 0 1-.942-.093l-1.353-.346c-.255-.065-.515-.095-.778-.095h-.942c-.263 0-.523.03-.778.095l-1.353.346a6.379 6.379 0 0 1-.942.093h-.857c-.283-.011-.567-.015-.857-.011h-.538c-.16 0-.321.011-.482.037l-1.423-.237A2.1 2.1 0 0 1 3.75 14.894V10.608c0-.97.616-1.813 1.5-2.097L6.75 8.25m.75 3.375v3.375m4.5-3.375v3.375m4.5-3.375v3.375m0-9.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h1.5Zm-6.045-1.125a1.125 1.125 0 0 1 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h1.5Z" /></svg>,
            title: "Chatbot com IA (24/7)",
            description: "Integração com Dialogflow (Google AI) para respostas automáticas e inteligentes a qualquer hora."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" /></svg>,
            title: "Sistema de Tickets",
            description: "Utilizamos Zendesk ou Freshdesk para registrar e acompanhar suas solicitações com eficiência."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>,
            title: "FAQ (Perguntas Frequentes)",
            description: "Acesse nossa base de conhecimento no app e no site para resolver dúvidas comuns rapidamente."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>,
            title: "Tutoriais em Vídeo",
            description: "Aprenda a usar a plataforma com guias práticos em nosso canal do YouTube e dentro do app."
        }
    ];

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6">
                <SectionTitle>Suporte e Atendimento</SectionTitle>
                <SectionSubtitle>Estamos sempre aqui para ajudar. Conte com uma equipe dedicada e recursos completos para tirar o máximo proveito da plataforma.</SectionSubtitle>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-12 max-w-4xl mx-auto">
                    {supportFeatures.map((feature, index) => (
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

const DifferentiatorsSection = () => {
    const features = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 12c0 2.42-.943 4.638-2.486 6.32a7.5 7.5 0 0 1-10.974-4.275" /><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5-3.75-3.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008Z" /></svg>,
            title: "Simplicidade Radical",
            description: "Vaquinhas criadas em 3 cliques, sem burocracia ou complicações desnecessárias."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.69-3.182-3.182a8.25 8.25 0 0 0-11.667 0l-3.181 3.182m0 0h-4.992v4.992h4.992v-4.992Z" /></svg>,
            title: "Automação Total",
            description: "Cobranças, lembretes e distribuição de valores são feitos de forma 100% automática."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-4.43a1.012 1.012 0 0 1 1.433 0l4.43 4.43a1.012 1.012 0 0 1 0 .639l-4.43 4.43a1.012 1.012 0 0 1-1.433 0l-4.43-4.43Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-4.43a1.012 1.012 0 0 1 1.433 0l4.43 4.43a1.012 1.012 0 0 1 0 .639l-4.43 4.43a1.012 1.012 0 0 1-1.433 0l-4.43-4.43Z" /></svg>,
            title: "Transparência",
            description: "Todos os participantes podem ver quem pagou e quando, acabando com a desconfiança."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
            title: "Monetização Flexível",
            description: "Escolha o modelo que mais se adapta ao seu grupo: taxas, assinaturas ou white-label."
        },
         {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" /></svg>,
            title: "Segurança de Ponta",
            description: "Com validação de CPF e criptografia de nível bancário (SSL), seus dados estão seguros."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" /></svg>,
            title: "Modelo White-Label",
            description: "Licencie nossa plataforma e crie seu próprio negócio de vaquinhas com sua marca."
        }
    ];
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6">
                <SectionTitle>Nossos Diferenciais</SectionTitle>
                <SectionSubtitle>Veja por que somos a escolha número um para vaquinhas coletivas.</SectionSubtitle>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-slate-50 p-6 rounded-lg">
                            <div className="flex items-center space-x-4">
                               <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 text-emerald-600">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 font-heading">{feature.title}</h3>
                                </div>
                            </div>
                             <p className="text-gray-600 mt-4">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const PricingSection = () => (
    <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
            <SectionTitle>Planos Flexíveis para Todos</SectionTitle>
            <SectionSubtitle>Monetize sua comunidade ou simplesmente organize um grupo de amigos. Nós temos a solução certa.</SectionSubtitle>
            <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                
                <div className="bg-white p-8 rounded-xl border border-gray-200">
                    <h3 className="text-2xl font-bold text-center mb-2 font-heading">Uso Flexível</h3>
                    <p className="text-center text-gray-500 mb-6">Ideal para começar</p>
                    <p className="text-4xl font-extrabold text-center mb-1 font-heading">R$ 15 <span className="text-lg font-medium text-gray-500">/vaquinha</span></p>
                    <p className="text-center font-bold text-2xl text-gray-600 mb-6">+ 3% <span className="text-base font-normal">do valor</span></p>
                    <ul className="space-y-3 text-gray-600 mb-8">
                        <li className="flex items-center"><span className="text-emerald-500 mr-2">✔</span>Cobre uma taxa única por vaquinha</li>
                        <li className="flex items-center"><span className="text-emerald-500 mr-2">✔</span>Perfeito para eventos pontuais</li>
                        <li className="flex items-center"><span className="text-emerald-500 mr-2">✔</span>Sem compromisso mensal</li>
                    </ul>
                    <a href="#" className="w-full block text-center bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors">Começar Agora</a>
                </div>

                <div className="bg-emerald-600 text-white p-8 rounded-xl shadow-2xl transform lg:scale-110">
                    <p className="text-center bg-white text-emerald-600 font-bold text-xs py-1 px-3 rounded-full uppercase inline-block mb-4 ml-1/2 -translate-x-1/2">Mais Popular</p>
                    <h3 className="text-2xl font-bold text-center mb-2 font-heading">Assinatura Pro</h3>
                    <p className="text-center text-emerald-200 mb-6">Para gestores de grupos</p>
                    <p className="text-4xl font-extrabold text-center mb-6 font-heading">R$ 19,90<span className="text-lg font-medium text-emerald-200">/mês</span></p>
                    <ul className="space-y-3 text-emerald-100 mb-8">
                        <li className="flex items-center"><span className="mr-2">✔</span>Crie vaquinhas ilimitadas</li>
                        <li className="flex items-center"><span className="mr-2">✔</span>Taxas percentuais reduzidas</li>
                        <li className="flex items-center"><span className="mr-2">✔</span>Suporte prioritário via chat</li>
                    </ul>
                    <a href="#" className="w-full block text-center bg-white text-emerald-600 font-semibold py-3 rounded-lg hover:bg-emerald-50 transition-colors">Assinar Agora</a>
                </div>

                <div className="bg-white p-8 rounded-xl border border-gray-200">
                    <h3 className="text-2xl font-bold text-center mb-2 font-heading">White-Label</h3>
                    <p className="text-center text-gray-500 mb-6">Sua marca, nossa tecnologia</p>
                    <p className="text-4xl font-extrabold text-center mb-1 font-heading">R$ 300<span className="text-lg font-medium text-gray-500">/mês</span></p>
                     <p className="text-center text-gray-500 mb-6">(a partir de)</p>
                     <ul className="space-y-3 text-gray-600 mb-8">
                        <li className="flex items-center"><span className="text-emerald-500 mr-2">✔</span>Plataforma completa com sua identidade</li>
                        <li className="flex items-center"><span className="text-emerald-500 mr-2">✔</span>Ideal para empreendedores e empresas</li>
                        <li className="flex items-center"><span className="text-emerald-500 mr-2">✔</span>Modelo de receita escalável</li>
                    </ul>
                    <a href="#" className="w-full block text-center bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors">Contate-nos</a>
                </div>
            </div>
        </div>
    </section>
);

const RoadmapSection = () => {
    const phases = [
        { name: "MVP", action: "Desenvolvimento do protótipo (front-end, back-end, pagamentos).", time: "60–90 dias" },
        { name: "Testes Beta", action: "Convite para 50 grupos testarem a plataforma e colher feedbacks.", time: "30 dias" },
        { name: "Lançamento", action: "Disponibilização na Kwify, Hotmart e PlayStore para o público geral.", time: "15 dias" },
        { name: "Escalabilidade", action: "Adição de IA para previsão de inadimplência e novos templates.", time: "60 dias" },
    ];

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6">
                <SectionTitle>Roadmap de Desenvolvimento</SectionTitle>
                <SectionSubtitle>Nosso plano para o futuro: inovação contínua para sua tranquilidade e sucesso.</SectionSubtitle>
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
                    {phases.map((phase, index) => (
                        <div key={index} className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                            <div className="w-5/12"></div>
                            <div className="z-10 flex items-center bg-emerald-500 shadow-xl w-12 h-12 rounded-full">
                                <h1 className="mx-auto text-white font-semibold text-lg">{index + 1}</h1>
                            </div>
                            <div className={`w-5/12 p-6 bg-slate-50 rounded-lg shadow-md ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                <p className="text-sm font-bold text-emerald-600 mb-1">{phase.name} ({phase.time})</p>
                                <p className="text-gray-700">{phase.action}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FinancialProjectionSection = () => {
    const data = [
        { month: "1–3", vaquinhas: 50, revenue: "R$ 3.000", costs: "R$ 3.000", profit: "R$ 0" },
        { month: "4–6", vaquinhas: 200, revenue: "R$ 12.000", costs: "R$ 5.000", profit: "R$ 7.000" },
        { month: "7–9", vaquinhas: 500, revenue: "R$ 30.000", costs: "R$ 8.000", profit: "R$ 22.000" },
        { month: "10–12", vaquinhas: "1.000", revenue: "R$ 60.000", costs: "R$ 12.000", profit: "R$ 48.000" }
    ];

    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto px-6">
                <SectionTitle>Projeção Financeira (12 Meses)</SectionTitle>
                <SectionSubtitle>Nossa visão de crescimento, baseada em um modelo de negócio sólido e escalável, com um ROI estimado de 500% a 1000%.</SectionSubtitle>
                <div className="max-w-4xl mx-auto overflow-x-auto">
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 font-heading">
                                <tr>
                                    <th scope="col" className="px-6 py-3 rounded-l-lg">Mês</th>
                                    <th scope="col" className="px-6 py-3">Vaquinhas Ativas</th>
                                    <th scope="col" className="px-6 py-3">Receita (Taxa + %)</th>
                                    <th scope="col" className="px-6 py-3">Custos</th>
                                    <th scope="col" className="px-6 py-3 rounded-r-lg">Lucro Líquido</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index} className="bg-white border-b last:border-0">
                                        <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{row.month}</th>
                                        <td className="px-6 py-4">{row.vaquinhas}</td>
                                        <td className="px-6 py-4">{row.revenue}</td>
                                        <td className="px-6 py-4">{row.costs}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">{row.profit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

const NextStepsSection = () => {
    const steps = [
        {
            title: "Validação",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" /></svg>,
            actions: [
                "Teste manual com 1 grupo real (WhatsApp + Google Sheets).",
                "Crie a landing page e capture 100+ e-mails."
            ]
        },
        {
            title: "Desenvolvimento",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.75A2.25 2.25 0 0 0 18 3.5H6A2.25 2.25 0 0 0 3.75 5.75v12.5A2.25 2.25 0 0 0 6 20.25Z" /></svg>,
            actions: [
                "Contrate uma equipe de desenvolvimento (front-end: React/Flutter; back-end: Node.js).",
                "Priorize o MVP (taxa por vaquinha + 3% sobre valor total)."
            ]
        },
        {
            title: "Lançamento",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502" /></svg>,
            actions: [
                "Ofereça 7 dias grátis para os primeiros 100 usuários.",
                "Use afiliados e influencers para divulgação."
            ]
        },
        {
            title: "Escalabilidade",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
            actions: [
                "Adicione assinaturas e white-label após 3 meses.",
                "Expanda para nichos: viagens, presentes, poupança colaborativa."
            ]
        }
    ];

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6">
                <SectionTitle>Próximos Passos para a Google AI Studios</SectionTitle>
                <SectionSubtitle>Nosso plano estratégico para validar o modelo, desenvolver a plataforma e escalar o negócio de forma sustentável.</SectionSubtitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-slate-50 p-8 rounded-xl border border-gray-200 h-full flex flex-col">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-5 mx-auto">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4 font-heading text-center">{index + 1}. {step.title}</h3>
                            <ul className="space-y-3 text-gray-600 text-sm flex-grow">
                                {step.actions.map((action, actionIndex) => (
                                     <li key={actionIndex} className="flex items-start">
                                         <svg className="w-4 h-4 text-emerald-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                         <span>{action}</span>
                                     </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection = () => (
    <section className="bg-emerald-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Pronto para começar sua vaquinha?</h2>
            <p className="text-emerald-200 text-lg mb-8 max-w-2xl mx-auto">Junte-se a milhares de pessoas que organizam suas finanças em grupo de forma inteligente e automatizada.</p>
            <a href="#" className="inline-block bg-white text-emerald-600 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-emerald-50 transition-transform transform hover:scale-105 duration-300 ease-in-out">
                Experimente grátis por 7 dias
            </a>
            <p className="mt-4 text-sm text-emerald-300">Sem cartão de crédito. Cancele quando quiser.</p>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                 <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <LogoIcon />
                    <span className="text-xl font-bold text-white tracking-tight font-heading">Vakinha Fácil</span>
                </div>
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
                    <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                    <a href="#" className="hover:text-white transition-colors">Suporte</a>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
                <p>&copy; 2025 Google AI Studios. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
);

const LandingPage = () => (
    <>
        <main>
            <HeroSection />
            <BenefitsSection />
            <HowItWorksSection />
            <UseCasesSection />
            <TestimonialsSection />
            <SecuritySection />
            <SupportSection />
            <DifferentiatorsSection />
            <PricingSection />
            <RoadmapSection />
            <FinancialProjectionSection />
            <NextStepsSection />
            <CTASection />
        </main>
        <Footer />
    </>
);


const mockVaquinhas = [
    {
        id: 1,
        title: "Viagem para a Bahia",
        collected: 1500,
        goal: 3000,
        deadline: "3/6 meses",
        status: "Ativa",
        participants: [
            { name: "João", status: "Pago" },
            { name: "Maria", status: "Atraso" },
            { name: "Carlos", status: "Pago" },
            { name: "Ana", status: "Pendente" },
        ],
        payments: {
            pix: 1000,
            card: 500,
            boleto: 0
        },
        history: [
            { month: "Jan", amount: 500 },
            { month: "Fev", amount: 500 },
            { month: "Mar", amount: 500 },
        ]
    },
    {
        id: 2,
        title: "Presente de Casamento do Léo",
        collected: 1200,
        goal: 1200,
        deadline: "Finalizado",
        status: "Finalizada",
        participants: Array(24).fill(0).map((_, i) => ({ name: `Convidado ${i+1}`, status: 'Pago'})),
        payments: { pix: 800, card: 400, boleto: 0 },
        history: [{ month: "Abr", amount: 1200 }]
    },
    {
        id: 3,
        title: "Churrasco de Fim de Ano",
        collected: 450,
        goal: 800,
        deadline: "1/1 mês",
        status: "Ativa",
        participants: Array(18).fill(0).map((_, i) => ({ name: `Amigo ${i+1}`, status: i % 2 === 0 ? 'Pago' : 'Pendente' })),
        payments: { pix: 450, card: 0, boleto: 0 },
        history: [{ month: "Dez", amount: 450 }]
    }
];

const VaquinhaDetail = ({ vaquinha, onBack }: { vaquinha: any, onBack: () => void }) => {

    const getParticipantStatusClass = (status: string) => {
        switch (status) {
            case 'Pago': return 'bg-green-100 text-green-800';
            case 'Atraso': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Voltar para o Painel
                </button>
                 <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-heading text-right">Minha Vaquinha: <span className="text-emerald-600">"{vaquinha.title}"</span></h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-700 font-heading mb-3">RESUMO</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex justify-between"><span>Valor Total:</span> <span className="font-semibold text-gray-800">R$ {vaquinha.goal.toLocaleString('pt-BR')}</span></li>
                            <li className="flex justify-between"><span>Prazo:</span> <span className="font-semibold text-gray-800">{vaquinha.deadline}</span></li>
                            <li className="flex justify-between"><span>Arrecadado:</span> <span className="font-semibold text-emerald-600">R$ {vaquinha.collected.toLocaleString('pt-BR')}</span></li>
                        </ul>
                    </div>
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-700 font-heading mb-3">AÇÕES</h3>
                        <div className="flex flex-col space-y-2">
                             <button className="text-left w-full bg-white hover:bg-slate-100 border border-gray-200 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Enviar lembrete</button>
                             <button className="text-left w-full bg-white hover:bg-slate-100 border border-gray-200 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Solicitar distribuição</button>
                             <button className="text-left w-full bg-white hover:bg-slate-100 border border-gray-200 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Editar vaquinha</button>
                        </div>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg h-full flex flex-col">
                        <h3 className="font-bold text-gray-700 font-heading mb-3">PARTICIPANTES</h3>
                        <div className="flex-grow overflow-y-auto max-h-48 pr-2">
                            <ul className="space-y-2 text-sm">
                                {vaquinha.participants.map((p: any) => (
                                    <li key={p.name} className="flex justify-between items-center">
                                        <span className="text-gray-600">{p.name}</span>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getParticipantStatusClass(p.status)}`}>{p.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="mt-3 text-sm w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold py-2 px-4 rounded-lg transition-colors">+ Adicionar</button>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-700 font-heading mb-3">CONVITES</h3>
                        <div className="flex flex-col space-y-2">
                             <button className="text-left w-full bg-white hover:bg-slate-100 border border-gray-200 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Copiar link</button>
                             <button className="text-left w-full bg-white hover:bg-slate-100 border border-gray-200 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">WhatsApp</button>
                             <button className="text-left w-full bg-white hover:bg-slate-100 border border-gray-200 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">E-mail</button>
                        </div>
                    </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-700 font-heading mb-3">PAGAMENTOS</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex justify-between"><span>Pix:</span> <span className="font-semibold text-gray-800">R$ {vaquinha.payments.pix.toLocaleString('pt-BR')}</span></li>
                            <li className="flex justify-between"><span>Cartão:</span> <span className="font-semibold text-gray-800">R$ {vaquinha.payments.card.toLocaleString('pt-BR')}</span></li>
                            <li className="flex justify-between"><span>Boleto:</span> <span className="font-semibold text-gray-800">R$ {vaquinha.payments.boleto.toLocaleString('pt-BR')}</span></li>
                        </ul>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-700 font-heading mb-3">HISTÓRICO</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                           {vaquinha.history.map((h: any) => (
                                <li key={h.month} className="flex justify-between">
                                    <span>{h.month}:</span> <span className="font-semibold text-gray-800">R$ {h.amount.toLocaleString('pt-BR')}</span>
                                </li>
                           ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VaquinhaList = ({ onSelectVaquinha }: { onSelectVaquinha: (vaquinha: any) => void }) => {
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Ativa': return 'bg-green-100 text-green-800';
            case 'Finalizada': return 'bg-gray-100 text-gray-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 font-heading">Painel do Gestor</h1>
                <button className="bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    <span>Criar Nova Vaquinha</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockVaquinhas.map((vaquinha) => {
                    const progress = (vaquinha.collected / vaquinha.goal) * 100;
                    return (
                        <div key={vaquinha.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold text-gray-800 font-heading">{vaquinha.title}</h2>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClass(vaquinha.status)}`}>{vaquinha.status}</span>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Progresso</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="flex justify-between text-center border-t border-b border-gray-100 py-3 my-4">
                                    <div>
                                        <p className="text-lg font-bold text-emerald-600">R$ {vaquinha.collected.toLocaleString('pt-BR')}</p>
                                        <p className="text-xs text-gray-500">Arrecadado</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-gray-700">R$ {vaquinha.goal.toLocaleString('pt-BR')}</p>
                                        <p className="text-xs text-gray-500">Meta</p>
                                    </div>
                                     <div>
                                        <p className="text-lg font-bold text-gray-700">{vaquinha.participants.length}</p>
                                        <p className="text-xs text-gray-500">Participantes</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex space-x-3 text-sm">
                                <button onClick={() => onSelectVaquinha(vaquinha)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors">Gerenciar</button>
                                <button className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold py-2 px-4 rounded-lg transition-colors">Convidar</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

const GroupAdminDashboard = () => {
    const [selectedVaquinha, setSelectedVaquinha] = useState<any | null>(null);

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="pt-24">
                <main className="container mx-auto px-6 py-8">
                   {selectedVaquinha ? (
                       <VaquinhaDetail vaquinha={selectedVaquinha} onBack={() => setSelectedVaquinha(null)} />
                   ) : (
                       <VaquinhaList onSelectVaquinha={setSelectedVaquinha} />
                   )}
                </main>
            </div>
        </div>
    );
};

const SystemAdminCard = ({ title, items }: { title: string, items: { label: string, value: any }[] }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider font-heading mb-4 border-b border-gray-200 pb-3">{title}</h3>
        <ul className="space-y-3">
            {items.map(item => (
                <li key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                </li>
            ))}
        </ul>
    </div>
);

const SystemAdminDashboard = () => {
    const adminData = {
        dashboard: { title: "DASHBOARD", items: [{ label: "Receita", value: "R$ 15.000" }, { label: "Vaquinhas", value: "250" }, { label: "Usuários", value: "1.200" }] },
        users: { title: "USUÁRIOS", items: [{ label: "Listar", value: <button className="text-emerald-600 hover:underline text-sm font-semibold">Ver</button> }, { label: "Bloquear", value: <button className="text-emerald-600 hover:underline text-sm font-semibold">Gerenciar</button> }, { label: "Verificar CPF", value: <button className="text-emerald-600 hover:underline text-sm font-semibold">Consultar</button> }, { label: "Exportar CSV", value: <button className="text-emerald-600 hover:underline text-sm font-semibold">Baixar</button> }] },
        vaquinhas: { title: "VAQUINHAS", items: [{ label: "Ativas", value: 250 }, { label: "Finalizadas", value: 120 }, { label: "Em atraso", value: 30 }] },
        finance: { title: "FINANCEIRO", items: [{ label: "Total", value: "R$ 15K" }, { label: "Taxas", value: "R$ 3K" }, { label: "Assinaturas", value: "R$ 5K" }] },
        config: { title: "CONFIG.", items: [{ label: "Taxas", value: "5%" }, { label: "Planos", value: <button className="text-emerald-600 hover:underline text-sm font-semibold">Editar</button> }] },
        whiteLabel: { title: "WHITE-LABEL", items: [{ label: "Licenças", value: 10 }, { label: "Receita", value: "R$ 3K" }] },
        support: { title: "SUPORTE", items: [{ label: "Tickets", value: 15 }, { label: "Responder (Chat)", value: <button className="text-emerald-600 hover:underline text-sm font-semibold">Abrir</button> }] },
        reports: { title: "RELATÓRIOS", items: [{ label: "Exportar PDF/CSV", value: <button className="text-emerald-600 hover:underline text-sm font-semibold">Gerar</button> }, { label: "Gráficos", value: <button className="text-emerald-600 hover:underline text-sm font-semibold">Visualizar</button> }] },
    };

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="pt-24">
                <main className="container mx-auto px-6 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 font-heading">Painel Admin <span className="text-base font-medium text-gray-500">(Google AI Studios)</span></h1>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SystemAdminCard title={adminData.dashboard.title} items={adminData.dashboard.items} />
                        <SystemAdminCard title={adminData.users.title} items={adminData.users.items} />
                        <SystemAdminCard title={adminData.vaquinhas.title} items={adminData.vaquinhas.items} />
                        <SystemAdminCard title={adminData.finance.title} items={adminData.finance.items} />
                        <SystemAdminCard title={adminData.config.title} items={adminData.config.items} />
                        <SystemAdminCard title={adminData.whiteLabel.title} items={adminData.whiteLabel.items} />
                        <SystemAdminCard title={adminData.support.title} items={adminData.support.items} />
                        <SystemAdminCard title={adminData.reports.title} items={adminData.reports.items} />
                    </div>
                </main>
            </div>
        </div>
    );
};


const App = () => {
    const [userType, setUserType] = useState<string | null>(null); // null, 'groupAdmin', 'systemAdmin'

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
        <div className="bg-slate-50 min-h-screen text-gray-800">
            <Header
                userType={userType}
                onGroupAdminLogin={handleGroupAdminLogin}
                onSystemAdminLogin={handleSystemAdminLogin}
                onLogout={handleLogout}
            />
            {renderContent()}
        </div>
    );
};

export default App;
