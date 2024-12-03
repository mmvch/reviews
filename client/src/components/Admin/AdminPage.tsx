import GenreContainer from '../Genre/GenreContainer';
import Grid from '@mui/material/Grid2';
import UserContainer from '../User/UserContainer';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Grid container justifyContent="center" spacing={2}>
        <UserContainer />
        <GenreContainer />

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/movies/create')}
          sx={{ height: 'fit-content' }}
        >
          Add movie
        </Button>
      </Grid>
    </>
  );
}

export default AdminPage;
