import { anisaData } from "./anisaTypes";
import { client } from "./types";

export interface Order {
  id: string;
  orderCategoryID: string;
  clientID: string;
  anisaID: string;
  orderCategory: { title: string; isEnable: boolean };
  client: client;
  anisa: anisaData;
  orderPrice: number;
  orderHours: number;
  doneHours: number;
  orderStatus: string;
  child: child;
  startDate: Date | string;
  endDate: Date | string;
  payedAmount: number;
  location: string;
  notes: notes[];
  createdAt: string;
  finalPrice: number;
  whoStaysWithAnisa: string;
  anisaOrderPrice: number;
  profit: number;
  remainingHours: number;
  remainingAmount: number;
  childID: string;
  absent: string;
  createdByName: string;
  hasAnisaBeenPaid: boolean;
}

export type child = {
  id: string;
  name: string;
  age: string;
  specialChild: boolean;
  createdAt: string;
};

export interface OrderCategory {
  id: string;
  title: string;
  type: string;
  order: Order[];
  unitPrice: number;
  anisaPrice: number;
  minHours?: number;
  maxHours?: number;
  isEnable: boolean;
  createdAt: string;
}

export interface notes {
  id: string;
  body: string;
  createdAt: string;
}

export interface OrderValidation {
  errors: {
    whoStaysWithAnisa?: { message: string };
    notes?: { message: string };
    childID: { message: string };
    orderCategoryID?: { message: string };
    anisaID?: { message: string };
    clientID?: { message: string };
    orderPrice?: { message: string };
    orderHours?: { message: string };
    doneHours?: { message: string };
    childrenNum?: { message: string };
    orderStatus?: { message: string };
    startDate?: { message: string };
    endDate?: { message: string };
    payedAmount?: { message: string };
    location?: { message: string };
    createdBy?: { message: string };
  };
}
