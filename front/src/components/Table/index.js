import { List, ListSubheader, Collapse, Box } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import TableColumn from "./TableColumn";
import TableControls from "./TableControls";
import { useContext, useState, memo, useMemo, useCallback } from "react";
import { HotKeys } from "react-hotkeys";
import { useTableDispatch, useFK } from "../../context/tables";

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

const keyMap = {
  STOP_EDITING: "Escape",
  REMOVE_COLUMN: "del",
};

const Table = ({ id, data: table }) => {
  const { columns, name } = table;
  const dispatch = useTableDispatch();
  const FKSource = useFK();
  const [editingTable, setEditingTable] = useState(false);
  const toggleEditingTable = () =>
    setEditingTable((editingTable) => !editingTable);

  const [editingColumn, setEditingColumn] = useState(null);
  const toggleEditingColumn = useCallback(
    (index) =>
      setEditingColumn((prevValue) => (prevValue === index ? null : index)),
    []
  );

  const colCount = columns ? Object.keys(columns).length : 0;
  const handleAddColumn = useCallback(() => {
    dispatch({ type: "addColumn", tableId: id });
    setEditingColumn((colCount + 1).toString());
  }, [colCount, setEditingColumn, id, dispatch]);

  const keyMapHandlers = {
    STOP_EDITING: (event) => console.log("asdf", event),
    REMOVE_COLUMN: (event) => console.log("asdfe", event),
  };

  const classes = useStyles();
  return (
    <>
      {FKSource && <div className={classes.fkSelectionBg} />}
      <List
        className={classes.root}
        subheader={
          <ListSubheader
            className={classes.listSubHeader}
            style={{ backgroundColor: table.color }}
            onDoubleClick={toggleEditingTable}
          >
            {name}
          </ListSubheader>
        }
      >
        <Collapse in={editingTable} unmountOnExit className="nodrag">
          <TableControls table={table} tableId={id} />
        </Collapse>
        <HotKeys keyMap={keyMap} handlers={keyMapHandlers}>
          {Object.keys(columns).map((colId) => (
            <TableColumn
              editing={editingColumn === colId}
              column={columns[colId]}
              onClick={toggleEditingColumn}
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
            onClick={handleAddColumn}
          />
        </Box>
      </List>
    </>
  );
};
export default memo(Table, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && prevProps.data === nextProps.data;
});
