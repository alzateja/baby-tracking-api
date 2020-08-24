import {DefaultCrudRepository} from '@loopback/repository';
import {Feedings, FeedingsRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FeedingsRepository extends DefaultCrudRepository<
  Feedings,
  typeof Feedings.prototype.feedingId,
  FeedingsRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Feedings, dataSource);
  }
}
