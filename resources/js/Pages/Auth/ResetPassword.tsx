import { FormEventHandler } from "react";
import { Head, useForm } from "@inertiajs/react";

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface Props {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: Props) {
    const { data, setData, post, processing, errors } = useForm<ResetPasswordForm>({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/reset-password");
    };

    return (
        <>
            <Head title="Reset Password" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <img
                                    src="/images/dost_logo.png"
                                    alt="DOST Logo"
                                    className="h-16 w-16 mr-3"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        SETUP CONNECT
                                    </h2>
                                    <p className="text-xs text-gray-600">
                                        Department of Science and Technology
                                    </p>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Set Your Password
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Create a secure password for your account
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={submit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    readOnly
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={data.email}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter new password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Must be at least 8 characters long
                                </p>
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Confirm new password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                                >
                                    {processing ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Setting Password...
                                        </span>
                                    ) : (
                                        "Set Password & Login"
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                After setting your password, you'll be redirected to login
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
