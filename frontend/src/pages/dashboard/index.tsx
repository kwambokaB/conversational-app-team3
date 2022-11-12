import { Button, CircularProgress, Paper } from '@mui/material';
import { useGetAllCourseQuery } from '../../apiServices/courseService';
import TabView from '../../components/TabView';
import CourseList from './CourseList';

function Dashboard() {
  const { isLoading } = useGetAllCourseQuery();

  if (isLoading) { return <CircularProgress />; }

  return (
    <TabView
      title="Community courses"
      tabs={
      [
        {
          name: 'All Courses',
          component: <CourseList />,
        },
        {
          name: 'Courses Categories',
          component: (
            <Paper sx={{
              height: '300px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 2,
            }}
            >
              <Button size="large">All Courses in progress</Button>
            </Paper>
          ),
        },
      ]
     }

    />

  );
}

export default Dashboard;