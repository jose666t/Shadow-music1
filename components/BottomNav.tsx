
import React from 'react';
import { HomeIcon, SearchIcon, LibraryIcon, PlusIcon } from './IconComponents';

type ActiveView = 'home' | 'search' | 'library' | 'create';

interface BottomNavProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent z-40">
            <div className="absolute bottom-0 left-0 right-0 h-full bg-neutral-950/70 backdrop-blur-xl">
                 <div className="h-full grid grid-cols-4 items-center px-4">
                    <NavItem 
                        label="Inicio"
                        icon={<HomeIcon className="w-6 h-6" />}
                        isActive={activeView === 'home'}
                        onClick={() => setActiveView('home')}
                    />
                     <NavItem 
                        label="Buscar"
                        icon={<SearchIcon className="w-6 h-6" />}
                        isActive={activeView === 'search'}
                        onClick={() => setActiveView('search')}
                    />
                     <NavItem 
                        label="Tu biblioteca"
                        icon={<LibraryIcon className="w-6 h-6" />}
                        isActive={activeView === 'library'}
                        onClick={() => setActiveView('library')}
                    />
                     <NavItem 
                        label="Crear"
                        icon={<PlusIcon className="w-6 h-6 border-2 border-neutral-400 rounded-full p-0.5" />}
                        isActive={activeView === 'create'}
                        onClick={() => setActiveView('create')}
                    />
                 </div>
            </div>
        </nav>
    );
};

export default BottomNav;
