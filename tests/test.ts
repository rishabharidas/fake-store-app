import { expect, test } from '@playwright/test';
import { formatMoney, capitalize } from '$lib/utils/common';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

test('Formatted money needs to be a floating char', async () => {
	expect(formatMoney('34')).toBe('34.00');
});

test('lower caseletter need to output the first letter as capitalize', async () => {
	expect(capitalize('textstring')).toBe('Textstring');
	expect(capitalize('Text string')).toBe('Text string');
});
