import {
  FormControl,
  FormGroup,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
  Box,
} from "@material-ui/core";
import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  indigo,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@material-ui/core/colors";
import { memo } from "react";

const TableControls = ({ table, setTable, tableId }) => {
  const theme = useTheme();
  const handleNameChange = (event) => {
    setTable({ ...table, name: event.target.value }, tableId);
  };
  const handleColorChange = (event) => {
    setTable({ ...table, color: event.target.value }, tableId);
  };

  return (
    <List style={{ backgroundColor: theme.palette.background.paperAlt }}>
      <ListItem>
        <TextField
          label="Table name"
          value={table.name}
          onChange={handleNameChange}
        />
      </ListItem>
      <ListItem>
        <FormControl style={{ display: "flex", flex: "1 0 auto" }}>
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            onChange={handleColorChange}
            value={table.color ?? null}
          >
            {[
              amber,
              blue,
              blueGrey,
              brown,
              cyan,
              deepPurple,
              deepOrange,
              green,
              indigo,
              lime,
              orange,
              pink,
              purple,
              red,
              teal,
              yellow,
            ].map((color) => (
              <MenuItem value={color[200]}>
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: color[200],
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ListItem>
    </List>
  );
};
export default memo(
  TableControls,
  (prevProps, nextProps) =>
    prevProps.table.name === nextProps.table.name &&
    prevProps.table.color === nextProps.table.color
);
