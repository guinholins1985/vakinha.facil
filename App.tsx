
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

// FIX: Added type for the 'children' prop to fix TypeScript error.
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 font-heading">{children}</h2>
);

// FIX: Added type for the 'children' prop to fix TypeScript error.
const SectionSubtitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">{children}</p>
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
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto px-6">
                <SectionTitle>O que nossos usuários dizem</SectionTitle>
                <SectionSubtitle>Histórias de sucesso de quem já confia na nossa plataforma.</SectionSubtitle>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
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

const PricingSection = () => (
    <section className="bg-white py-20">
        <div className="container mx-auto px-6">
            <SectionTitle>Planos Flexíveis para Todos</SectionTitle>
            <SectionSubtitle>Monetize sua comunidade ou simplesmente organize um grupo de amigos. Nós temos a solução certa.</SectionSubtitle>
            <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                
                <div className="bg-slate-50 p-8 rounded-xl border border-gray-200">
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

                <div className="bg-slate-50 p-8 rounded-xl border border-gray-200">
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
            <TestimonialsSection />
            <PricingSection />
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
