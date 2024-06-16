import { describe, it, expect } from 'vitest';
import { formatMoney, capitalize } from '$lib/utils/common';
import { api } from '$lib/api';

// Test the formatMoney function
describe('formatMoney', () => {
  it('should format money to two decimal places', () => {
    expect(formatMoney('34')).toBe('34.00');
  });
});

// Test the capitalize function
describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('textstring')).toBe('Textstring');
    expect(capitalize('Text string')).toBe('Text string');
  });
});

describe('api function', () => {
  it('should return products data', async () => {
    expect(await api('')).toBeTypeOf("object")
  })
})
