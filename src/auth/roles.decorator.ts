import { Reflector } from '@nestjs/core';
import { AccountRoles } from 'src/account/role.enum';

export const Roles = Reflector.createDecorator<AccountRoles[]>();