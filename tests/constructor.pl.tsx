import { test, expect } from '@playwright/test';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
  });

  test.describe('Добавление ингредиентов в конструктор', () => {
    test('Добавление булки и начинки в конструктор', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('button:has-text("Добавить")', {
        timeout: 10000
      });

      const bunSection = page
        .locator('li, [class*="container"]')
        .filter({ hasText: 'Краторная булка N-200i' })
        .first();
      await expect(bunSection).toBeVisible();
      await bunSection.locator('button:has-text("Добавить")').click();

      const constructorTopBun = page
        .locator('[class*="constructor"], [class*="element"]')
        .filter({ hasText: /Краторная булка N-200i.*верх/ })
        .first();
      await expect(constructorTopBun).toBeVisible();

      const mainSection = page
        .locator('li, [class*="container"]')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
        .first();
      await expect(mainSection).toBeVisible();
      await mainSection.locator('button:has-text("Добавить")').click();

      const constructorMain = page
        .locator('[class*="constructor"], [class*="elements"]')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
        .first();
      await expect(constructorMain).toBeVisible();

      const sauceSection = page
        .locator('li, [class*="container"]')
        .filter({ hasText: 'Соус Spicy-X' })
        .first();
      await expect(sauceSection).toBeVisible();
      await sauceSection.locator('button:has-text("Добавить")').click();

      const constructorSauce = page
        .locator('[class*="constructor"], [class*="elements"]')
        .filter({ hasText: 'Соус Spicy-X' })
        .first();
      await expect(constructorSauce).toBeVisible();

      const constructorBottomBun = page
        .locator('[class*="constructor"], [class*="element"]')
        .filter({ hasText: /Краторная булка N-200i.*низ/ })
        .first();
      await expect(constructorBottomBun).toBeVisible();
    });
  });

  test.describe('Модальное окно ингредиента', () => {
    test('Открытие модального окна по клику на ингредиент', async ({
      page
    }) => {
      await page.goto('/');
      await page.waitForSelector('button:has-text("Добавить")', {
        timeout: 10000
      });

      const ingredientLink = page
        .locator('a, [class*="article"]')
        .filter({ hasText: 'Краторная булка N-200i' })
        .first();
      await expect(ingredientLink).toBeVisible();
      await ingredientLink.click();

      const modal = page.locator('[class*="modal"]').first();
      await expect(modal).toBeVisible();
      await expect(modal).toContainText('Краторная булка N-200i');
      await expect(modal).toContainText('Калории, ккал');
      await expect(modal).toContainText('420');
      await expect(modal).toContainText('Белки, г');
      await expect(modal).toContainText('80');
    });

    test('Закрытие модального окна по клику на крестик', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('button:has-text("Добавить")', {
        timeout: 10000
      });

      const ingredientLink = page
        .locator('a, [class*="article"]')
        .filter({ hasText: 'Соус Spicy-X' })
        .first();
      await ingredientLink.click();

      const modal = page.locator('[class*="modal"]').first();
      await expect(modal).toBeVisible();
      await expect(modal).toContainText('Соус Spicy-X');

      const closeButton = modal.locator('button, [class*="button"]').first();
      await closeButton.click();

      await expect(modal).not.toBeVisible();
    });

    test('Закрытие модального окна по клику на оверлей', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('button:has-text("Добавить")', {
        timeout: 10000
      });

      const ingredientLink = page
        .locator('a, [class*="article"]')
        .filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' })
        .first();
      await ingredientLink.click();

      const modal = page.locator('[class*="modal"]').first();
      await expect(modal).toBeVisible();
      await expect(modal).toContainText(
        'Филе Люминесцентного тетраодонтимформа'
      );

      const overlay = page.locator('[class*="overlay"]').first();
      await overlay.click();

      await expect(modal).not.toBeVisible();
    });

    test('Отображение в открытом модальном окне данных именно того ингредиента, по которому произошел клик', async ({
      page
    }) => {
      await page.goto('/');

      await page.waitForSelector('button:has-text("Добавить")', {
        timeout: 10000
      });

      const bunLink = page
        .locator('a, [class*="article"]')
        .filter({ hasText: 'Краторная булка N-200i' })
        .first();
      await bunLink.click();

      const modal = page.locator('[class*="modal"]').first();
      await expect(modal).toContainText('Краторная булка N-200i');
      await expect(modal).toContainText('1255');
      await expect(modal).toContainText('Калории');

      await page.locator('[class*="overlay"]').first().click();

      const mainLink = page
        .locator('a, [class*="article"]')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
        .first();
      await mainLink.click();

      await expect(modal).toContainText('Биокотлета из марсианской Магнолии');
      await expect(modal).toContainText('424');

      await page.locator('[class*="overlay"]').first().click();

      const sauceLink = page
        .locator('a, [class*="article"]')
        .filter({ hasText: 'Соус Spicy-X' })
        .first();
      await sauceLink.click();

      await expect(modal).toContainText('Соус Spicy-X');
      await expect(modal).toContainText('90');

      await page.locator('[class*="overlay"]').first().click();
    });
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });
    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      update: false
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
  });

  test('Сборка бургера, оформление заказа, проверка модального окна с номером заказа и очистка конструктора', async ({
    page
  }) => {
    await page.goto('/');
    await page.waitForSelector('button:has-text("Добавить")', {
      timeout: 10000
    });

    const bunSection = page
      .locator('li, [class*="container"]')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bunSection.locator('button:has-text("Добавить")').click();

    const mainSection = page
      .locator('li, [class*="container"]')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .first();
    await mainSection.locator('button:has-text("Добавить")').click();

    const sauceSection = page
      .locator('li, [class*="container"]')
      .filter({ hasText: 'Соус Spicy-X' })
      .first();
    await sauceSection.locator('button:has-text("Добавить")').click();

    await expect(
      page
        .locator('[class*="constructor"], [class*="element"]')
        .filter({ hasText: /Краторная булка N-200i.*верх/ })
        .first()
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="constructor"], [class*="element"]')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
        .first()
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="constructor"], [class*="element"]')
        .filter({ hasText: 'Соус Spicy-X' })
        .first()
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="constructor"], [class*="element"]')
        .filter({ hasText: /Краторная булка N-200i.*низ/ })
        .first()
    ).toBeVisible();

    const orderButton = page
      .locator('button')
      .filter({ hasText: 'Оформить заказ' });
    await orderButton.click();

    const orderModal = page.locator('[class*="modal"]').first();
    await expect(orderModal).toBeVisible({
      timeout: 10000
    });
    await expect(orderModal).toContainText('12345');

    const closeButton = orderModal.locator('button, [class*="button"]').first();
    await closeButton.click();
    await expect(orderModal).not.toBeVisible();

    await expect(page.locator('text=Выберите булки').first()).toBeVisible();
    await expect(page.locator('text=Выберите начинку').first()).toBeVisible();
  });
});
