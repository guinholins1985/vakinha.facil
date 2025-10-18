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


// --- App Structure ---
type NavItem = { name: string; icon: FC<{ className?: string }> };

const navItems: { title: string; items: NavItem[] }[] = [
  {
    title: "GERAL",
    items: [{ name: "Dashboard", icon: DashboardIcon }],
  },
  {
    title: "GESTÃO",
    items: [
      { name: "Usuários", icon: UsersIcon },
      { name: "Financeiro", icon: WalletIcon },
    ],
  },
  {
    title: "CONFIGURAÇÕES",
    items: [
      { name: "Geral", icon: SettingsIcon },
      { name: "API", icon: ApiIcon },
      { name: "Gateways", icon: GatewayIcon },
      { name: "E-mails", icon: EmailIcon },
      { name: "Banners", icon: BannersIcon },
      { name: "Customização", icon: CustomizeIcon },
    ],
  },
];

const Sidebar: FC<{ activePage: string; setActivePage: (page: string) => void }> = ({ activePage, setActivePage }) => {
  return (
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
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePage(item.name);
                    }}
                    className={`flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      activePage === item.name
                        ? 'bg-primary text-white shadow-lg'
                        : 'hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
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
};

const Header: FC<{ title: string }> = ({ title }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold font-heading text-neutral-dark">{title}</h2>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-semibold text-gray-600">Admin User</span>
        <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User avatar" />
      </div>
    </header>
  );
};

const StatCard: FC<{ title: string; value: string; icon: FC; color: string }> = ({ title, value, icon: Icon, color }) => (
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

const DashboardPage = () => (
  <div className="animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard title="Total Arrecadado" value="R$ 125.643" icon={MoneyIcon} color="bg-primary" />
      <StatCard title="Rifas Ativas" value="34" icon={RaffleIcon} color="bg-secondary" />
      <StatCard title="Novos Usuários (Mês)" value="+1.204" icon={NewUsersIcon} color="bg-blue-500" />
    </div>
    <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold font-heading text-neutral-dark mb-4">Atividade Recente</h3>
        <p className="text-gray-600">Gráficos e tabelas de atividade estarão disponíveis aqui em breve.</p>
    </div>
  </div>
);

const PlaceholderPage: FC<{ title:string }> = ({ title }) => (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold font-heading text-neutral-dark">{title}</h1>
        <p className="mt-4 text-gray-600">Conteúdo da página de <span className="font-semibold">{title}</span> em breve...</p>
        <p className="mt-2 text-gray-500 text-sm">Esta é uma área de demonstração. A funcionalidade completa será implementada em breve.</p>
    </div>
);

const App = () => {
  const [activePage, setActivePage] = useState('Dashboard');

  const renderContent = () => {
    switch(activePage) {
      case 'Dashboard':
        return <DashboardPage />;
      default:
        return <PlaceholderPage title={activePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-light font-sans text-gray-800">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={activePage} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
