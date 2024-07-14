// Card.tsx
import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4">
            <div className="px-4 py-2">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>
        </div>
    );
};

export default Header;
