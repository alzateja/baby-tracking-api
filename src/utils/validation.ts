import {HttpErrors} from '@loopback/rest';
import {Baby} from '../models';
import {trimString} from './format';

export const babyLengthCheck = (babies: Baby[]): void => {
  if (babies.length >= 4) {
    throw new HttpErrors.Conflict(
      'Sorry, no more than 4 babies can be on an account.',
    );
  }
};

export const validIdPassed = (id: string): void => {
  if (id === '') {
    throw new HttpErrors.Conflict('You need to provide a userId.');
  }
};

export const doesBabyNameMatch = (
  babies: Baby[],
  inputtedName: string,
): void => {
  const matchesBabyName = (existingBaby: Baby): boolean =>
    trimString(inputtedName) === trimString(existingBaby.name);

  if (babies.find(matchesBabyName)) {
    throw new HttpErrors.Conflict('That baby name already exists.');
  }
};

export const hasValidFeedingType = (type: string): void => {
  const validFeedingTypes = ['Nursing', 'Bottle'];
  if (!validFeedingTypes.includes(type)) {
    throw new HttpErrors.Conflict(
      "You need to provide a valid type of either 'Nursing' or 'Bottle'.",
    );
  }
};

export const hasValidDiaperType = (type: string): void => {
  const validDiaperTypes = ['Mixed', 'Wet', 'Dirty'];
  if (!validDiaperTypes.includes(type)) {
    throw new HttpErrors.Conflict(
      "You need to provide a valid type of either 'Dirty', 'Wet' or 'Mixed'.",
    );
  }
};
