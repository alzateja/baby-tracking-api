import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Baby, User} from '../models';
import {UserRepository} from '../repositories';

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
  async find(
    @param.path.string('userId') userId: string,
    @param.query.object('filter') filter?: Filter<Baby>,
  ): Promise<Baby[]> {
    return this.userRepository.babies(userId).find(filter);
  }

  @post('/users/{userId}/babies', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Baby)}},
      },
    },
  })
  async create(
    @param.path.string('userId') userId: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Baby, {
            title: 'NewBabyInUser',
            exclude: ['babyId', 'userId'],
          }),
        },
      },
    })
    baby: Omit<Baby, 'babyId'>,
  ): Promise<Baby[]> {
    const babies = await this.userRepository.babies(userId).find();

    if (babies.length >= 4) {
      throw new HttpErrors.Conflict(
        'Sorry, no more than 4 babies can be on an account',
      );
    }

    const matchesBabyName = (existingBaby: Baby): boolean =>
      baby.name === existingBaby.name;

    if (babies.find(matchesBabyName)) {
      throw new HttpErrors.Conflict('That baby name already exists');
    }
    await this.userRepository.babies(userId).create(baby);

    return this.userRepository.babies(userId).find();
  }

  @patch('/users/{userId}/babies', {
    responses: {
      '200': {
        description: 'User.Baby PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('userId') userId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Baby, {partial: true}),
        },
      },
    })
    baby: Partial<Baby>,
    @param.query.object('where', getWhereSchemaFor(Baby)) where?: Where<Baby>,
  ): Promise<Count> {
    return this.userRepository.babies(userId).patch(baby, where);
  }
}
