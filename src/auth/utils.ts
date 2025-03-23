import { AccountRoles } from "src/account/role.enum";

export function containsRole(user_roles: AccountRoles[], roles: AccountRoles[]): boolean {
  return user_roles.find(r => roles.includes(r)) !== undefined
}