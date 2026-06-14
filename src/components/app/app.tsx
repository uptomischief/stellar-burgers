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
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Preloader } from '@ui';
import { ProtectedRoute } from '../protected-route';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '@slices';
import { getUser, authChecked } from '@slices';
import { getCookie } from '../../utils/cookie';

const App = () => {
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

  const OrderModal = () => {
    const { number } = useParams();
    return (
      <Modal onClose={handleModalClose} title={`#${number}`}>
        <OrderInfo />
      </Modal>
    );
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route
          path='/'
          element={
            isLoading ? (
              <Preloader />
            ) : error ? (
              <div
                className={`${styles.error} text text_type_main-medium pt-4`}
              >
                {error}
              </div>
            ) : (
              <ConstructorPage />
            )
          }
        />
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
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
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
          <Route path='/feed/:number' element={<OrderModal />} />
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
                <OrderModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
