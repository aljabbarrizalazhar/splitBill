import { useLocation } from 'react-router-dom';
import AppMenu from '../components/AppMenu';
import Dashboard from '../views/Dashboard';
import GuidePage from '../views/guide';
import Profile from '../views/profile';

const DefaultLayout = () => {

  const { pathname } = useLocation();
  let contentComponent;

  switch (true) {
    case pathname ===  "/main":
      contentComponent = <Dashboard />;
      break;
    case pathname ===  "/guide":
        contentComponent = <GuidePage />;
        break;
    case pathname ===  "/profile":
        contentComponent = <Profile />;
        break;
  };
  
  return (
    <div className="min-h-screen bg-primary flex flex-row items-start justify-center p-4 sm:p-6 gap-2">
        <AppMenu />
        <div className="max-w-xl md:max-w-3xl w-full">
            {contentComponent}
        </div>
    </div>
  );
};

export default DefaultLayout;