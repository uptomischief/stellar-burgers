import { ingredientsReducer, getIngredients } from '../ingredientsSlice';

describe('Тесты редьюсера ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  };

  const mockIngredients = [
    mockIngredient,
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
    }
  ];

  test('Инициализация с undefined и неизвестным экшеном возвращает начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('При неизвестном экшене возвращается текущее состояние', () => {
    const currentState = {
      ingredients: mockIngredients,
      loading: false,
      error: null
    };
    const state = ingredientsReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(currentState);
  });

  test('getIngredients.pending устанавливает loading в true и сбрасывает ошибку', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('getIngredients.fulfilled загружает ингредиенты и сбрасывает loading', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(
      { ...initialState, loading: true },
      action
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.ingredients).toHaveLength(2);
  });

  test('getIngredients.fulfilled обрабатывает пустой массив', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: []
    };
    const state = ingredientsReducer(
      { ...initialState, loading: true },
      action
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('getIngredients.rejected устанавливает ошибку и сбрасывает loading', () => {
    const errorMessage = 'Network error';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(
      { ...initialState, loading: true },
      action
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.ingredients).toEqual([]);
  });

  test('getIngredients.rejected использует дефолтное сообщение, если message отсутствует', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: {}
    };
    const state = ingredientsReducer(
      { ...initialState, loading: true },
      action
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
    expect(state.ingredients).toEqual([]);
  });
});
