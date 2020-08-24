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
import {BabyRepository, UserRepository} from '../repositories';

export class BabyController {
  constructor(
    @repository(BabyRepository)
    public babyRepository: BabyRepository,
    @repository(UserRepository) protected userRepository: UserRepository,
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
      content: {
        'application/json': {
          schema: getModelSchemaRef(Baby, {
            title: 'NewBaby',
            exclude: ['babyId'],
          }),
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
  ): Promise<void> {
    await this.babyRepository.updateById(id, baby);
  }

  @del('/babies/{id}', {
    responses: {
      '204': {
        description: 'Baby DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<Baby[]> {
    const baby = await this.babyRepository.findById(id);
    await this.babyRepository.deleteById(id);
    const {userId} = baby;
    return this.userRepository.babies(userId).find();
  }
}
