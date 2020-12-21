import { List, ListSubheader, Button, Box } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import TableColumn from "./TableColumn";
import { useContext, useEffect, useState, memo } from "react";
import TableContext from "../../context/tables";
import ReactFlow, { Handle } from "react-flow-renderer";
import ContextMenu from "../ContextMenu";

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
}));

const Table = ({ id, data: table }) => {
  const { columns, name } = table;
  const { setTable, foreignKeySource } = useContext(TableContext);

  const onColumnChange = (newValue, index) => {
    const tableCopy = table;
    tableCopy.columns[index] = newValue;
    setTable(tableCopy, id);
  };
  const [editingColumn, setEditingColumn] = useState(null);
  const toggleEditingColumn = (index) =>
    editingColumn === index ? setEditingColumn(null) : setEditingColumn(index);

  const addColumn = () => {
    const tableCopy = table;
    const colId =
      Math.max(...Object.keys(tableCopy.columns).map((key) => parseInt(key))) +
      1;
    tableCopy.columns[colId] = { name: "??" };
    setTable(tableCopy, id);
    setEditingColumn(columns.length);
  };

  const classes = useStyles();
  return (
    <>
      {foreignKeySource && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            backgroundColor: "#00000080",
            width: "100%",
            height: "100%",
          }}
        />
      )}
      <List
        className={classes.root}
        subheader={
          <ListSubheader className={classes.listSubHeader}>
            {name}
          </ListSubheader>
        }
        style={{ position: "relative", zIndex: "unset" }}
      >
        {Object.keys(columns).map((colId) => (
          <TableColumn
            editing={editingColumn === colId}
            column={columns[colId]}
            onClick={() => toggleEditingColumn(colId)}
            onColumnChange={(change) => onColumnChange(change, colId)}
            colIndex={colId}
            key={colId}
            tableId={id}
            style={{ zIndex: 11 }}
          />
        ))}
        <Box className={classes.addBox}>
          <Add fontSize={"small"} className={classes.add} onClick={addColumn} />
        </Box>
      </List>
    </>
  );
};
export default memo(Table, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && prevProps.data === nextProps.data;
});
