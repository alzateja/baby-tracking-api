import {Entity, hasOne, model, property, hasMany} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';
import {Baby} from './baby.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    required: false,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
      uniqueItems: true,
    },
  })
  email: string;
  password: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @hasMany(() => Baby)
  babies: Baby[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
