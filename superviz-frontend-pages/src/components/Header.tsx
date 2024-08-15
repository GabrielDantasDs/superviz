// Card.tsx
import React, { ReactNode } from 'react';
import EdiText from 'react-editext';

interface HeaderProps {
    children: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4">
            <div className="px-4 py-2">
                <h2 className="text-xl font-bold text-gray-800">
                    {children}
                </h2>
            </div>
        </div>
    );
};

export default Header;
