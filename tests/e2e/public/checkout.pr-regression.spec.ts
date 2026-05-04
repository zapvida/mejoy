import { fillCheckoutStepOne, openCheckoutWithSeededCart } from '../support/store';
import { expect, test } from '../support/test';

test.describe('MeJoy store checkout @pr-regression', () => {
  test('store checkout advances from customer/address to payment', async ({ page, request }) => {
    await openCheckoutWithSeededCart(page, request);
    await fillCheckoutStepOne(page);

    await expect(page.getByRole('heading', { name: 'Pagamento' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pix', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cartão de Crédito', exact: true })).toBeVisible();
  });
});
