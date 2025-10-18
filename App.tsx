import React, { useState, FC, ReactNode, ChangeEvent, FormEvent, useEffect, useCallback, useRef } from 'react';

// --- Ícones SVG ---
const DashboardIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const SettingsIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const GatewayIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const EmailIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const BannersIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const CustomizeIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2v10m0-10h4m-4 0H8m4 10h4m-4 0H8m4-14a2 2 0 100-4 2 2 0 000 4zm0 14a2 2 0 100-4 2 2 0 000 4z" /></svg>;
const UsersIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 016 2.803M15 21a9 9 0 00-9-5.197" /></svg>;
const WalletIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const DepositIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const WithdrawIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8v1a3 3 0 003 3h10a3 3 0 003-3V8m-4 8l-4-4m0 0l-4 4m4-4v8" /></svg>;
const ChevronDownIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const ChevronRightIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
const LogoutIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const XIcon: FC<{ className?: string }> = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const PencilIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const TrashIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const SearchIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const UpArrowIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const DownArrowIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
const SpinnerIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
const VaquinhaIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 4h-2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2zM7 9V7a2 2 0 012-2h2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13H9m6 0a2 2 0 012 2v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2a2 2 0 012-2h6z" /></svg>;
const RifaIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" /></svg>;
const CouponIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12L3 8m4 8l4-8m-4 8H3m4 0h4m9 4v-4m0 4h4m0-4h-4m0 4L15 8m6 12l-4-8m4 8h-4" /></svg>;
const DetailsIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 7.523 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-7.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const CheckCircleIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const XCircleIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const ArrowLeftIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const GuideIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const MapIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10v-5.5m6 5.5v-5.5m0 0l-6-3m6 3l6-3" /></svg>;
const ClassifiedsIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v18m0-18h10a2 2 0 012 2v5a2 2 0 01-2 2h-1m-1-4l-4 4m0 0l4 4m-4-4h4" /></svg>;

// --- App Structure & Types ---
type Page =
    | 'Painel de Controle' | 'Configurações' | 'Gateway de Pagamentos'
    | 'Definições de Email' | 'Banners' | 'Customização' | 'Usuários' | 'Carteiras'
    | 'Depósitos' | 'Saques'
    | 'Rifa Solidária' | 'Vaquinha Online para Projetos Locais' | 'Cupom de Desconto em Parcerias Locais'
    | 'Guia de Serviços Locais' | 'Mapa Interativo' | 'Classificados Locais';

type NavItem = { name: Page; icon: FC<{ className?: string }> };

// --- Mock Data & Types ---
type User = { id: number; name: string; email: string; saldo: number; data: string; status: 'Ativo' | 'Banido'; influencer: boolean; };
type Wallet = { id: number; usuario: string; saldo: number; saldo_saque: number; bonus: number; saldo_b_rol: number };
type Deposit = { id: string; user: string; valor: number; tipo: 'pix'; status: 'Aprovado' | 'Pendente'; created_at: string; };
type Withdrawal = { id: number; nome: string; valor: number; tipo: 'Telefone'; chave_pix: string; status: 'Aprovado' | 'Pendente' | 'Recusado'; data: string; };

const navItems: { title?: string; items: NavItem[] }[] = [
    { items: [{ name: "Painel de Controle", icon: DashboardIcon }] },
    {
        title: "Utilidades do Dia a Dia",
        items: [
            { name: "Guia de Serviços Locais", icon: GuideIcon },
            { name: "Mapa Interativo", icon: MapIcon },
            { name: "Classificados Locais", icon: ClassifiedsIcon },
        ]
    },
    {
        title: "Rifas, Vaquinhas e Cupoms",
        items: [
            { name: "Vaquinha Online para Projetos Locais", icon: VaquinhaIcon },
            { name: "Rifa Solidária", icon: RifaIcon },
            { name: "Cupom de Desconto em Parcerias Locais", icon: CouponIcon },
            { name: "Banners", icon: BannersIcon },
        ]
    },
    {
        title: "Gestão da Plataforma",
        items: [
            { name: "Usuários", icon: UsersIcon },
            { name: "Carteiras", icon: WalletIcon },
            { name: "Depósitos", icon: DepositIcon },
            { name: "Saques", icon: WithdrawIcon },
            { name: "Configurações", icon: SettingsIcon },
            { name: "Gateway de Pagamentos", icon: GatewayIcon },
            { name: "Definições de Email", icon: EmailIcon },
            { name: "Customização", icon: CustomizeIcon },
        ]
    },
];


// --- Reusable Components ---
const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode; maxWidth?: string }> = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-[95vh] flex flex-col animate-fade-in border border-gray-200`}>
                <header className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h3 className="text-xl font-extrabold text-gray-800 font-heading">{title}</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors" aria-label="Fechar modal">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};

const ConfirmationModal: FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; }> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="text-gray-600 mb-6">{message}</p>
            <footer className="flex justify-end items-center pt-4 space-x-4">
                <Button onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancelar</Button>
                <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">Confirmar</Button>
            </footer>
        </Modal>
    );
};

const ToggleSwitch: FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
);

const Button: FC<{ onClick?: () => void; children: ReactNode; className?: string; type?: 'button' | 'submit' | 'reset'; disabled?: boolean }> = ({ onClick, children, className = '', type = 'button', disabled = false }) => (
    <button type={type} onClick={onClick} disabled={disabled} className={`bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}>
        {children}
    </button>
);

const Input: FC<{ label: string; placeholder?: string; type?: string; value: string | number; onChange: (e: ChangeEvent<HTMLInputElement>) => void; name: string; required?: boolean; className?: string; step?: string }> = ({ label, placeholder, type = 'text', value, onChange, name, required = false, className = '', step }) => (
    <div className={`w-full ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            step={step}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
    </div>
);

const Textarea: FC<{ label: string; placeholder?: string; value: string; onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void; name: string; rows?: number; className?: string }> = ({ label, placeholder, value, onChange, name, rows = 4, className = '' }) => (
    <div className={`w-full ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
    </div>
);


const Select: FC<{ label: string; value: string | number; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; name: string; children: ReactNode; required?: boolean; className?: string }> = ({ label, value, onChange, name, children, required = false, className = '' }) => (
    <div className={`w-full ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
        >
            {children}
        </select>
    </div>
);

const ColorInput: FC<{ label: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; name: string; required?: boolean; className?: string }> = ({ label, value, onChange, name, required = false, className = '' }) => (
    <div className={`w-full ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
            <input
                type="color"
                value={value}
                onChange={onChange}
                name={name}
                className="w-10 h-10 p-1 bg-white border-none cursor-pointer rounded-l-md"
            />
            <input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-3 py-2 border-none focus:outline-none rounded-r-lg"
            />
        </div>
    </div>
);

const getBreadcrumbs = (page: Page, subPage?: string): (string | { name: string, page: Page })[] => {
    if (page === 'Configurações') return ['Configurações', 'Padrão'];
    
    for (const section of navItems) {
        const foundItem = section.items.find(item => item.name === page);
        if (foundItem) {
            const basePath = section.title ? [section.title, { name: page, page: page }] : [{ name: page, page: page }];
            if (subPage) {
                return [...basePath, subPage];
            }
            return basePath;
        }
    }
    return [page];
};

const Breadcrumbs: FC<{ page: Page; subPage?: string; onNavigate: (page: Page) => void; }> = ({ page, subPage, onNavigate }) => {
    const path = getBreadcrumbs(page, subPage);
    return (
        <nav className="flex items-center text-sm text-gray-500 font-medium">
            {path.map((p, index) => (
                <React.Fragment key={index}>
                    {typeof p === 'object' ? (
                         <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(p.page); }} className="hover:text-blue-600 transition-colors">{p.name}</a>
                    ) : (
                        <span className={index === path.length - 1 ? "text-gray-800 font-semibold" : ""}>{p}</span>
                    )}
                   
                    {index < path.length - 1 && <ChevronRightIcon className="mx-1.5 w-4 h-4 text-gray-400" />}
                </React.Fragment>
            ))}
        </nav>
    );
};

const Accordion: FC<{ title: string; subtitle: string; children: ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, subtitle, children, isOpen, onToggle }) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button onClick={onToggle} className="w-full flex justify-between items-center p-5 bg-white hover:bg-gray-50 transition">
            <div>
                <h3 className="text-lg font-bold text-gray-800 text-left">{title}</h3>
                <p className="text-sm text-gray-500 text-left">{subtitle}</p>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 bg-gray-50/50 border-t border-gray-200">
                {children}
            </div>
        </div>
    </div>
);

const ProgressBar: FC<{ value: number; max: number }> = ({ value, max }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

// --- Pages ---
const PlaceholderPage: FC<{ title: string }> = ({ title }) => (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 font-heading">{title}</h1>
        <p className="mt-4 text-gray-600">Funcionalidade para <span className="font-semibold">{title}</span> em desenvolvimento.</p>
    </div>
);

const StatCard: FC<{ title: string; value: string; subtext: string; trend: 'up' | 'down'; icon: ReactNode }> = ({ title, value, subtext, trend, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center transition-all hover:shadow-md hover:-translate-y-1">
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            <div className="flex items-center text-xs text-gray-500 mt-2">
                {trend === 'up' ? <UpArrowIcon className="text-green-500 mr-1" /> : <DownArrowIcon className="text-red-500 mr-1" />}
                <span>{subtext}</span>
            </div>
        </div>
        <div className="bg-gray-100 p-3 rounded-full">
            {icon}
        </div>
    </div>
);

const DashboardPage = () => (
    <div className="animate-fade-in space-y-8">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-800 font-heading">Painel de Controle</h1>
            <p className="text-gray-500 mt-1">Olá, Admin! Bem-vindo(a) à sua plataforma comunitária.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <StatCard title="Usuários Ativos" value="352" subtext="+12 esta semana" trend="up" icon={<UsersIcon className="text-gray-600" />} />
            <StatCard title="Vaquinhas Ativas" value="5" subtext="R$ 1.250 arrecadados" trend="up" icon={<VaquinhaIcon className="text-gray-600" />} />
            <StatCard title="Rifas em Andamento" value="8" subtext="2.300 bilhetes vendidos" trend="up" icon={<RifaIcon className="text-gray-600" />} />
            <StatCard title="Depósitos" value="R$ 10,00" subtext="Total de Depósitos" trend="up" icon={<DepositIcon className="text-gray-600" />} />
            <StatCard title="Saques" value="R$ 0,00" subtext="Total de saques" trend="up" icon={<WithdrawIcon className="text-gray-600" />} />
            <StatCard title="Saldo dos Usuários" value="R$ 0,00" subtext="Saldo dos usuários" trend="up" icon={<UsersIcon className="text-gray-600" />} />
            <StatCard title="Total Ganhos" value="R$ 170,42" subtext="Ganhos dos usuários" trend="up" icon={<UpArrowIcon className="text-gray-600" />} />
        </div>
    </div>
);

// --- CONFIGURAÇÕES SECTION ---
const ConfiguracoesPage = () => (
    <div className="animate-fade-in">
        <h1 className="text-3xl font-extrabold text-gray-800 font-heading mb-2">Padrão</h1>
        <p className="text-gray-500 mb-8">Ajustes da plataforma</p>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Ajuste Visual</h2>
            <p className="text-gray-500 mb-6">Formulário ajustar o visual da plataforma</p>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input name="name" label="Nome" value="betbezz.online" onChange={() => {}} required />
                    <Input name="description" label="Descrição" value="- Plataforma de Apostas | Slots e Cassino Online |Auto" onChange={() => {}} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input name="favicon" label="Favicon" value="C:\\fakepath\\favicon.ico" onChange={() => {}} />
                    <Input name="logo_white" label="Logo Branca" value="C:\\fakepath\\logo-white.png" onChange={() => {}} />
                    <Input name="logo_dark" label="Logo Escura" value="C:\\fakepath\\logo-dark.png" onChange={() => {}} />
                </div>
                <div className="pt-4 flex justify-start">
                    <Button type="submit">Salvar Informações</Button>
                </div>
            </form>
        </div>
    </div>
);

const GatewayPagamentosPage = () => {
    type Gateway = {
        name: string;
        logo: string;
        isActive: boolean;
        credentials: Record<string, string>;
    };

    const initialGateways: Gateway[] = [
        { name: 'PicPay', logo: 'https://i.imgur.com/kPsvb2D.png', isActive: true, credentials: { client_id: '', client_secret: '' } },
        { name: 'Stripe', logo: 'https://i.imgur.com/22nCUS1.png', isActive: false, credentials: { public_key: '', secret_key: '' } },
        { name: 'Mercado Pago', logo: 'https://i.imgur.com/gGjO32d.png', isActive: true, credentials: { access_token: '' } },
        { name: 'PagSeguro', logo: 'https://i.imgur.com/a4wBfB2.png', isActive: false, credentials: { email: '', token: '' } },
        { name: 'Inter', logo: 'https://i.imgur.com/fplC2bV.png', isActive: false, credentials: {} },
        { name: 'Nubank', logo: 'https://i.imgur.com/l6T8tGj.png', isActive: false, credentials: {} },
        { name: 'SumUp', logo: 'https://i.imgur.com/tYjL9jV.png', isActive: false, credentials: {} },
        { name: 'Ton', logo: 'https://i.imgur.com/c4YnI0j.png', isActive: false, credentials: {} },
    ];

    const [gateways, setGateways] = useState<Gateway[]>(initialGateways);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);

    const handleToggle = (name: string) => {
        setGateways(gateways.map(g => g.name === name ? { ...g, isActive: !g.isActive } : g));
    };

    const handleConfigure = (gateway: Gateway) => {
        setSelectedGateway(gateway);
        setModalOpen(true);
    };

    const handleSaveConfig = () => {
        // Lógica para salvar as credenciais do selectedGateway
        console.log("Salvando configuração para:", selectedGateway);
        setModalOpen(false);
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-800 font-heading mb-2">Gateways de Pagamento</h1>
            <p className="text-gray-500 mb-8">Ative, desative e configure seus gateways de pagamento.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gateways.map((gateway) => (
                    <div key={gateway.name} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col items-start justify-between">
                        <div className="flex justify-between items-start w-full">
                            <img src={gateway.logo} alt={gateway.name} className="h-8 object-contain" />
                            <ToggleSwitch checked={gateway.isActive} onChange={() => handleToggle(gateway.name)} />
                        </div>
                        <div className="mt-4 w-full">
                            <h3 className="font-bold text-lg text-gray-800">{gateway.name}</h3>
                            <button onClick={() => handleConfigure(gateway)} className="mt-3 w-full text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 py-2 rounded-lg transition">
                                Configurar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={`Configurar ${selectedGateway?.name}`}>
                {selectedGateway ? (
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveConfig(); }}>
                        <p className="text-gray-600">Insira as credenciais para o gateway {selectedGateway.name}.</p>
                        {Object.keys(selectedGateway.credentials).length > 0 ? (
                            Object.keys(selectedGateway.credentials).map(key => (
                                <Input key={key} name={key} label={key.replace(/_/g, ' ').toUpperCase()} value={selectedGateway.credentials[key]} onChange={() => {}} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 bg-gray-100 p-4 rounded-lg">Este gateway não requer configuração de credenciais aqui.</p>
                        )}
                        <footer className="flex justify-end items-center pt-4 space-x-4">
                            <Button type="button" onClick={() => setModalOpen(false)} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancelar</Button>
                            <Button type="submit">Salvar</Button>
                        </footer>
                    </form>
                ) : null}
            </Modal>
        </div>
    );
};

const DefinicoesEmailPage = () => (
     <div className="animate-fade-in">
        <h1 className="text-3xl font-extrabold text-gray-800 font-heading mb-8">Configurações de E-mail</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
            <h2 className="text-xl font-bold text-gray-800 mb-1">SMTP</h2>
            <p className="text-gray-500 mb-6">Ajustes de credenciais para o servidor de e-mail.</p>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Input name="mailer" label="Mailer" value="smtp" onChange={() => {}} />
                    <Input name="host" label="Host" value="smtp.hostinger.com" onChange={() => {}} />
                    <Input name="port" label="Porta" value="465" onChange={() => {}} />
                    <Input name="user" label="Usuário" value="suporte@brber7k.bet" onChange={() => {}} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Input name="password" label="Senha" value="Resident4557#" onChange={() => {}} type="password" />
                    <Input name="encryption" label="Encryption" value="Digite a criptografia" onChange={() => {}} />
                    <Input name="email_header" label="E-mail Cabeçalho" value="suporte@brber7k.bet" onChange={() => {}} />
                    <Input name="name_header" label="Nome Cabeçalho" value="BET7K" onChange={() => {}} />
                </div>
                <div className="pt-4 flex justify-start">
                    <Button type="submit">Atualizar dados</Button>
                </div>
            </form>
        </div>
    </div>
);

type Banner = { id: number; image: string; link: string; type: 'home' | 'carousel' };
const initialBanners: Banner[] = [
    { id: 1, image: 'https://i.ibb.co/L5BQNfQ/fortune-snake-banner.png', link: '/games/play/1190/1879752', type: 'home' },
    { id: 2, image: 'https://i.ibb.co/yQjK2P5/zeus-banner.png', link: '/games/play/250/vs20olympgate', type: 'home' },
    { id: 3, image: 'https://i.ibb.co/qN9gXN5/cassino-banner.png', link: '/', type: 'carousel' },
];

const BannersPage = () => {
    const [banners, setBanners] = useState<Banner[]>(initialBanners);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formState, setFormState] = useState<Partial<Banner>>({});

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setFormState(banner);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setEditingBanner(null);
        setFormState({ link: '', image: '', type: 'home' });
        setModalOpen(true);
    };
    
    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingBanner) {
            setBanners(banners.map(b => b.id === editingBanner.id ? { ...b, ...formState } as Banner : b));
        } else {
            const newBanner: Banner = { id: Date.now(), ...formState } as Banner;
            setBanners(prev => [newBanner, ...prev]);
        }
        setModalOpen(false);
    };

    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 font-heading">Banners</h1>
                <Button onClick={handleCreate}>+ Novo Banner</Button>
            </header>
            <main className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4"><input type="checkbox" className="rounded border-gray-300" /></th>
                                <th scope="col" className="px-6 py-3">Imagem</th>
                                <th scope="col" className="px-6 py-3">Link</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map(banner => (
                                <tr key={banner.id} className="bg-white border-b hover:bg-gray-50 align-middle">
                                    <td className="w-4 p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                                    <td className="px-6 py-2"><img src={banner.image} alt={`Banner ${banner.id}`} className="h-10 object-contain rounded" /></td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{banner.link}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${banner.type === 'home' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{banner.type}</span></td>
                                    <td className="px-6 py-4 text-center">
                                         <button onClick={() => handleEdit(banner)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" aria-label={`Editar ${banner.id}`}><PencilIcon /></button>
                                         <button onClick={() => setBanners(banners.filter(b => b.id !== banner.id))} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label={`Excluir ${banner.id}`}><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingBanner ? "Editar Banner" : "Criar Novo Banner"}>
                 <form onSubmit={handleFormSubmit} className="space-y-6">
                    <Input name="image" label="URL da Imagem" value={formState.image || ''} onChange={handleFormChange} required />
                    <Input name="link" label="Link de destino" value={formState.link || ''} onChange={handleFormChange} required />
                    <Select name="type" label="Tipo" value={formState.type || 'home'} onChange={handleFormChange} required>
                        <option value="home">Home</option>
                        <option value="carousel">Carousel</option>
                    </Select>
                    <footer className="flex justify-end items-center pt-4 space-x-4">
                        <Button type="button" onClick={() => setModalOpen(false)} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancelar</Button>
                        <Button type="submit">Salvar Alterações</Button>
                    </footer>
                </form>
            </Modal>
        </div>
    );
};

const CustomizacaoPage = () => {
    const [openAccordion, setOpenAccordion] = useState<string | null>('layout');
    const handleToggle = (id: string) => setOpenAccordion(prev => prev === id ? null : id);
    
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-800 font-heading mb-8">Customização do Layout</h1>
            <div className="space-y-4 max-w-6xl">
                 <Accordion title="Layout Custom" subtitle="Personalize a aparência do seu cassino" isOpen={openAccordion === 'layout'} onToggle={() => handleToggle('layout')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ColorInput label="Cor do topo e botão" name="color_top_button" value="#0071ff" onChange={()=>{}} required />
                        <ColorInput label="Cor da barra do logo" name="color_logo_bar" value="#00004f" onChange={()=>{}} required />
                        <ColorInput label="Cor do icone do presente" name="color_gift_icon" value="#0071ff" onChange={()=>{}} required />
                        <ColorInput label="Cor do menu lateral" name="color_sidebar_menu" value="#020d2b" onChange={()=>{}} required />
                        <ColorInput label="Cor de fundo do cassino" name="color_casino_bg" value="#020d2b" onChange={()=>{}} required />
                        <ColorInput label="Cor de fundo do icone" name="color_icon_bg" value="#04274a" onChange={()=>{}} required />
                        <Input label="Link do Facebook" name="link_facebook" value="https://facebook.com/" onChange={()=>{}} />
                        <Input label="Link do Telegram" name="link_telegram" value="https://t.me/" onChange={()=>{}} />
                    </div>
                </Accordion>
                 <Accordion title="Sidebar & Navbar & Footer" subtitle="Personalize a aparência do seu site, conferindo-lhe uma identidade única." isOpen={openAccordion === 'nav'} onToggle={() => handleToggle('nav')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ColorInput label="Sidebar" name="color_sidebar" value="#e8e8e8" onChange={()=>{}} required />
                        <ColorInput label="Sidebar (Dark)" name="color_sidebar_dark" value="#24262B" onChange={()=>{}} required />
                        <ColorInput label="Navtop" name="color_navtop" value="#bdbdbd" onChange={()=>{}} required />
                        <ColorInput label="Navtop (Dark)" name="color_navtop_dark" value="#1E2024" onChange={()=>{}} required />
                    </div>
                </Accordion>
                <Accordion title="Customização no Código HTML BASE" subtitle="Customize seu CSS, JS, ou adicione conteúdo no corpo da sua página" isOpen={openAccordion === 'code'} onToggle={() => handleToggle('code')}>
                     <div className="space-y-6">
                        <Textarea name="custom_css" label="Customização do CSS" value=".clear-button { all: revert; }" onChange={()=>{}} rows={6} />
                        <Textarea name="custom_js" label="Customização do JS" value="" onChange={()=>{}} rows={6} />
                    </div>
                </Accordion>
            </div>
             <div className="pt-6 flex justify-start">
                <Button type="submit">Atualizar dados</Button>
            </div>
        </div>
    );
};

// --- ARRECADAÇÃO & MARKETING ---
type Vaquinha = { id: number; title: string; description: string; goal: number; current: number; status: 'Ativa' | 'Finalizada' | 'Pendente'; creator: string; endDate: string; };
const VaquinhasPage = () => {
    const [vaquinhas, setVaquinhas] = useState<Vaquinha[]>([
        { id: 1, title: 'Ajuda para o Abrigo de Animais', description: 'Arrecadação para comprar ração e medicamentos para os animais do abrigo local.', goal: 5000, current: 3750, status: 'Ativa', creator: 'Ana Silva', endDate: '2024-08-30' },
        { id: 2, title: 'Campanha do Agasalho 2024', description: 'Vamos ajudar a aquecer o inverno de quem mais precisa com doações de agasalhos e cobertores.', goal: 2000, current: 2000, status: 'Finalizada', creator: 'Carlos Souza', endDate: '2024-06-15' },
    ]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingVaquinha, setEditingVaquinha] = useState<Vaquinha | null>(null);
    const [formState, setFormState] = useState<Partial<Vaquinha>>({});
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleCreate = () => {
        setEditingVaquinha(null);
        setFormState({ title: '', description: '', goal: 0, creator: '', endDate: '', status: 'Pendente' });
        setModalOpen(true);
    };

    const handleEdit = (vaquinha: Vaquinha) => {
        setEditingVaquinha(vaquinha);
        setFormState(vaquinha);
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDeletingId(id);
        setConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (deletingId) {
            setVaquinhas(vaquinhas.filter(v => v.id !== deletingId));
        }
        setConfirmModalOpen(false);
        setDeletingId(null);
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormState(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingVaquinha) {
            setVaquinhas(vaquinhas.map(v => v.id === editingVaquinha.id ? { ...v, ...formState } as Vaquinha : v));
        } else {
            const newVaquinha: Vaquinha = { id: Date.now(), current: 0, ...formState } as Vaquinha;
            setVaquinhas(prev => [newVaquinha, ...prev]);
        }
        setModalOpen(false);
    };


    return (
         <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 font-heading">Vaquinhas</h1>
                <Button onClick={handleCreate}>+ Nova Vaquinha</Button>
            </header>
            <main className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Título</th>
                                <th scope="col" className="px-6 py-3">Criador</th>
                                <th scope="col" className="px-6 py-3">Meta</th>
                                <th scope="col" className="px-6 py-3">Progresso</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Data Final</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vaquinhas.map(v => (
                                <tr key={v.id} className="bg-white border-b hover:bg-gray-50 align-middle">
                                    <td className="px-6 py-4 font-bold text-gray-800">{v.title}</td>
                                    <td className="px-6 py-4 text-gray-600">{v.creator}</td>
                                    <td className="px-6 py-4 font-semibold">R$ {v.goal.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <ProgressBar value={v.current} max={v.goal} />
                                            <span className="text-xs mt-1 text-gray-500">R$ {v.current.toFixed(2)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${v.status === 'Ativa' ? 'bg-green-100 text-green-800' : v.status === 'Finalizada' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{v.status}</span></td>
                                    <td className="px-6 py-4">{new Date(v.endDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleEdit(v)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><PencilIcon/></button>
                                        <button onClick={() => handleDelete(v.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><TrashIcon/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </main>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingVaquinha ? "Editar Vaquinha" : "Criar Nova Vaquinha"}>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <Input name="title" label="Título" value={formState.title || ''} onChange={handleFormChange} required />
                    <Textarea name="description" label="Descrição" value={formState.description || ''} onChange={handleFormChange} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input name="goal" label="Meta (R$)" type="number" step="0.01" value={formState.goal || ''} onChange={handleFormChange} required />
                        <Input name="creator" label="Criador" value={formState.creator || ''} onChange={handleFormChange} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input name="endDate" label="Data de Encerramento" type="date" value={formState.endDate || ''} onChange={handleFormChange} required />
                        <Select name="status" label="Status" value={formState.status || 'Pendente'} onChange={handleFormChange} required>
                            <option value="Pendente">Pendente</option>
                            <option value="Ativa">Ativa</option>
                            <option value="Finalizada">Finalizada</option>
                        </Select>
                    </div>
                    <footer className="flex justify-end items-center pt-4 space-x-4">
                        <Button type="button" onClick={() => setModalOpen(false)} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </footer>
                </form>
            </Modal>
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={confirmDelete} title="Confirmar Exclusão" message="Tem certeza que deseja excluir esta vaquinha? Esta ação não pode ser desfeita."/>
        </div>
    );
};

type Rifa = { id: number; prize: string; image: string; ticketPrice: number; totalTickets: number; soldTickets: number; status: 'Ativa' | 'Finalizada' | 'Pendente'; drawDate: string; };
const RifasPage = () => {
     const [rifas, setRifas] = useState<Rifa[]>([
        { id: 1, prize: 'iPhone 15 Pro', image: 'https://i.imgur.com/s6nIflL.png', ticketPrice: 10, totalTickets: 200, soldTickets: 150, status: 'Ativa', drawDate: '2024-09-01' },
        { id: 2, prize: 'Viagem para a Praia', image: 'https://i.imgur.com/gS32kcs.png', ticketPrice: 20, totalTickets: 100, soldTickets: 100, status: 'Finalizada', drawDate: '2024-05-20' },
    ]);
    return (
         <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 font-heading">Rifas</h1>
                <Button>+ Nova Rifa</Button>
            </header>
            <main className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Prêmio</th>
                                <th scope="col" className="px-6 py-3">Preço/Bilhete</th>
                                <th scope="col" className="px-6 py-3">Progresso</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Data Sorteio</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rifas.map(r => (
                                <tr key={r.id} className="bg-white border-b hover:bg-gray-50 align-middle">
                                    <td className="px-6 py-4 font-bold text-gray-800 flex items-center space-x-3">
                                        <img src={r.image} alt={r.prize} className="w-12 h-12 object-cover rounded-md" />
                                        <span>{r.prize}</span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">R$ {r.ticketPrice.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <ProgressBar value={r.soldTickets} max={r.totalTickets} />
                                            <span className="text-xs mt-1 text-gray-500">{r.soldTickets} / {r.totalTickets} vendidos</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${r.status === 'Ativa' ? 'bg-green-100 text-green-800' : r.status === 'Finalizada' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status}</span></td>
                                    <td className="px-6 py-4">{new Date(r.drawDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><PencilIcon/></button>
                                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-full"><TrashIcon/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </main>
        </div>
    );
};

type Cupom = { id: number; code: string; type: 'percent' | 'fixed'; value: number; usageLimit: number; usageCount: number; expiryDate: string; };
const CuponsPage = () => {
    const [cupons, setCupons] = useState<Cupom[]>([
        { id: 1, code: 'BEMVINDO10', type: 'percent', value: 10, usageLimit: 100, usageCount: 25, expiryDate: '2024-12-31' },
        { id: 2, code: 'OFF50', type: 'fixed', value: 50, usageLimit: 50, usageCount: 50, expiryDate: '2024-07-31' },
        { id: 3, code: 'EXPIRADO', type: 'fixed', value: 20, usageLimit: 10, usageCount: 5, expiryDate: '2024-01-01' },
    ]);
     const getStatus = (cupom: Cupom): { text: string; className: string } => {
        if (new Date(cupom.expiryDate) < new Date()) return { text: 'Expirado', className: 'bg-red-100 text-red-800' };
        if (cupom.usageCount >= cupom.usageLimit) return { text: 'Esgotado', className: 'bg-yellow-100 text-yellow-800' };
        return { text: 'Ativo', className: 'bg-green-100 text-green-800' };
    };

    return (
         <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 font-heading">Cupons de Desconto</h1>
                <Button>+ Novo Cupom</Button>
            </header>
            <main className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Código</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3">Valor</th>
                                <th scope="col" className="px-6 py-3">Uso</th>
                                <th scope="col" className="px-6 py-3">Validade</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cupons.map(c => {
                                const status = getStatus(c);
                                return (
                                <tr key={c.id} className="bg-white border-b hover:bg-gray-50 align-middle">
                                    <td className="px-6 py-4 font-mono font-bold text-gray-800">{c.code}</td>
                                    <td className="px-6 py-4">{c.type === 'percent' ? 'Porcentagem' : 'Valor Fixo'}</td>
                                    <td className="px-6 py-4 font-semibold">{c.type === 'percent' ? `${c.value}%` : `R$ ${c.value.toFixed(2)}`}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <ProgressBar value={c.usageCount} max={c.usageLimit} />
                                            <span className="text-xs mt-1 text-gray-500">{c.usageCount} / {c.usageLimit} usados</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{new Date(c.expiryDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.className}`}>{status.text}</span></td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><PencilIcon/></button>
                                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-full"><TrashIcon/></button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                 </div>
            </main>
        </div>
    );
};

// --- GESTÃO DE JOGOS SECTION ---

// MOCK DATA
const initialUsers: User[] = [
    { id: 1, name: 'so4853388@gmail.com', email: 'so4853388@gmail.com', saldo: 50.00, data: 'Jun 9, 2025 00:00:00', status: 'Ativo', influencer: false },
    { id: 2, name: 'kleiberlopesmb@gmail.com', email: 'kleiberlopesmb@gmail.com', saldo: 50.00, data: 'Jun 9, 2025 01:28:20', status: 'Ativo', influencer: true },
    { id: 3, name: 'mateus.vasconcllos@gmail.com', email: 'mateus.vasconcllos@gmail.com', saldo: 50.00, data: 'Jun 8, 2025 23:36:11', status: 'Ativo', influencer: false },
    { id: 4, name: 'admin@eu.com', email: 'admin@eu.com', saldo: 0.00, data: 'Mar 30, 2025 00:00:00', status: 'Banido', influencer: false },
];
const initialWallets: Wallet[] = [
    { id: 1, usuario: 'so4853388@gmail.com', saldo: 50, saldo_saque: 0, bonus: 0, saldo_b_rol: 0 },
    { id: 2, usuario: 'kleiberlopesmb@gmail.com', saldo: 50, saldo_saque: 0, bonus: 0, saldo_b_rol: 50 },
];
const initialDeposits: Deposit[] = [
    { id: 'ed9bea5017480596faca086a9bd8b', user: 'eunidiopereirasilva@gmail.com', valor: 10, tipo: 'pix', status: 'Aprovado', created_at: 'Jun 8, 2025 21:20:24' },
    { id: '5cb2cf151124f46aa978cdcab0b9b0d', user: 'leons_ramos@hotmail.com', valor: 20, tipo: 'pix', status: 'Pendente', created_at: 'Mar 31, 2025 13:06:17' },
];
const initialWithdrawals: Withdrawal[] = [
    { id: 1, nome: 'admin@eu.com', valor: 20.00, tipo: 'Telefone', chave_pix: '45999057184', status: 'Aprovado', data: 'Mar 30, 2025 11:20:27' },
    { id: 2, nome: 'user@example.com', valor: 100.00, tipo: 'Telefone', chave_pix: '11987654321', status: 'Pendente', data: 'Jun 10, 2025 10:00:00' },
];

const CarteirasPage = () => {
    const [wallets, setWallets] = useState<Wallet[]>(initialWallets);
    return(
        <div className="animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-800 font-heading mb-6">Carteiras</h1>
            <main className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Usuário</th>
                                <th scope="col" className="px-6 py-3">Saldo</th>
                                <th scope="col" className="px-6 py-3">Saldo Saque</th>
                                <th scope="col" className="px-6 py-3">Bônus</th>
                                <th scope="col" className="px-6 py-3">Saldo B Rol.</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wallets.map(w => (
                                <tr key={w.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{w.usuario}</td>
                                    <td className="px-6 py-4">R$ {w.saldo.toFixed(2)}</td>
                                    <td className="px-6 py-4">R$ {w.saldo_saque.toFixed(2)}</td>
                                    <td className="px-6 py-4">R$ {w.bonus.toFixed(2)}</td>
                                    <td className="px-6 py-4">R$ {w.saldo_b_rol.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><PencilIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
};
const DepositosPage = () => {
    const [deposits, setDeposits] = useState<Deposit[]>(initialDeposits);
    return(
        <div className="animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-800 font-heading mb-6">Depósitos</h1>
            <main className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID Pag.</th>
                                <th scope="col" className="px-6 py-3">Usuário</th>
                                <th scope="col" className="px-6 py-3">Valor</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deposits.map(d => (
                                <tr key={d.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600 truncate max-w-xs">{d.id}</td>
                                    <td className="px-6 py-4 font-medium">{d.user}</td>
                                    <td className="px-6 py-4 font-semibold">R$ {d.valor.toFixed(2)}</td>
                                    <td className="px-6 py-4">{d.tipo}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${d.status === 'Aprovado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{d.created_at}</td>
                                     <td className="px-6 py-4 text-center">
                                        <button disabled={d.status === 'Aprovado'} className="p-2 text-green-600 hover:bg-green-100 rounded-full disabled:text-gray-300 disabled:hover:bg-transparent"><CheckCircleIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
};
const SaquesPage = () => {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(initialWithdrawals);
    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 font-heading">Saques</h1>
                <Button>+ Novo Saque</Button>
            </header>
            <main className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">Valor</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3">Chave Pix</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.map(w => (
                                <tr key={w.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{w.nome}</td>
                                    <td className="px-6 py-4 font-semibold">R$ {w.valor.toFixed(2)}</td>
                                    <td className="px-6 py-4">{w.tipo}</td>
                                    <td className="px-6 py-4">{w.chave_pix}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${w.status === 'Aprovado' ? 'bg-green-100 text-green-800' : w.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                            {w.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{w.data}</td>
                                    <td className="px-6 py-4 text-center">
                                         {w.status === 'Pendente' && (
                                            <div className="flex justify-center space-x-2">
                                                <button className="p-2 text-green-600 hover:bg-green-100 rounded-full"><CheckCircleIcon /></button>
                                                <button className="p-2 text-red-600 hover:bg-red-100 rounded-full"><XCircleIcon /></button>
                                            </div>
                                         )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

const UsuariosPage = ({ onNavigateToUser }: { onNavigateToUser: (user: User) => void }) => {
    const [users] = useState<User[]>(initialUsers);
    return(
        <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 font-heading">Usuários</h1>
                <Button>+ Novo Usuário</Button>
            </header>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <StatCard title="Total Usuários" value="7" subtext="" trend="up" icon={<UsersIcon className="text-gray-600"/>} />
                 <StatCard title="Novos na Semana" value="2" subtext="" trend="up" icon={<UsersIcon className="text-gray-600"/>} />
                 <StatCard title="Novos no Mês" value="5" subtext="" trend="down" icon={<UsersIcon className="text-gray-600"/>} />
            </div>
            <main className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Saldo</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                         <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">R$ {user.saldo.toFixed(2)}</td>
                                    <td className="px-6 py-4">{user.data}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => onNavigateToUser(user)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full flex items-center space-x-2 text-sm">
                                            <DetailsIcon />
                                            <span>Detalhes</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

const UserDetailPage = ({ user, onBack }: { user: User; onBack: () => void; }) => {
    const [formData, setFormData] = useState<User>(user);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleToggle = (field: 'status' | 'influencer', checked: boolean) => {
        if (field === 'status') {
            setFormData(prev => ({ ...prev, status: checked ? 'Ativo' : 'Banido' }));
        } else {
            setFormData(prev => ({ ...prev, influencer: checked }));
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);
        console.log("Salvando dados do usuário:", formData);
        // Simula chamada de API
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2500);
            // Em um app real, aqui você chamaria uma função via props
            // para atualizar a lista de usuários no componente pai.
        }, 1500);
    };

    return(
        <div className="animate-fade-in">
             <button onClick={onBack} className="flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeftIcon />
                <span>Voltar para Usuários</span>
            </button>
            <h1 className="text-3xl font-extrabold text-gray-800 font-heading">Editar Usuário</h1>
            <p className="text-gray-500 mb-8">Gerencie as informações de {user.email}</p>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input name="name" label="Nome" value={formData.name} onChange={handleChange} />
                        <Input name="email" label="Email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="flex items-center space-x-8 pt-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <ToggleSwitch checked={formData.status === 'Ativo'} onChange={(checked) => handleToggle('status', checked)} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Influencer</label>
                            <ToggleSwitch checked={formData.influencer} onChange={(checked) => handleToggle('influencer', checked)} />
                        </div>
                    </div>
                     <div className="pt-4 flex items-center space-x-4">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <SpinnerIcon /> : 'Salvar Alterações'}
                        </Button>
                        <Button type="button" className="bg-red-600 hover:bg-red-700">Excluir Usuário</Button>
                        {saveSuccess && <p className="ml-4 text-green-600 font-semibold animate-fade-in">Usuário salvo com sucesso!</p>}
                    </div>
                </form>
            </div>
        </div>
    )
}

// --- Admin Panel Component ---
const AdminPanel: FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activePage, setActivePage] = useState<Page>('Painel de Controle');
    const [openMenus, setOpenMenus] = useState<string[]>(['Utilidades do Dia a Dia', 'Rifas, Vaquinhas e Cupoms', 'Gestão da Plataforma']);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleMenuToggle = (title: string) => {
        setOpenMenus(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
    };

    const navigateTo = (page: Page) => {
        setActivePage(page);
        setSelectedUser(null);
    }

    const renderContent = () => {
        if (selectedUser) {
            return <UserDetailPage user={selectedUser} onBack={() => setSelectedUser(null)} />
        }
        
        switch (activePage) {
            case 'Painel de Controle': return <DashboardPage />;
            // Utilidades
            case 'Guia de Serviços Locais': return <PlaceholderPage title={activePage} />;
            case 'Mapa Interativo': return <PlaceholderPage title={activePage} />;
            case 'Classificados Locais': return <PlaceholderPage title={activePage} />;
            // Configs & Gestão
            case 'Configurações': return <ConfiguracoesPage />;
            case 'Gateway de Pagamentos': return <GatewayPagamentosPage />;
            case 'Definições de Email': return <DefinicoesEmailPage />;
            case 'Banners': return <BannersPage />;
            case 'Customização': return <CustomizacaoPage />;
            // Arrecadação
            case 'Rifa Solidária': return <RifasPage />;
            case 'Vaquinha Online para Projetos Locais': return <VaquinhasPage />;
            case 'Cupom de Desconto em Parcerias Locais': return <CuponsPage />;
            // Gestão de Usuários
            case 'Usuários': return <UsuariosPage onNavigateToUser={setSelectedUser} />;
            case 'Carteiras': return <CarteirasPage />;
            case 'Depósitos': return <DepositosPage />;
            case 'Saques': return <SaquesPage />;
            default: return <PlaceholderPage title={activePage} />;
        }
    };

    const Sidebar: FC = () => (
        <aside className="w-72 flex-shrink-0 bg-[#0F172A] text-gray-300 flex flex-col">
            <div className="text-center py-6 border-b border-gray-700/50">
                <h1 className="text-3xl font-extrabold text-white tracking-wider font-heading">REDELOCAL</h1>
            </div>
            <nav className="flex-1 px-4 pt-4 space-y-2 overflow-y-auto">
                {navItems.map((section, sectionIndex) => (
                    <div key={section.title || `section-${sectionIndex}`}>
                        {section.title && (
                            <button onClick={() => handleMenuToggle(section.title!)} className="w-full flex justify-between items-center px-2 pt-4 pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                <span>{section.title}</span>
                                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${openMenus.includes(section.title) ? 'rotate-180' : ''}`} />
                            </button>
                        )}
                        <ul className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${section.title && !openMenus.includes(section.title) ? 'max-h-0' : 'max-h-[1000px]'}`}>
                            {section.items.map((item) => (
                                <li key={item.name}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo(item.name); }}
                                        className={`flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activePage === item.name ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-700/50 hover:text-white'}`}>
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="truncate">{item.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );

    const Header: FC = () => (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10 border-b border-gray-200">
            <Breadcrumbs page={activePage} subPage={selectedUser?.email} onNavigate={navigateTo} />
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." className="w-full lg:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-lg">A</div>
                    <div className="text-right hidden sm:block">
                        <span className="text-sm font-semibold text-gray-800">Admin</span>
                    </div>
                </div>
                <button onClick={onLogout} className="p-2 text-gray-500 hover:text-red-600" title="Sair">
                    <LogoutIcon />
                </button>
            </div>
        </header>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};


// --- HOME PAGE Component ---
const HomePage: FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
    
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?q=80&w=1964&auto=format&fit=crop",
            alt: "Fundo abstrato com formas geométricas claras",
            title: "O Poder da Ação Coletiva.",
            subtitle: "Conectamos pessoas, ideias e recursos para construir uma comunidade mais forte, solidária e vibrante. Junte-se ao movimento.",
            cta: "Explore as Iniciativas"
        },
        {
            image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop",
            alt: "Pessoas diversas unindo as mãos em um círculo, simbolizando colaboração e união.",
            title: "Transforme Ideias em Realidade.",
            subtitle: "Use nossas ferramentas de vaquinha e rifa para financiar projetos locais e tirar suas ideias do papel com o apoio de todos.",
            cta: "Crie seu Projeto"
        },
        {
            image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=1974&auto=format&fit=crop",
            alt: "Grupo de amigos sorrindo e se divertindo em um evento ao ar livre.",
            title: "Apoie o Comércio Local.",
            subtitle: "Aproveite cupons de desconto exclusivos em estabelecimentos parceiros e ajude a fortalecer a economia da sua região.",
            cta: "Ver Parceiros"
        }
    ];

    const initiativeCategories = navItems.filter(section => section.title && section.title !== 'Gestão da Plataforma');
    const [activeCategory, setActiveCategory] = useState(initiativeCategories[0]?.title || '');
    
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(slideInterval);
    }, [nextSlide]);
    
    const testimonials = [
        { name: 'Ana Silva', role: 'Organizadora de Vaquinha', text: 'A vaquinha para o nosso projeto de revitalização da praça foi um sucesso! Arrecadamos tudo que precisávamos em uma semana.' },
        { name: 'Carlos Pereira', role: 'Ganhador da Rifa', text: 'Comprei um número na rifa para ajudar o abrigo de animais e acabei ganhando uma cesta incrível. Ajudar nunca foi tão bom!' },
        { name: 'Juliana Costa', role: 'Dona de Comércio Local', text: 'Oferecer cupons de desconto pela REDELOCAL trouxe muitos clientes novos para minha loja. Uma parceria excelente para todos.' }
    ];
    
    return (
        <div className="bg-neutral-light text-neutral-dark font-sans">
            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200/80">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-black tracking-tighter font-heading text-slate-900">REDELOCAL</h1>
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#iniciativas" className="text-slate-600 hover:text-primary transition font-semibold">Iniciativas</a>
                        <a href="#sobre" className="text-slate-600 hover:text-primary transition font-semibold">Como Funciona</a>
                        <a href="#depoimentos" className="text-slate-600 hover:text-primary transition font-semibold">Depoimentos</a>
                    </nav>
                    <div className="flex items-center space-x-3">
                        <button onClick={onLoginClick} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold px-5 py-2.5 rounded-lg transition-colors">Entrar</button>
                        <button onClick={onLoginClick} className="bg-primary hover:bg-primary-dark text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md">Cadastre-se</button>
                    </div>
                </div>
            </header>

            <main>
                <section className="relative h-[90vh] w-full flex items-center justify-center text-center px-6 overflow-hidden">
                    {slides.map((slide, index) => (
                        <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                            <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
                        </div>
                    ))}
                    <div className="relative z-20 max-w-4xl">
                        {slides.map((slide, index) => (
                             <div key={index} className={`transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                                {index === currentSlide && (
                                    <>
                                        <h2 className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tight text-slate-800 drop-shadow-sm">{slide.title}</h2>
                                        <p className="mt-4 text-xl text-slate-600 drop-shadow-sm">{slide.subtitle}</p>
                                        <button onClick={onLoginClick} className="mt-10 bg-primary hover:bg-primary-dark text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto">
                                            <span>{slide.cta}</span>
                                            <ChevronRightIcon className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                     <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
                        {slides.map((_, index) => (
                            <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary w-6' : 'bg-slate-400/50'}`}></button>
                        ))}
                    </div>
                    <button onClick={prevSlide} className="absolute z-30 left-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition-colors"><ArrowLeftIcon/></button>
                    <button onClick={nextSlide} className="absolute z-30 right-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition-colors"><ChevronRightIcon className="w-5 h-5"/></button>
                </section>
                
                <section className="bg-slate-50 py-12">
                    <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-4">
                            <h3 className="text-4xl font-bold font-heading text-primary">120+</h3>
                            <p className="text-slate-500 mt-1">Projetos Lançados</p>
                        </div>
                        <div className="p-4">
                            <h3 className="text-4xl font-bold font-heading text-primary">R$50k+</h3>
                            <p className="text-slate-500 mt-1">Arrecadados para Causas</p>
                        </div>
                        <div className="p-4">
                            <h3 className="text-4xl font-bold font-heading text-primary">800+</h3>
                            <p className="text-slate-500 mt-1">Voluntários Engajados</p>
                        </div>
                        <div className="p-4">
                            <h3 className="text-4xl font-bold font-heading text-primary">30+</h3>
                            <p className="text-slate-500 mt-1">Parceiros Locais</p>
                        </div>
                    </div>
                </section>

                <section id="iniciativas" className="py-20 lg:py-28 bg-white">
                    <div className="container mx-auto px-6 text-center">
                        <span className="text-primary font-semibold uppercase tracking-wider">O Que Fazemos</span>
                        <h3 className="text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 mt-2">Explore Todas as Nossas Iniciativas</h3>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">De sustentabilidade à cultura, encontre uma causa para chamar de sua. Use os filtros abaixo para navegar por todas as oportunidades de transformar o seu redor.</p>
                        
                        <div className="mt-12 flex flex-wrap justify-center gap-2 md:gap-4">
                            {initiativeCategories.map(category => (
                                <button
                                    key={category.title}
                                    onClick={() => setActiveCategory(category.title)}
                                    className={`px-5 py-2.5 text-sm md:text-base font-bold rounded-full transition-all duration-300 transform hover:scale-105 ${activeCategory === category.title ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                >
                                    {category.title}
                                </button>
                            ))}
                        </div>

                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {initiativeCategories.find(cat => cat.title === activeCategory)?.items.map((item, index) => {
                                const description = item.name.length > 50 ? item.name.substring(0, 50) + '...' : item.name;
                                return (
                                <div key={item.name} className="bg-white p-8 rounded-xl shadow-md border border-gray-200/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in text-left" style={{ animationDelay: `${index * 0.05}s`}}>
                                    <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center">
                                        <item.icon className="w-8 h-8"/>
                                    </div>
                                    <h4 className="mt-6 text-xl font-bold text-slate-800 font-heading">{item.name}</h4>
                                    <p className="mt-2 text-gray-500">Uma oportunidade incrível para se envolver e fazer a diferença na sua comunidade.</p>
                                    <a href="#" className="mt-4 inline-flex items-center font-semibold text-primary hover:underline">
                                        Saiba mais <ChevronRightIcon className="ml-1 w-4 h-4" />
                                    </a>
                                </div>
                            )})}
                        </div>
                    </div>
                </section>
                
                <section id="sobre" className="py-20 lg:py-28 bg-slate-50">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                            <span className="text-primary font-semibold uppercase tracking-wider">Como Funciona</span>
                            <h3 className="text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 mt-2">Simples, Transparente e Eficaz</h3>
                            <p className="mt-4 text-lg text-gray-600">Criamos uma ponte entre quem quer ajudar e quem precisa de ajuda, facilitando a participação em 3 passos:</p>
                            <ul className="mt-8 space-y-6 text-left">
                                <li className="flex items-start">
                                    <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center mr-4">1</div>
                                    <p><strong className="text-slate-800">Explore as Causas:</strong> Navegue por dezenas de projetos e eventos. Use filtros para encontrar o que mais te inspira.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-green-100 text-green-600 font-bold rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center mr-4">2</div>
                                    <p><strong className="text-slate-800">Participe Como Puder:</strong> Doe, seja voluntário, troque um item ou simplesmente compartilhe. Toda ação conta.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-purple-100 text-purple-600 font-bold rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center mr-4">3</div>
                                    <p><strong className="text-slate-800">Veja o Impacto:</strong> Acompanhe o progresso das iniciativas em tempo real e veja a transformação acontecer.</p>
                                </li>
                            </ul>
                        </div>
                         <div>
                            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop" alt="Voluntários trabalhando juntos" className="rounded-2xl shadow-xl w-full h-full object-cover"/>
                        </div>
                    </div>
                </section>

                <section id="depoimentos" className="py-20 lg:py-28 bg-white">
                     <div className="container mx-auto px-6 text-center">
                        <span className="text-primary font-semibold uppercase tracking-wider">Vozes da Comunidade</span>
                        <h3 className="text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 mt-2">O Que Nossos Membros Dizem</h3>
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <div key={i} className="bg-white p-8 rounded-xl shadow-md border border-gray-200/50">
                                    <p className="text-gray-600 italic">"{t.text}"</p>
                                    <div className="mt-6">
                                        <h4 className="font-bold text-slate-800">{t.name}</h4>
                                        <p className="text-sm text-slate-500">{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </section>
            </main>

            <footer className="bg-neutral-dark text-slate-300">
                <div className="container mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-4 gap-8">
                         <div className="col-span-1 md:col-span-2">
                            <h2 className="text-2xl font-bold font-heading text-white">REDELOCAL</h2>
                            <p className="mt-4 text-slate-400 max-w-md">Fortalecendo comunidades, uma ação de cada vez. Junte-se a nós para fazer a diferença.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white tracking-wider">Navegação</h4>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#iniciativas" className="text-slate-400 hover:text-primary transition">Iniciativas</a></li>
                                <li><a href="#sobre" className="text-slate-400 hover:text-primary transition">Como Funciona</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-primary transition">Contato</a></li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-white tracking-wider">Legal</h4>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-slate-400 hover:text-primary transition">Termos de Serviço</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-primary transition">Política de Privacidade</a></li>
                            </ul>
                        </div>
                    </div>
                     <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
                        <p>&copy; {new Date().getFullYear()} REDELOCAL. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const LoginModal: FC<{ isOpen: boolean; onClose: () => void; onAdminLogin: () => void; onUserLogin: () => void; }> = ({ isOpen, onClose, onAdminLogin, onUserLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [role, setRole] = useState<'Administrador' | 'Usuário'>('Usuário');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (role === 'Administrador') {
            if (username === 'admin01' && password === 'a123') {
                onAdminLogin();
            } else {
                setError('Credenciais de administrador inválidas.');
            }
        } else if (role === 'Usuário') {
            // Simula um login/registro de usuário bem-sucedido
            onUserLogin();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isRegister ? "Criar Conta" : "Acessar Plataforma"} maxWidth="max-w-md">
            <div className="w-full">
                <div className="flex border-b border-gray-200">
                    <button onClick={() => setIsRegister(false)} className={`w-1/2 py-3 text-sm font-bold ${!isRegister ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Login</button>
                    <button onClick={() => setIsRegister(true)} className={`w-1/2 py-3 text-sm font-bold ${isRegister ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>{isRegister ? "Já tenho conta" : "Cadastre-se"}</button>
                </div>
                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <Select label="Selecione seu perfil" name="role" value={role} onChange={e => setRole(e.target.value as any)}>
                        <option>Usuário</option>
                        <option>Administrador</option>
                    </Select>

                    <Input name="username" label="Usuário ou E-mail" value={username} onChange={e => setUsername(e.target.value)} required />
                    <Input name="password" label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    
                    {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
                    
                    <div className="pt-2">
                        <Button type="submit" className="w-full">{isRegister ? "Criar Conta" : "Entrar"}</Button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

// --- Main App Component ---
const App = () => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    
    const handleAdminLogin = () => {
        setIsAdminAuthenticated(true);
        setIsUserAuthenticated(false);
        setIsLoginModalOpen(false);
    };
    
    const handleUserLogin = () => {
        setIsUserAuthenticated(true);
        setIsAdminAuthenticated(false);
        setIsLoginModalOpen(false);
    };

    const handleLogout = () => {
        setIsAdminAuthenticated(false);
        setIsUserAuthenticated(false);
    };

    if (isAdminAuthenticated) {
        return <AdminPanel onLogout={handleLogout} />;
    }
    
    return (
        <>
            <HomePage onLoginClick={() => setIsLoginModalOpen(true)} />
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
                onAdminLogin={handleAdminLogin}
                onUserLogin={handleUserLogin}
            />
        </>
    )
};

export default App;