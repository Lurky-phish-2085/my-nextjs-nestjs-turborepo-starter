import { describe, it, expect } from '@jest/globals';
import { AbilityFactory } from './ability.factory';

describe('AbilityFactory', () => {
  it('should be defined', () => {
    expect(new AbilityFactory()).toBeDefined();
  });
});
