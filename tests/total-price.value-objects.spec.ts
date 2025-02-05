import { TotalPriceValueObject } from '../src/domain/value-objects/total-price.value-objects';

describe('TotalPriceValueObject', () => {
  it('should create a TotalPriceValueObject with a valid value', () => {
    const value = 100;
    const totalPrice = new TotalPriceValueObject(value);
    expect(totalPrice.getValue()).toBe(value);
    expect(totalPrice.toString()).toBe('100.00');
  });

  it('should throw an error when creating a TotalPriceValueObject with a negative value', () => {
    const value = -100;
    expect(() => new TotalPriceValueObject(value)).toThrow(
      'O preço total deve ser um valor positivo.',
    );
  });

  it('should return the correct string representation of the value', () => {
    const value = 123.456;
    const totalPrice = new TotalPriceValueObject(value);
    expect(totalPrice.toString()).toBe('123.46');
  });
});
