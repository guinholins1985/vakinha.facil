import React, { useState, ReactNode, FC } from 'react';

// --- Ícones SVG ---
const DashboardIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const SettingsIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ApiIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const GatewayIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const EmailIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const BannersIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const CustomizeIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20v-6m0 0V4m0 6h10m-10 0H0" /></svg>;
const UsersIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 016 2.803M15 21a9 9 0 00-9-5.197" /></svg>;
const WalletIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const AffiliateIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const DepositIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const WithdrawIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const CategoryIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>;
const ProviderIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0118 18c-5 .5-9 .5-11.657-.157" /></svg>;
const GamesIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a4 4 0 100 8 4 4 0 000-8z" /></svg>;
const HistoryIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChevronDownIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const SearchIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const BellIcon: FC<{ className?: string }> = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const VaquinhaIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06z" /></svg>;
const RifaIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a2 2 0 002-2H10a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>;
const CouponIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const AdminIcon: FC<{ className?: string }> = ({ className = "w-16 h-16 mx-auto text-indigo-500 mb-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const ManagerIcon: FC<{ className?: string }> = ({ className = "w-16 h-16 mx-auto text-indigo-500 mb-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h5m-5 4h5" /></svg>;
const UserIcon: FC<{ className?: string }> = ({ className = "w-16 h-16 mx-auto text-indigo-500 mb-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;


// --- Mock Data ---
const usersData = [
    { name: "so4853388@gmail.com", email: "so4853388@gmail.com", balance: "50.00", date: "Jun 9, 2025 00:00:00" },
    { name: "kleiberlopesmb@gmail.com", email: "kleiberlopesmb@gmail.com", balance: "50.00", date: "Jun 9, 2025 01:28:20" },
];
const templatesData = [
    { title: "Tigre Imperial", concept: "Clássico com tigres dourados e lanternas vermelhas.", colors: "Vermelho, Dourado, Preto", icon: "🐅" },
    { title: "Dragão Ascendente", concept: "Neon futurista com dragões cibernéticos.", colors: "Roxo, Ciano, Preto", icon: "🐉" },
];

// --- Page Components ---
const ControlPanelPage = () => <div><h1 className="text-2xl font-semibold">Painel de Controle</h1></div>;
const SettingsPage = () => <div><h1 className="text-2xl font-semibold">Configurações</h1></div>;
const ApiGamesPage = () => <div><h1 className="text-2xl font-semibold">API de Jogos</h1></div>;
const CouponsPage = () => <div><h1 className="text-2xl font-semibold">Cupons de Desconto</h1></div>;
const VaquinhasPage = () => <div><h1 className="text-2xl font-semibold">Gerenciar Vaquinhas</h1></div>;
const RifasPage = () => <div><h1 className="text-2xl font-semibold">Gerenciar Rifas</h1></div>;
const UsersPage = () => <div><h1 className="text-2xl font-semibold">Usuários</h1></div>;

const FortunaFelizGame = () => {
    const symbols = ['🍊', '💰', '🧧', '🐯', '🎁'];
    const [balance, setBalance] = useState(9750.00);
    const [bet, setBet] = useState(2.50);
    const [reels, setReels] = useState<string[][]>([
        ['🍊', '💰', '🧧'], ['🐯', '🎁', '🍊'], ['💰', '🍊', '🎁'],
        ['🧧', '🐯', '🍊'], ['🍊', '💰', '🧧'],
    ]);
    const [spinning, setSpinning] = useState(false);
    const [message, setMessage] = useState('Bem-vindo ao Fortuna Feliz!');
    const [freeSpins, setFreeSpins] = useState(0);

    const spinReels = () => {
        if (spinning) return;
        if (balance < bet && freeSpins === 0) {
            setMessage("Saldo insuficiente.");
            return;
        }
        setSpinning(true);
        if (freeSpins > 0) {
            setFreeSpins(prev => prev - 1);
        } else {
            setBalance(prev => prev - bet);
        }
        const spinInterval = setInterval(() => {
            setReels(reels.map(reel => reel.map(() => symbols[Math.floor(Math.random() * symbols.length)])));
        }, 100);
        setTimeout(() => {
            clearInterval(spinInterval);
            const finalReels = reels.map(reel => reel.map(() => symbols[Math.floor(Math.random() * symbols.length)]));
            setReels(finalReels);
            // Calculation logic would go here
            setMessage("Você ganhou R$ 125,00!");
            setBalance(prev => prev + 125);
            setSpinning(false);
        }, 2000);
    };
    
    return (
        <div className="bg-gradient-to-b from-red-800 to-red-900 p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto border-4 border-yellow-400">
            <h1 className="text-4xl font-bold text-yellow-300 text-center mb-4">Fortuna Feliz</h1>
            <div className="flex justify-between items-center text-white font-semibold mb-4 bg-black/30 p-4 rounded-xl">
                <div>Saldo: R$ {balance.toFixed(2)}</div>
                <div>Rodadas Grátis: {freeSpins}</div>
                <div>Aposta: R$ {bet.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-5 gap-4 p-4 bg-red-900/50 rounded-lg">
                {reels.map((reel, reelIndex) => (
                    <div key={reelIndex} className="overflow-hidden h-60 bg-red-200/10 rounded-lg">
                        <div className={`flex flex-col transition-transform duration-500 ease-in-out ${spinning ? 'animate-spin-slow' : ''}`}>
                           {reel.map((symbol, symbolIndex) => (
                               <div key={symbolIndex} className="flex-shrink-0 h-20 flex items-center justify-center text-5xl">{symbol}</div>
                           ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 p-2 text-center bg-black/40 rounded-lg"><p className="text-yellow-300">{message}</p></div>
            <div className="mt-4 flex justify-center items-center space-x-4">
                <button onClick={() => setBet(b => Math.max(0.5, b - 0.5))} disabled={spinning} className="px-4 py-2 font-bold text-white bg-yellow-600 rounded-full">-</button>
                <button onClick={spinReels} disabled={spinning} className="px-8 py-4 text-xl font-bold text-red-900 bg-yellow-400 rounded-full">{spinning ? '...' : 'GIRAR'}</button>
                <button onClick={() => setBet(b => Math.min(250, b + 0.5))} disabled={spinning} className="px-4 py-2 font-bold text-white bg-yellow-600 rounded-full">+</button>
            </div>
        </div>
    );
};

const GestaoSlotsPage = () => {
    const [activeTab, setActiveTab] = useState('Jogar Jogo');
    const tabs = ['Jogar Jogo', 'Visão Geral & Templates', 'Gestão de Slots', 'Gestão de Reservas', 'Relatórios & Análises', 'Configurações & Automação'];
    return (
        <div>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                         <button key={tab} onClick={() => setActiveTab(tab)} className={`${ activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} py-4 px-1 border-b-2 font-medium text-sm`}>{tab}</button>
                    ))}
                </nav>
            </div>
            {activeTab === 'Jogar Jogo' && <FortunaFelizGame />}
            {activeTab === 'Visão Geral & Templates' && <div>Templates...</div>}
        </div>
    )
}

type Role = 'admin' | 'manager' | 'user';

const PortalPage: FC<{ onSelectRole: (role: Role) => void }> = ({ onSelectRole }) => (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 animate-fade-in">
        <h1 className="text-5xl font-extrabold text-indigo-600 font-heading mb-4">BETBEZZ</h1>
        <p className="text-gray-600 text-lg mb-12">Portal de Acesso</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform">
                <AdminIcon />
                <h2 className="text-2xl font-bold font-heading text-gray-800 mb-2">Administrador</h2>
                <p className="text-gray-500 mb-6">Controle total da plataforma, configurações e usuários.</p>
                <button onClick={() => onSelectRole('admin')} className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Entrar</button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform">
                <ManagerIcon />
                <h2 className="text-2xl font-bold font-heading text-gray-800 mb-2">Gestor de Conteúdo</h2>
                <p className="text-gray-500 mb-6">Gerencie Vaquinhas, Rifas e Slots.</p>
                <button onClick={() => onSelectRole('manager')} className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Entrar</button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform">
                <UserIcon />
                <h2 className="text-2xl font-bold font-heading text-gray-800 mb-2">Usuário</h2>
                <p className="text-gray-500 mb-6">Acesse os jogos e funcionalidades da plataforma.</p>
                <button onClick={() => onSelectRole('user')} className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Entrar</button>
            </div>
        </div>
    </div>
);

const LoginPage: FC<{ role: Role, onLoginSuccess: (role: Role) => void, onBack: () => void }> = ({ role, onLoginSuccess, onBack }) => (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">Login de {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
            <form onSubmit={(e) => { e.preventDefault(); onLoginSuccess(role); }}>
                <input className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3" type="email" placeholder="Email" defaultValue={`${role}@betbezz.com`} />
                <input className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3" type="password" placeholder="Senha" defaultValue="password" />
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="submit">Entrar</button>
                <button onClick={onBack} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mt-2" type="button">Voltar</button>
            </form>
        </div>
    </div>
);

const UserView: FC<{ onLogout: () => void }> = ({ onLogout }) => (
    <div className="min-h-screen bg-gray-900 text-white">
         <header className="bg-gray-800 p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-yellow-300">Fortuna Feliz</h1>
            <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
                <LogoutIcon className="w-5 h-5 mr-2"/> Sair
            </button>
        </header>
        <main className="p-4"><FortunaFelizGame /></main>
    </div>
);

const App = () => {
    const [user, setUser] = useState<{ role: Role | null }>({ role: null });
    const [loginTarget, setLoginTarget] = useState<Role | null>(null);

    const handleLoginSuccess = (role: Role) => setUser({ role });
    const handleLogout = () => setUser({ role: null });
    
    if (!user.role) {
        if (loginTarget) {
            return <LoginPage role={loginTarget} onLoginSuccess={handleLoginSuccess} onBack={() => setLoginTarget(null)} />;
        }
        return <PortalPage onSelectRole={(role) => setLoginTarget(role)} />;
    }

    switch (user.role) {
        case 'admin': return <AdminDashboard onLogout={handleLogout} />;
        case 'manager': return <ManagerDashboard onLogout={handleLogout} />;
        case 'user': return <UserView onLogout={handleLogout} />;
        default: return <PortalPage onSelectRole={(role) => setLoginTarget(role)} />;
    }
};

const AdminDashboard: FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeMenu, setActiveMenu] = useState('Painel de Controle');
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

    const renderContent = () => {
        const currentSelection = activeSubMenu || activeMenu;
        switch (currentSelection) {
            case 'Painel de Controle': return <ControlPanelPage />;
            case 'Vaquinhas': return <VaquinhasPage />;
            case 'Rifas': return <RifasPage />;
            case 'Configurações': return <SettingsPage />;
            case 'API de jogos': return <ApiGamesPage />;
            case 'Cupons de Desconto': return <CouponsPage />;
            case 'Usuários': return <UsersPage />;
            case 'Gestão de Slots': return <GestaoSlotsPage />;
            default: return <div><h1 className="text-2xl">{currentSelection}</h1></div>;
        }
    };

    const navItems = [
        { name: 'Painel de Controle', icon: <DashboardIcon /> },
        { name: 'Configurações', icon: <SettingsIcon /> },
        { name: 'API de jogos', icon: <ApiIcon /> },
        { name: 'Gateway de Pagamentos', icon: <GatewayIcon /> },
        { name: 'Definições de Email', icon: <EmailIcon /> },
        { name: 'Customização', icon: <CustomizeIcon /> },
    ];
    const marketingItems = [ { name: 'Banners', icon: <BannersIcon /> }, { name: 'Cupons de Desconto', icon: <CouponIcon /> } ];
    const adminItems = [ { name: 'Usuários', icon: <UsersIcon /> }, { name: 'Carteiras', icon: <WalletIcon /> }, { name: 'Saques de Afiliados', icon: <AffiliateIcon /> }, { name: 'Depositos', icon: <DepositIcon /> }, { name: 'Saques', icon: <WithdrawIcon /> }, ];
    const gameItems = [ { name: 'Gestão de Slots', icon: <GamesIcon /> }, { name: 'Todas as Categorias', icon: <CategoryIcon /> }, { name: 'Todos os Provedores', icon: <ProviderIcon /> }, { name: 'Histórico de Partidas', icon: <HistoryIcon /> }, ];

    return (
        <DashboardLayout onLogout={onLogout} activeMenu={activeMenu} setActiveMenu={setActiveMenu} activeSubMenu={activeSubMenu} setActiveSubMenu={setActiveSubMenu}>
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map(item => <NavItem key={item.name} icon={item.icon} label={item.name} isActive={activeMenu === item.name && !activeSubMenu} onClick={() => { setActiveMenu(item.name); setActiveSubMenu(null); }} />)}
                <CollapsibleNavItem label="Marketing" isOpen={true} toggleOpen={()=>{}}>
                    {marketingItems.map(item => <SubNavItem key={item.name} icon={item.icon} label={item.name} isActive={activeSubMenu === item.name} onClick={() => { setActiveMenu('Marketing'); setActiveSubMenu(item.name); }} />)}
                </CollapsibleNavItem>
                <CollapsibleNavItem label="Administração" isOpen={true} toggleOpen={()=>{}}>
                    {adminItems.map(item => <SubNavItem key={item.name} icon={item.icon} label={item.name} isActive={activeSubMenu === item.name} onClick={() => { setActiveMenu('Administração'); setActiveSubMenu(item.name); }} />)}
                </CollapsibleNavItem>
                <CollapsibleNavItem label="Gestão de Jogos" isOpen={true} toggleOpen={()=>{}}>
                     {gameItems.map(item => <SubNavItem key={item.name} icon={item.icon} label={item.name} isActive={activeSubMenu === item.name} onClick={() => { setActiveMenu('Gestão de Jogos'); setActiveSubMenu(item.name); }} />)}
                </CollapsibleNavItem>
            </nav>
            {renderContent()}
        </DashboardLayout>
    );
};

const ManagerDashboard: FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeMenu, setActiveMenu] = useState('Gestão de Slots');
    const renderContent = () => {
        switch (activeMenu) {
            case 'Vaquinhas': return <VaquinhasPage />;
            case 'Rifas': return <RifasPage />;
            case 'Gestão de Slots': return <GestaoSlotsPage />;
            default: return <div><h1 className="text-2xl">{activeMenu}</h1></div>;
        }
    };
    
    const navItems = [
        { name: 'Vaquinhas', icon: <VaquinhaIcon /> },
        { name: 'Rifas', icon: <RifaIcon /> },
        { name: 'Gestão de Slots', icon: <GamesIcon /> },
    ];

    return (
        <DashboardLayout onLogout={onLogout} activeMenu={activeMenu} setActiveMenu={setActiveMenu} activeSubMenu={null} setActiveSubMenu={() => {}}>
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map(item => <NavItem key={item.name} icon={item.icon} label={item.name} isActive={activeMenu === item.name} onClick={() => setActiveMenu(item.name)} />)}
            </nav>
            {renderContent()}
        </DashboardLayout>
    );
};

type DashboardLayoutProps = {
    children: ReactNode[];
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
    activeSubMenu: string | null;
    setActiveSubMenu: (subMenu: string | null) => void;
    onLogout: () => void;
};
const DashboardLayout: FC<DashboardLayoutProps> = ({ children, onLogout }) => {
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const nav = children[0];
    const content = children[1];

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white flex flex-col shadow-lg">
                <div className="h-16 flex items-center justify-center border-b"><h1 className="text-2xl font-bold text-indigo-600">BETBEZZ</h1></div>
                {nav}
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white shadow-md flex items-center justify-between px-6">
                    <div className="relative"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Pesquisar" className="pl-10 pr-4 py-2 w-full max-w-xs border rounded-full" /></div>
                    <div className="flex items-center space-x-4">
                        <BellIcon className="text-gray-500" />
                        <div className="relative">
                           <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="w-10 h-10 bg-indigo-600 text-white rounded-full font-bold">A</button>
                           {isProfileMenuOpen && (
                               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
                                   <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"><LogoutIcon className="w-5 h-5 mr-2" />Sair</button>
                               </div>
                           )}
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">{content}</main>
            </div>
        </div>
    );
};

type NavItemProps = { icon: ReactNode; label: string; isActive: boolean; onClick: () => void; };
const NavItem: FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
        {icon}<span className="ml-3">{label}</span>
    </button>
);

type SubNavItemProps = { icon: ReactNode; label: string; isActive: boolean; onClick: () => void; };
const SubNavItem: FC<SubNavItemProps> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center pl-11 pr-4 py-2.5 text-sm font-medium rounded-md ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
         {icon}<span className="ml-3">{label}</span>
    </button>
);

type CollapsibleNavItemProps = { label: string; isOpen: boolean; toggleOpen: () => void; children: ReactNode; };
const CollapsibleNavItem: FC<CollapsibleNavItemProps> = ({ label, isOpen, toggleOpen, children }) => (
    <div>
        <button onClick={toggleOpen} className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100">
            <span>{label}</span><ChevronDownIcon className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && <div className="mt-1 space-y-1">{children}</div>}
    </div>
);

export default App;