import {DefaultCrudRepository} from '@loopback/repository';
import {Baby, BabyRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class BabyRepository extends DefaultCrudRepository<
  Baby,
  typeof Baby.prototype.id,
  BabyRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Baby, dataSource);
  }
}
