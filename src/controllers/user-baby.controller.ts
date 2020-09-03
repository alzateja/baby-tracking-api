import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Baby} from '../models';
import {UserRepository} from '../repositories';
import {returnListOfBabiesOnUser} from '../utils/controller';

export class UserBabyController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{userId}/babies', {
    responses: {
      '200': {
        description: 'Array of User has many Baby',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Baby)},
          },
        },
      },
    },
  })
  async find(@param.path.string('userId') userId: string): Promise<Baby[]> {
    return returnListOfBabiesOnUser(this.userRepository, userId);
  }
}
