import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/layout/styles.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './app/layout/App';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStore';
import { createBrowserHistory } from "history";
import { BrowserRouter} from 'react-router-dom';

const history = createBrowserHistory({ window });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export default history;

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
      <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
 