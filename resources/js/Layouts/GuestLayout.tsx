import React from "react";

interface GuestLayoutProps {
    title?: string;
    children: React.ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ title, children }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-10 md:p-12">
                {title && (
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
                        {title}
                    </h1>
                )}
                {children}
            </div>
        </div>
    );
};

export default GuestLayout;
