import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Diapers} from '../models';
import {BabyRepository} from '../repositories';

export class BabyDiapersController {
  constructor(
    @repository(BabyRepository) protected babyRepository: BabyRepository,
  ) {}

  @get('/babies/{id}/diapers', {
    responses: {
      '200': {
        description: 'Array of Baby has many Diapers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diapers)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Diapers>,
  ): Promise<Diapers[]> {
    return this.babyRepository.diapers(id).find(filter);
  }
}
