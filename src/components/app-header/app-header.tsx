import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { useLocation } from 'react-router-dom';

export const AppHeader: FC = () => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  return <AppHeaderUI userName={user?.name || ''} location={location} />;
};
