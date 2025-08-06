
import React from 'react';

export const AiLoader = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-neutral-400 text-sm ml-2">AI is curating...</span>
    </div>
);
