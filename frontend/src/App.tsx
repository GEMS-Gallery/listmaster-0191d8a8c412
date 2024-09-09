import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, TextField, List, ListItem, ListItemText, ListItemIcon, IconButton, Checkbox, Fab, CircularProgress, LinearProgress } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface ShoppingItem {
  id: bigint;
  name: string;
  completed: boolean;
  completedAt: bigint | null;
}

const App: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const fetchedItems = await backend.getItems();
      setItems(fetchedItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (newItemName.trim() === '') return;
    setUpdating(true);
    try {
      const id = await backend.addItem(newItemName);
      const newItem: ShoppingItem = {
        id: id,
        name: newItemName,
        completed: false,
        completedAt: null,
      };
      setItems([...items, newItem]);
      setNewItemName('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
    setUpdating(false);
  };

  const toggleItemComplete = async (id: bigint) => {
    setUpdating(true);
    try {
      const success = await backend.toggleItemComplete(id);
      if (success) {
        setItems(items.map(item =>
          item.id === id ? { ...item, completed: !item.completed } : item
        ));
      }
    } catch (error) {
      console.error('Error toggling item completion:', error);
    }
    setUpdating(false);
  };

  const deleteItem = async (id: bigint) => {
    setUpdating(true);
    try {
      const success = await backend.deleteItem(id);
      if (success) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setUpdating(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="sm">
      {updating && <LinearProgress />}
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping List
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Add new item"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addItem()}
        margin="normal"
      />
      <Fab color="primary" aria-label="add" onClick={addItem} style={{ marginTop: '1rem' }}>
        <AddIcon />
      </Fab>
      <List>
        {items.map((item) => (
          <ListItem key={item.id.toString()} dense button>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.completed}
                onChange={() => toggleItemComplete(item.id)}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              style={{ textDecoration: item.completed ? 'line-through' : 'none' }}
            />
            <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
