import {
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  useTheme,
  Box,
  Button,
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
import { useTableDispatch } from "../../context/tables";

const TableControls = ({ table, tableId }) => {
  const theme = useTheme();
  const dispatch = useTableDispatch();
  const handleNameChange = (event) => {
    dispatch({
      type: "setTable",
      newValue: { name: event.target.value },
      tableId: tableId,
    });
  };
  const handleColorChange = (event) => {
    dispatch({
      type: "setTable",
      newValue: { color: event.target.value },
      tableId: tableId,
    });
  };
  const handleRemoveTable = (event) => {
    dispatch({
      type: "removeTable",
      tableId,
    });
  };

  return (
    <List style={{ backgroundColor: theme.palette.background.paperAlt }}>
      <ListItem>
        <TextField
          label="Table name"
          value={table.name}
          onChange={handleNameChange}
          autoFocus
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
              <MenuItem value={color[200]} key={color[200]}>
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
      <ListItem alignItems="center" style={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleRemoveTable}
        >
          Delete table
        </Button>
      </ListItem>
    </List>
  );
};
export default memo(TableControls);
