import React, { useState } from 'react';

// Helper component for SVG Icons
const Icon = ({ path, className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const ICONS = {
  dashboard: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h-1.5m1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.085-1.085-1.085m1.085 1.085L5.25 16.5m2.25-11.25h1.5m2.25 11.25c0 .621.504 1.125 1.125 1.125H12a1.125 1.125 0 001.125-1.125m-3.375 0V1.5A2.25 2.25 0 009.75 0h-3.375c-.621 0-1.125.504-1.125 1.125V15M12 15V2.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 2.25V15m3.375 1.5h2.25",
  users: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.598M12 14.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z",
  vaquinhas: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-.75m0-1.5h.375c.621 0 1.125.504 1.125 1.125v.375m-18 0p_a_start_of_a_tag",
  finance: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517l2.74-1.22m0 0l-3.94-3.94m3.94 3.94l-3.94 3.94",
  marketing: "M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-6-6",
  support: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
  settings: "M9.594 3.94c.09-.542.56-1.008 1.11-1.226.55-.218 1.19-.243 1.74-.102.55.14.99.553 1.226 1.11.236.55.26 1.19.102 1.74-.14.55-.553.99-1.11 1.226-.55.218-1.19.243-1.74.102a2.22 2.22 0 01-1.226-1.11zM12.03 13.94c.09-.542.56-1.008 1.11-1.226.55-.218 1.19-.243 1.74-.102.55.14.99.553 1.226 1.11.236.55.26 1.19.102 1.74-.14.55-.553.99-1.11 1.226-.55.218-1.19.243-1.74.102a2.22 2.22 0 01-1.226-1.11zM6.594 13.94c.09-.542.56-1.008 1.11-1.226.55-.218 1.19-.243 1.74-.102.55.14.99.553 1.226 1.11.236.55.26 1.19.102 1.74-.14.55-.553.99-1.11 1.226-.55.218-1.19.243-1.74.102a2.22 2.22 0 01-1.226-1.11z",
  logout: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
};

const Sidebar = () => (
    <div className="w-64 bg-gray-900 text-gray-300 flex flex-col min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold font-heading text-white">Vakinha Fácil</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"><Icon path={ICONS.dashboard} className="w-5 h-5 mr-3"/> Dashboard</a>
        <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"><Icon path={ICONS.users} className="w-5 h-5 mr-3"/> Usuários</a>
        <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"><Icon path={ICONS.vaquinhas} className="w-5 h-5 mr-3"/> Vaquinhas</a>
        <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"><Icon path={ICONS.finance} className="w-5 h-5 mr-3"/> Financeiro</a>
        <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md bg-indigo-600 text-white font-semibold"><Icon path={ICONS.marketing} className="w-5 h-5 mr-3"/> Marketing</a>
        <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"><Icon path={ICONS.support} className="w-5 h-5 mr-3"/> Suporte</a>
      </nav>
      <div className="px-4 py-6 border-t border-gray-800 space-y-2">
        <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"><Icon path={ICONS.settings} className="w-5 h-5 mr-3"/> Configurações</a>
        <a href="#" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"><Icon path={ICONS.logout} className="w-5 h-5 mr-3"/> Sair</a>
      </div>
    </div>
);

const Header = () => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    <div>
        <h2 className="text-2xl font-bold font-heading text-gray-800">Marketing & Engajamento</h2>
        <p className="text-sm text-gray-500">Gerencie campanhas, cupons e notificações para impulsionar o crescimento.</p>
    </div>
    <div className="flex items-center">
      {/* Search and Profile can be added here */}
    </div>
  </header>
);

const MarketingCampaigns = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-700">Gerenciar Campanhas</h3>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700">Criar Nova Campanha</button>
    </div>
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campanha</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr>
          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">Black Friday 2024</div><div className="text-sm text-gray-500">Taxa zero para novas vaquinhas</div></td>
          <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativa</span></td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20/11/24 - 30/11/24</td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">...</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">Dia das Mães</div><div className="text-sm text-gray-500">Campanha de presentes em grupo</div></td>
          <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inativa</span></td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/05/24 - 12/05/24</td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">...</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Coupons = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-700">Cupons e Promoções</h3>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700">Criar Novo Cupom</button>
    </div>
     <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desconto</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validade</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usos</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr>
          <td className="px-6 py-4 whitespace-nowrap"><span className="font-mono bg-gray-100 p-1 rounded">PRIMEIRAVAKA</span></td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ 15 Fixo</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">31/12/24</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">42/100</td>
          <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span></td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap"><span className="font-mono bg-gray-100 p-1 rounded">ECONOMIZE10</span></td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10%</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30/09/24</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">89/ilimitado</td>
          <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span></td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap"><span className="font-mono bg-gray-100 p-1 rounded">FERIAS2023</span></td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5%</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">31/01/24</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">150/150</td>
          <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Expirado</span></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const EmailMarketing = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">E-mail Marketing</h3>
        <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800">Criar Novo E-mail</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input type="text" placeholder="Assunto do e-mail" className="p-2 border rounded-md w-full col-span-2" defaultValue="Novidades na Vakinha Fácil!"/>
                <div className="col-span-2 h-40 border rounded-md p-2 bg-gray-50 text-gray-400">
                    <p>Editor de texto rico (TinyMCE/Quill) apareceria aqui.</p>
                    <p>Olá {'{nome}'},</p>
                </div>
                <select className="p-2 border rounded-md">
                    <option>Todos os Usuários</option>
                    <option>Doadores Recentes</option>
                    <option>Criadores de Vaquinha</option>
                </select>
                <div className="flex items-center space-x-2">
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 w-full">Enviar Teste</button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 w-full">Agendar Envio</button>
                </div>
            </div>
        </div>
    </div>
);

const ReferralProgram = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Programa de Indicações</h3>
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 mb-6">
            <div className="flex items-center">
                <p className="font-semibold mr-4">Status do Programa</p>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked/>
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
                <span className="ml-3 text-sm font-medium text-gray-900">Ativo</span>
            </div>
            <div className="flex items-center">
                <label className="font-semibold mr-2">Recompensa:</label>
                <input type="text" defaultValue="R$10,00" className="p-2 border rounded-md w-24 text-center"/>
            </div>
        </div>
        <h4 className="font-semibold text-gray-800 mb-2">Indicações Realizadas</h4>
         <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indicado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                </tr>
            </thead>
             <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">joao.silva@email.com</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aprovada</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/07/2024</td>
                </tr>
                <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">maria.santos@email.com</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendente</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">22/07/2024</td>
                </tr>
             </tbody>
        </table>
    </div>
);

const PushNotifications = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Notificações Push</h3>
        <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800">Criar Nova Notificação</h4>
            <div className="grid grid-cols-1 gap-4 mt-4">
                <input type="text" placeholder="Título da notificação" className="p-2 border rounded-md w-full"/>
                <textarea placeholder="Mensagem (até 200 caracteres)" rows={3} className="p-2 border rounded-md w-full"></textarea>
                <div className="flex items-center space-x-4">
                    <select className="p-2 border rounded-md flex-grow">
                        <option>Segmento: Todos</option>
                        <option>Segmento: Doadores</option>
                        <option>Segmento: Criadores</option>
                    </select>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700">Enviar Agora</button>
                </div>
            </div>
        </div>
    </div>
);

const MarketingReports = () => (
    <div>
        <div className="flex justify-end mb-4">
            <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-50">Exportar Relatórios (CSV/PDF)</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-gray-700 mb-4">Desempenho de Campanhas (Cliques)</h4>
                <div className="h-48 bg-gray-100 rounded-md flex items-end justify-around p-4">
                    <div className="w-8 bg-indigo-400 rounded-t-sm" style={{ height: '70%' }}></div>
                    <div className="w-8 bg-indigo-400 rounded-t-sm" style={{ height: '50%' }}></div>
                    <div className="w-8 bg-indigo-400 rounded-t-sm" style={{ height: '90%' }}></div>
                    <div className="w-8 bg-indigo-400 rounded-t-sm" style={{ height: '60%' }}></div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-gray-700 mb-4">Taxa de Abertura de E-mails</h4>
                <div className="h-48 bg-gray-100 rounded-md p-4">
                  {/* Fake Line Chart */}
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M 0 30 L 20 20 L 40 25 L 60 15 L 80 22 L 100 10" fill="none" stroke="#818cf8" strokeWidth="2"/>
                  </svg>
                </div>
            </div>
        </div>
    </div>
);

const MarketingPage = () => {
    const [activeTab, setActiveTab] = useState('campaigns');

    const TABS = {
        campaigns: <MarketingCampaigns />,
        coupons: <Coupons />,
        email: <EmailMarketing />,
        referrals: <ReferralProgram />,
        push: <PushNotifications />,
        reports: <MarketingReports />,
    };

    const tabNames = {
      campaigns: "Campanhas",
      coupons: "Cupons",
      email: "E-mail Marketing",
      referrals: "Indicações",
      push: "Push",
      reports: "Relatórios",
    };

    return (
        <div className="p-6">
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {Object.keys(TABS).map(tabKey => (
                        <button
                            key={tabKey}
                            onClick={() => setActiveTab(tabKey)}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tabKey
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tabNames[tabKey]}
                        </button>
                    ))}
                </nav>
            </div>

            <div>
                {TABS[activeTab]}
            </div>
        </div>
    );
};


function App() {
  return (
    <div className="flex bg-gray-100 font-sans">
        <Sidebar />
        <main className="flex-1">
          <Header />
          <MarketingPage />
        </main>
    </div>
  );
}

export default App;
