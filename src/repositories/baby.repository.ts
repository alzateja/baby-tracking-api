import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Baby, BabyRelations, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class BabyRepository extends DefaultCrudRepository<
  Baby,
  typeof Baby.prototype.id,
  BabyRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Baby.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Baby, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
