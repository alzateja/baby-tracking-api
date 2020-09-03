import {repository} from '@loopback/repository';
import {
  del,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Feedings} from '../models';
import {BabyRepository, FeedingsRepository} from '../repositories';
import {returnBabyFeedingEvents} from '../utils/controller';
import {hasValidFeedingType, validIdPassed} from './../utils/validation';

export class FeedingsController {
  constructor(
    @repository(FeedingsRepository)
    public feedingsRepository: FeedingsRepository,
    @repository(BabyRepository)
    public babyRepository: BabyRepository,
  ) {}

  @post('/feedings', {
    responses: {
      '200': {
        description: 'Feedings model instance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Feedings)},
          },
        },
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
  ): Promise<Feedings[]> {
    const {type, babyId} = feedings;
    validIdPassed(babyId);
    hasValidFeedingType(type);
    await this.feedingsRepository.create(feedings);
    return returnBabyFeedingEvents(this.babyRepository, babyId);
  }

  @patch('/feedings/{id}', {
    responses: {
      '204': {
        description: 'Feedings PATCH success',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Feedings)},
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
          schema: getModelSchemaRef(Feedings, {
            title: 'UpdatedFeedings',
            exclude: ['feedingId', 'babyId'],
            partial: true,
          }),
        },
      },
    })
    feedings: Feedings,
  ): Promise<Feedings[]> {
    const {type, babyId} = feedings;
    if (type !== undefined) {
      hasValidFeedingType(type);
    }
    validIdPassed(babyId);
    await this.feedingsRepository.updateById(id, feedings);
    return returnBabyFeedingEvents(this.babyRepository, babyId);
  }

  @del('/feedings/{id}', {
    responses: {
      '204': {
        description: 'Feedings DELETE success',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Feedings)},
          },
        },
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<Feedings[]> {
    const feedingEvent = await this.feedingsRepository.findById(id);
    await this.feedingsRepository.deleteById(id);
    const {babyId} = feedingEvent;
    return returnBabyFeedingEvents(this.babyRepository, babyId);
  }
}
