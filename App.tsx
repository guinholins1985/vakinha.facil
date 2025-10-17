import React, { useState, ReactNode, FC } from 'react';

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
const AffiliateIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const DepositIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const WithdrawIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const CategoryIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>;
const ProviderIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0118 18c-5 .5-9 .5-11.657-.157" /></svg>;
const GamesIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a4 4 0 100 8 4 4 0 000-8z" /></svg>;
const HistoryIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BellIcon: FC<{ className?: string }> = ({ className = "w-6 h-6 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const VaquinhaIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06z" /></svg>;
const RifaIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a2 2 0 002-2H10a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>;
const CouponIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const AdminIcon: FC<{ className?: string }> = ({ className = "w-16 h-16 mx-auto text-primary mb-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const ManagerIcon: FC<{ className?: string }> = ({ className = "w-16 h-16 mx-auto text-primary mb-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h5m-5 4h5" /></svg>;
const UserIcon: FC<{ className?: string }> = ({ className = "w-16 h-16 mx-auto text-primary mb-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const StarIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const CheckCircleIcon: FC<{ className?: string }> = ({ className = "w-8 h-8" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ArrowRightIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;
const ShieldCheckIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 flex-shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.944c.435 0 .86-.033 1.284-.096m6.143-4.873a5.976 5.976 0 00-8.243-7.53" /></svg>;
const BookOpenIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;


const primaryButtonClasses = "bg-gradient-to-r from-primary-light to-primary text-white font-bold rounded-lg shadow-md hover:from-primary hover:to-primary-dark transition-all duration-300 transform hover:scale-105";

// --- Types ---
type Role = 'admin' | 'manager' | 'user';
type SlotConfig = {
  payoutMultiplier: number;
  winSymbol: string;
  winMessage: string;
  minBet: number;
  maxBet: number;
  defaultBet: number;
};
type Permissions = {
  manager: {
    canManageVaquinhas: boolean;
    canManageRifas: boolean;
    canManageSlots: boolean;
  };
  user: {
    canPlaySlots: boolean;
    maxBetAmount: number;
  };
};

// --- NEW USER VIEW COMPONENTS ---
const BannerSlider: FC<{ onNavigate: (page: 'vaquinhas' | 'rifas' | 'slots') => void }> = ({ onNavigate }) => {
    const slides = [
        {
            image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop',
            title: 'Realize Sonhos, Apoie Causas',
            subtitle: 'Crie ou participe de vaquinhas online para projetos que transformam vidas.',
            cta: 'Ver Vaquinhas',
            action: () => onNavigate('vaquinhas'),
        },
        {
            image: 'https://images.unsplash.com/photo-1593697821252-9c91b172a16a?q=80&w=2070&auto=format&fit=crop',
            title: 'Prêmios Incríveis Esperam por Você',
            subtitle: 'Participe de nossas rifas e concorra a produtos fantásticos. A sorte está lançada!',
            cta: 'Ver Rifas',
            action: () => onNavigate('rifas'),
        },
        {
            image: 'https://images.unsplash.com/photo-1542838223-3da3c6276a59?q=80&w=2070&auto=format&fit=crop',
            title: 'Diversão e Fortuna nos Slots',
            subtitle: 'Gire e ganhe em nossos jogos de slots exclusivos. A próxima grande vitória pode ser sua!',
            cta: 'Jogar Agora',
            action: () => onNavigate('slots'),
        }
    ];

    const [current, setCurrent] = useState(0);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setCurrent(current === slides.length - 1 ? 0 : current + 1);
        }, 5000);
        return () => clearTimeout(timer);
    }, [current, slides.length]);

    return (
        <div className="relative w-full max-w-7xl mx-auto h-96 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            {slides.map((slide, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white font-heading">{slide.title}</h2>
                        <p className="text-lg text-white/90 mt-4 max-w-2xl">{slide.subtitle}</p>
                        <button onClick={slide.action} className={`${primaryButtonClasses} mt-8 px-8 py-3 text-lg`}>{slide.cta}</button>
                    </div>
                </div>
            ))}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button key={index} onClick={() => setCurrent(index)} className={`w-3 h-3 rounded-full transition-colors ${index === current ? 'bg-white' : 'bg-white/50 hover:bg-white'}`}></button>
                ))}
            </div>
        </div>
    );
};

const UserVaquinhasPage: FC = () => {
    const vaquinhas = [
        { title: 'Ajude o abrigo Anjos de Patas', goal: 10000, raised: 7500, image: 'https://images.unsplash.com/photo-1598875184988-5e67b1a7ea95?q=80&w=2070&auto=format&fit=crop' },
        { title: 'Cirurgia do pequeno Lucas', goal: 25000, raised: 12500, image: 'https://images.unsplash.com/photo-1519951838435-a6e29a55c6d3?q=80&w=2070&auto=format&fit=crop' },
        { title: 'Reforma da creche Comunitária', goal: 50000, raised: 45000, image: 'https://images.unsplash.com/photo-1576765682692-05a7d74548f2?q=80&w=2070&auto=format&fit=crop' }
    ];
    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">Vaquinhas em Destaque</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {vaquinhas.map(v => (
                    <div key={v.title} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform">
                        <img src={v.image} alt={v.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-white">{v.title}</h3>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>R$ {v.raised.toFixed(2)}</span>
                                    <span>Meta: R$ {v.goal.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(v.raised / v.goal) * 100}%` }}></div>
                                </div>
                            </div>
                            <button className={`${primaryButtonClasses} w-full mt-4 py-2`}>Apoiar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const UserRifasPage: FC = () => {
     const rifas = [
        { prize: 'iPhone 15 Pro', ticketPrice: 5.00, image: 'https://images.unsplash.com/photo-1695026224700-9e65b0532292?q=80&w=1964&auto=format&fit=crop' },
        { prize: 'Playstation 5', ticketPrice: 7.50, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2070&auto=format&fit=crop' },
        { prize: 'Viagem para Cancún', ticketPrice: 10.00, image: 'https://images.unsplash.com/photo-1541172626292-8097157b433c?q=80&w=2070&auto=format&fit=crop' }
    ];
    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">Rifas Ativas</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {rifas.map(r => (
                    <div key={r.prize} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg text-center">
                        <img src={r.image} alt={r.prize} className="w-full h-56 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-xl text-white">{r.prize}</h3>
                            <p className="text-secondary font-bold text-2xl my-2">R$ {r.ticketPrice.toFixed(2)}</p>
                            <p className="text-gray-400 text-sm">por bilhete</p>
                            <button className={`${primaryButtonClasses} w-full mt-4 py-2`}>Participar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const UserSlotsPage: FC<{ slotConfig: SlotConfig; permissions: Permissions['user'] }> = ({ slotConfig, permissions }) => {
    return (
        <div className="animate-fade-in">
             <FortunaFelizGame slotConfig={slotConfig} permissions={permissions} />
        </div>
    );
};

const UserCuponsPage: FC = () => {
    const cupons = [
        { code: 'BEMVINDO10', description: '10% de desconto na primeira compra de rifa.', expiry: '31/12/2024' },
        { code: 'SLOTS5', description: '5 rodadas grátis no Fortuna Feliz.', expiry: '30/11/2024' }
    ];
    return (
         <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">Meus Cupons</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
                {cupons.map(c => (
                     <div key={c.code} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between border-l-4 border-secondary">
                        <div>
                             <p className="text-sm text-gray-400">Código</p>
                             <p className="text-white font-bold text-lg tracking-widest">{c.code}</p>
                             <p className="text-gray-300 mt-1">{c.description}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-sm text-gray-400">Válido até</p>
                             <p className="text-white font-semibold">{c.expiry}</p>
                             <button className="text-primary hover:text-primary-light text-sm font-semibold mt-1">Usar Agora</button>
                        </div>
                     </div>
                ))}
            </div>
        </div>
    );
};


// --- Page Components ---
const ControlPanelPage = () => <div><h1 className="text-2xl font-semibold text-neutral-dark">Painel de Controle</h1></div>;
const SettingsPage = () => <div><h1 className="text-2xl font-semibold text-neutral-dark">Configurações</h1></div>;
const ApiGamesPage = () => <div><h1 className="text-2xl font-semibold text-neutral-dark">API de Jogos</h1></div>;
const CouponsPage = () => <div><h1 className="text-2xl font-semibold text-neutral-dark">Cupons de Desconto</h1></div>;
const VaquinhasPage = () => <div><h1 className="text-2xl font-semibold text-neutral-dark">Gerenciar Vaquinhas</h1></div>;
const RifasPage = () => <div><h1 className="text-2xl font-semibold text-neutral-dark">Gerenciar Rifas</h1></div>;
const UsersPage = () => <div><h1 className="text-2xl font-semibold text-neutral-dark">Usuários</h1></div>;

const PermissionsPage: FC<{ permissions: Permissions, setPermissions: (p: Permissions) => void }> = ({ permissions, setPermissions }) => {
    
    const handleManagerChange = (key: keyof Permissions['manager'], value: boolean) => {
        setPermissions({
            ...permissions,
            manager: { ...permissions.manager, [key]: value }
        });
    };

    const handleUserChange = (key: keyof Permissions['user'], value: boolean | number) => {
        setPermissions({
            ...permissions,
            user: { ...permissions.user, [key]: value }
        });
    };

    const Toggle: FC<{ label: string, isEnabled: boolean, onToggle: (enabled: boolean) => void }> = ({ label, isEnabled, onToggle }) => (
        <div className="flex items-center justify-between">
            <span className="text-neutral-dark/80">{label}</span>
            <button onClick={() => onToggle(!isEnabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-primary' : 'bg-gray-300'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-neutral-dark">Gestão de Permissões</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-neutral-dark mb-4 border-b pb-2">Permissões do Gestor de Conteúdo</h2>
                <div className="space-y-4">
                    <Toggle label="Pode gerenciar Vaquinhas?" isEnabled={permissions.manager.canManageVaquinhas} onToggle={(val) => handleManagerChange('canManageVaquinhas', val)} />
                    <Toggle label="Pode gerenciar Rifas?" isEnabled={permissions.manager.canManageRifas} onToggle={(val) => handleManagerChange('canManageRifas', val)} />
                    <Toggle label="Pode gerenciar Slots?" isEnabled={permissions.manager.canManageSlots} onToggle={(val) => handleManagerChange('canManageSlots', val)} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-neutral-dark mb-4 border-b pb-2">Permissões do Usuário</h2>
                <div className="space-y-4">
                    <Toggle label="Pode jogar Slots?" isEnabled={permissions.user.canPlaySlots} onToggle={(val) => handleUserChange('canPlaySlots', val)} />
                    <div>
                        <label className="block text-sm font-medium text-neutral-dark/90 mb-2" htmlFor="maxBetAmount">Aposta Máxima nos Slots (R$)</label>
                        <input type="number" id="maxBetAmount" value={permissions.user.maxBetAmount} onChange={(e) => handleUserChange('maxBetAmount', Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                </div>
            </div>
        </div>
    );
};


const FortunaFelizGame: FC<{ slotConfig: SlotConfig; permissions: Permissions['user']; isAdminView?: boolean }> = ({ slotConfig, permissions, isAdminView = false }) => {
    const symbols = ['🍊', '💰', '🧧', '🐯', '🎁'];
    const [balance, setBalance] = useState(9750.00);
    const [bet, setBet] = useState(slotConfig.defaultBet);
    const [reels, setReels] = useState<string[][]>([
        ['🍊', '💰', '🧧'], ['🐯', '🎁', '🍊'], ['💰', '🍊', '🎁'],
        ['🧧', '🐯', '🍊'], ['🍊', '💰', '🧧'],
    ]);
    const [spinning, setSpinning] = useState(false);
    const [message, setMessage] = useState('Bem-vindo ao Fortuna Feliz!');
    const [freeSpins, setFreeSpins] = useState(0);

    if (!isAdminView && !permissions.canPlaySlots) {
        return <div className="text-center p-10 bg-red-100 rounded-lg"><p className="text-red-700 font-bold">Acesso aos jogos de Slot está temporariamente desativado.</p></div>
    }

    const spinReels = () => {
        if (spinning) return;
        if (!isAdminView && balance < bet && freeSpins === 0) {
            setMessage("Saldo insuficiente.");
            return;
        }
        setSpinning(true);
        if (!isAdminView) {
          if (freeSpins > 0) {
              setFreeSpins(prev => prev - 1);
          } else {
              setBalance(prev => prev - bet);
          }
        }
        const spinInterval = setInterval(() => {
            setReels(reels.map(reel => reel.map(() => symbols[Math.floor(Math.random() * symbols.length)])));
        }, 100);

        setTimeout(() => {
            clearInterval(spinInterval);
            const finalReels = reels.map(reel => reel.map(() => symbols[Math.floor(Math.random() * symbols.length)]));
            setReels(finalReels);
            
            const winSymbolsOnScreen = finalReels.flat().filter(s => s === slotConfig.winSymbol).length;
            let winAmount = 0;

            if (winSymbolsOnScreen >= 3) {
                winAmount = bet * slotConfig.payoutMultiplier;
                const formattedMessage = slotConfig.winMessage.replace('{winAmount}', winAmount.toFixed(2));
                setMessage(formattedMessage);
                if (!isAdminView) {
                    setBalance(prev => prev + winAmount);
                }
            } else {
                setMessage("Não foi dessa vez. Tente novamente!");
            }
            setSpinning(false);
        }, 2000);
    };
    
    return (
        <div className="bg-gradient-to-b from-secondary to-red-800 p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto border-4 border-yellow-400">
            <h1 className="text-4xl font-bold text-yellow-300 text-center mb-4">Fortuna Feliz</h1>
            <div className="flex justify-between items-center text-white font-semibold mb-4 bg-black/30 p-4 rounded-xl">
                <div>Saldo: R$ {isAdminView ? '---' : balance.toFixed(2)}</div>
                <div>Rodadas Grátis: {isAdminView ? '---' : freeSpins}</div>
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
                <button onClick={() => setBet(b => Math.max(slotConfig.minBet, b - 0.5))} disabled={spinning} className="px-4 py-2 font-bold text-white bg-yellow-600 rounded-full">-</button>
                <button onClick={spinReels} disabled={spinning} className="px-8 py-4 text-xl font-bold text-red-900 bg-yellow-400 rounded-full">{spinning ? '...' : 'GIRAR'}</button>
                <button onClick={() => setBet(b => Math.min(isAdminView ? slotConfig.maxBet : permissions.maxBetAmount, b + 0.5))} disabled={spinning} className="px-4 py-2 font-bold text-white bg-yellow-600 rounded-full">+</button>
            </div>
        </div>
    );
};

const SlotConfigEditor: FC<{ config: SlotConfig, setConfig: (config: SlotConfig) => void }> = ({ config, setConfig }) => {
    const symbols = ['🍊', '💰', '🧧', '🐯', '🎁'];
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig({
            ...config,
            [name]: e.target.type === 'number' ? Number(value) : value
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold text-neutral-dark mb-6 border-b pb-3">Configurações do Jogo de Slot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-medium text-neutral-dark/90 mb-2" htmlFor="winSymbol">Símbolo de Vitória</label>
                    <select name="winSymbol" id="winSymbol" value={config.winSymbol} onChange={handleChange} className="w-full text-lg p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                        {symbols.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Escolha o símbolo que acionará o prêmio.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-dark/90 mb-2" htmlFor="payoutMultiplier">Multiplicador do Prêmio (x Aposta)</label>
                    <input type="number" name="payoutMultiplier" id="payoutMultiplier" value={config.payoutMultiplier} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    <p className="text-xs text-gray-500 mt-1">Ex: Aposta 10, Multiplicador 50 = Prêmio 500.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-dark/90 mb-2" htmlFor="minBet">Aposta Mínima (R$)</label>
                    <input type="number" step="0.5" name="minBet" id="minBet" value={config.minBet} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-dark/90 mb-2" htmlFor="maxBet">Aposta Máxima (R$)</label>
                    <input type="number" step="0.5" name="maxBet" id="maxBet" value={config.maxBet} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-neutral-dark/90 mb-2" htmlFor="winMessage">Mensagem de Vitória</label>
                     <textarea name="winMessage" id="winMessage" value={config.winMessage} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
                     <p className="text-xs text-gray-500 mt-1">Use {'{winAmount}'} para exibir o valor ganho. Ex: Parabéns! Você ganhou R$ {'{winAmount}'}!</p>
                </div>
            </div>
        </div>
    );
};


const GestaoSlotsPage: FC<{ slotConfig: SlotConfig, setSlotConfig: (config: SlotConfig) => void; permissions: Permissions['user'] }> = ({ slotConfig, setSlotConfig, permissions }) => {
    const [activeTab, setActiveTab] = useState('Jogar Jogo');
    const tabs = ['Jogar Jogo', 'Configurações do Jogo', 'Visão Geral & Templates', 'Gestão de Slots', 'Gestão de Reservas', 'Relatórios & Análises'];
    return (
        <div>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                         <button key={tab} onClick={() => setActiveTab(tab)} className={`${ activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-neutral-dark/60'} py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap`}>{tab}</button>
                    ))}
                </nav>
            </div>
            {activeTab === 'Jogar Jogo' && <FortunaFelizGame slotConfig={slotConfig} permissions={permissions} isAdminView={true} />}
            {activeTab === 'Configurações do Jogo' && <SlotConfigEditor config={slotConfig} setConfig={setSlotConfig} />}
            {activeTab === 'Visão Geral & Templates' && <div>Templates...</div>}
        </div>
    )
}

const PortalPage: FC<{ onSelectRole: (role: Role) => void; onBackToHome: () => void; }> = ({ onSelectRole, onBackToHome }) => (
    <div className="min-h-screen bg-neutral-light flex flex-col items-center justify-center p-4 animate-fade-in">
        <h1 className="text-5xl font-extrabold text-primary font-heading mb-4">PREMIX</h1>
        <p className="text-neutral-dark/80 text-lg mb-12">Portal de Acesso</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform">
                <AdminIcon />
                <h2 className="text-2xl font-bold font-heading text-neutral-dark mb-2">Administrador</h2>
                <p className="text-neutral-dark/60 mb-6">Controle total da plataforma, configurações e usuários.</p>
                <button onClick={() => onSelectRole('admin')} className={`w-full px-6 py-3 ${primaryButtonClasses}`}>Entrar</button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform">
                <ManagerIcon />
                <h2 className="text-2xl font-bold font-heading text-neutral-dark mb-2">Gestor de Conteúdo</h2>
                <p className="text-neutral-dark/60 mb-6">Gerencie Vaquinhas, Rifas e Slots.</p>
                <button onClick={() => onSelectRole('manager')} className={`w-full px-6 py-3 ${primaryButtonClasses}`}>Entrar</button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform">
                <UserIcon />
                <h2 className="text-2xl font-bold font-heading text-neutral-dark mb-2">Usuário</h2>
                <p className="text-neutral-dark/60 mb-6">Acesse os jogos e funcionalidades da plataforma.</p>
                <button onClick={() => onSelectRole('user')} className={`w-full px-6 py-3 ${primaryButtonClasses}`}>Entrar</button>
            </div>
        </div>
         <div className="mt-12">
            <button onClick={onBackToHome} className="text-neutral-dark/70 hover:text-neutral-dark transition-colors font-medium">
                &larr; Voltar ao Início
            </button>
        </div>
    </div>
);

const LoginPage: FC<{
  role: Role;
  onLogin: (credentials: {email: string, password: string}) => void;
  onBack: () => void;
  onSwitchToRegister: () => void;
  error: string | null;
}> = ({ role, onLogin, onBack, onSwitchToRegister, error }) => {
    const [email, setEmail] = useState(role === 'admin' ? 'admin01' : '');
    const [password, setPassword] = useState(role === 'admin' ? 'a123' : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin({ email, password });
    };

    return (
    <div className="min-h-screen bg-neutral-light flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center text-primary mb-2">Login de {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
             <p className="text-center text-neutral-dark/60 mb-6">Bem-vindo de volta!</p>
            <form onSubmit={handleSubmit}>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
                <div className="mb-4">
                    <label className="block text-neutral-dark/90 text-sm font-bold mb-2" htmlFor="email">Usuário/Email</label>
                    <input id="email" value={email} onChange={e => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-dark/90 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="seu@email.com" />
                </div>
                <div className="mb-6">
                    <label className="block text-neutral-dark/90 text-sm font-bold mb-2" htmlFor="password">Senha</label>
                    <input id="password" value={password} onChange={e => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-dark/90 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="Senha" />
                </div>
                <button className={`w-full py-2 px-4 ${primaryButtonClasses}`} type="submit">Entrar</button>
                <button onClick={onBack} className="w-full bg-gray-200 hover:bg-gray-300 text-neutral-dark/90 font-bold py-2 px-4 rounded mt-2 transition-colors" type="button">Voltar</button>
            </form>
             <p className="text-center text-neutral-dark/60 text-sm mt-6">
                Não tem uma conta?{' '}
                <button onClick={onSwitchToRegister} className="font-medium text-primary hover:text-primary/90">
                    Cadastre-se
                </button>
            </p>
        </div>
    </div>
    );
};

const RegistrationPage: FC<{
  role: Role;
  onRegister: (details: any) => void;
  onSwitchToLogin: () => void;
  error: string | null;
}> = ({ role, onRegister, onSwitchToLogin, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [internalError, setInternalError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInternalError('');
    if (!name || !email || !password || !confirmPassword) {
      setInternalError('Todos os campos são obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      setInternalError('As senhas não coincidem.');
      return;
    }
    onRegister({ name, email, password });
  };

  return (
    <div className="min-h-screen bg-neutral-light flex flex-col justify-center items-center p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-primary mb-2">
          Criar Conta de {role.charAt(0).toUpperCase() + role.slice(1)}
        </h1>
        <p className="text-center text-neutral-dark/60 mb-6">
          Preencha os dados para se cadastrar.
        </p>
        <form onSubmit={handleSubmit}>
          {(error || internalError) && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error || internalError}</p>}
          <div className="mb-4">
            <label className="block text-neutral-dark/90 text-sm font-bold mb-2" htmlFor="name">Nome Completo</label>
            <input id="name" value={name} onChange={e => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-dark/90 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Seu Nome" />
          </div>
          <div className="mb-4">
             <label className="block text-neutral-dark/90 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input id="email" value={email} onChange={e => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-dark/90 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="seu@email.com" />
          </div>
          <div className="mb-4">
            <label className="block text-neutral-dark/90 text-sm font-bold mb-2" htmlFor="password">Senha</label>
            <input id="password" value={password} onChange={e => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-dark/90 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="Senha" />
          </div>
          <div className="mb-6">
            <label className="block text-neutral-dark/90 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirmar Senha</label>
            <input id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-dark/90 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="Confirmar Senha" />
          </div>
          <button className={`w-full py-2 px-4 ${primaryButtonClasses}`} type="submit">Cadastrar</button>
           <button onClick={onSwitchToLogin} className="w-full bg-gray-200 hover:bg-gray-300 text-neutral-dark/90 font-bold py-2 px-4 rounded mt-2 transition-colors" type="button">Voltar</button>
        </form>
        <p className="text-center text-neutral-dark/60 text-sm mt-6">
          Já tem uma conta?{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-primary hover:text-primary/90">
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
};

type UserPage = 'inicio' | 'vaquinhas' | 'rifas' | 'slots' | 'cupons';
const UserView: FC<{ onLogout: () => void; slotConfig: SlotConfig; permissions: Permissions['user'] }> = ({ onLogout, slotConfig, permissions }) => {
    const [activePage, setActivePage] = useState<UserPage>('inicio');

    const navItems = [
        { id: 'inicio' as UserPage, label: 'Início', icon: <DashboardIcon /> },
        { id: 'vaquinhas' as UserPage, label: 'Vaquinhas', icon: <VaquinhaIcon /> },
        { id: 'rifas' as UserPage, label: 'Rifas', icon: <RifaIcon /> },
        { id: 'slots' as UserPage, label: 'Slots', icon: <GamesIcon /> },
        { id: 'cupons' as UserPage, label: 'Cupons', icon: <CouponIcon /> },
    ];
    
    const renderPage = () => {
        switch(activePage) {
            case 'inicio': return <BannerSlider onNavigate={(page) => setActivePage(page)} />;
            case 'vaquinhas': return <UserVaquinhasPage />;
            case 'rifas': return <UserRifasPage />;
            case 'slots': return <UserSlotsPage slotConfig={slotConfig} permissions={permissions} />;
            case 'cupons': return <UserCuponsPage />;
            default: return <BannerSlider onNavigate={(page) => setActivePage(page)} />;
        }
    }
    
    return (
        <div className="min-h-screen bg-neutral-dark text-white font-sans">
            <header className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 p-4 flex justify-between items-center shadow-lg">
                <h1 className="text-2xl font-bold text-primary font-heading">PREMIX</h1>
                <div className="flex items-center space-x-4">
                     <p>Bem-vindo, Usuário!</p>
                     <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                        <LogoutIcon className="w-5 h-5"/> <span>Sair</span>
                    </button>
                </div>
            </header>
            
            <nav className="bg-gray-800 p-2 flex justify-center space-x-2 md:space-x-8">
                {navItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => setActivePage(item.id)} 
                        className={`flex flex-col md:flex-row items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-semibold ${activePage === item.id ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
                        <span className="text-sm md:text-base">{item.label}</span>
                    </button>
                ))}
            </nav>
            
            <main className="p-6 md:p-10">
                {renderPage()}
            </main>
        </div>
    );
};

const Header: FC<{ onNavigate: (page: 'homepage' | 'faq' | 'portal') => void }> = ({ onNavigate }) => (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <button onClick={() => onNavigate('homepage')} className="text-3xl font-bold text-primary font-heading">PREMIX</button>
            <nav className="hidden md:flex space-x-8 items-center">
                <button onClick={() => onNavigate('homepage')} className="text-neutral-dark/70 hover:text-primary transition-colors">Início</button>
                <a href="#" className="text-neutral-dark/70 hover:text-primary transition-colors">Vaquinhas</a>
                <a href="#" className="text-neutral-dark/70 hover:text-primary transition-colors">Rifas</a>
                <a href="#" className="text-neutral-dark/70 hover:text-primary transition-colors">Slots</a>
                <button onClick={() => onNavigate('faq')} className="text-neutral-dark/70 hover:text-primary transition-colors">Como Funciona</button>
            </nav>
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate('portal')} className="hidden md:block text-neutral-dark/80 font-semibold hover:text-primary transition-colors">Login</button>
                <button onClick={() => onNavigate('portal')} className={`${primaryButtonClasses} px-6 py-2`}>Cadastre-se</button>
            </div>
        </div>
    </header>
);

const Footer: FC<{ onNavigate: (page: 'homepage' | 'faq' | 'portal') => void }> = ({ onNavigate }) => (
    <footer className="bg-neutral-dark text-neutral-light/70">
        <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
                <div>
                    <h4 className="text-2xl font-bold text-white font-heading mb-4">PREMIX</h4>
                    <p>Sua plataforma completa de arrecadação e entretenimento.</p>
                </div>
                 <div>
                    <h5 className="font-bold text-white mb-4">Links</h5>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white">Sobre Nós</a></li>
                        <li><a href="#" className="hover:text-white">Contato</a></li>
                        <li><button onClick={() => onNavigate('faq')} className="hover:text-white text-left">Como Funciona</button></li>
                        <li><a href="#" className="hover:text-white">Privacidade</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-white mb-4">Recursos</h5>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white">Criar Vaquinha</a></li>
                        <li><a href="#" className="hover:text-white">Ver Rifas</a></li>
                        <li><a href="#" className="hover:text-white">Jogar Slots</a></li>
                    </ul>
                </div>
                <div>
                     <h5 className="font-bold text-white mb-4">Siga-nos</h5>
                     <div className="flex space-x-4">
                        {/* Social Icons Placeholder */}
                     </div>
                </div>
            </div>
            <div className="mt-12 border-t border-neutral-light/20 pt-8 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} PREMIX. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
);

const HomePage: FC<{ onNavigate: (page: 'portal' | 'faq' | 'homepage') => void }> = ({ onNavigate }) => {
    
    const HeroSection = () => (
         <section className="relative py-20 md:py-32 bg-white">
            <div className="absolute inset-0 opacity-50">
                 <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1949&auto=format&fit=crop" className="w-full h-full object-cover" alt="Community support"/>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

            <div className="relative container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-6xl font-extrabold text-neutral-dark font-heading leading-tight mb-6">
                    A Sua Plataforma Completa de <br /><span className="bg-gradient-to-r from-primary to-primary-dark text-transparent bg-clip-text">Arrecadação e Entretenimento</span>
                </h2>
                <p className="text-lg text-neutral-dark/70 max-w-3xl mx-auto mb-10">
                    Crie vaquinhas, participe de rifas premiadas e divirta-se com nossos jogos exclusivos. Tudo em um só lugar, de forma transparente e segura.
                </p>
                <button onClick={() => onNavigate('portal')} className={`${primaryButtonClasses} text-lg px-10 py-4`}>
                    Comece Agora
                </button>
            </div>
        </section>
    );

    const FeaturesSection = () => (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-3xl md:text-4xl font-bold text-neutral-dark font-heading">Tudo que você precisa em um só lugar</h3>
                    <p className="text-neutral-dark/60 mt-4">Explore nossas principais funcionalidades.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl hover:-translate-y-2 transition-all">
                        <VaquinhaIcon className="w-12 h-12 mx-auto text-primary mb-4" />
                        <h4 className="text-2xl font-bold font-heading text-neutral-dark mb-2">Vaquinhas Online</h4>
                        <p className="text-neutral-dark/60">Arrecade fundos para suas causas e projetos de forma simples e eficiente, com total transparência.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl hover:-translate-y-2 transition-all">
                        <RifaIcon className="w-12 h-12 mx-auto text-primary mb-4" />
                        <h4 className="text-2xl font-bold font-heading text-neutral-dark mb-2">Rifas Premiadas</h4>
                        <p className="text-neutral-dark/60">Crie e participe de rifas com prêmios incríveis. A sorte pode estar ao seu lado!</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl hover:-translate-y-2 transition-all">
                        <GamesIcon className="w-12 h-12 mx-auto text-primary mb-4" />
                        <h4 className="text-2xl font-bold font-heading text-neutral-dark mb-2">Slots Divertidos</h4>
                        <p className="text-neutral-dark/60">Relaxe e divirta-se com nossa seleção de jogos de slot, com regras customizáveis pelo admin.</p>
                    </div>
                </div>
            </div>
        </section>
    );

    const HowItWorksSection = () => (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-16">
                    <h3 className="text-3xl md:text-4xl font-bold text-neutral-dark font-heading">Como Funciona?</h3>
                    <p className="text-neutral-dark/60 mt-4">Comece em apenas 3 passos simples.</p>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-12">
                    <div className="text-center max-w-xs">
                        <div className="flex items-center justify-center bg-primary/10 text-primary w-16 h-16 rounded-full mx-auto mb-4 font-bold text-2xl">1</div>
                        <h4 className="text-xl font-bold mb-2">Cadastre-se</h4>
                        <p className="text-neutral-dark/60">Crie sua conta gratuitamente em menos de um minuto.</p>
                    </div>
                     <div className="text-center max-w-xs">
                        <div className="flex items-center justify-center bg-primary/10 text-primary w-16 h-16 rounded-full mx-auto mb-4 font-bold text-2xl">2</div>
                        <h4 className="text-xl font-bold mb-2">Escolha ou Crie</h4>
                        <p className="text-neutral-dark/60">Crie sua própria campanha ou escolha um jogo para participar.</p>
                    </div>
                     <div className="text-center max-w-xs">
                        <div className="flex items-center justify-center bg-primary/10 text-primary w-16 h-16 rounded-full mx-auto mb-4 font-bold text-2xl">3</div>
                        <h4 className="text-xl font-bold mb-2">Participe e Divirta-se</h4>
                        <p className="text-neutral-dark/60">Contribua, compre bilhetes, jogue e acompanhe tudo em tempo real.</p>
                    </div>
                </div>
            </div>
        </section>
    );

    const TestimonialsSection = () => (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-3xl md:text-4xl font-bold text-neutral-dark font-heading">O que nossos usuários dizem</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <div className="flex items-center mb-4">
                            <img className="w-12 h-12 rounded-full object-cover mr-4" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" alt="Carla Mendes"/>
                            <div>
                                <p className="font-bold text-neutral-dark">Carla Mendes</p>
                                <div className="flex text-yellow-500"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                            </div>
                        </div>
                        <p className="text-neutral-dark/70">"A plataforma é incrível! Consegui arrecadar o valor para a cirurgia do meu pet em uma semana com a vaquinha. Super recomendo!"</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <div className="flex items-center mb-4">
                            <img className="w-12 h-12 rounded-full object-cover mr-4" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop" alt="João Ferreira"/>
                            <div>
                                <p className="font-bold text-neutral-dark">João Ferreira</p>
                                <div className="flex text-yellow-500"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                            </div>
                        </div>
                        <p className="text-neutral-dark/70">"Participei de uma rifa e ganhei um prêmio fantástico! O processo foi todo transparente e seguro. E os jogos são bem divertidos."</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <div className="flex items-center mb-4">
                            <img className="w-12 h-12 rounded-full object-cover mr-4" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" alt="Mariana Costa"/>
                            <div>
                                <p className="font-bold text-neutral-dark">Mariana Costa</p>
                                <div className="flex text-yellow-500"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                            </div>
                        </div>
                        <p className="text-neutral-dark/70">"Fácil de usar, design moderno e cumpre o que promete. Uso tanto para criar campanhas quanto para me divertir nos slots."</p>
                    </div>
                </div>
            </div>
        </section>
    );

    const CTASection = () => (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                 <h3 className="text-3xl md:text-4xl font-bold text-neutral-dark font-heading mb-4">Pronto para Começar?</h3>
                 <p className="text-lg text-neutral-dark/70 max-w-2xl mx-auto mb-8">
                    Junte-se a milhares de usuários e transforme suas ideias em realidade.
                </p>
                 <button onClick={() => onNavigate('portal')} className={`${primaryButtonClasses} text-lg px-10 py-4`}>
                    Crie sua conta grátis
                </button>
            </div>
        </section>
    );
    
    return (
        <div className="bg-neutral-light font-sans animate-fade-in">
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <CTASection />
            </main>
        </div>
    );
};

const FaqPage: FC<{ onNavigate: (page: 'portal' | 'homepage') => void }> = ({ onNavigate }) => {
    
    const FaqItem: FC<{ q: string, a: string }> = ({ q, a }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="border-b">
                <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left py-4 flex justify-between items-center">
                    <span className="font-semibold">{q}</span>
                    <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {isOpen && <div className="pb-4 text-neutral-dark/80">{a}</div>}
            </div>
        );
    }
    
    const FeatureCard: FC<{ icon: ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-neutral-dark">{title}</h3>
                <p className="text-neutral-dark/70 mt-1">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="bg-neutral-light font-sans animate-fade-in">
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-primary to-green-400 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-heading">Como Funciona</h1>
                    <p className="text-lg mt-2">Tudo o que você precisa saber sobre a PREMIX.</p>
                </div>
            </div>

            <main className="container mx-auto px-6 py-16">
                 {/* Seção de Features */}
                <section className="mb-20">
                     <h2 className="text-3xl font-bold text-center text-neutral-dark font-heading mb-12">Nossas Funcionalidades em Detalhes</h2>
                     <div className="grid md:grid-cols-2 gap-12">
                         <FeatureCard icon={<VaquinhaIcon className="w-6 h-6"/>} title="Vaquinhas Online" description="Arrecade dinheiro para qualquer objetivo. Crie sua página, defina uma meta e compartilhe com sua rede. Acompanhe as contribuições em tempo real com total transparência." />
                         <FeatureCard icon={<RifaIcon className="w-6 h-6"/>} title="Rifas Premiadas" description="Crie ou participe de sorteios de forma fácil e segura. Defina o prêmio, o valor dos bilhetes e a data do sorteio. Nosso sistema garante a aleatoriedade e a lisura do resultado." />
                         <FeatureCard icon={<GamesIcon className="w-6 h-6"/>} title="Slots Divertidos" description="Relaxe com nossos jogos de slot. As regras, prêmios e limites podem ser ajustados pelo administrador da plataforma para criar experiências únicas e promoções especiais." />
                         <FeatureCard icon={<CouponIcon className="w-6 h-6"/>} title="Cupons de Desconto" description="Ofereça ou utilize cupons para obter descontos na compra de bilhetes de rifas ou em outras transações na plataforma, aumentando o engajamento e as oportunidades." />
                     </div>
                </section>

                {/* Seção de FAQ */}
                <section>
                    <h2 className="text-3xl font-bold text-center text-neutral-dark font-heading mb-12">Perguntas Frequentes (FAQ)</h2>
                    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <FaqItem q="Como funcionam os saques?" a="Você pode solicitar o saque do saldo disponível em sua carteira a qualquer momento. O valor será transferido para a sua conta bancária cadastrada em até 3 dias úteis. Aplicam-se taxas de processamento." />
                        <FaqItem q="Quais são as taxas da plataforma?" a="Para vaquinhas, cobramos uma taxa de 5% sobre o valor total arrecadado. Para rifas, a taxa é de 10% sobre a receita. Não há taxas para jogar nos slots, apenas o valor da aposta." />
                        <FaqItem q="É seguro usar a PREMIX?" a="Sim. Utilizamos gateways de pagamento seguros e criptografia de ponta a ponta para proteger suas informações. Todas as transações são monitoradas para prevenir fraudes." />
                        <FaqItem q="Como sei que as rifas são justas?" a="Nosso sistema de sorteio é automatizado e auditável, garantindo que todos os participantes tenham chances iguais. O resultado é gerado de forma aleatória e transparente." />
                        <FaqItem q="Posso criar mais de uma campanha ao mesmo tempo?" a="Sim, você pode gerenciar múltiplas vaquinhas e rifas simultaneamente através do seu painel de gestor." />
                    </div>
                </section>
            </main>

            <div className="bg-white py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-neutral-dark font-heading mb-4">Ainda tem dúvidas?</h2>
                    <p className="text-lg text-neutral-dark/70 mb-8">Nossa equipe de suporte está pronta para ajudar.</p>
                    <button className={`${primaryButtonClasses} px-8 py-3`}>Entre em Contato</button>
                </div>
            </div>
        </div>
    );
}

const App = () => {
    type View = 'homepage' | 'portal' | 'login' | 'register' | 'faq';
    const [view, setView] = useState<View>('homepage');
    const [targetRole, setTargetRole] = useState<Role | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<{ email: string, role: Role } | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    
    const [permissions, setPermissions] = useState<Permissions>({
        manager: {
            canManageVaquinhas: true,
            canManageRifas: true,
            canManageSlots: true,
        },
        user: {
            canPlaySlots: true,
            maxBetAmount: 250,
        }
    });

    const [users, setUsers] = useState([
        { name: 'Admin User', email: 'admin01', password: 'a123', role: 'admin' as Role },
        { name: 'Manager User', email: 'manager@premix.com', password: 'password', role: 'manager' as Role },
        { name: 'Regular User', email: 'user@premix.com', password: 'password', role: 'user' as Role }
    ]);

    const [slotConfig, setSlotConfig] = useState<SlotConfig>({
        payoutMultiplier: 50,
        winSymbol: '💰',
        winMessage: "Prêmio! Você ganhou R$ {winAmount}!",
        minBet: 0.5,
        maxBet: 250,
        defaultBet: 2.50,
    });
    
    const handleNavigate = (page: View) => {
        setView(page);
    }

    const handleSelectRole = (role: Role) => {
        setTargetRole(role);
        setView('login');
        setAuthError(null);
    };
    
    const handleLogin = (credentials: {email: string, password: string}) => {
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password && u.role === targetRole);
        if (user) {
            setLoggedInUser({ email: user.email, role: user.role });
            setView('homepage');
            setTargetRole(null);
            setAuthError(null);
        } else {
            setAuthError('Credenciais inválidas ou perfil incorreto.');
        }
    };
    
    const handleRegister = (newUser: {name: string, email: string, password: string}) => {
        if (users.some(u => u.email === newUser.email)) {
            setAuthError('Um usuário com este email já existe.');
            return;
        }
        const userWithRole = { ...newUser, role: targetRole! };
        setUsers(prev => [...prev, userWithRole]);
        setLoggedInUser({ email: userWithRole.email, role: userWithRole.role });
        setView('homepage');
        setTargetRole(null);
        setAuthError(null);
    };
    
    const handleLogout = () => {
        setLoggedInUser(null);
        setView('homepage');
        setTargetRole(null);
    }
    
    if (!loggedInUser) {
        let pageContent: ReactNode;
        switch (view) {
            case 'login':
                pageContent = <LoginPage 
                    role={targetRole!} 
                    onLogin={handleLogin} 
                    onBack={() => { setView('portal'); setAuthError(null); }}
                    onSwitchToRegister={() => { setView('register'); setAuthError(null); }}
                    error={authError}
                />;
                break;
            case 'register':
                pageContent = <RegistrationPage 
                    role={targetRole!} 
                    onRegister={handleRegister}
                    onSwitchToLogin={() => { setView('login'); setAuthError(null); }}
                    error={authError}
                />;
                break;
            case 'portal':
                pageContent = <PortalPage onSelectRole={handleSelectRole} onBackToHome={() => setView('homepage')} />;
                break;
            case 'faq':
                pageContent = <FaqPage onNavigate={(page) => setView(page)} />;
                break;
            case 'homepage':
            default:
                 pageContent = <HomePage onNavigate={(page) => setView(page)} />;
                 break;
        }
        
        return (
            <>
                {(view === 'homepage' || view === 'faq') && <Header onNavigate={handleNavigate} />}
                {pageContent}
                {(view === 'homepage' || view === 'faq') && <Footer onNavigate={handleNavigate} />}
            </>
        )
    }

    switch (loggedInUser.role) {
        case 'admin': return <AdminDashboard onLogout={handleLogout} slotConfig={slotConfig} setSlotConfig={setSlotConfig} permissions={permissions} setPermissions={setPermissions} />;
        case 'manager': return <ManagerDashboard onLogout={handleLogout} slotConfig={slotConfig} permissions={permissions} />;
        case 'user': return <UserView onLogout={handleLogout} slotConfig={slotConfig} permissions={permissions.user} />;
        default: return <HomePage onNavigate={(page) => setView(page)} />;
    }
};

const AdminDashboard: FC<{ onLogout: () => void; slotConfig: SlotConfig; setSlotConfig: (config: SlotConfig) => void; permissions: Permissions; setPermissions: (p: Permissions) => void; }> = ({ onLogout, slotConfig, setSlotConfig, permissions, setPermissions }) => {
    const [activeMenu, setActiveMenu] = useState('Painel de Controle');
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

    const renderContent = () => {
        const currentSelection = activeSubMenu || activeMenu;
        switch (currentSelection) {
            case 'Painel de Controle': return <ControlPanelPage />;
            case 'Vaquinhas': return <VaquinhasPage />;
            case 'Rifas': return <RifasPage />;
            case 'Configurações': return <SettingsPage />;
            case 'Permissões': return <PermissionsPage permissions={permissions} setPermissions={setPermissions} />;
            case 'API de jogos': return <ApiGamesPage />;
            case 'Cupons de Desconto': return <CouponsPage />;
            case 'Usuários': return <UsersPage />;
            case 'Gestão de Slots': return <GestaoSlotsPage slotConfig={slotConfig} setSlotConfig={setSlotConfig} permissions={permissions.user} />;
            default: return <div><h1 className="text-2xl">{currentSelection}</h1></div>;
        }
    };

    const navItems = [
        { name: 'Painel de Controle', icon: <DashboardIcon /> },
        { name: 'Configurações', icon: <SettingsIcon /> },
        { name: 'Permissões', icon: <ShieldCheckIcon /> },
        { name: 'API de jogos', icon: <ApiIcon /> },
        { name: 'Gateway de Pagamentos', icon: <GatewayIcon /> },
        { name: 'Definições de Email', icon: <EmailIcon /> },
        { name: 'Customização', icon: <CustomizeIcon /> },
    ];
    const marketingItems = [ { name: 'Banners', icon: <BannersIcon /> }, { name: 'Cupons de Desconto', icon: <CouponIcon /> } ];
    const adminItems = [ { name: 'Usuários', icon: <UsersIcon /> }, { name: 'Carteiras', icon: <WalletIcon /> }, { name: 'Saques de Afiliados', icon: <AffiliateIcon /> }, { name: 'Depositos', icon: <DepositIcon /> }, { name: 'Saques', icon: <WithdrawIcon /> }, ];
    const gameItems = [ { name: 'Gestão de Slots', icon: <GamesIcon /> }, { name: 'Todas as Categorias', icon: <CategoryIcon /> }, { name: 'Todos os Provedores', icon: <ProviderIcon /> }, { name: 'Histórico de Partidas', icon: <HistoryIcon /> }, ];

    return (
        <DashboardLayout onLogout={onLogout}>
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

const ManagerDashboard: FC<{ onLogout: () => void; slotConfig: SlotConfig; permissions: Permissions }> = ({ onLogout, slotConfig, permissions }) => {
    const { canManageRifas, canManageSlots, canManageVaquinhas } = permissions.manager;
    
    const navItems = [
        canManageVaquinhas && { name: 'Vaquinhas', icon: <VaquinhaIcon /> },
        canManageRifas && { name: 'Rifas', icon: <RifaIcon /> },
        canManageSlots && { name: 'Gestão de Slots', icon: <GamesIcon /> },
    ].filter(Boolean) as { name: string, icon: ReactNode }[];
    
    const [activeMenu, setActiveMenu] = useState(navItems[0]?.name || 'Nenhum acesso');

    const renderContent = () => {
        if (navItems.length === 0) return <div className="p-6"><h1 className="text-2xl text-neutral-dark">Você não tem permissão para acessar nenhuma funcionalidade.</h1><p className="text-neutral-dark/70">Entre em contato com o administrador.</p></div>

        switch (activeMenu) {
            case 'Vaquinhas': return <VaquinhasPage />;
            case 'Rifas': return <RifasPage />;
            case 'Gestão de Slots': return <GestaoSlotsPage slotConfig={slotConfig} setSlotConfig={() => {}} permissions={permissions.user} />;
            default: return <div><h1 className="text-2xl">{activeMenu}</h1></div>;
        }
    };

    return (
        <DashboardLayout onLogout={onLogout}>
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map(item => <NavItem key={item.name} icon={item.icon} label={item.name} isActive={activeMenu === item.name} onClick={() => setActiveMenu(item.name)} />)}
            </nav>
            {renderContent()}
        </DashboardLayout>
    );
};

type DashboardLayoutProps = {
    children: ReactNode[];
    onLogout: () => void;
};
const DashboardLayout: FC<DashboardLayoutProps> = ({ children, onLogout }) => {
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const nav = children[0];
    const content = children[1];

    return (
        <div className="flex h-screen bg-neutral-light font-sans">
            <aside className="w-64 bg-white flex flex-col shadow-lg">
                <div className="h-16 flex items-center justify-center border-b"><h1 className="text-2xl font-bold text-primary font-heading">PREMIX</h1></div>
                {nav}
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white shadow-md flex items-center justify-end px-6">
                    <div className="flex items-center space-x-4">
                        <BellIcon className="text-gray-500" />
                        <div className="relative">
                           <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="w-10 h-10 bg-gradient-to-br from-primary-light to-primary text-white rounded-full font-bold flex items-center justify-center">A</button>
                           {isProfileMenuOpen && (
                               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
                                   <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-neutral-dark/90 hover:bg-gray-100 flex items-center"><LogoutIcon className="w-5 h-5 mr-2" />Sair</button>
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
    <button onClick={onClick} className={`w-full flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-neutral-dark/80 hover:bg-gray-100'}`}>
        {icon}<span className="ml-4">{label}</span>
    </button>
);

type SubNavItemProps = { icon: ReactNode; label: string; isActive: boolean; onClick: () => void; };
const SubNavItem: FC<SubNavItemProps> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center pl-11 pr-4 py-3 text-base font-medium rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-neutral-dark/80 hover:bg-gray-100'}`}>
         {icon}<span className="ml-4">{label}</span>
    </button>
);

type CollapsibleNavItemProps = { label: string; isOpen: boolean; toggleOpen: () => void; children: ReactNode; };
const CollapsibleNavItem: FC<CollapsibleNavItemProps> = ({ label, isOpen, toggleOpen, children }) => (
    <div>
        <div className="w-full flex items-center px-4 py-3 text-base font-medium text-neutral-dark/80 rounded-md">
            <span>{label}</span>
        </div>
        {isOpen && <div className="mt-1 space-y-1">{children}</div>}
    </div>
);

export default App;