import {
  ListItem,
  ListItemText,
  useTheme,
  ListItemIcon,
  Collapse,
  Typography,
  TextField,
  List,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
} from "@material-ui/core";
import {
  VpnKey,
  Subject,
  ShortText,
  TextFormat,
  FormatListBulleted,
  PowerSettingsNew,
  Today,
  Schedule,
  Description,
  Storage,
  Language,
  Dialpad,
  CalendarToday,
  TextRotateUpRounded,
} from "@material-ui/icons";
import { Hashtag, Unique, NoNull } from "../Icons";
import { Handle } from "react-flow-renderer";
import { useContext, memo } from "react";
import TableContext from "../../context/tables";

const colTypes = [
  { type: "STRING", icon: <ShortText fontSize="inherit" /> },
  {
    type: "TEXT",
    lengthOptions: ["tiny", "medium", "long"],
    icon: <Subject fontSize="inherit" />,
  },
  { type: "CHAR", icon: <TextFormat fontSize="inherit" /> },

  { type: "ENUM", icon: <FormatListBulleted fontSize="inherit" /> },
  {
    type: "BOOLEAN",
    length: null,
    icon: <PowerSettingsNew fontSize="inherit" />,
  },

  { type: "INTEGER", icon: <Hashtag fontSize="inherit" /> },
  { type: "FLOAT", icon: <Hashtag fontSize="inherit" /> },
  { type: "DOUBLE", icon: <Hashtag fontSize="inherit" /> },
  { type: "DECIMAL", icon: <Hashtag fontSize="inherit" /> },
  { type: "REAL", icon: <Hashtag fontSize="inherit" /> },

  { type: "DATE", icon: <Today fontSize="inherit" /> },
  { type: "TIME", length: null, icon: <Schedule fontSize="inherit" /> },
  {
    type: "DATEONLY",
    length: null,
    icon: <CalendarToday fontSize="inherit" />,
  },

  { type: "BLOB", icon: <Description fontSize="inherit" /> },
  { type: "JSONB", icon: <Storage fontSize="inherit" /> },
  { type: "JSONTYPE", icon: <Storage fontSize="inherit" /> },
  { type: "GEOMETRY", icon: <Language fontSize="inherit" /> },
  { type: "GEOGRAPHY", icon: <Language fontSize="inherit" /> },
];

const useStyles = makeStyles((theme) => ({
  handle: {
    opacity: 0,
  },
}));

const titlefy = (txt) =>
  txt.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
const TableColumn = ({
  editing,
  column,
  onClick,
  onColumnChange,
  colIndex,
  tableId,
}) => {
  const theme = useTheme();
  const {
    foreignKeySource,
    setForeignKeySource,
    addForeignKey,
    removeFK,
  } = useContext(TableContext);
  const onColClick = (event) => {
    if (foreignKeySource) {
      addForeignKey({ id: tableId, colId: colIndex });
    } else {
      onClick();
    }
  };
  const classes = useStyles();
  const updateField = (field, value) =>
    onColumnChange({ ...column, [field]: value });
  const handleTextFieldChange = (event) =>
    updateField(event.target.name, event.target.value);
  const handleCheckboxChange = (event) =>
    updateField(event.target.name, event.target.checked);
  const onFKeyChange = (event) =>
    event.target.checked
      ? setForeignKeySource({ id: tableId, colId: colIndex })
      : removeFK({ table: tableId, column: colIndex });

  const currColIsSource =
    foreignKeySource &&
    foreignKeySource.id === tableId &&
    foreignKeySource.colId === colIndex;

  return (
    <>
      <ListItem
        button
        onClick={onColClick}
        style={{
          ...(!currColIsSource && { zIndex: 11 }),
          position: "relative",
          backgroundColor: theme.palette.background.paper,
        }}
        className="nodrag"
      >
        <ListItemText primary={column.name} style={{ marginRight: 20 }} />
        {column.pkey && (
          <VpnKey
            fontSize="small"
            color="primary"
            style={{ marginRight: 10 }}
          />
        )}
        {column.ai && (
          <TextRotateUpRounded
            fontSize="small"
            color="primary"
            style={{ marginRight: 10 }}
          />
        )}
        {column.unique && (
          <Unique
            fontSize="small"
            color={theme.palette.primary.main}
            style={{ marginRight: 10 }}
          />
        )}
        {!column.allowNull && (
          <NoNull
            fontSize="small"
            color={theme.palette.primary.main}
            style={{ marginRight: 10 }}
          />
        )}
        {column.type &&
          colTypes.filter(({ type }) => type === column.type)[0].icon}
        <Handle
          id={`i${colIndex}r`}
          position="right"
          type="target"
          className={classes.handle}
        />
        <Handle
          id={`o${colIndex}r`}
          position="right"
          type="source"
          className={classes.handle}
        />
        <Handle
          id={`i${colIndex}l`}
          position="left"
          type="target"
          className={classes.handle}
        />
        <Handle
          id={`o${colIndex}l`}
          position="left"
          type="source"
          className={classes.handle}
        />
      </ListItem>

      <Collapse in={editing} timeout="auto" unmountOnExit className="nodrag">
        <List style={{ backgroundColor: theme.palette.background.paperAlt }}>
          <ListItem>
            <TextField
              label="Column name"
              value={column.name}
              name="name"
              onChange={handleTextFieldChange}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <FormGroup row style={{ display: "flex", alignItems: "flex-end" }}>
              <FormControl style={{ display: "flex", flex: "3 1 1rem" }}>
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
                style={{ display: "flex", flex: "1 1 1rem", marginLeft: 10 }}
              >
                <TextField label="Length" name="name" />
              </FormControl>
            </FormGroup>
          </ListItem>
          <ListItem>
            <TextField label="Default" name="name" size="small" fullWidth />
          </ListItem>
          <ListItem>
            <FormGroup>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={column.pkey ?? false}
                      name="pkey"
                      onChange={handleCheckboxChange}
                    />
                  }
                  labelPlacement="end"
                  label="Primary key"
                />
              </FormControl>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={column.ai ?? false}
                      name="ai"
                      onChange={handleCheckboxChange}
                    />
                  }
                  labelPlacement="end"
                  label="Auto increment"
                  color="#fff"
                />
              </FormControl>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={column.allowNull ?? false}
                      onChange={handleCheckboxChange}
                      name="allowNull"
                    />
                  }
                  labelPlacement="end"
                  label="Allow null"
                  color="#fff"
                />
              </FormControl>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={column.unique ?? ""}
                      onChange={handleCheckboxChange}
                      name="unique"
                    />
                  }
                  labelPlacement="end"
                  label="Unique"
                  color="#fff"
                />
              </FormControl>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={column.fkey ?? false}
                      indeterminate={currColIsSource}
                      onChange={onFKeyChange}
                    />
                  }
                  labelPlacement="end"
                  label="Foreign key"
                  color="#fff"
                />
              </FormControl>
            </FormGroup>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};
export default memo(TableColumn);
