

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

// AI client initialized once at the module level for performance.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- TYPE DEFINITIONS ---
interface ModalContext {
  promptType: 'email' | 'push' | '';
}

interface GeneratedEmail {
  subject: string;
  body: string;
}

interface GeneratedPush {
  title: string;
  message: string;
}

interface GenerationError {
  error: string;
}

type GeneratedContent = GeneratedEmail | GeneratedPush | GenerationError | null;

interface AIContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (objective: string) => void;
    isGenerating: boolean;
    generatedContent: GeneratedContent;
    onUseContent: () => void;
    context: ModalContext;
}

interface EmailMarketingProps {
    subject: string;
    onSubjectChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    body: string;
    onBodyChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onGenerate: (type: 'email') => void;
}

interface PushNotificationsProps {
    title: string;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    message: string;
    onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onGenerate: (type: 'push') => void;
}

type PageName = 'dashboard' | 'users' | 'vaquinhas' | 'finance' | 'marketing' | 'support' | 'settings';


// --- COMPONENTS ---

// Helper component for SVG Icons
const Icon = ({ path, className = 'w-6 h-6' }: { path: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const ICONS = {
  dashboard: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5",
  users: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.598M12 14.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z",
  vaquinhas: "M2.25 18.75a6 6 0 006-6 6 6 0 00-6-6v12zM2.25 7.5a6 6 0 016 6 6 6 0 01-6-6zM3 13.5a5.25 5.25 0 015.25-5.25H18a5.25 5.25 0 010 10.5H8.25A5.25 5.25 0 013 13.5zM15 13.5a1.5 1.5 0 01-1.5 1.5H12a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5h1.5a1.5 1.5 0 011.5 1.5v1.5z",
  finance: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517l2.74-1.22m0 0l-3.94-3.94m3.94 3.94l-3.94 3.94",
  marketing: "M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-6-6",
  support: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
  settings: "M9.594 3.94c.09-.542.56-1.008 1.11-1.226.55-.218 1.19-.243 1.74-.102.55.14.99.553 1.226 1.11.236.55.26 1.19.102 1.74-.14.55-.553.99-1.11 1.226-.55.218-1.19.243-1.74.102a2.22 2.22 0 01-1.226-1.11zM12.03 13.94c.09-.542.56-1.008 1.11-1.226.55-.218 1.19-.243 1.74-.102.55.14.99.553 1.226 1.11.236.55.26 1.19.102 1.74-.14.55-.553.99-1.11 1.226-.55.218-1.19.243-1.74.102a2.22 2.22 0 01-1.226-1.11zM6.594 13.94c.09-.542.56-1.008 1.11-1.226.55-.218 1.19-.243 1.74-.102.55.14.99.553 1.226 1.11.236.55.26 1.19.102 1.74-.14.55-.553.99-1.11 1.226-.55.218-1.19.243-1.74.102a2.22 2.22 0 01-1.226-1.11z",
  logout: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
  ai: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
  plusCircle: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  chartBar: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  edit: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
  trash: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0",
  eye: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M12 15a3 3 0 100-6 3 3 0 000 6z",
  checkCircle: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  xCircle: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  creditCard: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 3m0 0l-3-3m3 3V15m6-1.5V6a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6v12a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 18v-2.25",
  palette: "M.5 7.5l.75-2.25h1.5l.75 2.25m-3 0h3m-3 0l-1.125 3.375a.5.5 0 00.44 1.125h2.25a.5.5 0 00.439-.875L2.5 7.5m0 0l-1.125-3.375a.5.5 0 01.44-1.125h2.25a.5.5 0 01.439.875L2.5 7.5m6.5-3.375l.75-2.25h1.5l.75 2.25m-3 0h3m-3 0l-1.125 3.375a.5.5 0 00.44 1.125h2.25a.5.5 0 00.439-.875L9 7.5m0 0l-1.125-3.375a.5.5 0 01.44-1.125h2.25a.5.5 0 01.439.875L9 7.5m6.5-3.375l.75-2.25h1.5l.75 2.25m-3 0h3m-3 0l-1.125 3.375a.5.5 0 00.44 1.125h2.25a.5.5 0 00.439-.875L15.5 7.5m0 0l-1.125-3.375a.5.5 0 01.44-1.125h2.25a.5.5 0 01.439.875L15.5 7.5",
  link: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244",
  lock: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
  camera: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316zM12 15a3 3 0 100-6 3 3 0 000 6z",
};

const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const StatCard = ({ title, value, iconPath, colorClass }: { title: string, value: string, iconPath: string, colorClass: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClass}`}>
            <Icon path={iconPath} className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const QuickActionButton = ({ label, iconPath, onClick }: { label: string, iconPath: string, onClick: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200">
        <div className="p-3 bg-indigo-100 rounded-full mb-2">
            <Icon path={iconPath} className="w-6 h-6 text-indigo-600" />
        </div>
        <span className="text-sm font-semibold text-gray-700 text-center">{label}</span>
    </button>
);

const DashboardPage = () => {
    const userGrowthData = [
        { month: 'Jan', users: 65 }, { month: 'Fev', users: 59 }, { month: 'Mar', users: 80 },
        { month: 'Abr', users: 81 }, { month: 'Mai', users: 56 }, { month: 'Jun', users: 55 },
        { month: 'Jul', users: 40 }, { month: 'Ago', users: 62 }, { month: 'Set', users: 75 }
    ];
    const maxUsers = Math.max(...userGrowthData.map(d => d.users));

    return (
    <div className="p-6 animate-fade-in space-y-6">
        {/* Section 1: KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Arrecadação Total" value="R$ 1.250.340" iconPath={ICONS.finance} colorClass="bg-blue-500" />
            <StatCard title="Vaquinhas Ativas" value="89" iconPath={ICONS.vaquinhas} colorClass="bg-green-500" />
            <StatCard title="Usuários Ativos" value="12.450" iconPath={ICONS.users} colorClass="bg-yellow-500" />
            <StatCard title="Novos Cadastros (Mês)" value="432" iconPath={ICONS.users} colorClass="bg-purple-500" />
        </div>

        {/* Section 2: Quick Actions & User Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold font-heading text-gray-800 mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-2 gap-4">
                    <QuickActionButton label="Nova Vaquinha" iconPath={ICONS.plusCircle} onClick={() => alert('Abrir formulário de nova vaquinha...')} />
                    <QuickActionButton label="Gerar Relatório" iconPath={ICONS.chartBar} onClick={() => alert('Abrir painel de relatórios...')} />
                    <QuickActionButton label="Ver Tickets" iconPath={ICONS.support} onClick={() => alert('Ir para a página de suporte...')} />
                    <QuickActionButton label="Convidar Admin" iconPath={ICONS.users} onClick={() => alert('Abrir modal para convidar administrador...')} />
                </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-lg font-bold font-heading text-gray-800 mb-4">Crescimento de Usuários (Últimos Meses)</h3>
                 <div className="flex items-end h-48 space-x-2">
                    {userGrowthData.map(data => (
                        <div key={data.month} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-colors" style={{ height: `${(data.users / maxUsers) * 100}%` }}></div>
                            <span className="text-xs text-gray-500 mt-1">{data.month}</span>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
        
        {/* Section 3: Recent Activity & Vaquinhas nearing goal */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold font-heading text-gray-800 mb-4">Atividade Recente</h3>
                 <ul className="space-y-4">
                    <li className="flex items-center space-x-3"><div className="p-2 bg-green-100 rounded-full"><Icon path={ICONS.vaquinhas} className="w-4 h-4 text-green-600" /></div><p className="text-sm text-gray-600">Nova vaquinha <span className="font-semibold text-gray-800">"Formatura de Medicina"</span> foi criada.</p><span className="text-xs text-gray-400 ml-auto flex-shrink-0">agora</span></li>
                    <li className="flex items-center space-x-3"><div className="p-2 bg-blue-100 rounded-full"><Icon path={ICONS.users} className="w-4 h-4 text-blue-600" /></div><p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">Carlos Souza</span> acabou de se cadastrar.</p><span className="text-xs text-gray-400 ml-auto flex-shrink-0">2 min</span></li>
                    <li className="flex items-center space-x-3"><div className="p-2 bg-yellow-100 rounded-full"><Icon path={ICONS.finance} className="w-4 h-4 text-yellow-600" /></div><p className="text-sm text-gray-600">Doação de <span className="font-semibold text-gray-800">R$ 150,00</span> recebida para <span className="font-semibold text-gray-800">"Ajude o Lar São José"</span>.</p><span className="text-xs text-gray-400 ml-auto flex-shrink-0">10 min</span></li>
                    <li className="flex items-center space-x-3"><div className="p-2 bg-red-100 rounded-full"><Icon path={ICONS.support} className="w-4 h-4 text-red-600" /></div><p className="text-sm text-gray-600">Novo ticket de suporte <span className="font-semibold text-gray-800">#81245</span> foi aberto.</p><span className="text-xs text-gray-400 ml-auto flex-shrink-0">1 hora</span></li>
                </ul>
            </div>
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold font-heading text-gray-800 mb-4">Vaquinhas Próximas da Meta</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campanha</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrecadado / Meta</th></tr></thead><tbody className="bg-white divide-y divide-gray-200"><tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Viagem para a Disney</td><td className="px-6 py-4 whitespace-nowrap"><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-green-600 h-2.5 rounded-full" style={{ width: '95%' }}></div></div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 9.500 / R$ 10.000</td></tr><tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Presente Casamento Joana e Pedro</td><td className="px-6 py-4 whitespace-nowrap"><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-green-600 h-2.5 rounded-full" style={{ width: '82%' }}></div></div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 4.100 / R$ 5.000</td></tr><tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Reforma da Sede do Grupo</td><td className="px-6 py-4 whitespace-nowrap"><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '75%' }}></div></div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 15.000 / R$ 20.000</td></tr></tbody></table>
                </div>
            </div>
        </div>
    </div>
    );
};

const UsersPage = () => {
    const users = [
        { id: 1, name: 'Ana Silva', email: 'ana.silva@example.com', role: 'Admin', status: 'Ativo', joined: '2023-01-15' },
        { id: 2, name: 'Bruno Costa', email: 'bruno.costa@example.com', role: 'Gestor', status: 'Ativo', joined: '2023-02-20' },
        { id: 3, name: 'Carla Dias', email: 'carla.dias@example.com', role: 'Usuário', status: 'Ativo', joined: '2023-03-10' },
        { id: 4, name: 'Daniel Alves', email: 'daniel.alves@example.com', role: 'Usuário', status: 'Bloqueado', joined: '2023-04-05' },
    ];

    const getStatusClass = (status: string) => status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    
    return (
        <div className="p-6 animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="text-xl font-bold font-heading text-gray-800">Todos os Usuários</h3>
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="Buscar usuário..." className="p-2 border rounded-md text-sm"/>
                        <select className="p-2 border rounded-md text-sm"><option>Filtrar por Status</option><option>Ativo</option><option>Bloqueado</option></select>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"><Icon path={ICONS.plusCircle} className="w-5 h-5"/> Adicionar</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Cadastro</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{user.name}</div><div className="text-sm text-gray-500">{user.email}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>{user.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"><button className="text-indigo-600 hover:text-indigo-900"><Icon path={ICONS.edit} className="w-5 h-5"/></button><button className="text-red-600 hover:text-red-900"><Icon path={ICONS.trash} className="w-5 h-5"/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600"><p>Mostrando 1 a 4 de 120 usuários</p><div className="flex gap-1"><button className="px-3 py-1 border rounded-md hover:bg-gray-100">Anterior</button><button className="px-3 py-1 border rounded-md hover:bg-gray-100">Próximo</button></div></div>
            </div>
        </div>
    );
};

const VaquinhasPage = () => {
    const vaquinhas = [
        { id: 1, name: 'Formatura de Medicina', creator: 'Turma C', status: 'Ativa', raised: 45000, goal: 50000 },
        { id: 2, name: 'Ajude o Lar São José', creator: 'Maria Oliveira', status: 'Ativa', raised: 8200, goal: 10000 },
        { id: 3, name: 'Construção da Quadra', creator: 'Comunidade Local', status: 'Pendente', raised: 0, goal: 25000 },
        { id: 4, name: 'Viagem de Férias', creator: 'Família Souza', status: 'Encerrada', raised: 5000, goal: 5000 },
    ];
    
    const getStatusClass = (status: string) => {
        if (status === 'Ativa') return 'bg-green-100 text-green-800';
        if (status === 'Pendente') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6 animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold font-heading text-gray-800">Todas as Vaquinhas</h3>
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="Buscar vaquinha..." className="p-2 border rounded-md text-sm"/>
                        <select className="p-2 border rounded-md text-sm"><option>Filtrar por Status</option><option>Ativa</option><option>Pendente</option><option>Encerrada</option></select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campanha</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {vaquinhas.map(v => {
                                const progress = (v.raised / v.goal) * 100;
                                return (
                                <tr key={v.id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{v.name}</div><div className="text-sm text-gray-500">Criador: {v.creator}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">R$ {v.raised.toLocaleString()} / R$ {v.goal.toLocaleString()}</div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(v.status)}`}>{v.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button className="text-gray-500 hover:text-indigo-600"><Icon path={ICONS.eye} className="w-5 h-5"/></button>
                                        {v.status === 'Pendente' && <><button className="text-green-600 hover:text-green-900"><Icon path={ICONS.checkCircle} className="w-5 h-5"/></button><button className="text-red-600 hover:text-red-900"><Icon path={ICONS.xCircle} className="w-5 h-5"/></button></>}
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600"><p>Mostrando 1 a 4 de 89 vaquinhas</p><div className="flex gap-1"><button className="px-3 py-1 border rounded-md hover:bg-gray-100">Anterior</button><button className="px-3 py-1 border rounded-md hover:bg-gray-100">Próximo</button></div></div>
            </div>
        </div>
    );
};

const FinancePage = () => {
    const transactions = [
        { id: 'TXN123', date: '2024-07-28', type: 'Doação', amount: 50.00, status: 'Concluída' },
        { id: 'TXN124', date: '2024-07-28', type: 'Taxa', amount: -1.50, status: 'Concluída' },
        { id: 'TXN125', date: '2024-07-27', type: 'Saque', amount: -850.00, status: 'Pendente' },
        { id: 'TXN126', date: '2024-07-26', type: 'Doação', amount: 200.00, status: 'Concluída' },
    ];
    
    return (
        <div className="p-6 animate-fade-in space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Receita Bruta (Mês)" value="R$ 85.400" iconPath={ICONS.finance} colorClass="bg-blue-500" />
                <StatCard title="Taxas (Mês)" value="R$ 2.562" iconPath={ICONS.vaquinhas} colorClass="bg-yellow-500" />
                <StatCard title="Lucro Líquido (Mês)" value="R$ 82.838" iconPath={ICONS.chartBar} colorClass="bg-green-500" />
                <StatCard title="Saques Pendentes" value="R$ 12.300" iconPath={ICONS.users} colorClass="bg-red-500" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold font-heading text-gray-800">Histórico de Transações</h3>
                     <div className="flex items-center gap-2">
                        <input type="date" className="p-2 border rounded-md text-sm"/>
                        <input type="date" className="p-2 border rounded-md text-sm"/>
                        <button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800">Exportar</button>
                     </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID da Transação</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th></tr></thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map(t => (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{t.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.status === 'Concluída' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{t.status}</span></td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-semibold ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {t.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SupportPage = () => {
    const tickets = [
        { id: 81245, subject: 'Problema com saque', user: 'joana.m@email.com', priority: 'Alta', status: 'Aberto', updated: '2h atrás' },
        { id: 81244, subject: 'Como mudar o prazo?', user: 'pedro.g@email.com', priority: 'Média', status: 'Pendente', updated: '1 dia atrás' },
        { id: 81243, subject: 'Sugestão: PIX Recorrente', user: 'ana.s@email.com', priority: 'Baixa', status: 'Resolvido', updated: '3 dias atrás' },
    ];
    
    const getPriorityClass = (p: string) => {
        if (p === 'Alta') return 'bg-red-100 text-red-800';
        if (p === 'Média') return 'bg-yellow-100 text-yellow-800';
        return 'bg-blue-100 text-blue-800';
    };

    return (
        <div className="p-6 animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tickets Abertos" value="12" iconPath={ICONS.support} colorClass="bg-red-500" />
                <StatCard title="Tickets Pendentes" value="35" iconPath={ICONS.support} colorClass="bg-yellow-500" />
                <StatCard title="Resolvidos (Hoje)" value="28" iconPath={ICONS.checkCircle} colorClass="bg-green-500" />
                <StatCard title="Primeira Resposta" value="~ 45 min" iconPath={ICONS.users} colorClass="bg-blue-500" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold font-heading text-gray-800">Fila de Atendimento</h3>
                    <div className="flex items-center gap-2">
                        <select className="p-2 border rounded-md text-sm"><option>Filtrar por Status</option></select>
                        <select className="p-2 border rounded-md text-sm"><option>Filtrar por Prioridade</option></select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tickets.map(t => (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{t.subject}</div><div className="text-sm text-gray-500">#{t.id} - {t.user}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(t.priority)}`}>{t.priority}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.updated}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button className="text-indigo-600 hover:text-indigo-900 font-semibold">Ver</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- Settings Page Components ---

interface SettingsCardProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}
const SettingsCard = ({ title, description, children }: SettingsCardProps) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold font-heading text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        <div className="space-y-4">{children}</div>
    </div>
);

const GeneralSettings = () => (
    <SettingsCard title="Geral" description="Configurações globais da plataforma.">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome da Plataforma</label><input type="text" defaultValue="Vakinha Fácil" className="p-2 border rounded-md w-full md:w-1/2"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Contato Principal</label><input type="email" defaultValue="contato@vakinhafacil.com" className="p-2 border rounded-md w-full md:w-1/2"/></div>
    </SettingsCard>
);

const SecuritySettings = () => (
    <SettingsCard title="Segurança" description="Gerencie as configurações de segurança da conta e da plataforma.">
        <div className="flex items-center justify-between"><p className="text-sm font-medium text-gray-900">Exigir Autenticação de Dois Fatores (2FA) para Admins</p><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" value="" className="sr-only peer" defaultChecked/><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label></div>
    </SettingsCard>
);

const GatewayCard = ({ name, logoSrc, description, isActive }: { name: string, logoSrc: string, description: string, isActive: boolean }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border flex flex-col">
        <div className="flex justify-between items-start">
            <img src={logoSrc} alt={`${name} logo`} className="h-8 mb-4"/>
            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{isActive ? 'Ativo' : 'Inativo'}</span>
        </div>
        <p className="text-sm text-gray-600 flex-grow">{description}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
             <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" value="" className="sr-only peer" defaultChecked={isActive}/><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">Configurar</button>
        </div>
    </div>
);

const GatewaySettings = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold font-heading text-gray-800">Gateways de Pagamento</h3>
        <p className="text-gray-600">Ative e configure os provedores de pagamento para processar as transações em sua plataforma.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GatewayCard name="Stripe" logoSrc="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" description="Plataforma global para pagamentos online, ideal para aceitar cartões de crédito com facilidade." isActive={true} />
            <GatewayCard name="Mercado Pago" logoSrc="https://logospng.org/download/mercado-pago/logo-mercado-pago-2048.png" description="Solução líder na América Latina, oferecendo pagamentos via PIX, boleto e cartões." isActive={true} />
            <GatewayCard name="PagSeguro" logoSrc="https://logodownload.org/wp-content/uploads/2019/08/pagseguro-logo-0-2048x410.png" description="Gateway de pagamento popular no Brasil com diversas opções de parcelamento e segurança." isActive={false} />
        </div>
    </div>
);

const LayoutSettings = () => {
    const affiliates = [
        { id: 1, name: 'Blog do Investidor', code: 'INVESTIDOR10', commission: '5%', earnings: 'R$ 1,250.00' },
        { id: 2, name: 'Canal Tech Reviews', code: 'TECHVAKA', commission: '7%', earnings: 'R$ 3,420.50' },
        { id: 3, name: 'Finanças Pessoais BR', code: 'FINBR20', commission: '5%', earnings: 'R$ 875.00' },
    ];
    return (
        <div className="space-y-8">
            <SettingsCard title="Banner Principal" description="Personalize o banner que aparece na página inicial do seu site.">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Banner (URL)</label><input type="text" placeholder="https://example.com/banner.jpg" className="p-2 border rounded-md w-full"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Título</label><input type="text" placeholder="Arrecade fundos para seus sonhos" className="p-2 border rounded-md w-full"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label><input type="text" placeholder="Crie sua vaquinha online de forma fácil e segura." className="p-2 border rounded-md w-full"/></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Texto do Botão</label><input type="text" placeholder="Criar Vaquinha Grátis" className="p-2 border rounded-md w-full"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Link do Botão</label><input type="text" placeholder="/criar-vaquinha" className="p-2 border rounded-md w-full"/></div>
                </div>
            </SettingsCard>

            <SettingsCard title="Cabeçalho e Rodapé" description="Configure o logo e os links de navegação.">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label><input type="text" placeholder="https://example.com/logo.svg" className="p-2 border rounded-md w-full"/></div>
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Links do Cabeçalho (separados por vírgula)</label><input type="text" defaultValue="Como Funciona, Preços, Contato" className="p-2 border rounded-md w-full"/></div>
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Links do Rodapé (separados por vírgula)</label><input type="text" defaultValue="Termos de Uso, Política de Privacidade, Sobre Nós" className="p-2 border rounded-md w-full"/></div>
            </SettingsCard>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold font-heading text-gray-800">Programa de Afiliados</h3>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"><Icon path={ICONS.plusCircle} className="w-5 h-5"/> Novo Afiliado</button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Afiliado</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link de Referência</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comissão</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ganhos</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {affiliates.map(aff => (
                                <tr key={aff.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{aff.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">.../?ref={aff.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aff.commission}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{aff.earnings}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"><button className="text-indigo-600 hover:text-indigo-900"><Icon path={ICONS.edit} className="w-5 h-5"/></button><button className="text-red-600 hover:text-red-900"><Icon path={ICONS.trash} className="w-5 h-5"/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};


const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabNames: { [key: string]: string } = {
        general: "Geral",
        security: "Segurança",
        gateways: "Gateways de Pagamento",
        layout: "Layout e Aparência",
    };

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'general': return <GeneralSettings />;
            case 'security': return <SecuritySettings />;
            case 'gateways': return <GatewaySettings />;
            case 'layout': return <LayoutSettings />;
            default: return null;
        }
    };

    return (
        <div className="p-6 animate-fade-in space-y-6">
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Seções de Configurações">
                    {Object.keys(tabNames).map(tabKey => (
                        <button key={tabKey} onClick={() => setActiveTab(tabKey)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 rounded-t-sm ${activeTab === tabKey ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            {tabNames[tabKey]}
                        </button>
                    ))}
                </nav>
            </div>
            {renderActiveTabContent()}
            <div className="flex justify-end mt-6">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors">Salvar Alterações</button>
            </div>
        </div>
    );
};
const AIContentModal: React.FC<AIContentModalProps> = ({ isOpen, onClose, onGenerate, isGenerating, generatedContent, onUseContent, context }) => {
    if (!isOpen) return null;

    const [objective, setObjective] = useState('');

    const handleGenerateClick = () => {
      onGenerate(objective);
    };

    const isError = generatedContent && 'error' in generatedContent;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-modal-title"
        >
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 id="ai-modal-title" className="text-xl font-bold font-heading text-gray-800">Assistente de Conteúdo IA</h3>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Fechar modal">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6"/>
                  </button>
                </div>
                <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">Descreva o objetivo do conteúdo:</label>
                <textarea
                    id="objective"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder={context.promptType === 'email' ? "Ex: Promover a campanha de Black Friday com taxa zero para novas vaquinhas." : "Ex: Anunciar um novo cupom de 10% de desconto."}
                    className="p-2 border rounded-md w-full h-24 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Objetivo do conteúdo"
                />
                <button
                    onClick={handleGenerateClick}
                    disabled={isGenerating || !objective}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 w-full disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                    {isGenerating ? <><Spinner/> Gerando...</> : <><Icon path={ICONS.ai} className="w-5 h-5 mr-2"/> Gerar Conteúdo</>}
                </button>

                {generatedContent && !isError && (
                    <div className="mt-6 border-t pt-4 space-y-4 animate-fade-in">
                        <div>
                            <h4 className="font-semibold text-gray-700">{context.promptType === 'email' ? 'Assunto Sugerido' : 'Título Sugerido'}</h4>
                            <p className="text-sm text-gray-800 bg-gray-100 p-3 rounded-md mt-1 font-medium">
                                {('subject' in generatedContent && generatedContent.subject) || ('title' in generatedContent && generatedContent.title)}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700">{context.promptType === 'email' ? 'Corpo do E-mail Sugerido' : 'Mensagem Sugerida'}</h4>
                            <p className="text-sm text-gray-800 bg-gray-100 p-3 rounded-md mt-1 whitespace-pre-wrap h-48 overflow-y-auto">
                                {('body' in generatedContent && generatedContent.body) || ('message' in generatedContent && generatedContent.message)}
                            </p>
                        </div>
                        <button onClick={onUseContent} className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 w-full transition-colors">
                            Usar este conteúdo
                        </button>
                    </div>
                )}
                {isError && (
                    <div className="mt-6 border-t pt-4 text-red-600 bg-red-50 p-3 rounded-md">
                        <p><span className="font-bold">Erro:</span> {generatedContent.error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface NavLinkProps {
    item: { id: PageName, label: string, icon: string };
    isActive: boolean;
    onClick: (id: PageName) => void;
}
const NavLink: React.FC<NavLinkProps> = ({ item, isActive, onClick }) => (
    <button
        onClick={() => onClick(item.id)}
        className={`flex items-center w-full px-4 py-2 text-sm rounded-md transition-colors ${
            isActive 
            ? 'bg-indigo-600 text-white font-semibold' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
        <Icon path={item.icon} className="w-5 h-5 mr-3"/>
        {item.label}
    </button>
);

const Sidebar = ({ activePage, onNavigate, onLogout }: { activePage: PageName, onNavigate: (page: PageName) => void, onLogout: () => void }) => {
    const navItems: { id: PageName, label: string, icon: string }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
        { id: 'users', label: 'Usuários', icon: ICONS.users },
        { id: 'vaquinhas', label: 'Vaquinhas', icon: ICONS.vaquinhas },
        { id: 'finance', label: 'Financeiro', icon: ICONS.finance },
        { id: 'marketing', label: 'Marketing', icon: ICONS.marketing },
        { id: 'support', label: 'Suporte', icon: ICONS.support },
    ];

    const settingsItems: { id: PageName, label: string, icon: string }[] = [
        { id: 'settings', label: 'Configurações', icon: ICONS.settings },
    ];
    
    return (
        <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col min-h-screen flex-shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <h1 className="text-xl font-bold font-heading text-white">Vakinha Fácil</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => (
                    <NavLink key={item.id} item={item} isActive={activePage === item.id} onClick={onNavigate} />
                ))}
            </nav>
            <div className="px-4 py-6 border-t border-gray-800 space-y-2">
                {settingsItems.map(item => (
                     <NavLink key={item.id} item={item} isActive={activePage === item.id} onClick={onNavigate} />
                ))}
                <button
                    onClick={onLogout} 
                    className="flex items-center w-full px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    <Icon path={ICONS.logout} className="w-5 h-5 mr-3"/> Sair
                </button>
            </div>
        </aside>
    );
};

const Header = ({ title, description }: { title: string, description: string }) => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    <div>
        <h2 className="text-2xl font-bold font-heading text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
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

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subject, onSubjectChange, body, onBodyChange, onGenerate }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">E-mail Marketing</h3>
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800">Criar Novo E-mail</h4>
              <button onClick={() => onGenerate('email')} className="flex items-center text-sm text-indigo-600 font-semibold hover:text-indigo-800">
                <Icon path={ICONS.ai} className="w-4 h-4 mr-1"/> Gerar com IA
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input type="text" placeholder="Assunto do e-mail" className="p-2 border rounded-md w-full col-span-2" value={subject} onChange={onSubjectChange}/>
                <textarea
                    placeholder={`Olá {nome},\n\nEscreva sua mensagem aqui...`}
                    rows={6}
                    className="p-2 border rounded-md w-full col-span-2"
                    value={body}
                    onChange={onBodyChange}
                ></textarea>
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

const PushNotifications: React.FC<PushNotificationsProps> = ({ title, onTitleChange, message, onMessageChange, onGenerate }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Notificações Push</h3>
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800">Criar Nova Notificação</h4>
              <button onClick={() => onGenerate('push')} className="flex items-center text-sm text-indigo-600 font-semibold hover:text-indigo-800">
                  <Icon path={ICONS.ai} className="w-4 h-4 mr-1"/> Gerar com IA
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
                <input type="text" placeholder="Título da notificação" className="p-2 border rounded-md w-full" value={title} onChange={onTitleChange}/>
                <textarea placeholder="Mensagem (até 200 caracteres)" rows={3} className="p-2 border rounded-md w-full" value={message} onChange={onMessageChange}></textarea>
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
    
    // State for AI Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContext, setModalContext] = useState<ModalContext>({ promptType: '' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(null);

    // State for controlled components
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [pushTitle, setPushTitle] = useState("");
    const [pushMessage, setPushMessage] = useState("");

    const handleOpenAIModal = (promptType: 'email' | 'push') => {
        setModalContext({ promptType });
        setGeneratedContent(null);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => setIsModalOpen(false);
    
    const handleGenerateContent = async (objective: string) => {
        setIsGenerating(true);
        setGeneratedContent(null);
    
        if (!objective.trim() || !modalContext.promptType) {
            setGeneratedContent({ error: "O objetivo não pode estar vazio." });
            setIsGenerating(false);
            return;
        }
    
        let systemInstruction: string;
        let userPrompt: string;
        let schema;
    
        const baseSystemInstruction = `Você é um assistente de marketing da "Vakinha Fácil", uma plataforma de arrecadação de fundos em grupo. Crie conteúdo para engajar usuários. O tom deve ser amigável, claro e encorajador.`;
    
        if (modalContext.promptType === 'email') {
            systemInstruction = baseSystemInstruction;
            userPrompt = `Crie um e-mail de marketing com o seguinte objetivo: "${objective}".`;
            schema = {
                type: Type.OBJECT,
                properties: {
                    subject: { type: Type.STRING, description: "Assunto conciso e chamativo para o e-mail." },
                    body: { type: Type.STRING, description: "Corpo do e-mail, usando placeholders como {nome} se apropriado." }
                },
                required: ["subject", "body"]
            };
        } else { // 'push'
            systemInstruction = `${baseSystemInstruction} A mensagem deve ser curta e direta, com no máximo 200 caracteres.`;
            userPrompt = `Crie uma notificação push com o seguinte objetivo: "${objective}".`;
            schema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Título curto e impactante para a notificação push." },
                    message: { type: Type.STRING, description: "Mensagem da notificação, com no máximo 200 caracteres." }
                },
                required: ["title", "message"]
            };
        }
    
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: schema
                }
            });
            
            let textResponse = response.text;
            if (!textResponse) {
                throw new Error("A API retornou uma resposta vazia.");
            }
            
            const jsonMatch = textResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
                textResponse = jsonMatch[1];
            }

            let parsedContent;
            try {
                parsedContent = JSON.parse(textResponse);
            } catch (e) {
                throw new Error("A resposta da IA não é um JSON válido.");
            }
    
            const isEmailContent = modalContext.promptType === 'email' &&
                                   typeof parsedContent === 'object' && parsedContent !== null &&
                                   'subject' in parsedContent && typeof parsedContent.subject === 'string' &&
                                   'body' in parsedContent && typeof parsedContent.body === 'string';
    
            const isPushContent = modalContext.promptType === 'push' &&
                                   typeof parsedContent === 'object' && parsedContent !== null &&
                                   'title' in parsedContent && typeof parsedContent.title === 'string' &&
                                   'message' in parsedContent && typeof parsedContent.message === 'string';
    
            if (!isEmailContent && !isPushContent) {
                throw new Error("A resposta da IA não corresponde ao formato esperado.");
            }
    
            setGeneratedContent(parsedContent);
    
        } catch (error) {
            console.error("Error generating content:", error);
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
            setGeneratedContent({ error: `Falha ao gerar conteúdo: ${errorMessage}. Por favor, tente novamente.` });
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleUseContent = () => {
        if (!generatedContent || 'error' in generatedContent) return;
    
        if (modalContext.promptType === 'email' && 'subject' in generatedContent && 'body' in generatedContent) {
            setEmailSubject(generatedContent.subject);
            setEmailBody(generatedContent.body);
        } else if (modalContext.promptType === 'push' && 'title' in generatedContent && 'message' in generatedContent) {
            setPushTitle(generatedContent.title);
            setPushMessage(generatedContent.message);
        }
        handleCloseModal();
    };

    const tabNames: { [key: string]: string } = {
      campaigns: "Campanhas",
      coupons: "Cupons",
      email: "E-mail Marketing",
      referrals: "Indicações",
      push: "Push",
      reports: "Relatórios",
    };
    
    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'campaigns':
                return <MarketingCampaigns />;
            case 'coupons':
                return <Coupons />;
            case 'email':
                return <EmailMarketing 
                          subject={emailSubject}
                          onSubjectChange={(e) => setEmailSubject(e.target.value)}
                          body={emailBody}
                          onBodyChange={(e) => setEmailBody(e.target.value)}
                          onGenerate={handleOpenAIModal}
                       />;
            case 'referrals':
                return <ReferralProgram />;
            case 'push':
                return <PushNotifications 
                        title={pushTitle}
                        onTitleChange={(e) => setPushTitle(e.target.value)}
                        message={pushMessage}
                        onMessageChange={(e) => setPushMessage(e.target.value)}
                        onGenerate={handleOpenAIModal}
                      />;
            case 'reports':
                return <MarketingReports />;
            default:
                return null;
        }
    };


    return (
        <div className="p-6">
            <AIContentModal 
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onGenerate={handleGenerateContent}
              isGenerating={isGenerating}
              generatedContent={generatedContent}
              onUseContent={handleUseContent}
              context={modalContext}
            />
            
            <div className="mb-6 border-b border-gray-200">
                <nav 
                  role="tablist"
                  className="-mb-px flex space-x-6 overflow-x-auto" 
                  aria-label="Seções de Marketing"
                >
                    {Object.keys(tabNames).map(tabKey => (
                        <button
                            key={tabKey}
                            id={`tab-${tabKey}`}
                            role="tab"
                            aria-selected={activeTab === tabKey}
                            aria-controls={`tabpanel-${tabKey}`}
                            onClick={() => setActiveTab(tabKey)}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 rounded-t-sm ${
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

            <div
              id={`tabpanel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              tabIndex={0}
              className="focus:outline-none"
            >
                {renderActiveTabContent()}
            </div>
        </div>
    );
};

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
    const [activeTab, setActiveTab] = useState('user');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would have validation and an API call here.
        onLogin();
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md animate-fade-in">
                <div className="text-center">
                    <h1 className="text-3xl font-bold font-heading text-gray-900">Vakinha Fácil</h1>
                    <p className="mt-2 text-sm text-gray-600">Acesse sua conta para continuar</p>
                </div>

                <div className="flex border-b border-gray-200">
                    <button onClick={() => setActiveTab('user')} className={`flex-1 py-2 text-sm font-semibold text-center transition-colors ${activeTab === 'user' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Acesso Usuário
                    </button>
                     <button onClick={() => setActiveTab('admin')} className={`flex-1 py-2 text-sm font-semibold text-center transition-colors ${activeTab === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Acesso Admin
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleLoginSubmit}>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <input id="email" name="email" type="email" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="voce@example.com" />
                    </div>
                    <div>
                        <label htmlFor="password"className="text-sm font-medium text-gray-700">Senha</label>
                        <input id="password" name="password" type="password" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Sua senha" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Lembrar-me</label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Esqueceu a senha?</a>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<PageName>('dashboard');

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const PAGES: Record<PageName, { title: string, description: string, component: React.ReactElement }> = {
      dashboard: {
          title: "Dashboard",
          description: "Visão geral da plataforma e estatísticas chave.",
          component: <DashboardPage />,
      },
      users: {
          title: "Gestão de Usuários",
          description: "Visualize, adicione e gerencie todos os usuários da plataforma.",
          component: <UsersPage />,
      },
      vaquinhas: {
          title: "Gestão de Vaquinhas",
          description: "Monitore, approve e gerencie todas as vaquinhas ativas e encerradas.",
          component: <VaquinhasPage />,
      },
      finance: {
          title: "Financeiro",
          description: "Acompanhe transações, gerencie saques e configure taxas.",
          component: <FinancePage />,
      },
      marketing: {
          title: "Marketing & Engajamento",
          description: "Gerencie campanhas, cupons e notificações para impulsionar o crescimento.",
          component: <MarketingPage />,
      },
      support: {
          title: "Suporte e Atendimento",
          description: "Responda a tickets de suporte e gerencie a base de conhecimento.",
          component: <SupportPage />,
      },
      settings: {
          title: "Configurações",
          description: "Ajuste as configurações gerais, segurança e integrações da plataforma.",
          component: <SettingsPage />,
      }
  };

  const currentPage = PAGES[activePage];

  if (!isAuthenticated) {
      return <LoginPage onLogin={handleLogin} />;
  }

  return (
      <div className="flex bg-gray-100 font-sans min-h-screen">
          <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />
          <main className="flex-1">
              <Header title={currentPage.title} description={currentPage.description} />
              {currentPage.component}
          </main>
      </div>
  );
}

export default App;