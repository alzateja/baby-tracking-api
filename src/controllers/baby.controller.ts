import {FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  put,
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

  @get('/babies/{id}', {
    responses: {
      '200': {
        description: 'Baby model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Baby, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Baby, {exclude: 'where'}) filter?: FilterExcludingWhere<Baby>,
  ): Promise<Baby> {
    return this.babyRepository.findById(id, filter);
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

  @put('/babies/{id}', {
    responses: {
      '204': {
        description: 'Baby PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() baby: Baby,
  ): Promise<void> {
    await this.babyRepository.replaceById(id, baby);
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
