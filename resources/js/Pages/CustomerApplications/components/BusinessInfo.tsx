import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormData } from "@/types/applicationform";

interface OrgType {
    id: number,
    name: string,
    is_active: boolean
}

interface BusinessInfoProps {
    formData: FormData;
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    submitted: boolean;
    inputClass: (field: keyof FormData) => string;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({
    formData,
    handleChange,
    submitted,
    inputClass,
}) => {
    const [orgTypeOptions, setOrgTypeOptions] = useState<OrgType[]>([]);
    const [loadingOrgTypes, setLoadingOrgTypes] = useState(true);

    const phoneRegex = /^09\d{2} \d{4} \d{3}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const websiteRegex =
        /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

    const isValidContactNumber = formData.contactNumbers.trim() === "" || phoneRegex.test(formData.contactNumbers);
    const isValidEmail = formData.emailAddress.trim() === "" || emailRegex.test(formData.emailAddress);
    const isValidWebsite = formData.website.trim() === "" || websiteRegex.test(formData.website);

    useEffect(() => {
        const loadOrgTypes = async () => {
            try {
                const response = await axios.get<OrgType[]>(
                    "http://127.0.0.1:8000/api/org-types"
                );
                setOrgTypeOptions(response.data);
            } catch (err) {
                console.error("Failed to fetch business organization types", err);
            } finally {
                setLoadingOrgTypes(false);
            }
        };

        loadOrgTypes();
    }, []);

    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-600 text-white rounded-lg p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Business Information</h2>
            </div>

            {/* Agency / Firm */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <label className="form-label">
                        Agency/Firm <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="agencyFirm"
                        value={formData.agencyFirm}
                        onChange={handleChange}
                        placeholder="e.g. Bread and Butter Trading Co."
                        className={inputClass("agencyFirm")}
                    />
                    {submitted && !formData.agencyFirm && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                </div>

                <div>
                    <label className="form-label">
                        Business of the Firm{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="businessOfFirm"
                        value={formData.businessOfFirm}
                        onChange={handleChange}
                        placeholder="e.g. Baking Supplies"
                        className={inputClass("businessOfFirm")}
                    />
                    {submitted && !formData.businessOfFirm && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                </div>

                <div>
                    <label className="form-label">
                        Product Line <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="productLine"
                        value={formData.productLine}
                        onChange={handleChange}
                        placeholder="e.g. Baking Products"
                        className={inputClass("productLine")}
                    />
                    {submitted && !formData.productLine && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                </div>
            </div>

            {/* Organization Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Type of Organization */}
                <div>
                    <label className="form-label">
                        Type of Organization{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    {loadingOrgTypes ? (
                        <select className={inputClass("orgType")}>
                            <option value="">Loading...</option>
                        </select>
                    ) : (
                        <select
                            name="orgType"
                            value={formData.orgType}
                            onChange={handleChange}
                            className={inputClass("orgType")}
                        >
                            <option value="">Select organization type</option>
                            {orgTypeOptions.map((opt) => (
                                <option key={opt.id} value={opt.id.toString()}>
                                {opt.name}
                                </option>
                            ))}
                        </select>
                    )}
                    {submitted && !formData.orgType && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                </div>

                <div>
                    <label className="form-label">
                        Date Established <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="date"
                        name="dateEstablished"
                        value={formData.dateEstablished}
                        onChange={handleChange}
                        className={inputClass("dateEstablished")}
                        max={new Date().toISOString().split("T")[0]} // ⛔ prevent future dates
                    />

                    {/* Readable date display */}
                    {formData.dateEstablished && (
                        <p className="text-gray-600 text-sm mt-1">
                            {new Date(
                                formData.dateEstablished
                            ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    )}

                    {submitted && !formData.dateEstablished && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                </div>

                <div>
                    <label className="form-label">
                        Name of the Head of Agency{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nameOfHeadOfAgency"
                        value={formData.nameOfHeadOfAgency}
                        onChange={handleChange}
                        placeholder="e.g. Dr. Jane Dela Cruz"
                        className={inputClass("nameOfHeadOfAgency")}
                    />
                    {submitted && !formData.nameOfHeadOfAgency && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                </div>
            </div>

            {/* Business Address */}
            <div>
                <label className="form-label">
                    Business Address <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    placeholder="e.g. Purok 5, Miputak, Dipolog City"
                    className={inputClass("businessAddress")}
                    rows={3}
                />
                {submitted && !formData.businessAddress && (
                    <p className="text-red-500 text-sm mt-1">
                        This field is required
                    </p>
                )}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Number */}
                <div>
                    <label className="form-label">
                        Contact No. <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="contactNumbers"
                        value={formData.contactNumbers}
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ""); // numbers only
                            value = value.slice(0, 11); // limit to 11 digits
                            value = value.replace(/(\d{4})(?=\d)/g, "$1 "); // space after 4 digits
                            handleChange({
                                target: {
                                    name: e.target.name,
                                    value,
                                },
                            } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        placeholder="e.g. 0917 123 4567"
                        className={inputClass("contactNumbers")}
                    />
                    {submitted && !formData.contactNumbers && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                    {submitted &&
                        formData.contactNumbers.replace(/\s/g, "").length > 0 &&
                        formData.contactNumbers.replace(/\s/g, "").length <
                            11 && (
                            <p className="text-red-500 text-sm mt-1">
                                Contact number must be 11 digits
                            </p>
                    )}
                    {submitted && formData.contactNumbers.replace(/\s/g, "").length > 0 &&
                        !isValidContactNumber && (
                            <p className="text-red-500 text-sm mt-1">
                                Please enter a valid contact number (09XX XXX XXXX)
                            </p>
                    )}
                </div>

                {/* Email Address */}
                <div>
                    <label className="form-label">
                        Email Address{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        placeholder="e.g. johndoe@email.com"
                        className={inputClass("emailAddress")}
                    />
                    {submitted && !formData.emailAddress && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                    {submitted && formData.emailAddress && !isValidEmail && (
                        <p className="text-red-500 text-sm mt-1">
                            Please enter a valid email address
                        </p>
                    )}
                </div>
            </div>

            {/* Website (Optional) */}
            <div className="mt-8">
                <label className="form-label">
                    Website (Optional)
                </label>
                <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="e.g. https://mybusiness.com"
                    className="form-input border border-gray-400 rounded px-3 py-2 w-full"
                />
                {submitted && formData.website && !isValidWebsite && (
                    <p className="text-red-500 text-sm mt-1">
                        Please enter a valid website URL
                    </p>
                )}
            </div>
        </div>
    );
};

export default BusinessInfo;
