import { database } from "firebase";

export interface Book  {
    title: string,
    publisher: string,
    img?: string,
    id: string
}
