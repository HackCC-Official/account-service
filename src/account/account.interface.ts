export interface UpdateAccountDTO {
    id?: string,
    email?: string,
    password?: string,
    roles?: string,
    createdAt?: string,
    loggedInAt: string[],
}
