import React from "react";
import { FormData, designationOptions } from "@/types/applicationform";

interface CustomerInfoProps {
    formData: FormData;
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    submitted: boolean;
    inputClass: (field: keyof FormData) => string;
}

    const capitalizeFirstLetter = (value: string): string => {
        if (!value) return "";
        return value
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };


const CustomerInfo: React.FC<CustomerInfoProps> = ({
    formData,
    handleChange,
    submitted,
    inputClass,
}) => {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 text-white rounded-lg p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Cooperator's Personal Information
                </h2>
            </div>

            {/* Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <label className="form-label">
                        First Name <span className="text-red-500 ">*</span>
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={capitalizeFirstLetter(formData.firstName)}
                        onChange={handleChange}
                        placeholder="e.g. John"
                        className={inputClass("firstName")}
                    />
                    {submitted && !formData.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                </div>
                <div>
                    <label className="form-label">Middle Name</label>
                    <input
                        type="text"
                        name="middleName"
                        value={capitalizeFirstLetter(formData.middleName)}
                        onChange={handleChange}
                        placeholder="e.g. Andrew"
                        className="form-input border border-gray-400 rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label className="form-label">
                        Last Name <span className="text-red-500 ">*</span>
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={capitalizeFirstLetter(formData.lastName)}
                        onChange={handleChange}
                        placeholder="e.g. Doe"
                        className={inputClass("lastName")}
                    />
                    {submitted && !formData.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                </div>
            </div>

            {/* Suffix / Designation Position */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <label className="form-label">Suffix</label>
                    <input
                        type="text"
                        name="suffix"
                        value={capitalizeFirstLetter(formData.suffix)}
                        onChange={handleChange}
                        placeholder="e.g. Jr., Sr., III"
                        className="form-input border border-gray-400 rounded px-3 py-2 w-full"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="form-label">
                        Designation Position{" "}
                        <span className="text-red-500 ">*</span>
                    </label>
                    <select
                        name="designationPosition"
                        value={formData.designationPosition}
                        onChange={handleChange}
                        className={inputClass("designationPosition")}
                    >
                        <option value="">Select designation</option>
                        {designationOptions.map((pos) => (
                            <option key={pos} value={pos}>
                                {pos}
                            </option>
                        ))}
                    </select>
                    {submitted && !formData.designationPosition && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                </div>
            </div>

            {/* Residential Address */}
            <div>
                <label className="form-label">
                    Residential Address <span className="text-red-500 ">*</span>
                </label>
                <textarea
                    name="residentialAddress"
                    value={formData.residentialAddress}
                    onChange={handleChange}
                    placeholder="e.g. 123 Main Street, Dipolog City"
                    className={inputClass("residentialAddress")}
                    rows={3}
                />
                {submitted && !formData.residentialAddress && (
                    <p className="text-red-500 text-sm mt-1">
                        This field is required
                    </p>
                )}
            </div>
        </div>
    );
};

export default CustomerInfo;
