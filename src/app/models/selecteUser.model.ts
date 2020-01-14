
export interface IselectedUser {
    id?: number;
    fullName?: string;
}

export class selectedUser implements IselectedUser {
    constructor(public id?: number, public fullName?: string) { }
}
