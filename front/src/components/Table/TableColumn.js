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
import { useContext, memo } from "react";
import TableContext from "../../context/tables";
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

const TableColumn = ({
  editing,
  column,
  onClick,
  onColumnChange,
  colId,
  tableId,
}) => {
  const theme = useTheme();
  const { foreignKeySource, addForeignKey } = useContext(TableContext);
  const onColClick = () => {
    if (foreignKeySource) {
      addForeignKey({ id: tableId, colId: colId });
    } else {
      onClick(colId);
    }
  };
  const classes = useStyles();
  const handleColumnChange = (changes) => onColumnChange(changes, colId);

  const currColIsSource =
    foreignKeySource &&
    foreignKeySource.id === tableId &&
    foreignKeySource.colId === colId;

  return (
    <>
      <ListItem
        button
        onClick={onColClick}
        className={`nodrag ${classes.column} ${
          !currColIsSource && classes.sourceColumn
        }`}
      >
        <ListItemText primary={column.name} className={classes.columnName} />
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
        <ColumnControls
          column={column}
          tableId={tableId}
          colId={colId}
          onColumnChange={handleColumnChange}
        />
      </Collapse>
    </>
  );
};
export default memo(TableColumn);
