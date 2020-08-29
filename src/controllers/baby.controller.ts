import {repository} from '@loopback/repository';
import {
  del,
  getModelSchemaRef,
  HttpErrors,
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
          schema: getModelSchemaRef(Baby),
        },
      },
    })
    baby: Omit<Baby, 'babyId'>,
  ): Promise<Baby[]> {
    const {userId} = baby;
    if (userId === undefined) {
      throw new HttpErrors.Conflict('You need to provide a userId');
    }
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
          schema: getModelSchemaRef(Baby, {partial: true}),
        },
      },
    })
    baby: Baby,
  ): Promise<Baby[]> {
    await this.babyRepository.updateById(id, baby);
    const updatedRecord = await this.babyRepository.findById(id);
    const {userId} = updatedRecord;
    return this.userRepository.babies(userId).find();
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
    const baby = await this.babyRepository.findById(id);
    await this.babyRepository.feedings(id).delete();
    await this.babyRepository.diapers(id).delete();
    await this.babyRepository.deleteById(id);
    const {userId} = baby;
    return this.userRepository.babies(userId).find();
  }
}
