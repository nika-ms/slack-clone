import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import App from './layouts/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3090';

const queryClient = new QueryClient();

render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
  document.querySelector('#app'),
);
