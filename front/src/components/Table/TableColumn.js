import {
  ListItem,
  ListItemText,
  useTheme,
  makeStyles,
  Collapse,
} from "@material-ui/core";
import { VpnKey, TextRotateUpRounded } from "@material-ui/icons";
import { Unique, NoNull } from "../Icons";
import { Handle } from "react-flow-renderer";
import { memo } from "react";
import { useTableDispatch, useFK } from "../../context/tables";
import { colTypes } from "../../constants";
import ColumnControls from "./ColumnControls";

const useStyles = makeStyles((theme) => ({
  column: {
    position: "relative",
    backgroundColor: theme.palette.background.paper,
  },
  sourceColumn: {
    zIndex: 11,
  },
  columnName: {
    marginRight: 20,
  },
  handle: {
    opacity: 0,
  },
  icon: {
    marginRight: 10,
  },
}));

const TableColumn = ({ editing, column, colId, tableId }) => {
  const theme = useTheme();
  const dispatch = useTableDispatch();
  const FKSource = useFK();
  const onColClick = () => {
    if (FKSource) {
      dispatch({
        type: "addFK",
        targetTableId: tableId,
        targetColumnId: colId,
      });
    } else {
      dispatch({ type: "toggleEditing", tableId, colId });
    }
  };
  const classes = useStyles();

  const currColIsSource =
    FKSource && FKSource.table === tableId && FKSource.column === colId;

  return (
    <>
      <ListItem
        button
        onClick={onColClick}
        className={`nodrag ${classes.column} ${
          !currColIsSource && classes.sourceColumn
        }`}
      >
        <ListItemText
          primary={column.name.length ? column.name : "\u00A0"}
          className={classes.columnName}
        />
        {column.pkey && (
          <VpnKey fontSize="small" color="primary" className={classes.icon} />
        )}
        {column.ai && (
          <TextRotateUpRounded
            fontSize="small"
            color="primary"
            className={classes.icon}
          />
        )}
        {column.unique && (
          <Unique
            fontSize="small"
            color={theme.palette.primary.main}
            className={classes.icon}
          />
        )}
        {!column.allowNull && (
          <NoNull
            fontSize="small"
            color={theme.palette.primary.main}
            className={classes.icon}
          />
        )}
        {column.type &&
          colTypes.filter(({ type }) => type === column.type)[0].icon}
        <Handle
          id={`i${colId}r`}
          position="right"
          type="target"
          className={classes.handle}
        />
        <Handle
          id={`o${colId}r`}
          position="right"
          type="source"
          className={classes.handle}
        />
        <Handle
          id={`i${colId}l`}
          position="left"
          type="target"
          className={classes.handle}
        />
        <Handle
          id={`o${colId}l`}
          position="left"
          type="source"
          className={classes.handle}
        />
      </ListItem>

      <Collapse className="nodrag" in={editing} unmountOnExit>
        <ColumnControls column={column} tableId={tableId} colId={colId} />
      </Collapse>
    </>
  );
};
export default memo(TableColumn);
