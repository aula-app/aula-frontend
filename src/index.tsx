import '@mdxeditor/editor/style.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';
import './print.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
