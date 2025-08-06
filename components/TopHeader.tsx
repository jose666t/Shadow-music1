import React from 'react';

type HomeViewType = 'all' | 'music';

interface TopHeaderProps {
    activeHomeView: HomeViewType;
    setActiveHomeView: (view: HomeViewType) => void;
}


const Pill = ({ text, isActive = false, onClick }: { text: string, isActive?: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${isActive ? 'bg-green-500 text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}>
        {text}
    </button>
);

const TopHeader: React.FC<TopHeaderProps> = ({ activeHomeView, setActiveHomeView }) => {
    return (
        <header className="p-4 sm:p-6 sticky top-0 bg-neutral-950/80 backdrop-blur-sm z-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-700 rounded-full flex items-center justify-center font-bold text-xl">
                        J
                    </div>
                     <div className="flex items-center gap-2">
                        <Pill text="Todas" isActive={activeHomeView === 'all'} onClick={() => setActiveHomeView('all')} />
                        <Pill text="Música" isActive={activeHomeView === 'music'} onClick={() => setActiveHomeView('music')} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
