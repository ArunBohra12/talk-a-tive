import { Route } from 'react-router-dom';
import ChatPage from './pages/chat.page';
import Home from './pages/home.page';
import './App.css';

function App() {
  return (
    <div className='app'>
      <Route path='/' component={Home} exact />
      <Route path='/chat' component={ChatPage} />
    </div>
  );
}

export default App;
