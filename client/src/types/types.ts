export type client = {
  id: string;
  phone: string;
  fullName: string;
  whatsapp: string;
  childNote: string;
  orderDate: string | Date;
  fromHour: string;
  toHour: string;
  whoStaysWithAnisa: string;
  pdfUrl: string;
  multiMedia: string[];
  image: FileList | string[];
  children: child[];
  childrenNum: number;
  blackList: boolean;
  notes: notes[];
  address: Address[];
  outInHome: string;
  orders: [];
  isVerified: boolean;
  createdAt: string;
};

export interface formDataProps {
  phone: string;
  fullName: string;
  whatsapp: string;
  childNote: string;
  orderDate: Date | string;
  fromHour: string;
  toHour: string;
  whoStaysWithAnisa: string;
  pdfUrl: string;
  multiMedia: string[];
  image: FileList | string[];
  children: child[];
  childrenNum: number;
  notes: notes[];
  address: Address[];
  outInHome: string;
  orders: [];
  isVerified: boolean;
  createdAt: string;
}

export type child = {
  id: string;
  name: string;
  age: string;
  specialChild: boolean;
  createdAt: string;
};

export interface Address {
  id: string;
  address: string;
  clientID?: string;
  anisaID?: string;
  createdAt: string;
}

export interface notes {
  id: string;
  body: string;
  createdAt: string;
}

export type clientWithOutID = Omit<client, "id">;

export type UserProps = {
  id: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  isCanceled: boolean;
  createdAt: string;
};

export interface errorValidation {
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
    children?: {
      message: string;
    };
    childrenNum?: {
      message: string;
    };
    childNote?: {
      message: string;
    };

    address?: Array<{ message: string }> | undefined;

    outInHome?: {
      message: string;
    };

    orderDate?: {
      message: string;
    };
    fromHour?: {
      message: string;
    };
    toHour?: {
      message: string;
    };
    whoStaysWithAnisa?: {
      message: string;
    };
    pdfUrl?: {
      message: string;
    };
    image?: {
      message: string;
    };
    notes?: {
      message: string;
    };
  };
}

export interface user {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm?: string;
}

export type auditLog = {
  id: string;
  user: string;
  userID: string;
  actionText: string;
  orderID: string;
  clientName: string;
  actionType: string;
  createdAt: string;
};

export type TagType = "blue" | "green" | "silver" | "red" | "yellow";
