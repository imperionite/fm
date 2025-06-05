import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import RouterList from './components/RouterList';

const App = () => {
  const location = useLocation();
  const excludeHeaderRoutes = ['/login', '/signup'];

  // Check if current path is in excluded routes
  const showHeader = !excludeHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <main>
        <div style={{ minHeight: '50px' }}>
          <Toaster toastOptions={{ duration: 3000 }} />
          <RouterList />
        </div>
      </main>
    </>
  );
};

export default App;
