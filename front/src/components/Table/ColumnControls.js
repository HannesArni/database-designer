import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useContext, useEffect, useRef } from "react";
import TableContext from "../../context/tables";
import { colTypes } from "../../constants";

const titlefy = (txt) =>
  txt.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

const ControlCheckbox = ({
  checked,
  name,
  label,
  handleCheckboxChange,
  indeterminate,
  toggleCheckbox,
}) => {
  return (
    <FormControl>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={checked ?? false}
            name={name}
            indeterminate={indeterminate ?? false}
            onChange={handleCheckboxChange}
            onKeyPress={(event) => {
              if (event.key === "Enter") toggleCheckbox(event);
            }}
          />
        }
        labelPlacement="end"
        label={label}
      />
    </FormControl>
  );
};
const TableControls = ({ column, onColumnChange, tableId, colId }) => {
  const theme = useTheme();
  const { foreignKeySource, setForeignKeySource, removeFK } = useContext(
    TableContext
  );
  const updateField = (field, value) =>
    onColumnChange({ ...column, [field]: value });
  const handleTextFieldChange = (event) =>
    updateField(event.target.name, event.target.value);
  const handleCheckboxChange = (event) =>
    updateField(event.target.name, event.target.checked);
  const toggleCheckbox = (event) =>
    updateField(event.target.name, !event.target.checked);
  const onFKeyChange = (event) =>
    event.target.checked
      ? setForeignKeySource({ id: tableId, colId: colId })
      : removeFK({ table: tableId, column: colId });
  const currColIsSource =
    foreignKeySource &&
    foreignKeySource.id === tableId &&
    foreignKeySource.colId === colId;

  return (
    <List style={{ backgroundColor: theme.palette.background.paperAlt }}>
      <ListItem>
        <TextField
          label="Column name"
          value={column.name}
          name="name"
          onChange={handleTextFieldChange}
          fullWidth
          autoFocus
        />
      </ListItem>
      <ListItem>
        <FormGroup
          row
          style={{
            display: "flex",
            alignItems: "flex-end",
            width: "100%",
            flexWrap: "nowrap",
          }}
        >
          <FormControl style={{ display: "flex", flex: "1 0 auto" }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={column.type}
              name="type"
              onChange={handleTextFieldChange}
            >
              {colTypes.map(({ type, icon }) => (
                <MenuItem value={type}>
                  <div
                    style={{
                      display: "inline-flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {icon}
                    <Typography style={{ marginLeft: 8 }}>
                      {titlefy(type)}
                    </Typography>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            style={{
              display: "flex",
              flex: "0 1 auto",
              width: "3.5rem",
              marginLeft: 10,
            }}
          >
            <TextField label="Length" name="length" type="number" />
          </FormControl>
        </FormGroup>
      </ListItem>
      <ListItem>
        <TextField label="Default" name="default" size="small" fullWidth />
      </ListItem>
      <ListItem>
        <FormGroup>
          <ControlCheckbox
            checked={column.pkey}
            name="pkey"
            handleCheckboxChange={handleCheckboxChange}
            label="Primary key"
            toggleCheckbox={toggleCheckbox}
          />
          <ControlCheckbox
            checked={column.ai}
            name="ai"
            handleCheckboxChange={handleCheckboxChange}
            label="Auto increment"
            toggleCheckbox={toggleCheckbox}
          />
          <ControlCheckbox
            checked={column.allowNull}
            name="allowNull"
            handleCheckboxChange={handleCheckboxChange}
            label="Allow null"
            toggleCheckbox={toggleCheckbox}
          />
          <ControlCheckbox
            checked={column.unique}
            name="unique"
            handleCheckboxChange={handleCheckboxChange}
            label="Unique"
            toggleCheckbox={toggleCheckbox}
          />
          <ControlCheckbox
            checked={column.fkey}
            indeterminate={currColIsSource}
            name="fk"
            handleCheckboxChange={onFKeyChange}
            label="Foreign key"
            toggleCheckbox={toggleCheckbox}
          />
        </FormGroup>
      </ListItem>
    </List>
  );
};
export default TableControls;
