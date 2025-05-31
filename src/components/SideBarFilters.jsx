import { List, ListItemButton, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Financial Analysis',
  'Marketing Analytics',
  'Business Intelligence',
  'Consulting Services',
];
const industries = ['Retail', 'E-commerce', 'Healthcare', 'Manufacturing'];

export default function SidebarFilters() {
  const navigate = useNavigate();

  return (
    <div>
      <List subheader="Categories">
        {categories.map((cat) => (
          <ListItemButton key={cat} onClick={() => navigate(`/services?category=${encodeURIComponent(cat)}`)}>
            <ListItemText primary={cat} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <List subheader="Industries">
        {industries.map((ind) => (
          <ListItemButton key={ind} onClick={() => navigate(`/services?industry=${encodeURIComponent(ind)}`)}>
            <ListItemText primary={ind} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
}
