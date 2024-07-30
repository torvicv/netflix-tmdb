import './App.css';
import Home from './components/home/home';
import Menu from './common/Menu';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useState } from 'react';

const AppLayout = () => {

  const [response, setResponse] = useState(null);

  const handleChildResponse = (results) => {
    console.log(results);
    setResponse(results);
  }

  return (
  <>
    <Menu onChildResponse={handleChildResponse} />
    <Home results={response} />
  </>
  );
}

const router = createBrowserRouter([

  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/series',
        element: <Home />
      },
      {
        path: '/movies',
        element: <Home />
      },
      {
        path: '/more-views',
        element: <Home />
      }
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
