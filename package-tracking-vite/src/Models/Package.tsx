import { type Contact } from "./Contact";

export interface Package {
  id:string;
  status: string;
  trackingNumber: string;
  created: string;
  sender: Contact;
  receiver: Contact;
}
