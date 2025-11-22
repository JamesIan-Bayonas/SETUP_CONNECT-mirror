import React from "react";

interface GuestLayoutProps {
    title?: string;
    children: React.ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ title, children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header with Logo */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-10 py-8">
                    <div className="flex items-center justify-center gap-4">
                        <img
                            src="/images/dost_logo.png"
                            alt="DOST Logo"
                            className="h-16 w-16 bg-white rounded-full p-2 shadow-lg"
                        />
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                                SETUP CONNECT
                            </h1>
                            <p className="text-blue-100 text-sm mt-1">
                                Department of Science and Technology
                            </p>
                        </div>
                    </div>
                    {title && (
                        <div className="mt-6 text-center">
                            <h2 className="text-xl md:text-2xl font-semibold text-white border-t border-blue-400 pt-4">
                                {title}
                            </h2>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-10 md:p-12">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default GuestLayout;
