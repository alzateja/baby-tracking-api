import {DefaultCrudRepository} from '@loopback/repository';
import {UserAccount, UserAccountRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserAccountRepository extends DefaultCrudRepository<
  UserAccount,
  typeof UserAccount.prototype.id,
  UserAccountRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserAccount, dataSource);
  }
}
