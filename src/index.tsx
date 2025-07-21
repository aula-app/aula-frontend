import '@mdxeditor/editor/style.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { loadRuntimeConfig } from './config';
import './i18n';
import './index.css';
import './print.css';

loadRuntimeConfig().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(<App />);
});
