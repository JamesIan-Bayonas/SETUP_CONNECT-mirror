import React, { useState } from "react";
import axios from "axios";
import GuestLayout from "@/Layouts/GuestLayout";
import CustomerInfo from "./Customers/CustomerInfo";
import BusinessInfo from "./Customers/BusinessInfo";
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
        webEmailAddress: "",
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
            "webEmailAddress",
        ];

        const hasEmpty = requiredFields.some(
            (field) => !formData[field as keyof FormData]
        );

        if (hasEmpty) return;

        try {
            setLoading(true);
            console.log("Submitting data to backend...");

            const response = await axios.post(
                "http://127.0.0.1:8000/api/applicants", //  Add backend API URL here (e.g. "/api/application-form/submit")
                formData
            );

            console.log("Server response:", response.data);
            alert("✅ Application submitted successfully!");

            // Reset form
            setFormData({
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
                webEmailAddress: "",
            });

            setSubmitted(false);
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
            <form className="space-y-10" onSubmit={handleSubmit}>
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
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-3 text-white text-sm font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-1 transition
                            ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-400"
                            }`}
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
};

export default ApplicationForm;
