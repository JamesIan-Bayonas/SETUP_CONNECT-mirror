import { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';
interface AuthenticatedLayoutProps {
  header?: ReactNode;
}

export default function AuthenticatedLayout({ header, children }: PropsWithChildren<AuthenticatedLayoutProps>) {
  const user = usePage<{ auth: { user: User } }>().props.auth.user;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [managementOpen, setManagementOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = usePage().url;
  const [documentOpen, setDocumentOpen] = useState(true);

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo and Brand */}
              <div className="flex items-center ml-4">
                <img
                  src="/images/dost_logo.png"
                  alt="DOST Logo"
                  className="h-8 w-8"
                />
                <span className="ml-3 text-xl font-bold text-gray-800 hidden sm:block">SETUP CONNECT</span>
              </div>
            </div>

            {/* Right side - User Profile */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-8 w-8">
                  {user.photo ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
                      src={`/storage/${user.photo}`}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-indigo-200">
                      <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-700">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.user_type.replace('_', ' ')}</div>
                </div>
              </div>

              <Link
                href="/logout"
                method="post"
                as="button"
                className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="ml-2 hidden sm:block">Logout</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-20 flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            
          >
            <svg
              className={`flex-shrink-0 h-6 w-6 ${
                isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span className="ml-3">Dashboard</span>}
          </Link>

          {/* Management Section - Only for admin and psto_staff */}
          {(user.user_type === 'admin' || user.user_type === 'psto_staff') && (
            <div className="space-y-1">
              {/* Management Group Header */}
              <button
                onClick={() => setManagementOpen(!managementOpen)}
                className="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {sidebarOpen && <span className="ml-3">Management</span>}
                </div>
                {sidebarOpen && (
                  <svg
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${
                      managementOpen ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              {/* Management Sub-items */}
              {(managementOpen || !sidebarOpen) && (
                <div className={`space-y-1 ${sidebarOpen ? 'pl-3' : ''}`}>
                  {/* Users */}
                  <Link
                    href="/users"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/users')
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 h-5 w-5 ${
                        isActive('/users') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {sidebarOpen && <span className="ml-3">Users</span>}
                  </Link>

                  {/* Organization Types - Admin only */}
                  {user.user_type === 'admin' && (
                    <Link
                      href="/org-types"
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive('/org-types')
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <svg
                        className={`flex-shrink-0 h-5 w-5 ${
                          isActive('/org-types') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                       {sidebarOpen && <span className="ml-3">Organization Types</span>}
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SETUP Section - Only for admin and psto_staff */}
          {(user.user_type === 'admin' || user.user_type === 'psto_staff') && (
            <div className="space-y-1">
              {/* SETUP Group Header */}
              <button
                onClick={() => setSetupOpen(!setupOpen)}
                className="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {sidebarOpen && <span className="ml-3">SETUP</span>}
                </div>
                {sidebarOpen && (
                  <svg
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${
                      setupOpen ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              {/* SETUP Sub-items */}
              {(setupOpen || !sidebarOpen) && (
                <div className={`space-y-1 ${sidebarOpen ? 'pl-3' : ''}`}>
                  {/* SETUP Approvals */}
                  <Link
                    href="/customerapprovalform"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/customerapprovalform') 
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 h-5 w-5 ${
                        isActive('/customerapprovalform') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                      {sidebarOpen && <span className="ml-3">SETUP Approvals</span>}
                  </Link>

                  {/* SETUP Clients */}
                  <Link
                    href="/setupcustomers"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/setupcustomers')
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 h-5 w-5 ${
                        isActive('/setupcustomers') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {sidebarOpen && <span className="ml-3">SETUP Clients</span>}
                  </Link>
                </div>
              )}
            </div>
          )}
              {/* Document Section - Adjust permission as needed */}
              <div className="space-y-1">
              {/* Document Group Header */}
              <button
                onClick={() => setDocumentOpen(!documentOpen)}
                className="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2m-4-6v4m4-4v4"
                  />
                </svg>
              {sidebarOpen && <span className="ml-3">Document</span>}
              </div>
              {sidebarOpen && (
                <svg
                  className={`h-5 w-5 text-gray-400 transform transition-transform ${
                    documentOpen ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              </button>

              {/* Document Sub-items */}
              {(documentOpen || !sidebarOpen) && (
                <div className={`space-y-1 ${sidebarOpen ? "pl-3" : ""}`}>
                  {/* View Documents */}
                  <Link
                    href="/document/view"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive("/document/view")
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 h-5 w-5 ${
                        isActive("/document/view")
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                {sidebarOpen && <span className="ml-3">View</span>}
                  </Link>

                {/* You can add more sub-items later, e.g. "Upload", etc. */}
                </div>
            )}
          </div>


          {/* Messages Section */}
          {(user.user_type === 'admin' || user.user_type === 'psto_staff') && (
            <div className="space-y-1">
              {/* Message Group Header */}
              <button
                onClick={() => setMessageOpen(!messageOpen)}
                className="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {sidebarOpen && <span className="ml-3">Messages</span>}
                </div>

                {sidebarOpen && (
                  <svg
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${
                      messageOpen ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>

              {/* Message Sub-items */}
              {(messageOpen || !sidebarOpen) && (
                <div className={`space-y-1 ${sidebarOpen ? 'pl-3' : ''}`}>
                  {/* Sent Message Link */}
                  <Link
                    href="/messages"
                    className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/messages')
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 9-18 9 4-9-4-9z"
                      />
                    </svg>
                    {sidebarOpen && <span className="ml-3">Sent Message</span>}
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
        {/* Sidebar Footer - Collapse Hint */}
        {sidebarOpen && (
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-500">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Click menu icon to collapse
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40 top-16"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Menu */}
          <aside className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col">
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {/* Dashboard */}
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg className="flex-shrink-0 h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>

              {/* Management Section */}
              {(user.user_type === 'admin' || user.user_type === 'psto_staff') && (
                <div className="space-y-1">
                  <button
                    onClick={() => setManagementOpen(!managementOpen)}
                    className="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                  >
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Management
                    </div>
                    <svg
                      className={`h-5 w-5 text-gray-400 transform transition-transform ${
                        managementOpen ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {managementOpen && (
                    <div className="pl-3 space-y-1">
                      <Link
                        href="/users"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                          isActive('/users') 
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <svg className="flex-shrink-0 h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Users
                      </Link>

                      {user.user_type === 'admin' && (
                        <Link
                          href="/org-types"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                            isActive('/org-types') 
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <svg className="flex-shrink-0 h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Organization Types
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SETUP Section - Mobile */}
              {(user.user_type === 'admin' || user.user_type === 'psto_staff') && (
                <div className="space-y-1">
                  <button
                    onClick={() => setSetupOpen(!setupOpen)}
                    className="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                  >
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      SETUP
                    </div>
                    <svg
                      className={`h-5 w-5 text-gray-400 transform transition-transform ${
                        setupOpen ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {setupOpen && (
                    <div className="pl-3 space-y-1">
                      <Link
                        href="/customerapprovalform"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                          isActive('/customerapprovalform') 
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <svg className="flex-shrink-0 h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        SETUP Approvals
                      </Link>

                      <Link
                        href="/setupcustomers"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                          isActive('/setupcustomers') 
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <svg className="flex-shrink-0 h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        SETUP Clients
                      </Link>
                    </div>
                  )}
                </div>
              )}
              {/* Document Section - Mobile */}
              <div className="space-y-1">
                <button
                  onClick={() => setDocumentOpen(!documentOpen)}
                  className="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                >
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-6 w-6 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2m-4-6v4m4-4v4"
                      />
                    </svg>
                    Document
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${
                      documentOpen ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {documentOpen && (
                  <div className="pl-3 space-y-1">
                    <Link
                      href="/document/view"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                        isActive("/document")
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <svg
                        className="flex-shrink-0 h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View
                    </Link>

                    {/* Add more items here if needed */}
                  </div>
                )}
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out pt-16 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
      {header && ( 
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {header}
    </div>
  </header>
)}
    <main>
  
       {children} 
    </main>
      </div>
    </div>
  );
}
