import { render } from 'solid-js/web';
import { App } from './App';
import './showcase.css';

const root = document.getElementById('root');
if (!root) throw new Error('Showcase root element #root is missing from index.html.');

render(() => <App />, root);
