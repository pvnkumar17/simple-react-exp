import './App.css';
import Switcher from './components/Switcher.js';
import TopNavigation from './components/navigation/topNavigation';

function App() {
  return (
    <div className="App">
        <div className='layout'>
          <TopNavigation />
          <Switcher />
        </div>
    </div>
  );
}

export default App;
