import React from "react";
import { FormData, orgTypeOptions } from "@/types/applicationform";

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const websiteRegex =
        /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

    const isEmail = (value: string) => emailRegex.test(value);
    const isWebsite = (value: string) => websiteRegex.test(value);

    const isInvalidWebOrEmail =
        submitted &&
        formData.webEmailAddress.trim() !== "" &&
        !isEmail(formData.webEmailAddress) &&
        !isWebsite(formData.webEmailAddress);

    return (
        <>
            <h2 className="text-lg font-semibold mb-4">Business Information</h2>

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
                    <select
                        name="orgType"
                        value={formData.orgType}
                        onChange={handleChange}
                        className={inputClass("orgType")}
                    >
                        <option value="">Select organization type</option>
                        {orgTypeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
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
                </div>

                {/* Website / Email */}
                <div>
                    <label className="form-label">
                        Website/Email Address{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="webEmailAddress"
                        value={formData.webEmailAddress}
                        onChange={handleChange}
                        placeholder="e.g. johndoe@email.com or https://mybusiness.com"
                        className={inputClass("webEmailAddress")}
                    />
                    {submitted && !formData.webEmailAddress && (
                        <p className="text-red-500 text-sm mt-1">
                            This field is required
                        </p>
                    )}
                    {isInvalidWebOrEmail && (
                        <p className="text-red-500 text-sm mt-1">
                            Your website/email address is invalid
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default BusinessInfo;
