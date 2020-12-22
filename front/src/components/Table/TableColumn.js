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
import CustomCollapse from "../CustomCollapse";

const useStyles = makeStyles((theme) => ({
  handle: {
    opacity: 0,
  },
}));

const TableColumn = ({
  editing,
  column,
  onClick,
  onColumnChange,
  colIndex,
  tableId,
}) => {
  const theme = useTheme();
  const { foreignKeySource, addForeignKey } = useContext(TableContext);
  const onColClick = (event) => {
    if (foreignKeySource) {
      addForeignKey({ id: tableId, colId: colIndex });
    } else {
      onClick();
    }
  };
  const classes = useStyles();

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

      <Collapse className="nodrag" in={editing} unmountOnExit>
        <ColumnControls
          column={column}
          tableId={tableId}
          colId={colIndex}
          onColumnChange={onColumnChange}
        />
      </Collapse>
    </>
  );
};
export default memo(TableColumn);
