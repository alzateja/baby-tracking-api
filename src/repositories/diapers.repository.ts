import {DefaultCrudRepository} from '@loopback/repository';
import {Diapers, DiapersRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DiapersRepository extends DefaultCrudRepository<
  Diapers,
  typeof Diapers.prototype.diaperId,
  DiapersRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Diapers, dataSource);
  }
}
