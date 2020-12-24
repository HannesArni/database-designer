import { List, ListSubheader, Collapse, Box } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import TableColumn from "./TableColumn";
import TableControls from "./TableControls";
import { memo, useCallback } from "react";
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
  const toggleEditingTable = () =>
    dispatch({ type: "toggleEditing", tableId: id, colId: -1 });

  const handleAddColumn = useCallback(() => {
    dispatch({ type: "addColumn", tableId: id });
  }, [id, dispatch]);

  const keyMapHandlers = {
    STOP_EDITING: (event) => console.log("asdfs", event),
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
        <Collapse in={table.editing === -1} unmountOnExit className="nodrag">
          <TableControls table={table} tableId={id} />
        </Collapse>
        <HotKeys keyMap={keyMap} handlers={keyMapHandlers}>
          {Object.keys(columns).map((colId) => (
            <TableColumn
              editing={table.editing === colId}
              column={columns[colId]}
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
export default memo(Table);
