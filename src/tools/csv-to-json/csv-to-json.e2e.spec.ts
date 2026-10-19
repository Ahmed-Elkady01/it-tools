import { expect, test } from '@playwright/test';

test.describe('Tool - CSV to JSON', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/csv-to-json');
  });

  test('has the correct title and category while preserving JSON to CSV in Development', async ({ page }) => {
    await expect(page).toHaveTitle('CSV to JSON - IT Tools');
    const converter = page.locator('div').filter({ has: page.getByText('Converter', { exact: true }) })
      .filter({ has: page.getByRole('link', { name: 'CSV to JSON', exact: true }) }).last();
    await expect(converter.getByRole('link', { name: 'CSV to JSON', exact: true })).toBeVisible();
    await expect(converter.getByRole('link', { name: 'JSON to CSV', exact: true })).toHaveCount(0);
    const development = page.locator('div').filter({ has: page.getByText('Development', { exact: true }) })
      .filter({ has: page.getByRole('link', { name: 'JSON to CSV', exact: true }) }).last();
    await expect(development.getByRole('link', { name: 'JSON to CSV', exact: true })).toBeVisible();
  });

  test('converts CSV and safely renders markup as string data', async ({ page }) => {
    await page.getByTestId('input').fill('name,note,age\r\nAlice,"hello, ""world""\n<script>alert(1)</script>",18\r\nBob');
    await expect(page.getByTestId('area-content')).toHaveText(JSON.stringify([
      { name: 'Alice', note: 'hello, "world"\n<script>alert(1)</script>', age: '18' },
      { name: 'Bob', note: '', age: '' },
    ], null, 2));
    await expect(page.getByTestId('area-content').locator('script')).toHaveCount(0);
  });

  test('shows readable errors and recovers after correction', async ({ page }) => {
    const input = page.getByTestId('input');
    const output = page.getByTestId('area-content');
    await input.fill('name\nAlice,extra');
    await expect(output).toHaveText('Row 2 has more fields than the header row.');
    await input.fill('name\n"Alice');
    await expect(output).toHaveText('Row 2 has an unterminated quoted field. Add the closing double quote.');
    await input.fill('name\n"Alice"extra');
    await expect(output).toContainText('Row 2 has an invalid double quote.');
    await input.fill('name\nAlice');
    await expect(output).toHaveText('[\n  {\n    "name": "Alice"\n  }\n]');
  });

  test('has empty output initially and after clearing input', async ({ page }) => {
    const output = page.getByTestId('area-content');
    await expect(output).toHaveText('');
    await page.getByTestId('input').fill('name\nAlice');
    await expect(output).toContainText('Alice');
    await page.getByTestId('input').fill('');
    await expect(output).toHaveText('');
  });
});
