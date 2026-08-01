import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';

let mockIdCounter = 0;
jest.mock('uuid', () => ({
  v4: jest.fn(() => `mock-id-${++mockIdCounter}`)
}));

describe('Тесты редьюсера constructorSlice', () => {
  beforeEach(() => {
    mockIdCounter = 0;
  });

  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun = {
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

  const mockBun2 = {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png'
  };

  const mockMain = {
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
  };

  const mockSauce = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
  };

  const mockSecondMain = {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.pn',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png'
  };

  test('Инициализация с undefined и неизвестным экшеном возвращает начальное состояние', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('При неизвестном экшене возвращается текущее состояние', () => {
    const currentState = {
      bun: { ...mockBun, id: 'existing-bun-id' },
      ingredients: [{ ...mockMain, id: 'existing-main-id' }]
    };
    const state = constructorReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(currentState);
  });

  describe('Экшен addIngredient', () => {
    test('Добавляет булку в поле bun', () => {
      const state = constructorReducer(initialState, addIngredient(mockBun));

      expect(state.bun).toEqual({ ...mockBun, id: 'mock-id-1' });
      expect(state.ingredients).toEqual([]);
    });

    test('Заменяет существующую булку при добавлении новой', () => {
      const stateWithBun = constructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      const state = constructorReducer(stateWithBun, addIngredient(mockBun2));

      expect(state.bun).toEqual({ ...mockBun2, id: 'mock-id-2' });
      expect(state.ingredients).toEqual([]);
    });

    test('Добавляет начинку (type: main) в массив ingredients', () => {
      const state = constructorReducer(initialState, addIngredient(mockMain));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({ ...mockMain, id: 'mock-id-1' });
    });

    test('Добавляет соус (type: sauce) в массив ingredients', () => {
      const state = constructorReducer(initialState, addIngredient(mockSauce));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({ ...mockSauce, id: 'mock-id-1' });
    });

    test('Генерирует уникальный id для каждого ингредиента', () => {
      const state = constructorReducer(initialState, addIngredient(mockMain));

      expect(state.ingredients[0].id).toBeDefined();
      expect(typeof state.ingredients[0].id).toBe('string');
      expect(state.ingredients[0].id).toBe('mock-id-1');
    });

    test('Добавляет несколько начинок в массив ingredients', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockSecondMain));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]._id).toBe(mockMain._id);
      expect(state.ingredients[1]._id).toBe(mockSauce._id);
      expect(state.ingredients[2]._id).toBe(mockSecondMain._id);
    });
  });

  describe('Экшен removeIngredient', () => {
    test('Удаляет ингредиент по индексу', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockSecondMain));
      state = constructorReducer(state, removeIngredient(1));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe(mockMain._id);
      expect(state.ingredients[1]._id).toBe(mockSecondMain._id);
    });

    test('Удаляет первый ингредиент по индексу 0', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, removeIngredient(0));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockSauce._id);
    });

    test('Удаляет последний ингредиент', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, removeIngredient(1));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockMain._id);
    });

    test('Не изменяет состояние при удалении несуществующего индекса', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, removeIngredient(5));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockMain._id);
    });
  });

  describe('Экшен moveIngredient', () => {
    test('Перемещает ингредиент вниз', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockSecondMain));
      state = constructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(state.ingredients[0]._id).toBe(mockSauce._id);
      expect(state.ingredients[1]._id).toBe(mockSecondMain._id);
      expect(state.ingredients[2]._id).toBe(mockMain._id);
    });

    test('Перемещает ингредиент вверх', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockSecondMain));
      state = constructorReducer(
        state,
        moveIngredient({ fromIndex: 2, toIndex: 0 })
      );

      expect(state.ingredients[0]._id).toBe(mockSecondMain._id);
      expect(state.ingredients[1]._id).toBe(mockMain._id);
      expect(state.ingredients[2]._id).toBe(mockSauce._id);
    });

    test('перемещает ингредиент на соседнюю позицию', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockSecondMain));
      state = constructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(state.ingredients[0]._id).toBe(mockSauce._id);
      expect(state.ingredients[1]._id).toBe(mockMain._id);
      expect(state.ingredients[2]._id).toBe(mockSecondMain._id);
    });
  });

  describe('Экшен clearConstructor', () => {
    test('Очищает конструктор от булки и ингредиентов', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    test('Возвращает начальное состояние при очистке пустого конструктора', () => {
      const state = constructorReducer(initialState, clearConstructor());

      expect(state).toEqual(initialState);
    });
  });
});
