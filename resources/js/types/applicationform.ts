export interface FormData {
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    designationPosition: string;
    residentialAddress: string;
    agencyFirm: string;
    businessOfFirm: string;
    productLine: string;
    orgType: string;
    dateEstablished: string;
    nameOfHeadOfAgency: string;
    businessAddress: string;
    contactNumbers: string;
    emailAddress: string;
    website: string;
}

export const designationOptions = [
    "Chief Executive Officer (CEO)",
    "Chief Operating Officer (COO)",
    "Chief Financial Officer (CFO)",
    "Managing Director",
    "General Manager",
    "Operations Manager",
    "Sales Manager",
    "Marketing Manager",
    "Account Manager",
    "Business Development Manager",
    "Product Manager",
    "Office Manager",
    "Executive Assistant",
    "Administrative Officer",
    "Customer Service Manager",
    "IT Manager",
    "Software Engineer",
    "Project Manager",
    "Consultant",
    "Auditor",
    "Legal Counsel",
    "Doctor / Physician",
    "Dentist",
    "Veterinarian",
    "Nurse Supervisor",
    "Laboratory Manager",
];

export const orgTypeOptions = [
    "Sole Proprietorship",
    "Partnership",
    "Corporation",
    "Cooperative",
    "Franchise",
    "Limited Liability Company (LLC)",
    "Joint Venture",
    "Holding Company",
    "Branch Office",
    "Subsidiary",
];
