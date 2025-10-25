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

const CustomerInfo: React.FC<CustomerInfoProps> = ({
    formData,
    handleChange,
    submitted,
    inputClass,
}) => {
    return (
        <>
            <h2 className="text-lg font-semibold mb-4">
                Cooperator's Personal Information
            </h2>

            {/* Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <label className="form-label">
                        First Name <span className="text-red-500 ">*</span>
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
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
                        value={formData.middleName}
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
                        value={formData.lastName}
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
                        value={formData.suffix}
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
        </>
    );
};

export default CustomerInfo;
