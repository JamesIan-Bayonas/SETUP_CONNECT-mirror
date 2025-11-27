import React from "react";
import { Head } from "@inertiajs/react";

const ApplicationSuccess: React.FC = () => {
    return (
        <>
            <Head title="Application Submitted Successfully" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
                <div className="max-w-2xl w-full">
                    {/* Success Card */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header with Gradient */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-lg">
                                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Application Submitted!
                            </h1>
                            <p className="text-green-100 text-lg">
                                Thank you for applying to SETUP CONNECT
                            </p>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-10">
                            <div className="space-y-6">
                                {/* What Happens Next */}
                                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        What happens next?
                                    </h2>
                                    <ol className="space-y-4">
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">1</span>
                                            <div>
                                                <p className="font-medium text-gray-800">Application Review</p>
                                                <p className="text-sm text-gray-600">Our team will review your application within 3-5 business days.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">2</span>
                                            <div>
                                                <p className="font-medium text-gray-800">Email Notification</p>
                                                <p className="text-sm text-gray-600">You'll receive an email once your application is approved.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">3</span>
                                            <div>
                                                <p className="font-medium text-gray-800">Account Setup</p>
                                                <p className="text-sm text-gray-600">Set your password and access the SETUP CONNECT portal.</p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>

                                {/* Important Note */}
                                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Important Reminder
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        Please check your email regularly for updates. Make sure to check your spam/junk folder if you don't see our email in your inbox.
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="font-semibold text-gray-800 mb-3">Need Help?</h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        If you have any questions about your application, feel free to contact us:
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="font-medium">Email:</span> setup.connect@dost.gov.ph
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <a
                                    href="/login"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Go to Login
                                </a>
                                <a
                                    href="/"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Back to Home
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Application Reference: #{new Date().getTime().toString().slice(-8)}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ApplicationSuccess;
