import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
} from '@loopback/rest';
import {Feedings} from '../models';
import {BabyRepository} from '../repositories';

export class BabyFeedingsController {
  constructor(
    @repository(BabyRepository) protected babyRepository: BabyRepository,
  ) {}

  @get('/babies/{id}/feedings', {
    responses: {
      '200': {
        description: 'Array of Baby has many Feedings',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Feedings)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Feedings>,
  ): Promise<Feedings[]> {
    return this.babyRepository.feedings(id).find(filter);
  }

  @del('/babies/{id}/feedings', {
    responses: {
      '200': {
        description: 'Baby.Feedings DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Feedings))
    where?: Where<Feedings>,
  ): Promise<Count> {
    return this.babyRepository.feedings(id).delete(where);
  }
}
