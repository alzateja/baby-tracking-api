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
import {Feedings} from '../models';
import {FeedingsRepository} from '../repositories';

export class FeedingsController {
  constructor(
    @repository(FeedingsRepository)
    public feedingsRepository: FeedingsRepository,
  ) {}

  @post('/feedings', {
    responses: {
      '200': {
        description: 'Feedings model instance',
        content: {'application/json': {schema: getModelSchemaRef(Feedings)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedings, {
            title: 'NewFeedings',
            exclude: ['feedingId'],
          }),
        },
      },
    })
    feedings: Omit<Feedings, 'feedingId'>,
  ): Promise<Feedings> {
    const {type} = feedings;
    const validFeedingTypes = ['nursing', 'bottle'];
    if (!validFeedingTypes.includes(type)) {
      throw new HttpErrors.Conflict(
        "You need to provide a valid type of either 'nursing' or 'bottle'",
      );
    }
    return this.feedingsRepository.create(feedings);
  }

  @patch('/feedings/{id}', {
    responses: {
      '204': {
        description: 'Feedings PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedings, {partial: true}),
        },
      },
    })
    feedings: Feedings,
  ): Promise<void> {
    await this.feedingsRepository.updateById(id, feedings);
  }

  @del('/feedings/{id}', {
    responses: {
      '204': {
        description: 'Feedings DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.feedingsRepository.deleteById(id);
  }
}
