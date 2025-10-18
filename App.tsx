
import React, { useState } from 'react';

// --- Icon Components (using inline SVG for simplicity and no extra files) ---
const ServiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4a2 2 0 012-2h6a2 2 0 012 2v4m-6 0a1 1 0 001 1h2a1 1 0 001-1m-5 0a1 1 0 00-1-1H5a1 1 0 00-1 1m14 0V11a2 2 0 00-2-2H7a2 2 0 00-2 2v10" />
  </svg>
);

const RaffleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3m0 0h3m-3 0h-3m0 0v3a2 2 0 002 2h3m0 0h3m-3 0h-3m0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v3a2 2 0 002 2h3m0 0h3" />
  </svg>
);

const CrowdfundingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10l-6-3m6 3V7" />
    </svg>
);

const ClassifiedsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

// --- Feature Card Component ---
// FIX: Explicitly type FeatureCard as a React.FC to allow React-specific props like 'key' to be passed without causing a TypeScript error.
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: string; }> = ({ icon, title, description, delay }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 animate-fade-in" style={{ animationDelay: delay }}>
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-DEFAULT mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-heading font-bold text-neutral-dark mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <a href="#" className="inline-block mt-4 text-primary-DEFAULT font-semibold hover:text-primary-dark transition-colors">Saiba mais &rarr;</a>
  </div>
);

// --- Admin Login Modal Component ---
const LoginModal = ({ onLogin, onClose, error, setUsername, setPassword }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm m-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading text-neutral-dark">Acesso Restrito</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
      </div>
      <form onSubmit={onLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Usuário</label>
          <input
            id="username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button type="submit" className="w-full bg-primary-DEFAULT hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
          Entrar
        </button>
      </form>
    </div>
  </div>
);

// --- Admin Panel Component ---
const AdminPanel = () => (
    <section className="py-20 animate-fade-in">
        <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-dark mb-8">Painel Administrativo</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-4">Bem-vindo, Admin!</h2>
                <p className="text-gray-600 mb-6">Esta é a sua área de gerenciamento. Aqui você poderá adicionar, editar e remover conteúdos da plataforma REDELOCAL.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button className="bg-primary-DEFAULT text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">Gerenciar Serviços</button>
                    <button className="bg-primary-DEFAULT text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">Moderar Rifas</button>
                    <button className="bg-primary-DEFAULT text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">Aprovar Vaquinhas</button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-not-allowed">Ver Relatórios</button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-not-allowed">Configurações</button>
                </div>
            </div>
        </div>
    </section>
);


// --- Main App Component ---
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'ad' && password === 'a123') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('Usuário ou senha inválidos.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const mvpFeatures = [
    { icon: <ServiceIcon />, title: 'Guia de Serviços Locais', description: 'Encontre profissionais e serviços essenciais em Alagoinhas com avaliações da comunidade.' },
    { icon: <RaffleIcon />, title: 'Rifas Online', description: 'Participe de rifas para apoiar o comércio local e concorra a prêmios incríveis.' },
    { icon: <CrowdfundingIcon />, title: 'Vaquinha Solidária', description: 'Apoie causas importantes e ajude a transformar a realidade da nossa cidade.' },
    { icon: <MapIcon />, title: 'Mapa Interativo', description: 'Localize farmácias, postos de saúde, feiras e outros pontos úteis da cidade.' },
    { icon: <ClassifiedsIcon />, title: 'Classificados Locais', description: 'Compre, venda e troque produtos com seus vizinhos de forma segura e prática.' },
    { icon: <CrowdfundingIcon />, title: 'Engajamento Comunitário', description: 'Participe de fóruns, denuncie problemas e ajude a construir uma Alagoinhas melhor.' }
  ];

  return (
    <div className="bg-neutral-light min-h-screen text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-heading font-extrabold text-primary-DEFAULT">
            REDELOCAL
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            {isAdmin ? (
              <>
                <a href="#" className="font-bold text-primary-DEFAULT transition-colors">Painel Admin</a>
                <a href="#" onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer">
                  Sair
                </a>
              </>
            ) : (
              <>
                <a href="#" className="text-gray-600 hover:text-primary-DEFAULT transition-colors">Início</a>
                <a href="#" className="text-gray-600 hover:text-primary-DEFAULT transition-colors">Serviços</a>
                <a href="#" className="text-gray-600 hover:text-primary-DEFAULT transition-colors">Eventos</a>
                <a href="#" className="text-gray-600 hover:text-primary-DEFAULT transition-colors">Sobre</a>
                <a href="#" onClick={() => setShowLoginModal(true)} className="bg-primary-DEFAULT text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors cursor-pointer">
                  Login
                </a>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-primary-DEFAULT" aria-label="Abrir menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {isAdmin ? (
          <AdminPanel />
        ) : (
          <>
            {/* Hero Section */}
            <section className="bg-white">
              <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-neutral-dark mb-4 animate-fade-in">
                  Conectando <span className="text-primary-DEFAULT">Alagoinhas</span>.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  Sua plataforma completa de engajamento comunitário. Fortalecendo a comunidade e o comércio local com utilidades, economia e colaboração.
                </p>
                <a href="#" className="bg-primary-DEFAULT text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-primary-dark transition-transform transform hover:scale-105 inline-block animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  Explore a Comunidade
                </a>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
              <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-neutral-dark mb-12">
                  Tudo que você precisa em um só lugar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mvpFeatures.map((feature, index) => (
                    <FeatureCard 
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      delay={`${index * 0.1}s`}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-dark text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-heading font-bold">REDELOCAL</h3>
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} Todos os direitos reservados.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">Contato</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Conditionally render Login Modal */}
      {showLoginModal && (
        <LoginModal 
            onLogin={handleLogin}
            onClose={() => setShowLoginModal(false)}
            error={loginError}
            setUsername={setUsername}
            setPassword={setPassword}
        />
      )}
    </div>
  );
}

export default App;
