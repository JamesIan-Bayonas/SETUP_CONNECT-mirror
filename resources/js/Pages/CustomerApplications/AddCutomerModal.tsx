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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    const hasEmpty = requiredFields.some((field) => !formData[field as keyof FormData]);
    if (hasEmpty) return;

    try {
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

      const res = await axios.post("/setupcustomer", payload);

      window.dispatchEvent(
        new CustomEvent("setupcustomer:created", {
          detail: { message: res?.data?.message ?? "Customer added successfully" },
        })
      );

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
    } catch (err) {
      console.error(err);
      alert("Failed to add customer.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName: keyof FormData) =>
    `form-input border ${submitted && !formData[fieldName] ? "border-red-500" : "border-gray-400"} rounded px-3 py-2 w-full`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-start z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-10 p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Add SetUp Customer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <CustomerInfo formData={formData} handleChange={handleChange} submitted={submitted} inputClass={inputClass} />
          <BusinessInfo formData={formData} handleChange={handleChange} submitted={submitted} inputClass={inputClass} />

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-100">Cancel</button>
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