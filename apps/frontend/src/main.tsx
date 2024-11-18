import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <CookiesProvider>
        <App />
        <ToastContainer position="bottom-right" />
      </CookiesProvider>
    </Provider>
  </BrowserRouter>
);
