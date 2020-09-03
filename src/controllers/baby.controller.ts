import {repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Baby} from '../models';
import {
  BabyRepository,
  DiapersRepository,
  FeedingsRepository,
  UserRepository,
} from '../repositories';
import {
  deleteBabyAndEvents,
  returnBabyInfo,
  returnBabyWithEvents,
  returnListOfBabiesOnUser,
} from '../utils/controller';
import {
  babyLengthCheck,
  doesBabyNameMatch,
  validIdPassed,
} from '../utils/validation';
import {BabyWithEvents} from './../types/index.d';

export class BabyController {
  constructor(
    @repository(BabyRepository)
    public babyRepository: BabyRepository,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(DiapersRepository)
    public diapersRepository: DiapersRepository,
    @repository(FeedingsRepository)
    public feedingsRepository: FeedingsRepository,
  ) {}

  @post('/babies', {
    responses: {
      '200': {
        description: 'Baby model instance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Baby)},
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      description: 'NewBaby',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Baby, {
            exclude: ['babyId'],
          }),
        },
      },
    })
    baby: Omit<Baby, 'babyId'>,
  ): Promise<Baby[]> {
    const {userId, name} = baby;
    validIdPassed(userId);
    const babies = await returnListOfBabiesOnUser(this.userRepository, userId);
    babyLengthCheck(babies);
    doesBabyNameMatch(babies, name);

    await this.userRepository.babies(userId).create(baby);

    return returnListOfBabiesOnUser(this.userRepository, userId);
  }

  @get('/babies/{id}', {
    responses: {
      '200': {
        description: 'Baby model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Baby),
          },
        },
      },
    },
  })
  async getById(@param.path.string('id') id: string): Promise<BabyWithEvents> {
    return returnBabyWithEvents(this.babyRepository, id);
  }

  @patch('/babies/{id}', {
    responses: {
      '204': {
        description: 'Baby PATCH success',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Baby)},
          },
        },
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Baby, {
            partial: true,
            title: 'UpdatedBaby',
            exclude: ['userId', 'babyId'],
          }),
        },
      },
    })
    updatedBaby: Baby,
  ): Promise<Baby[]> {
    validIdPassed(id);
    const {name} = updatedBaby;
    const originalRecord = await returnBabyInfo(this.babyRepository, id);
    const {userId} = originalRecord;
    if (name !== undefined) {
      const babies = await returnListOfBabiesOnUser(
        this.userRepository,
        userId,
      );
      doesBabyNameMatch(babies, name);
    }
    await this.babyRepository.updateById(id, updatedBaby);

    return returnListOfBabiesOnUser(this.userRepository, userId);
  }

  @del('/babies/{id}', {
    responses: {
      '204': {
        description: 'Baby DELETE success',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Baby)},
          },
        },
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<Baby[]> {
    const baby = await returnBabyInfo(this.babyRepository, id);
    await deleteBabyAndEvents(this.babyRepository, id);
    const {userId} = baby;
    return returnListOfBabiesOnUser(this.userRepository, userId);
  }
}
