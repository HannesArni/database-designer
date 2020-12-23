import {
  List,
  ListSubheader,
  Collapse,
  Box,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import TableColumn from "./TableColumn";
import TableControls from "./TableControls";
import { useContext, useState, memo, useMemo } from "react";
import { HotKeys } from "react-hotkeys";
import TableContext from "../../context/tables";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  listSubHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  addBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  add: {
    color: theme.palette.text.primary,
    cursor: "pointer",
  },
  fkSelectionBg: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "#00000080",
    width: "100%",
    height: "100%",
  },
}));

const Table = ({ id, data: table }) => {
  const { columns, name } = table;
  const { setTable, foreignKeySource } = useContext(TableContext);
  const [editingTable, setEditingTable] = useState(false);

  const onColumnChange = (newValue, index) => {
    const tableCopy = table;
    tableCopy.columns[index] = newValue;
    setTable(tableCopy, id);
  };
  const [editingColumn, setEditingColumn] = useState(null);
  const toggleEditingColumn = (index) => {
    editingColumn === index ? setEditingColumn(null) : setEditingColumn(index);
  };

  const addColumn = () => {
    const tableCopy = table;
    const colId =
      Math.max(...Object.keys(tableCopy.columns).map((key) => parseInt(key))) +
      1;
    tableCopy.columns[colId] = { name: "??", allowNull: true, type: "INTEGER" };
    setTable(tableCopy, id);
    setEditingColumn(Object.keys(columns).length.toString());
  };

  const keyMap = {
    STOP_EDITING: "Escape",
    REMOVE_COLUMN: "del",
  };
  const keyMapHandlers = {
    STOP_EDITING: (event) => console.log("asdf", event),
    REMOVE_COLUMN: (event) => console.log("asdfe", event),
  };

  const theme = useMemo(
    (theme) => {
      if (table.color) {
        return createMuiTheme({
          palette: {
            primary: {
              main: table.color,
            },
          },
        });
      }
      return null;
    },
    [table.color]
  );

  const classes = useStyles();
  return (
    <>
      {foreignKeySource && <div className={classes.fkSelectionBg} />}
      <List
        className={classes.root}
        subheader={
          <ListSubheader
            className={classes.listSubHeader}
            style={{ backgroundColor: table.color }}
          >
            {name}
          </ListSubheader>
        }
      >
        <Collapse in={editingTable} unmountOnExit className="nodrag">
          <TableControls table={table} setTable={setTable} tableId={id} />
        </Collapse>
        <HotKeys keyMap={keyMap} handlers={keyMapHandlers}>
          {Object.keys(columns).map((colId) => (
            <TableColumn
              editing={editingColumn === colId}
              column={columns[colId]}
              onClick={toggleEditingColumn}
              onColumnChange={onColumnChange}
              colId={colId}
              key={colId}
              tableId={id}
            />
          ))}
        </HotKeys>
        <Box className={classes.addBox}>
          <Add
            fontSize={"small"}
            className={`${classes.add} nodrag`}
            onClick={addColumn}
          />
        </Box>
      </List>
    </>
  );
};
export default memo(Table, (prevProps, nextProps) => {
  console.log(
    "same?",
    prevProps.id === nextProps.id && prevProps.data === nextProps.data
  );
  return prevProps.id === nextProps.id && prevProps.data === nextProps.data;
});
