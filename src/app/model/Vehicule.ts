import { Agence } from './Agence';
import { Station } from "./Station"

export class Vehicule{
id!: number

capacite!: number
agenceId!: number
immatricule!: string
stations!: Station[]
agence!:Agence
createdAt!:Date
updatedAt!: Date



}

