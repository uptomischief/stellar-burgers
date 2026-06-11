import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
// import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Preloader } from '@ui';
// import { useSelector } from 'react-redux';
// import { getIngredientsLoading, getIngredientsError, getIngredients } from '@selectors';
import { ProtectedRoute } from '../protected-route';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '@slices';
import { getUser, authChecked } from '@slices';
import { getCookie } from '../../utils/cookie';

const App = () => {
  /** TODO: взять переменные из стора */
  // const isIngredientsLoading = false;
  // const ingredients = [];
  // const error = null;

  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredients());

    const token = getCookie('accessToken');
    if (token) {
      dispatch(getUser());
    } else {
      dispatch(authChecked());
    }
  }, [dispatch]);

  const isLoading = useSelector((state) => state.ingredients.loading);
  const error = useSelector((state) => state.ingredients.error);

  const handleModalClose = () => {
    navigate(-1);
  };

  // return (
  //   <div className={styles.app}>
  //     <AppHeader />
  //     {isIngredientsLoading ? (
  //       <Preloader />
  //     ) : error ? (
  //       <div className={`${styles.error} text text_type_main-medium pt-4`}>
  //         {error}
  //       </div>
  //     ) : ingredients.length > 0 ? (
  //       <ConstructorPage />
  //     ) : (
  //       <div className={`${styles.title} text text_type_main-medium pt-4`}>
  //         Нет игредиентов
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className={styles.app}>
      <AppHeader />
      {isLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/feed/:number'
              element={
                <div className={styles.detailPageWrap}>
                  <OrderInfo />
                </div>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <div className={styles.detailPageWrap}>
                  <p
                    className={`text text_type_main-large${styles.detailHeader}`}
                  >
                    Детали ингредиента
                  </p>
                  <IngredientDetails />
                </div>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <div className={styles.detailPageWrap}>
                    <OrderInfo />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal onClose={handleModalClose} title='Информация о заказе'>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal onClose={handleModalClose} title='Детали ингредиента'>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <Modal
                      onClose={handleModalClose}
                      title='Информация о заказе'
                    >
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
