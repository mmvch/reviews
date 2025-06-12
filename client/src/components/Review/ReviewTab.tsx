import OwnReview from './OwnReview';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ReviewGrid from './ReviewGrid';
import useUser from '../../contexts/user-context/useUser';
import { AppRoles } from '../../utils/AppRoles';
import { blue } from '@mui/material/colors';
import { Box, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useEffect, useState } from 'react';

interface ReviewTabProps {
  movieId: string;
  onChange: () => void;
}

const ReviewTab: React.FC<ReviewTabProps> = ({ movieId, onChange }) => {
  const { user } = useUser();
  const [tab, setTab] = useState("1");

  useEffect(() => {
    if (user?.role === AppRoles.Reviewer) {
      setTab("0");
    } else {
      setTab("1");
    }
  }, [user]);

  const handleChangeTab = (event: React.SyntheticEvent, newTab: string) => {
    setTab(newTab);
  };

  return (
    <>
      {user?.role === AppRoles.Reviewer ?
        (
          <TabContext value={tab}>
            <TabList centered onChange={handleChangeTab}>
              <Tab icon={<PersonIcon />} label="My Review" value="0" />
              <Tab icon={<PeopleIcon />} label="Reviews" value="1" />
            </TabList>
            <TabPanel value="0">
              <OwnReview movieId={movieId} onChange={onChange} />
            </TabPanel>
            <TabPanel value="1">
              <ReviewGrid movieId={movieId} />
            </TabPanel>
          </TabContext>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" color={blue[600]} sx={{ mb: 2, textAlign: "center" }}>
              Reviews
            </Typography>
            <ReviewGrid movieId={movieId} />
          </Box>
        )
      }
    </>
  );
}

export default ReviewTab;
