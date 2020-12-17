import { List, ListSubheader, Button, Box } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import TableColumn from "./TableColumn";
import { useEffect, useState } from "react";
import { Handle } from "react-flow-renderer";

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

const Table = ({ id }) => {
  const [columns, setColumns] = useState([
    { name: "id", type: "INTEGER", pkey: true, ai: true },
    { name: "someColumn", type: "INTEGER", pkey: false, ai: false },
    { name: "someOtherColumn", type: "STRING", pkey: false, ai: false },
  ]);
  const onColumnChange = (newValue, index) => {
    setColumns((prevState) => {
      prevState[index] = newValue;
      return [...prevState];
    });
  };
  const [editingColumn, setEditingColumn] = useState(null);
  const toggleEditingColumn = (index) =>
    editingColumn === index ? setEditingColumn(null) : setEditingColumn(index);

  const addColumn = () => {
    setColumns([...columns, { name: "??" }]);
    setEditingColumn(columns.length);
  };

  const classes = useStyles();
  return (
    <List
      className={classes.root}
      subheader={
        <ListSubheader className={classes.listSubHeader}>
          main_table
        </ListSubheader>
      }
    >
      {columns.map((col, i) => (
        <TableColumn
          editing={editingColumn === i}
          column={col}
          name={col.name}
          onClick={() => toggleEditingColumn(i)}
          onColumnChange={(change) => onColumnChange(change, i)}
          colIndex={i}
          key={i}
        />
      ))}
      <Box className={classes.addBox}>
        <Add fontSize={"small"} className={classes.add} onClick={addColumn} />
      </Box>
    </List>
  );
};
export default Table;
