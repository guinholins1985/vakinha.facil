
import React, { useState, useMemo } from 'react';

// --- ÍCONES SVG COMO COMPONENTES ---
const Icon = ({ path, className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d={path} />
  </svg>
);

const ICONS = {
    dashboard: "M10.5 6h3a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5h-3a1.5 1.5 0 01-1.5-1.5V7.5A1.5 1.5 0 0110.5 6zM4.5 6h3a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 013 12.5v-5A1.5 1.5 0 014.5 6zM4.5 15h3a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5h-3a1.5 1.5 0 01-1.5-1.5V16.5A1.5 1.5 0 014.5 15zM10.5 13h3a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-3a1.5 1.5 0 01-1.5-1.5v-5a1.5 1.5 0 011.5-1.5z",
    services: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    map: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13V7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 11V9m0 0l-6-2",
    classifieds: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    economy: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    crowdfunding: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    community: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    education: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    eyeOff: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-2.122 2.122",
    edit: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z",
    trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    plus: "M12 4v16m8-8H4",
    chevronDown: "M19 9l-7 7-7-7",
    x: "M6 18L18 6M6 6l12 12",
    tag: "M17.657 18.657l-7.07-7.07.07-.07 7.07-7.071 3.536 3.535-7.071 7.07.071.07 7.07 7.07-3.535 3.536zM3 12a2 2 0 114 0 2 2 0 01-4 0z",
    dollar: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 8v1m0-8V6m0 12v-1M12 18a6 6 0 100-12 6 6 0 000 12z",
    stock: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
    image: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
};

// --- DADOS MOCK ---
const initialProfessionals = [
    { id: 1, name: 'Dr. João Silva', category: 'Médico', phone: '(75) 9999-1234', rating: 5, status: 'Ativo', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Maria Souza', category: 'Advogado', phone: '(75) 9888-5678', rating: 4, status: 'Ativo', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Carlos Pereira', category: 'Encanador', phone: '(75) 9777-4321', rating: 5, status: 'Inativo', avatar: 'https://i.pravatar.cc/150?img=3' },
];

const initialMapPoints = [
    { id: 1, name: 'Farmácia Central', category: 'Farmácia', address: 'Rua das Flores, 123', hours: '24 horas', lat: 10, lng: 20 },
    { id: 2, name: 'Escola Municipal A', category: 'Escola', address: 'Av. Principal, 456', hours: '07:00 - 17:00', lat: 30, lng: 50 },
    { id: 3, name: 'Posto de Saúde Bairro Novo', category: 'Saúde', address: 'Rua da Paz, 789', hours: '08:00 - 18:00', lat: 80, lng: 15 },
    { id: 4, name: 'Feira Livre de Domingo', category: 'Feira', address: 'Praça da Matriz', hours: '06:00 - 12:00', lat: 60, lng: 70 },
];

const initialClassifieds = [
    { id: 1, title: 'Sofá 3 lugares seminovo', price: 450.00, category: 'Móveis', condition: 'Usado', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80' },
    { id: 2, title: 'Bicicleta Caloi Aro 29', price: 800.00, category: 'Esportes', condition: 'Usado - Bom estado', image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=822&q=80' },
    { id: 3, title: 'iPhone 11 Pro - 64GB', price: 2200.00, category: 'Eletrônicos', condition: 'Usado', image: 'https://images.unsplash.com/photo-1592215227419-f55a1591147e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' },
    { id: 4, title: 'Mesa de Jantar com 4 cadeiras', price: 600.00, category: 'Móveis', condition: 'Novo', image: 'https://images.unsplash.com/photo-1604074131593-3d085239a5e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' },
];

const initialProducts = [
    { id: 1, name: 'Queijo Artesanal', category: 'Laticínios', price: 25.50, stock: 'Em Estoque', image: 'https://images.unsplash.com/photo-1618164435328-9724153017a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80' },
    { id: 2, name: 'Doce de Leite Caseiro', category: 'Doces', price: 15.00, stock: 'Esgotado', image: 'https://images.unsplash.com/photo-1582458421447-40f438a2e482?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' },
    { id: 3, name: 'Hortaliças Orgânicas', category: 'Verduras', price: 10.00, stock: 'Em Estoque', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80' },
];

const initialOrders = [
    { id: '#1234', customerName: 'João Silva', date: '2023-10-27', total: 75.50, status: 'Entregue' },
    { id: '#1235', customerName: 'Maria Oliveira', date: '2023-10-27', total: 45.00, status: 'Processando' },
    { id: '#1236', customerName: 'Carlos Pereira', date: '2023-10-26', total: 120.00, status: 'Pendente' },
    { id: '#1237', customerName: 'Ana Costa', date: '2023-10-25', total: 30.00, status: 'Cancelado' },
];

const initialProducers = [
    { id: 1, name: 'Sítio Verde', category: 'Hortifruti', contact: '(75) 9111-1111', rating: 5, status: 'Ativo', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: 2, name: 'Laticínios da Serra', category: 'Laticínios', contact: '(75) 9222-2222', rating: 4, status: 'Ativo', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Doces da Vovó', category: 'Doces', contact: '(75) 9333-3333', rating: 5, status: 'Inativo', avatar: 'https://i.pravatar.cc/150?img=6' },
];

// --- COMPONENTES DA UI ---
// FIX: Refactored Modal props to use a 'type' alias. This can resolve potential
// TypeScript parser issues that might incorrectly flag 'children' as missing.
type ModalProps = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
};

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

// --- PÁGINAS ---

const Dashboard = ({ setActivePage }) => {
    const Chart = () => (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico de Linhas</p>
        </div>
    );
    const recentActivities = [
        { type: 'DEPOSIT', user: 'Carlos P.', amount: 50, time: 'Agora' },
        { type: 'NEW_USER', user: 'Ana B.', time: '2 min atrás' },
        { type: 'DEPOSIT', user: 'Juliana M.', amount: 20, time: '10 min atrás' },
    ];

    const StatCard = ({ title, value, page, icon }) => (
        <div onClick={() => setActivePage(page)} className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-neutral-dark">{value}</p>
                </div>
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Icon path={icon} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Usuários Ativos" value="1,254" page="Usuários" icon={ICONS.user} />
                <StatCard title="Vaquinhas Ativas" value="23" page="Vaquinhas" icon={ICONS.crowdfunding} />
                <StatCard title="Rifas em Andamento" value="12" page="Rifas" icon={ICONS.tag} />
                <StatCard title="Faturamento (Mês)" value="R$ 4,580" page="Faturamento" icon={ICONS.dollar} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Crescimento da Plataforma</h3>
                    <Chart />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
                    <div className="space-y-4">
                        {recentActivities.map((act, i) => (
                            <div key={i} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${act.type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {act.type === 'DEPOSIT' ? '+' : <Icon path={ICONS.user} className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {act.type === 'DEPOSIT' ? `Depósito de ${act.user}` : `Novo usuário: ${act.user}`}
                                    </p>
                                    <p className="text-xs text-gray-500">{act.time}</p>
                                </div>
                                {act.amount && <p className="text-sm font-semibold text-green-600">R${act.amount}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const GuiaServicos = () => {
    return <CrudPage 
              title="Guia de Serviços Locais" 
              itemType="Profissional"
              initialItems={initialProfessionals} 
              columns={[
                { key: 'avatar', label: 'Foto', render: (item) => <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" /> },
                { key: 'name', label: 'Nome' },
                { key: 'category', label: 'Categoria' },
                { key: 'phone', label: 'Telefone' },
                { key: 'rating', label: 'Avaliação', render: (item) => '⭐'.repeat(item.rating) },
                { key: 'status', label: 'Status', render: (item) => <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.status}</span> },
              ]}
              filterFields={[
                { key: 'category', label: 'Categoria', options: ['Médico', 'Advogado', 'Encanador'] },
                { key: 'status', label: 'Status', options: ['Ativo', 'Inativo'] },
              ]}
              formFields={[
                { key: 'name', label: 'Nome', type: 'text' },
                { key: 'category', label: 'Categoria', type: 'select', options: ['Médico', 'Advogado', 'Encanador'] },
                { key: 'phone', label: 'Telefone', type: 'text' },
                { key: 'rating', label: 'Avaliação', type: 'number', props: { min:1, max: 5 } },
                { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo'] },
                { key: 'avatar', label: 'URL da Foto', type: 'text' },
              ]}
            />;
};

const MapaInterativo = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(null);

    const mapCategories = ['Farmácia', 'Escola', 'Saúde', 'Feira'];

    const filteredPoints = useMemo(() => {
        return initialMapPoints.filter(p => 
            (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategories.length === 0 || selectedCategories.includes(p.category))
        );
    }, [searchTerm, selectedCategories]);

    const handleCategoryToggle = (category) => {
        setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
    };
    
    const getPointStyle = (point) => {
      const isHovered = hoveredPoint === point.id;
      const isSelected = selectedPoint?.id === point.id;
      const baseStyle = { position: 'absolute', top: `${point.lat}%`, left: `${point.lng}%`, transform: 'translate(-50%, -50%)', transition: 'all 0.2s ease' };
      if (isSelected) return { ...baseStyle, zIndex: 10, transform: 'translate(-50%, -50%) scale(1.5)'};
      if (isHovered) return { ...baseStyle, zIndex: 10, transform: 'translate(-50%, -50%) scale(1.2)' };
      return baseStyle;
    }

    const getIconForCategory = (category) => {
        switch(category) {
            case 'Farmácia': return '⚕️';
            case 'Escola': return '🎓';
            case 'Saúde': return '🏥';
            case 'Feira': return '🧺';
            default: return '📍';
        }
    };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-lg shadow-md overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/3 max-w-sm flex flex-col border-r border-gray-200">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Mapa Interativo</h2>
                    <div className="relative mt-4">
                        <Icon path={ICONS.search} className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Buscar local..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                </div>
                <div className="p-4 border-b">
                    <h3 className="font-semibold mb-2">Categorias</h3>
                    <div className="flex flex-wrap gap-2">
                        {mapCategories.map(cat => (
                            <button key={cat} onClick={() => handleCategoryToggle(cat)} className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCategories.includes(cat) ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredPoints.length > 0 ? (
                        filteredPoints.map(point => (
                            <div key={point.id} 
                                 onMouseEnter={() => setHoveredPoint(point.id)}
                                 onMouseLeave={() => setHoveredPoint(null)}
                                 onClick={() => setSelectedPoint(point)}
                                 className="p-4 border-b cursor-pointer hover:bg-primary/5">
                                <p className="font-semibold">{getIconForCategory(point.category)} {point.name}</p>
                                <p className="text-sm text-gray-500">{point.address}</p>
                            </div>
                        ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p>Nenhum local encontrado.</p>
                      </div>
                    )}
                </div>
            </div>
            {/* Mapa */}
            <div className="flex-1 bg-neutral-light relative">
                 <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: "url('https://www.freevectormaps.com/atlas/brazil/BR-06-3.png')"}}></div>
                 {filteredPoints.map(point => {
                   const isSelected = selectedPoint?.id === point.id;
                   return (
                     <div key={point.id} style={getPointStyle(point)}>
                       <div 
                         onClick={() => setSelectedPoint(point)}
                         onMouseEnter={() => setHoveredPoint(point.id)}
                         onMouseLeave={() => setHoveredPoint(null)}
                         className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg ${isSelected ? 'bg-primary text-white' : 'bg-white'}`}>
                         {getIconForCategory(point.category)}
                       </div>
                       {isSelected && (
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white p-3 rounded-lg shadow-xl animate-fade-in z-20">
                           <button onClick={() => setSelectedPoint(null)} className="absolute top-1 right-1 text-gray-500 hover:text-black">
                             <Icon path={ICONS.x} className="w-4 h-4"/>
                           </button>
                           <h4 className="font-bold text-md mb-1">{point.name}</h4>
                           <p className="text-sm text-gray-600">{point.address}</p>
                           <p className="text-xs text-gray-500 mt-1">Horário: {point.hours}</p>
                         </div>
                       )}
                     </div>
                   );
                 })}
            </div>
        </div>
    );
};

const ClassifiedsPage = () => {
    const [classifieds, setClassifieds] = useState(initialClassifieds);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ category: 'Todos', condition: 'Todas', priceRange: [0, 2500] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredClassifieds = useMemo(() => {
        return classifieds.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filters.category === 'Todos' || item.category === filters.category) &&
            (filters.condition === 'Todas' || item.condition.startsWith(filters.condition)) &&
            (item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1])
        );
    }, [classifieds, searchTerm, filters]);

    const handleSave = (itemData) => {
        if (editingItem) {
            setClassifieds(classifieds.map(c => c.id === editingItem.id ? { ...c, ...itemData } : c));
        } else {
            setClassifieds([...classifieds, { id: Date.now(), ...itemData }]);
        }
        closeModal();
    };
    
    const handleDelete = () => {
        if (itemToDelete) {
            setClassifieds(classifieds.filter(c => c.id !== itemToDelete.id));
            setItemToDelete(null);
        }
    };
    
    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-neutral-light min-h-full p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-neutral-dark">Classificados Locais</h1>
                <button onClick={() => openModal()} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors">
                    <Icon path={ICONS.plus} className="w-5 h-5"/>
                    Adicionar Anúncio
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Buscar</label>
                    <input type="text" placeholder="Ex: Sofá, bicicleta..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                        <option>Todos</option>
                        <option>Móveis</option>
                        <option>Eletrônicos</option>
                        <option>Esportes</option>
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700">Preço: R${filters.priceRange[0]} - R${filters.priceRange[1]}</label>
                     <input type="range" min="0" max="2500" value={filters.priceRange[1]} onChange={e => setFilters({...filters, priceRange: [filters.priceRange[0], Number(e.target.value)]})} className="w-full mt-2"/>
                </div>
            </div>

            {filteredClassifieds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredClassifieds.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                            <img src={item.image} alt={item.title} className="w-full h-48 object-cover"/>
                            <div className="p-4">
                                <p className="text-sm text-gray-500">{item.category}</p>
                                <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                                <p className="text-xl font-bold text-primary mt-2">R$ {item.price.toFixed(2)}</p>
                            </div>
                             <div className="p-2 bg-gray-50 flex justify-end gap-2">
                                <button onClick={() => openModal(item)} className="text-gray-500 hover:text-blue-600"><Icon path={ICONS.edit} className="w-5 h-5"/></button>
                                <button onClick={() => setItemToDelete(item)} className="text-gray-500 hover:text-red-600"><Icon path={ICONS.trash} className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-500">Nenhum anúncio encontrado. Tente ajustar seus filtros.</p>
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ClassifiedsForm item={editingItem} onSave={handleSave} onCancel={closeModal} />
            </Modal>
            
            <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)}>
                <div className="text-center">
                    <h3 className="text-lg font-bold">Confirmar Exclusão</h3>
                    <p className="my-4">Tem certeza que deseja excluir o anúncio "{itemToDelete?.title}"?</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Excluir</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const ClassifiedsForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: item?.title || '',
        category: item?.category || 'Móveis',
        price: item?.price || '',
        condition: item?.condition || 'Novo',
        image: item?.image || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, price: parseFloat(formData.price) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">{item ? 'Editar Anúncio' : 'Novo Anúncio'}</h2>
            <div>
                <label>Título</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border-gray-300 rounded-md" required/>
            </div>
            <div>
                <label>Categoria</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border-gray-300 rounded-md">
                    <option>Móveis</option>
                    <option>Eletrônicos</option>
                    <option>Esportes</option>
                    <option>Vestuário</option>
                </select>
            </div>
             <div>
                <label>Preço</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border-gray-300 rounded-md" required/>
            </div>
             <div>
                <label>Condição</label>
                 <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border-gray-300 rounded-md">
                    <option>Novo</option>
                    <option>Usado - Como novo</option>
                    <option>Usado - Bom estado</option>
                </select>
            </div>
            <div>
                <label>URL da Imagem</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border-gray-300 rounded-md" required/>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Salvar</button>
            </div>
        </form>
    );
};

const ProductsPage = () => {
   return <CrudPage 
              title="Produtos da Feira Virtual" 
              itemType="Produto"
              initialItems={initialProducts} 
              columns={[
                { key: 'image', label: 'Imagem', render: (item) => <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" /> },
                { key: 'name', label: 'Nome' },
                { key: 'category', label: 'Categoria' },
                { key: 'price', label: 'Preço', render: (item) => `R$ ${item.price.toFixed(2)}`},
                { key: 'stock', label: 'Estoque', render: (item) => <span className={`px-2 py-1 text-xs rounded-full ${item.stock === 'Em Estoque' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.stock}</span> },
              ]}
              filterFields={[
                { key: 'category', label: 'Categoria', options: ['Laticínios', 'Doces', 'Verduras'] },
                { key: 'stock', label: 'Estoque', options: ['Em Estoque', 'Esgotado'] },
              ]}
              formFields={[
                { key: 'name', label: 'Nome', type: 'text' },
                { key: 'category', label: 'Categoria', type: 'select', options: ['Laticínios', 'Doces', 'Verduras'] },
                { key: 'price', label: 'Preço', type: 'number', props: { step: 0.01 } },
                { key: 'stock', label: 'Estoque', type: 'select', options: ['Em Estoque', 'Esgotado'] },
                { key: 'image', label: 'URL da Imagem', type: 'text' },
              ]}
            />;
}

const OrdersPage = () => {
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const orderStatuses = ['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado'];

    const statusColors = {
        Pendente: 'bg-yellow-100 text-yellow-800',
        Processando: 'bg-blue-100 text-blue-800',
        Enviado: 'bg-indigo-100 text-indigo-800',
        Entregue: 'bg-green-100 text-green-800',
        Cancelado: 'bg-red-100 text-red-800',
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => 
            (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'Todos' || order.status === statusFilter)
        );
    }, [orders, searchTerm, statusFilter]);
    
    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Pedidos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                    <input 
                        type="text" 
                        placeholder="Buscar por cliente ou ID do pedido..."
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>
                <div>
                    <select 
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    >
                        <option value="Todos">Status (Todos)</option>
                        {orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Pedido ID</th>
                            <th scope="col" className="px-6 py-3">Cliente</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                       {filteredOrders.length > 0 ? filteredOrders.map(order => (
                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4">{order.customerName}</td>
                                <td className="px-6 py-4">{order.date}</td>
                                <td className="px-6 py-4">R$ {order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`p-1 text-xs rounded-full border-0 focus:ring-0 ${statusColors[order.status]}`}
                                    >
                                        {orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:underline text-xs">Ver Detalhes</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                    Nenhum pedido encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const ProducersPage = () => {
    return <CrudPage 
              title="Produtores Locais" 
              itemType="Produtor"
              initialItems={initialProducers} 
              columns={[
                { key: 'avatar', label: 'Foto', render: (item) => <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" /> },
                { key: 'name', label: 'Nome' },
                { key: 'category', label: 'Categoria' },
                { key: 'contact', label: 'Contato' },
                { key: 'rating', label: 'Avaliação', render: (item) => '⭐'.repeat(item.rating) },
                { key: 'status', label: 'Status', render: (item) => <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.status}</span> },
              ]}
              filterFields={[
                { key: 'category', label: 'Categoria', options: ['Hortifruti', 'Laticínios', 'Doces'] },
                { key: 'status', label: 'Status', options: ['Ativo', 'Inativo'] },
              ]}
              formFields={[
                { key: 'name', label: 'Nome do Produtor', type: 'text' },
                { key: 'category', label: 'Categoria', type: 'select', options: ['Hortifruti', 'Laticínios', 'Doces', 'Outros'] },
                { key: 'contact', label: 'Contato (Telefone/Email)', type: 'text' },
                { key: 'rating', label: 'Avaliação', type: 'number', props: { min:1, max: 5 } },
                { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo'] },
                { key: 'avatar', label: 'URL da Foto', type: 'text' },
              ]}
            />;
}


// --- COMPONENTES GENÉRICOS (CRUD) ---

const CrudPage = ({ title, itemType, initialItems, columns, filterFields, formFields }) => {
    const [items, setItems] = useState(initialItems);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState(filterFields.reduce((acc, f) => ({ ...acc, [f.key]: 'Todos' }), {}));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = Object.values(item).some(val => 
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesFilters = filterFields.every(field => 
                filters[field.key] === 'Todos' || item[field.key] === filters[field.key]
            );
            return matchesSearch && matchesFilters;
        });
    }, [items, searchTerm, filters, filterFields]);

    const handleSave = (itemData) => {
        if (editingItem) {
            setItems(items.map(p => p.id === editingItem.id ? { ...p, ...itemData } : p));
        } else {
            setItems([...items, { id: Date.now(), ...itemData }]);
        }
        closeModal();
    };

    const handleDelete = () => {
        if (itemToDelete) {
            setItems(items.filter(p => p.id !== itemToDelete.id));
            setItemToDelete(null);
        }
    };
    
    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button onClick={() => openModal()} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors">
                    <Icon path={ICONS.plus} className="w-5 h-5"/>
                    Novo {itemType}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                    <input 
                        type="text" 
                        placeholder={`Buscar ${itemType.toLowerCase()}...`}
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>
                {filterFields.map(field => (
                    <div key={field.key}>
                        <select 
                            value={filters[field.key]} 
                            onChange={e => setFilters({...filters, [field.key]: e.target.value})}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        >
                            <option value="Todos">{field.label} (Todos)</option>
                            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            {columns.map(col => <th key={col.key} scope="col" className="px-6 py-3">{col.label}</th>)}
                            <th scope="col" className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                       {filteredItems.length > 0 ? filteredItems.map(item => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                {columns.map(col => (
                                    <td key={col.key} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {col.render ? col.render(item) : item[col.key]}
                                    </td>
                                ))}
                                <td className="px-6 py-4 flex gap-4">
                                    <button onClick={() => openModal(item)} className="text-blue-600 hover:underline"><Icon path={ICONS.edit} className="w-5 h-5"/></button>
                                    <button onClick={() => setItemToDelete(item)} className="text-red-600 hover:underline"><Icon path={ICONS.trash} className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                                    Nenhum {itemType.toLowerCase()} encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

             <Modal isOpen={isModalOpen} onClose={closeModal}>
                <GenericForm 
                    item={editingItem} 
                    onSave={handleSave} 
                    onCancel={closeModal} 
                    fields={formFields} 
                    itemType={itemType} 
                />
            </Modal>
            
            <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)}>
                <div className="text-center">
                    <h3 className="text-lg font-bold">Confirmar Exclusão</h3>
                    <p className="my-4">Tem certeza que deseja excluir este {itemType.toLowerCase()}?</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Excluir</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const GenericForm = ({ item, onSave, onCancel, fields, itemType }) => {
    const [formData, setFormData] = useState(() => {
        const initialState = {};
        fields.forEach(field => {
            initialState[field.key] = item?.[field.key] ?? '';
        });
        return initialState;
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">{item ? `Editar ${itemType}` : `Novo ${itemType}`}</h2>
            {fields.map(field => (
                <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    {field.type === 'select' ? (
                        <select name={field.key} value={formData[field.key]} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md">
                            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    ) : (
                        <input 
                            type={field.type} 
                            name={field.key} 
                            value={formData[field.key]} 
                            onChange={handleChange} 
                            className="mt-1 w-full border-gray-300 rounded-md"
                            {...field.props}
                        />
                    )}
                </div>
            ))}
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Salvar</button>
            </div>
        </form>
    );
};

const PlaceholderPage = ({ title }) => (
    <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-400">{title}</h1>
        <p className="text-gray-400 ml-2">(Em construção)</p>
    </div>
);


// --- LOGIN ---
const LoginModal = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => { 
            if (isLoginView) {
                if (username === 'ad' && password === 'a123') {
                    onLogin();
                } else {
                    setError('Usuário ou senha inválidos.');
                }
            } else {
                onLogin();
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-neutral-dark bg-opacity-80 z-50 flex justify-center items-center animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm relative">
                <h2 className="text-2xl font-bold text-center mb-2 font-heading">{isLoginView ? 'Bem-vindo(a) de volta!' : 'Crie sua conta'}</h2>
                <p className="text-center text-gray-500 mb-6">{isLoginView ? 'Acesse o painel de administrador' : 'Rápido e fácil'}</p>
                
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginView && (
                         <div>
                            <label className="text-sm font-medium">Nome Completo</label>
                            <input type="text" required className={`mt-1 w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary`} />
                        </div>
                    )}
                    <div>
                        <label className="text-sm font-medium">Usuário</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className={`mt-1 w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500' : 'border-gray-300'}`} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Senha</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className={`mt-1 w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500' : 'border-gray-300'}`} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                                <Icon path={showPassword ? ICONS.eyeOff : ICONS.eye} className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                    {!isLoginView && (
                        <div className="flex items-center">
                             <input type="checkbox" id="terms" required className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/>
                             <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">Eu aceito os <a href="#" className="text-primary hover:underline">Termos de Uso</a></label>
                        </div>
                    )}
                     <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center">
                        {loading ? <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div> : (isLoginView ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>
                <div className="text-center mt-4">
                     <button onClick={() => setIsLoginView(!isLoginView)} className="text-sm text-primary hover:underline">
                        {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- ESTRUTURA PRINCIPAL DO APP ---
// FIX: Added explicit types for menu items to fix type inference issues
// with the complex menuItems array structure. This resolves errors in .flatMap()
// and .find() where item properties were previously not accessible.
interface MenuItem {
    name: string;
    icon: string;
    page: JSX.Element;
}

interface MenuPillar {
    pillar: string;
    items: MenuItem[];
}

type MenuEntry = MenuItem | MenuPillar;

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activePage, setActivePage] = useState('Painel de Controle');
    
    const menuItems: MenuEntry[] = [
        { name: 'Painel de Controle', icon: 'dashboard', page: <Dashboard setActivePage={setActivePage} /> },
        {
            pillar: 'Utilidades do Dia a Dia',
            items: [
                { name: 'Guia de Serviços Locais', icon: 'services', page: <GuiaServicos /> },
                { name: 'Mapa Interativo', icon: 'map', page: <MapaInterativo /> },
                { name: 'Classificados Locais', icon: 'classifieds', page: <ClassifiedsPage /> },
            ]
        },
        {
            pillar: 'Economia e Sustentabilidade',
            items: [
                 { name: 'Produtos', icon: 'stock', page: <ProductsPage /> },
                 { name: 'Pedidos', icon: 'services', page: <OrdersPage /> },
                 { name: 'Produtores', icon: 'user', page: <ProducersPage /> },
            ]
        },
         {
            pillar: 'Rifas, Vaquinhas e Cupons',
            items: [
                 { name: 'Rifas', icon: 'tag', page: <PlaceholderPage title="Rifas" /> },
                 { name: 'Vaquinhas', icon: 'crowdfunding', page: <PlaceholderPage title="Vaquinhas" /> },
                 { name: 'Cupons', icon: 'dollar', page: <PlaceholderPage title="Cupons" /> },
            ]
        },
         {
            pillar: 'Engajamento Comunitário',
            items: [
                 { name: 'Fórum', icon: 'community', page: <PlaceholderPage title="Fórum" /> },
                 { name: 'Denúncias', icon: 'services', page: <PlaceholderPage title="Denúncias" /> },
            ]
        },
        {
            pillar: 'Educação e Cultura',
            items: [
                 { name: 'Cursos', icon: 'education', page: <PlaceholderPage title="Cursos" /> },
                 { name: 'Agenda Cultural', icon: 'map', page: <PlaceholderPage title="Agenda Cultural" /> },
            ]
        },
    ];

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    if (!isLoggedIn) {
        return <LoginModal onLogin={handleLogin} />;
    }
    
    const currentPageComponent = menuItems
      .flatMap(i => ('items' in i) ? i.items : [i])
      .find(i => i.name === activePage)?.page;

    return (
        <div className="flex h-screen bg-neutral-light font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-dark text-white flex flex-col">
                <div className="p-6 text-center">
                    <h1 className="text-2xl font-bold font-heading">REDELOCAL</h1>
                    <p className="text-xs text-gray-400">Painel do Administrador</p>
                </div>
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((menu, index) => (
                        'pillar' in menu ? (
                           <div key={index}>
                               <h3 className="px-2 pt-4 pb-2 text-xs uppercase text-gray-400 font-bold">{menu.pillar}</h3>
                               {menu.items.map(item => (
                                   <button key={item.name} onClick={() => setActivePage(item.name)} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activePage === item.name ? 'bg-primary' : 'hover:bg-white/10'}`}>
                                       <Icon path={ICONS[item.icon]} />
                                       {item.name}
                                   </button>
                               ))}
                           </div>
                        ) : (
                           <button key={menu.name} onClick={() => setActivePage(menu.name)} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activePage === menu.name ? 'bg-primary' : 'hover:bg-white/10'}`}>
                               <Icon path={ICONS[menu.icon]} />
                               {menu.name}
                           </button>
                        )
                    ))}
                </nav>
                 <div className="p-4 border-t border-white/10">
                    <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors">
                        <Icon path={ICONS.logout} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                     <h2 className="text-xl font-bold text-neutral-dark">{activePage}</h2>
                     <div className="flex items-center gap-4">
                         <span className="font-semibold">Admin</span>
                         <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">A</div>
                     </div>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                   {currentPageComponent || <PlaceholderPage title={activePage} />}
                </div>
            </main>
        </div>
    );
}

export default App;
