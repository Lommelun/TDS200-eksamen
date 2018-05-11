export interface User {
    uid?: string,
    username: string,
    name: string,
    age?: number,
    address: {
        street: string,
        city: string
    }
    image?: string,
    createdAt?: string,
    updatedAt?: string
}
