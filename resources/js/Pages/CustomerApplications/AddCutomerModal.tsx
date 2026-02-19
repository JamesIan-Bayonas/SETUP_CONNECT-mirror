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
  const [inlineError, setInlineError] = useState<string | null>(null);

  const requiredFields: (keyof FormData)[] = [
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (inlineError) setInlineError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setInlineError(null);

    // FRONTEND REQUIRED CHECK
    const missingFields = requiredFields.filter((f) => !formData[f]);
    if (missingFields.length > 0) {
      // dispatch missing popup event to parent view (so it shows the designed popup)
      window.dispatchEvent(
        new CustomEvent("setupcustomer:missing", {
          detail: {
            message: "Please fill all required fields before submitting.",
            missingFields,
          },
        })
      );
      // keep modal open and do not submit
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
      business_organization_type_id: formData.orgType,
      date_established: formData.dateEstablished,
      name_of_head_of_agency_firm: formData.nameOfHeadOfAgency,
      business_address: formData.businessAddress,
      contact_nos: formData.contactNumbers,
      email_address: formData.emailAddress,
      website: formData.website,
    };

    try {
      const res = await axios.post("/setupcustomer", payload);

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
      const resp = err?.response;

      // Laravel validation errors -> 422
      if (resp && resp.status === 422 && resp.data && resp.data.errors) {
        const errors = resp.data.errors as Record<string, string[]>;

        // If there are non-email validation errors, show them inline
        const nonEmailErrors = Object.entries(errors)
          .filter(([field]) => field !== "email_address")
          .flatMap(([, msgs]) => msgs);

        if (nonEmailErrors.length > 0) {
          setInlineError(nonEmailErrors.join("\n"));
          return;
        }

        // If only email has errors (e.g. unique), dispatch duplicate user popup
        if (errors.email_address && errors.email_address.length > 0) {
          const message = errors.email_address.join(" ");
          window.dispatchEvent(
            new CustomEvent("setupcustomer:duplicate", { detail: { message } })
          );
          // also keep a short inline hint
          setInlineError("This email is already in use.");
          return;
        }

        setInlineError("Validation failed. Please check your input.");
        return;
      }

      // Optional: 409 conflict handling
      if (resp && resp.status === 409) {
        const message = resp.data?.message ?? "Email already exists.";
        window.dispatchEvent(
          new CustomEvent("setupcustomer:duplicate", { detail: { message } })
        );
        setInlineError("This email is already in use.");
        return;
      }

      const fallback =
        resp?.data?.message ||
        resp?.data?.error ||
        err?.message ||
        "Failed to add customer. Please try again.";
      setInlineError(fallback);
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
