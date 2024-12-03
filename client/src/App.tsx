import ReviewsAppBar from './components/AppBar/ReviewsAppBar';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <ReviewsAppBar />
      <Container maxWidth="xl" sx={{ marginTop: 10 }}>
        <Outlet />
      </Container>
    </div>);
}

export default App;
