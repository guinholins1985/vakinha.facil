import React, { useState, FC, ReactNode } from 'react';

// --- Ícones SVG ---
const DashboardIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const SettingsIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ApiIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const GatewayIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const EmailIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const BannersIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const CustomizeIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20v-6m0 0V4m0 6h10m-10 0H0" /></svg>;
const UsersIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 016 2.803M15 21a9 9 0 00-9-5.197" /></svg>;
const WalletIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const MoneyIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1.667a1.667 1.667 0 01.9-1.499m-1.8 0A1.667 1.667 0 0010.333 3v1.667m-3.93.833A9 9 0 0112 3.5a9 9 0 018.667 4.833m0 0A9 9 0 0112 20.5a9 9 0 01-8.667-11.167m0 0A9 9 0 003.333 12a9 9 0 008.667-7.167" /></svg>;
const RaffleIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h3a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" /></svg>;
const NewUsersIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const VaquinhaIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M12 14a4 4 0 100-8 4 4 0 000 8z" /></svg>;
const GamesIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12l2-2m0 0l2-2 2 2 2-2 2 2M6 12v6a2 2 0 002 2h8a2 2 0 002-2v-6M6 12H4m16 0h-2" /></svg>;
const PencilIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const TrashIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const CheckCircleIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ShareIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>;
const ChevronDownIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const LogoutIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

// --- App Structure ---
type NavItem = { name: string; icon: FC<{ className?: string }> };
type UserRole = 'Administrador' | 'Gestor/Criador' | 'Usuário' | 'Jogos';

const navItems: { title: string; items: NavItem[] }[] = [
  { title: "GERAL", items: [{ name: "Dashboard", icon: DashboardIcon }] },
  { title: "GESTÃO", items: [{ name: "Vaquinhas", icon: VaquinhaIcon }, { name: "Rifas", icon: RaffleIcon }, { name: "Jogos", icon: GamesIcon }, { name: "Usuários", icon: UsersIcon }, { name: "Financeiro", icon: WalletIcon }] },
  { title: "CONFIGURAÇÕES", items: [{ name: "Geral", icon: SettingsIcon }, { name: "API", icon: ApiIcon }, { name: "Gateways", icon: GatewayIcon }, { name: "E-mails", icon: EmailIcon }, { name: "Banners", icon: BannersIcon }, { name: "Customização", icon: CustomizeIcon }] },
];

const LoginPage: FC<{ onLogin: (role: UserRole) => void }> = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState<UserRole>('Administrador');
    const tabs: UserRole[] = ['Administrador', 'Gestor/Criador', 'Usuário', 'Jogos'];

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(activeTab);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="absolute top-0 left-0 w-full h-full z-0"></div>
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl animate-pulse-subtle"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full filter blur-3xl animate-pulse-subtle"></div>
            
            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold font-heading text-neutral-dark">PREMIX</h1>
                    <p className="text-gray-500 mt-2">Bem-vindo de volta! Acesse sua conta.</p>
                </div>

                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <div className="mb-6 border-b border-gray-200">
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                            {tabs.map(tab => (
                                <li className="mr-2" key={tab}>
                                    <button
                                        onClick={() => setActiveTab(tab)}
                                        className={`inline-block p-4 rounded-t-lg border-b-2 transition-colors duration-300 ${
                                            activeTab === tab 
                                            ? 'text-primary border-primary' 
                                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary" defaultValue="admin@premix.com" />
                            </div>
                            <div>
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                                    <a href="#" className="text-sm text-primary hover:underline">Esqueceu a senha?</a>
                                </div>
                                <input type="password" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary" defaultValue="password" />
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                                <span>Entrar como {activeTab}</span>
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Não tem uma conta? <a href="#" className="font-semibold text-primary hover:underline">Cadastre-se</a>
                    </p>
                </div>
            </div>
        </div>
    );
};


// --- Páginas de Conteúdo (Dashboard, Vaquinhas, etc.) ---
const StatCard: FC<{ title: string; value: string; icon: FC<{className?: string}>; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className={`p-4 rounded-full ${color}`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-semibold uppercase">{title}</p>
      <p className="text-3xl font-bold text-neutral-dark font-heading">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
    const chartData = [
        { name: 'Jan', value: 4000 }, { name: 'Fev', value: 3000 }, { name: 'Mar', value: 5000 },
        { name: 'Abr', value: 4500 }, { name: 'Mai', value: 6000 }, { name: 'Jun', value: 5500 }
    ];
    const maxValue = Math.max(...chartData.map(d => d.value));
    const recentActivities = [
        { id: 1, user: 'Ana Paula', action: 'criou a vaquinha "Ajuda para o Hospital"', time: '2h atrás' },
        { id: 2, user: 'Carlos Silva', action: 'comprou 10 bilhetes na rifa "iPhone 15"', time: '3h atrás' },
        { id: 3, user: 'Mariana Costa', action: 'fez uma doação de R$ 50,00', time: '5h atrás' },
        { id: 4, user: 'Admin', action: 'aprovou o saque de R$ 1.200,00', time: '8h atrás' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Arrecadado" value="R$ 125.643" icon={MoneyIcon} color="bg-primary" />
                <StatCard title="Rifas Ativas" value="34" icon={RaffleIcon} color="bg-secondary" />
                <StatCard title="Novos Usuários (Mês)" value="+1.204" icon={NewUsersIcon} color="bg-blue-500" />
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold font-heading text-neutral-dark mb-4">Arrecadação Mensal</h3>
                    <div className="h-64 flex items-end justify-around space-x-2 pt-4">
                        {chartData.map(item => (
                            <div key={item.name} className="flex flex-col items-center flex-1">
                                <div 
                                    className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all" 
                                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                                    title={`R$ ${item.value.toLocaleString('pt-BR')}`}
                                ></div>
                                <span className="text-xs font-semibold text-gray-500 mt-2">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold font-heading text-neutral-dark mb-4">Atividade Recente</h3>
                    <ul className="space-y-4">
                        {recentActivities.map(activity => (
                             <li key={activity.id} className="flex items-start space-x-3">
                                <div className="bg-gray-100 rounded-full p-2 mt-1">
                                    <UsersIcon className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-800">
                                        <span className="font-bold">{activity.user}</span> {activity.action}.
                                    </p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                             </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const VaquinhasPage = () => {
    const dummyVaquinhas = [
        { id: 1, nome: "Ajuda para o Hospital Central", meta: 50000, arrecadado: 35200, status: "Ativa" },
        { id: 2, nome: "Construção da nova creche", meta: 120000, arrecadado: 89500, status: "Ativa" },
        { id: 3, nome: "Campanha do Agasalho 2024", meta: 15000, arrecadado: 15000, status: "Finalizada" },
        { id: 4, nome: "Tratamento do cão Rex", meta: 8000, arrecadado: 2500, status: "Pendente" },
    ];
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-heading text-neutral-dark">Gestão de Vaquinhas</h1>
                <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                    + Criar Nova Vaquinha
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome da Campanha</th>
                                <th scope="col" className="px-6 py-3">Meta</th>
                                <th scope="col" className="px-6 py-3">Arrecadado</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyVaquinhas.map((item) => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.nome}</th>
                                    <td className="px-6 py-4">R$ {item.meta.toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4">R$ {item.arrecadado.toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 font-semibold leading-tight text-xs rounded-full ${
                                            item.status === 'Ativa' ? 'bg-green-100 text-green-800' :
                                            item.status === 'Finalizada' ? 'bg-gray-200 text-gray-700' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>{item.status}</span>
                                    </td>
                                    <td className="px-6 py-4"><a href="#" className="font-medium text-primary hover:underline">Editar</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const RifasPage = () => {
    const dummyRifas = [
        { id: 1, nome: "Rifa de um iPhone 15 Pro", premio: "iPhone 15 Pro", preco: 10, vendidos: 352, total: 500, status: "Ativa" },
        { id: 2, nome: "Cesta de Café da Manhã Especial", premio: "Cesta de Café", preco: 5, vendidos: 120, total: 200, status: "Ativa" },
        { id: 3, nome: "Rifa de uma Smart TV 55 polegadas", premio: "Smart TV 55\"", preco: 25, vendidos: 400, total: 400, status: "Finalizada" },
    ];
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-heading text-neutral-dark">Gestão de Rifas</h1>
                <button className="bg-secondary hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                    + Criar Nova Rifa
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome da Rifa</th>
                                <th scope="col" className="px-6 py-3">Prêmio</th>
                                <th scope="col" className="px-6 py-3">Preço (R$)</th>
                                <th scope="col" className="px-6 py-3">Bilhetes (Vendidos/Total)</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyRifas.map((item) => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.nome}</th>
                                    <td className="px-6 py-4">{item.premio}</td>
                                    <td className="px-6 py-4">R$ {item.preco.toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4">{item.vendidos} / {item.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 font-semibold leading-tight text-xs rounded-full ${
                                            item.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                                        }`}>{item.status}</span>
                                    </td>
                                    <td className="px-6 py-4"><a href="#" className="font-medium text-primary hover:underline">Ver Bilhetes</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const JogosPage = () => {
    const dummyJogos = [
        { id: 1, nome: "Tesouros do Faraó", provedor: "Gem Slots", status: "Ativo", img: "https://placehold.co/400x300/1A1A2E/FFFFFF/png?text=Fara%C3%B3" },
        { id: 2, nome: "Frutas da Sorte 777", provedor: "Lucky Games", status: "Ativo", img: "https://placehold.co/400x300/F59E0B/FFFFFF/png?text=Frutas" },
        { id: 3, nome: "Dragões de Fogo", provedor: "Gem Slots", status: "Inativo", img: "https://placehold.co/400x300/DC2626/FFFFFF/png?text=Drag%C3%A3o" },
        { id: 4, nome: "Explosão Estelar", provedor: "AstroPlay", status: "Ativo", img: "https://placehold.co/400x300/8B5CF6/FFFFFF/png?text=Estrela" },
    ];
    return (
        <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-heading text-neutral-dark">Gestão de Jogos</h1>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                    + Adicionar Novo Jogo
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dummyJogos.map(jogo => (
                    <div key={jogo.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <img src={jogo.img} alt={jogo.nome} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-neutral-dark">{jogo.nome}</h3>
                            <p className="text-sm text-gray-500">Provedor: {jogo.provedor}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <span className={`px-2 py-1 font-semibold leading-tight text-xs rounded-full ${
                                    jogo.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>{jogo.status}</span>
                                <button className="text-sm font-medium text-primary hover:underline">Configurar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const UsuariosPage = () => {
    const dummyUsers = [
        { id: 1, name: 'Alice Braga', email: 'alice.braga@example.com', role: 'Admin', lastLogin: '2024-07-20 10:30', status: 'Ativo', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
        { id: 2, name: 'Bruno Gomes', email: 'bruno.gomes@example.com', role: 'Usuário', lastLogin: '2024-07-20 09:15', status: 'Ativo', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' },
        { id: 3, name: 'Carla Dias', email: 'carla.dias@example.com', role: 'Usuário', lastLogin: '2024-07-19 18:00', status: 'Inativo', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c' },
        { id: 4, name: 'Daniel Alves', email: 'daniel.alves@example.com', role: 'Usuário', lastLogin: '2024-07-20 11:00', status: 'Pendente', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    ];
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-heading text-neutral-dark">Gestão de Usuários</h1>
                <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                    <NewUsersIcon className="w-5 h-5" />
                    <span>Adicionar Usuário</span>
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Usuário</th>
                                <th scope="col" className="px-6 py-3">Perfil</th>
                                <th scope="col" className="px-6 py-3">Último Acesso</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyUsers.map((user) => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center space-x-3">
                                        <img className="w-10 h-10 rounded-full" src={user.avatar} alt={user.name} />
                                        <div>
                                            <div className="font-bold">{user.name}</div>
                                            <div className="text-gray-500 text-xs">{user.email}</div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">{user.lastLogin}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 font-semibold leading-tight text-xs rounded-full ${
                                            user.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                                            user.status === 'Inativo' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>{user.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><PencilIcon /></button>
                                            <button className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"><TrashIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const FinanceiroPage = () => {
    const dummyTransactions = [
        { id: 1, date: '20/07/2024', description: 'Doação - Campanha do Agasalho', amount: 50.00, type: 'Crédito', status: 'Concluído' },
        { id: 2, date: '19/07/2024', description: 'Saque para conta bancária', amount: -1200.00, type: 'Débito', status: 'Concluído' },
        { id: 3, date: '18/07/2024', description: 'Venda de bilhetes - Rifa iPhone 15', amount: 250.00, type: 'Crédito', status: 'Concluído' },
        { id: 4, date: '17/07/2024', description: 'Taxa da plataforma (Julho)', amount: -75.50, type: 'Débito', status: 'Concluído' },
        { id: 5, date: '16/07/2024', description: 'Doação - Ajuda para o Hospital', amount: 100.00, type: 'Crédito', status: 'Pendente' },
    ];
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold font-heading text-neutral-dark mb-6">Visão Geral Financeira</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Saldo Disponível" value="R$ 12.540,50" icon={WalletIcon} color="bg-primary" />
                <StatCard title="Pendente de Liberação" value="R$ 2.810,00" icon={ClockIcon} color="bg-yellow-500" />
                <StatCard title="Total Sacado" value="R$ 89.200,00" icon={MoneyIcon} color="bg-blue-500" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold font-heading text-neutral-dark mb-4">Histórico de Transações</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Descrição</th>
                                <th scope="col" className="px-6 py-3 text-right">Valor (R$)</th>
                                <th scope="col" className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyTransactions.map((tx) => (
                                <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{tx.date}</td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{tx.description}</th>
                                    <td className={`px-6 py-4 text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                         <span className={`inline-flex items-center space-x-1 px-2 py-1 font-semibold leading-tight text-xs rounded-full ${
                                            tx.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {tx.status === 'Concluído' ? <CheckCircleIcon /> : <ClockIcon className="w-4 h-4" />}
                                            <span>{tx.status}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PlaceholderPage: FC<{ title:string }> = ({ title }) => (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold font-heading text-neutral-dark">{title}</h1>
        <p className="mt-4 text-gray-600">Conteúdo da página de <span className="font-semibold">{title}</span> em breve...</p>
        <p className="mt-2 text-gray-500 text-sm">Esta é uma área de demonstração. A funcionalidade completa será implementada em breve.</p>
    </div>
);


const LandingPage: FC<{ onEnterDashboard?: () => void, isLoggedInAs?: UserRole | null, onLogout?: () => void }> = ({ onEnterDashboard, isLoggedInAs = null, onLogout }) => {
    const faqItems = [
      { category: 'Geral', items: [ { q: "O que é a PREMIX?", a: "A PREMIX é uma plataforma completa que permite criar e gerenciar campanhas de arrecadação (vaquinhas), organizar sorteios (rifas) e integrar jogos de entretenimento, tudo em um só lugar." }, { q: "A plataforma é segura para transações financeiras?", a: "Sim. Priorizamos a segurança de ponta a ponta, utilizando gateways de pagamento confiáveis e criptografia para garantir que todas as transações e dados dos usuários sejam processados com máxima proteção." }, { q: "Quais são as taxas cobradas pela plataforma?", a: "Nossa estrutura de taxas é transparente e competitiva. Cobramos uma pequena porcentagem sobre o valor arrecadado para manter e melhorar a plataforma. Todos os detalhes podem ser encontrados em sua seção 'Financeiro' no painel." } ] },
      { category: 'Vaquinhas', items: [ { q: "Como posso criar uma vaquinha para minha causa?", a: "É muito fácil! No painel, vá para a seção 'Vaquinhas' e clique em 'Criar Nova Vaquinha'. Você preencherá um formulário com detalhes, meta, imagens e descrição da sua campanha." }, { q: "Como faço para sacar o dinheiro arrecadado?", a: "Assim que sua campanha atingir o prazo ou a meta, os valores (descontadas as taxas) ficarão disponíveis em seu saldo na plataforma. Você pode solicitar o saque para sua conta bancária a qualquer momento através do painel 'Financeiro'." } ] },
      { category: 'Rifas', items: [ { q: "Como funciona o sorteio das rifas? É transparente?", a: "Totalmente. O sorteio é realizado de forma automatizada pela plataforma em uma data e horário que você define. O resultado é gerado de forma aleatória e pode ser auditado, garantindo 100% de transparência para todos os participantes." }, { q: "Os participantes recebem comprovantes dos bilhetes comprados?", a: "Sim. A cada compra confirmada, o participante recebe um e-mail com a confirmação e os números dos seus bilhetes, garantindo o registro e a segurança da sua participação." } ] },
      { category: 'Jogos', items: [ { q: "Como os jogos são integrados à plataforma?", a: "Nós oferecemos uma API de integração simples para uma variedade de provedores de jogos. Você pode escolher quais jogos ativar em sua plataforma através do painel de 'Gestão de Jogos'." }, { q: "A plataforma garante a justiça dos resultados dos jogos?", a: "Sim. Trabalhamos apenas com provedores de jogos licenciados e auditados, que utilizam geradores de números aleatórios (RNG) para garantir resultados justos e imparciais em todas as partidas." } ] }
    ];
    const [openFaq, setOpenFaq] = useState<string | null>('Geral-0');

    return (
        <div className="min-h-screen bg-gray-50 text-neutral-dark font-sans flex flex-col items-center justify-center relative overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-full z-0"></div>
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl animate-pulse-subtle"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full filter blur-3xl animate-pulse-subtle"></div>

            <header className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm">
                 <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold font-heading text-neutral-dark">PREMIX</h1>
                    {isLoggedInAs ? (
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold text-gray-700">Bem-vindo, {isLoggedInAs}!</span>
                            <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-300">
                                Sair
                            </button>
                        </div>
                    ) : (
                        <button onClick={onEnterDashboard} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105">
                            Acessar Painel
                        </button>
                    )}
                 </div>
            </header>

            <main className="z-10 flex flex-col items-center w-full">
                <section className="text-center py-32 px-6 mt-12">
                    <h1 className="text-5xl md:text-7xl font-extrabold font-heading text-neutral-dark animate-fade-in">Sua Plataforma 3-em-1</h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-600 animate-fade-in">Crie vaquinhas, organize rifas e divirta-se com jogos. Tudo em um só lugar, de forma segura e transparente.</p>
                    <button onClick={onEnterDashboard} className={`mt-12 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105 animate-fade-in ${isLoggedInAs ? 'hidden' : ''}`}>
                        Comece Agora Mesmo
                    </button>
                </section>
                <section id="features" className="py-20 px-6 w-full max-w-6xl"><div className="text-center mb-12"><h2 className="text-4xl font-bold font-heading">Tudo que você precisa</h2><p className="text-gray-500 mt-2">Recursos poderosos para alavancar suas ideias.</p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div className="bg-white p-8 rounded-2xl border border-gray-200 text-center flex flex-col items-center shadow-lg transition-transform duration-300 hover:-translate-y-2"><div className="bg-primary p-4 rounded-full mb-4"><VaquinhaIcon className="w-10 h-10 text-white" /></div><h3 className="text-2xl font-bold font-heading mb-2">Vaquinhas Online</h3><p className="text-gray-600 text-sm">Crie e gerencie campanhas de arrecadação de forma simples e eficiente. Acompanhe doações em tempo real.</p></div><div className="bg-white p-8 rounded-2xl border border-gray-200 text-center flex flex-col items-center shadow-lg transition-transform duration-300 hover:-translate-y-2"><div className="bg-secondary p-4 rounded-full mb-4"><RaffleIcon className="w-10 h-10 text-white" /></div><h3 className="text-2xl font-bold font-heading mb-2">Rifas Digitais</h3><p className="text-gray-600 text-sm">Organize sorteios com bilhetes numerados, pagamento integrado e sorteio automatizado e transparente.</p></div><div className="bg-white p-8 rounded-2xl border border-gray-200 text-center flex flex-col items-center shadow-lg transition-transform duration-300 hover:-translate-y-2"><div className="bg-blue-500 p-4 rounded-full mb-4"><GamesIcon className="w-10 h-10 text-white" /></div><h3 className="text-2xl font-bold font-heading mb-2">Jogos e Entretenimento</h3><p className="text-gray-600 text-sm">Integre jogos de slot e outras formas de entretenimento para engajar seus usuários e gerar receita.</p></div></div></section>
                <section id="how-it-works" className="py-20 px-6 w-full bg-white"><div className="container mx-auto max-w-5xl"><div className="text-center mb-12"><h2 className="text-4xl font-bold font-heading">Comece em 3 Passos Simples</h2><p className="text-gray-500 mt-2">Transforme sua ideia em realidade rapidamente.</p></div><div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4"><div className="flex flex-col items-center text-center p-6 max-w-xs"><div className="flex items-center justify-center w-20 h-20 bg-primary/10 border-2 border-primary rounded-full mb-4"><PencilIcon className="w-8 h-8 text-primary"/></div><h3 className="text-xl font-bold mb-2">1. Crie sua Campanha</h3><p className="text-gray-500">Descreva sua vaquinha ou rifa, defina suas metas e personalize sua página.</p></div><div className="text-primary h-16 w-px md:w-32 md:h-px bg-gray-200"></div><div className="flex flex-col items-center text-center p-6 max-w-xs"><div className="flex items-center justify-center w-20 h-20 bg-primary/10 border-2 border-primary rounded-full mb-4"><ShareIcon className="w-8 h-8 text-primary"/></div><h3 className="text-xl font-bold mb-2">2. Divulgue seu Link</h3><p className="text-gray-500">Compartilhe o link exclusivo da sua campanha com amigos, família e nas redes sociais.</p></div><div className="text-primary h-16 w-px md:w-32 md:h-px bg-gray-200"></div><div className="flex flex-col items-center text-center p-6 max-w-xs"><div className="flex items-center justify-center w-20 h-20 bg-primary/10 border-2 border-primary rounded-full mb-4"><MoneyIcon className="w-8 h-8 text-primary"/></div><h3 className="text-xl font-bold mb-2">3. Receba o Dinheiro</h3><p className="text-gray-500">Acompanhe as contribuições e saque o valor arrecadado diretamente para sua conta.</p></div></div></div></section>
                <section id="testimonials" className="py-20 px-6 w-full max-w-6xl"><div className="text-center mb-12"><h2 className="text-4xl font-bold font-heading">O que nossos usuários dizem</h2><p className="text-gray-500 mt-2">Histórias de sucesso que nos inspiram.</p></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><div className="bg-white p-8 rounded-lg border border-gray-200"><p className="text-gray-700 italic">"A PREMIX foi fundamental para nossa campanha de ajuda comunitária. A plataforma é fácil de usar e o suporte é incrível!"</p><div className="flex items-center mt-4"><img src="https://i.pravatar.cc/150?u=user1" alt="Juliana S." className="w-12 h-12 rounded-full mr-4" /><div><p className="font-bold">Juliana S.</p><p className="text-sm text-primary">ONG Viver Bem</p></div></div></div><div className="bg-white p-8 rounded-lg border border-gray-200"><p className="text-gray-700 italic">"Organizei uma rifa para a formatura da minha turma e foi um sucesso. Tudo automatizado e muito seguro. Recomendo!"</p><div className="flex items-center mt-4"><img src="https://i.pravatar.cc/150?u=user2" alt="Marcos P." className="w-12 h-12 rounded-full mr-4" /><div><p className="font-bold">Marcos P.</p><p className="text-sm text-primary">Comissão de Formatura</p></div></div></div><div className="bg-white p-8 rounded-lg border border-gray-200"><p className="text-gray-700 italic">"Finalmente uma plataforma que une arrecadação com entretenimento. Meus seguidores adoraram os jogos!"</p><div className="flex items-center mt-4"><img src="https://i.pravatar.cc/150?u=user3" alt="Carla R." className="w-12 h-12 rounded-full mr-4" /><div><p className="font-bold">Carla R.</p><p className="text-sm text-primary">Criadora de Conteúdo</p></div></div></div></div></section>
                <section id="faq" className="py-20 px-6 w-full bg-white"><div className="container mx-auto max-w-4xl"><div className="text-center mb-12"><h2 className="text-4xl font-bold font-heading">Perguntas Frequentes</h2><p className="text-gray-500 mt-2">Tudo o que você precisa saber para começar.</p></div><div className="space-y-8">{faqItems.map((category) => (<div key={category.category}><h3 className="text-2xl font-bold font-heading mb-4 text-primary">{category.category}</h3><div className="space-y-4">{category.items.map((item, index) => { const id = `${category.category}-${index}`; return (<div key={id} className="bg-white border border-gray-200 rounded-lg overflow-hidden"><button onClick={() => setOpenFaq(openFaq === id ? null : id)} className="w-full flex justify-between items-center text-left p-5 font-semibold text-lg"><span>{item.q}</span><ChevronDownIcon className={`transition-transform duration-300 ${openFaq === id ? 'rotate-180' : ''}`} /></button><div className={`transition-all duration-500 ease-in-out ${openFaq === id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}><div className="p-5 pt-0 text-gray-600">{item.a}</div></div></div>)})}</div></div>)) }</div></div></section>
                <section className={`py-24 px-6 text-center w-full bg-gray-100 ${isLoggedInAs ? 'hidden' : ''}`}><h2 className="text-4xl font-bold font-heading">Pronto para começar?</h2><p className="text-gray-500 mt-2 max-w-2xl mx-auto">Junte-se a milhares de pessoas que já estão transformando suas ideias em realidade com a PREMIX.</p><button onClick={onEnterDashboard} className="mt-8 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105">Acessar o Painel Gratuitamente</button></section>
            </main>

            <footer className="w-full bg-white border-t border-gray-200 z-10 py-8 px-6">
                <div className="container mx-auto text-center text-gray-500 text-sm">
                    <p>&copy; 2024 PREMIX. Todos os direitos reservados.</p>
                    <p className="mt-2"><a href="#" className="hover:text-primary mx-2">Termos de Serviço</a> |<a href="#" className="hover:text-primary mx-2">Política de Privacidade</a></p>
                </div>
            </footer>
        </div>
    );
};


const AdminDashboardLayout: FC<{ userRole: UserRole; onLogout: () => void }> = ({ userRole, onLogout }) => {
    const [activePage, setActivePage] = useState('Dashboard');

    const Sidebar: FC<{ activePage: string; setActivePage: (page: string) => void }> = ({ activePage, setActivePage }) => (
        <aside className="w-64 flex-shrink-0 bg-neutral-dark text-gray-300 flex flex-col p-4">
            <div className="text-center py-4 mb-4">
                <h1 className="text-3xl font-bold font-heading text-white">PREMIX</h1>
                <p className="text-xs text-primary-light">Admin Dashboard</p>
            </div>
            <nav className="flex-1 space-y-4">
                {navItems.map((section) => (
                    <div key={section.title}>
                        <h2 className="px-4 text-xs font-bold tracking-wider text-gray-500 uppercase">{section.title}</h2>
                        <ul className="mt-2 space-y-1">
                            {section.items.map((item) => (
                                <li key={item.name}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActivePage(item.name); }}
                                        className={`flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${ activePage === item.name ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-700/50 hover:text-white'}`}>
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        <span>{item.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
            <div className="mt-auto text-center text-xs text-gray-500">
                <p>&copy; 2024 PREMIX. Todos os direitos reservados.</p>
            </div>
        </aside>
    );

    const Header: FC<{ title: string; userRole: UserRole; onLogout: () => void }> = ({ title, userRole, onLogout }) => (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold font-heading text-neutral-dark">{title}</h2>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <span className="text-sm font-semibold text-gray-600">{userRole}</span>
                    <p className="text-xs text-gray-500">online</p>
                </div>
                <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User avatar" />
                <button onClick={onLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" title="Sair">
                    <LogoutIcon />
                </button>
            </div>
        </header>
    );
    
    const renderContent = () => {
        switch(activePage) {
            case 'Dashboard': return <DashboardPage />;
            case 'Vaquinhas': return <VaquinhasPage />;
            case 'Rifas': return <RifasPage />;
            case 'Jogos': return <JogosPage />;
            case 'Usuários': return <UsuariosPage />;
            case 'Financeiro': return <FinanceiroPage />;
            default: return <PlaceholderPage title={activePage} />;
        }
    };

    return (
        <div className="flex h-screen bg-neutral-light font-sans text-gray-800">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={activePage} userRole={userRole} onLogout={onLogout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

const App = () => {
    // State to manage user session
    const [user, setUser] = useState<{ loggedIn: boolean; role: UserRole | null }>({ loggedIn: false, role: null });
    
    // State to manage navigation to the login page
    const [showLoginPage, setShowLoginPage] = useState(false);

    // Called from LoginPage upon successful login
    const handleLogin = (role: UserRole) => {
        setUser({ loggedIn: true, role: role });
        setShowLoginPage(false); // Hide login page and proceed to the app
    };

    // Called from AdminDashboard or logged-in LandingPage to log out
    const handleLogout = () => {
        setUser({ loggedIn: false, role: null });
    };

    // Called from LandingPage's "Acessar Painel" button
    const navigateToLogin = () => {
        setShowLoginPage(true);
    };

    // --- RENDER LOGIC ---

    // 1. If we have been explicitly told to show the login page (and user is not logged in)
    if (showLoginPage && !user.loggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    // 2. If the user IS logged in
    if (user.loggedIn && user.role) {
        // Admin or Manager sees the dashboard
        if (user.role === 'Administrador' || user.role === 'Gestor/Criador') {
            return <AdminDashboardLayout userRole={user.role} onLogout={handleLogout} />;
        }
        
        // Regular user or game user sees the landing page, but in a logged-in state
        return <LandingPage 
            isLoggedInAs={user.role} 
            onLogout={handleLogout} 
            onEnterDashboard={navigateToLogin} 
        />;
    }
    
    // 3. The default view for any non-logged-in user is the public landing page
    return <LandingPage onEnterDashboard={navigateToLogin} />;
};

export default App;
