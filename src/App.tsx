import { Provider } from 'react-redux';
import { store } from './store/store';
import UserList from './components/UserList';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-200">
        <UserList />
      </div>
    </Provider>
  );
}

export default App;
