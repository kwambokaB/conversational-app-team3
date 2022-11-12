import { Menu } from '@mui/icons-material';
import {
  AppBar, IconButton, Toolbar, Typography,
} from '@mui/material';

function Topbar() {
  return (
    <AppBar>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SkillBuddy
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;