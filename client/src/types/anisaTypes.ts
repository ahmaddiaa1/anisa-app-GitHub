import { Order } from "./ordersTypes";

export type anisaData = {
  id: string;
  phone: string;
  email: string;
  books: string;
  skills: string;
  pdfUrl: string;
  notes: notes[];
  courses: string;
  WhyAnisa: string;
  whatsapp: string;
  fullName: string;
  isVerified: false;
  learnWithUs: true;
  createdAt: string;
  experience: string;
  blackList: boolean;
  address: Address[];
  anisaStatus: string;
  devotedHours: string;
  maritalStatus: string;
  facebookEmail: string;
  multiMedia: string[];
  image: FileList | null;
  whatAnisaOffers: string;
  graduateOrStudent: string;
  otherMaritalStatus: string;
  EducationQualification: string;
  anisaPerceptionOfMother: string;
  orders: Order[];
};

interface notes {
  id: string;
  body: string;
}

export interface Address {
  id: string;
  address: string;
  createdAt: string;
}

export interface errorAnisaValidation {
  errors: {
    fullName?: {
      message: string;
    };
    phone?: {
      message: string;
    };
    whatsapp?: {
      message: string;
    };
    email?: {
      message: string;
    };
    facebookEmail?: {
      message: string;
    };
    maritalStatus?: {
      message: string;
    };
    graduateOrStudent?: {
      message: string;
    };
    multiMedia?: {
      message: string;
    };
    anisaStatus?: {
      message: string;
    };
    address?: {
      message: string;
    }[];
  };
}
