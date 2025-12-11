import React, { useState } from "react";
import axios from "axios";
import { FormData } from "@/types/applicationform";
import CustomerInfo from "./components/CustomerInfo";
import BusinessInfo from "./components/BusinessInfo";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose }) => {
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
  // Inline error shown inside the modal for validation / server errors
  const [inlineError, setInlineError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (inlineError) setInlineError(null); // clear inline error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setInlineError(null);

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

    const missing = requiredFields.filter((f) => !formData[f as keyof FormData]);
    if (missing.length > 0) {
      const missingNames = missing.join(", ");
      setInlineError(`Please fill required fields: ${missingNames}`);
      return;
    }

    setLoading(true);

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
      type_of_organization: formData.orgType,
      date_established: formData.dateEstablished,
      name_of_head_of_agency_firm: formData.nameOfHeadOfAgency,
      business_address: formData.businessAddress,
      contact_nos: formData.contactNumbers,
      email_address: formData.emailAddress,
      website: formData.website,
    };

    try {
      const res = await axios.post("/setupcustomer", payload);

      // success - dispatch event your view listens to
      const successMsg = res?.data?.message ?? "Customer added successfully";
      window.dispatchEvent(
        new CustomEvent("setupcustomer:created", { detail: { message: successMsg } })
      );

      // close modal & reset
      onClose();
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
        emailAddress: "",
        website: "",
      });
      setSubmitted(false);
      setInlineError(null);
    } catch (err: any) {
      // Prefer structured server responses
      const resp = err?.response;

      // Laravel validation errors come as 422 with errors object
      if (resp && resp.status === 422 && resp.data && resp.data.errors) {
        const errors = resp.data.errors as Record<string, string[]>;
        // If email has errors (including unique rule), trigger duplicate UI in parent view
        if (errors.email_address && errors.email_address.length > 0) {
          const message = errors.email_address.join(" ");
          window.dispatchEvent(
            new CustomEvent("setupcustomer:duplicate", { detail: { message } })
          );
          setInlineError(message);
        } else {
          // show all validation messages inline
          const allMessages = Object.values(errors).flat().join("\n");
          setInlineError(allMessages || "Validation failed. Please check your input.");
        }
      } else if (resp && resp.status === 409) {
        // If you ever return 409 for duplicates
        const message = resp.data?.message ?? "Email already exists.";
        window.dispatchEvent(
          new CustomEvent("setupcustomer:duplicate", { detail: { message } })
        );
        setInlineError(message);
      } else {
        // Generic fallback message
        const message =
          resp?.data?.message ||
          resp?.data?.error ||
          err?.message ||
          "Failed to add customer. Please try again.";
        setInlineError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName: keyof FormData) =>
    `form-input border ${
      submitted && !formData[fieldName] ? "border-red-500" : "border-gray-400"
    } rounded px-3 py-2 w-full`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-start z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-10 p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Add SetUp Customer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">
            &times;
          </button>
        </div>

        {/* Inline error box */}
        {inlineError && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-800 whitespace-pre-line">
            {inlineError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-white font-semibold ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Add SetUp Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
