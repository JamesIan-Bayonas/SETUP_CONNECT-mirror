import React, { useState } from "react";
import axios from "axios";
import GuestLayout from "@/Layouts/GuestLayout";
import CustomerInfo from "./components/CustomerInfo";
import BusinessInfo from "./components/BusinessInfo";
import { FormData } from "@/types/applicationform";

const ApplicationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        designationPosition: "",
        residentialAddress: "",
        agencyFirm: "",
        businessOfFirm: "",
        productLine: "",
        orgType: "",
        dateEstablished: "",
        nameOfHeadOfAgency: "",
        businessAddress: "",
        contactNumbers: "",
        emailAddress: "",
        website: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const requiredFields = [
            "firstName",
            "lastName",
            "designationPosition",
            "residentialAddress",
            "agencyFirm",
            "businessOfFirm",
            "productLine",
            "orgType",
            "dateEstablished",
            "nameOfHeadOfAgency",
            "businessAddress",
            "contactNumbers",
            "emailAddress",
        ];

        const hasEmpty = requiredFields.some(
            (field) => !formData[field as keyof FormData]
        );

        if (hasEmpty) return;

        try {
            setLoading(true);
            console.log("Submitting data to backend...");

            // ✅ Map frontend camelCase fields to Laravel snake_case fields
            const payload = {
                first_name: formData.firstName,
                middle_name: formData.middleName,
                last_name: formData.lastName,
                suffix: formData.suffix,
                designation_position: formData.designationPosition,
                residential_address: formData.residentialAddress,
                name_of_agency_firm: formData.agencyFirm,
                business_of_the_firm: formData.businessOfFirm,
                product_line: formData.productLine,
                business_organization_type_id: formData.orgType,
                date_established: formData.dateEstablished,
                name_of_head_of_agency_firm: formData.nameOfHeadOfAgency,
                business_address: formData.businessAddress,
                contact_nos: formData.contactNumbers,
                email_address: formData.emailAddress,
                website: formData.website,
            };

            const response = await axios.post(
                "http://127.0.0.1:8000/api/applicants",
                payload
            );

            console.log("Server response:", response.data);
            
            // Redirect to success page
            window.location.href = "/application-success";
        } catch (error) {
            console.error("Submission failed:", error);
            alert("❌ Something went wrong while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (fieldName: keyof FormData) =>
        `form-input border ${
            submitted && !formData[fieldName]
                ? "border-red-500"
                : "border-gray-400"
        } rounded px-3 py-2 w-full`;

    return (
        <GuestLayout title="Customer's Application Form">
            <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Instruction Banner */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-blue-800">
                                Please fill out all required fields marked with <span className="text-red-500">*</span>
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                Your application will be reviewed by our team within 3-5 business days.
                            </p>
                        </div>
                    </div>
                </div>

                <CustomerInfo
                    formData={formData}
                    handleChange={handleChange}
                    submitted={submitted}
                    inputClass={inputClass}
                />
                <BusinessInfo
                    formData={formData}
                    handleChange={handleChange}
                    submitted={submitted}
                    inputClass={inputClass}
                />

                {/* Submit Button */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        By submitting, you agree to our terms and conditions.
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full sm:w-auto px-10 py-3.5 text-white text-base font-semibold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all transform hover:scale-105
                            ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-400"
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Submit Application
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
};

export default ApplicationForm;
