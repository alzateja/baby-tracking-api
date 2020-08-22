import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Baby, BabyRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class BabyRepository extends DefaultCrudRepository<
  Baby,
  typeof Baby.prototype.babyId,
  BabyRelations
> {
  public readonly user: BelongsToAccessor<User, typeof Baby.prototype.babyId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Baby, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
