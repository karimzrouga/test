import { User } from 'src/app/model/User';
export class Cotisation {
    id!: number
    mois!: Date
    montant!: number
    userId!: number
    user !:User
    createdAt!:Date
    updatedAt!: Date
  }