import * as usersPermissions from '@strapi/plugin-users-permissions/server/services/users-permissions';
import * as user from '../services/user';
import * as role from '@strapi/plugin-users-permissions/server/services/role';
import * as jwt from '../services/jwt';
import * as providers from '@strapi/plugin-users-permissions/server/services/providers';
import * as permission from '@strapi/plugin-users-permissions/server/services/permission';
import * as registerLine from '../services/register-line';

type S = {
  ['users-permissions']: typeof usersPermissions;
  ['role']: typeof role;
  user: typeof user;
  jwt: typeof jwt;
  providers: typeof providers;
  ['providers-registry']: typeof providers;
  permission: typeof permission;
  ['register-line']: typeof registerLine;
};

export function getService<T extends keyof S>(name: T): ReturnType<S[T]>;
