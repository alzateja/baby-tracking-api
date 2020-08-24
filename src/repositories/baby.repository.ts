import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Baby, BabyRelations, User, Diapers, Feedings} from '../models';
import {UserRepository} from './user.repository';
import {DiapersRepository} from './diapers.repository';
import {FeedingsRepository} from './feedings.repository';

export class BabyRepository extends DefaultCrudRepository<
  Baby,
  typeof Baby.prototype.babyId,
  BabyRelations
> {
  public readonly user: BelongsToAccessor<User, typeof Baby.prototype.babyId>;

  public readonly diapers: HasManyRepositoryFactory<Diapers, typeof Baby.prototype.babyId>;

  public readonly feedings: HasManyRepositoryFactory<Feedings, typeof Baby.prototype.babyId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('DiapersRepository') protected diapersRepositoryGetter: Getter<DiapersRepository>, @repository.getter('FeedingsRepository') protected feedingsRepositoryGetter: Getter<FeedingsRepository>,
  ) {
    super(Baby, dataSource);
    this.feedings = this.createHasManyRepositoryFactoryFor('feedings', feedingsRepositoryGetter,);
    this.registerInclusionResolver('feedings', this.feedings.inclusionResolver);
    this.diapers = this.createHasManyRepositoryFactoryFor('diapers', diapersRepositoryGetter,);
    this.registerInclusionResolver('diapers', this.diapers.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
