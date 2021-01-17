import {
  List,
  ListSubheader,
  Collapse,
  Box,
  ThemeProvider,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import TableColumn from "./TableColumn";
import TableControls from "./TableControls";
import { memo, useCallback, useMemo } from "react";
import { HotKeys } from "react-hotkeys";
import { useTableDispatch, useFK } from "../../context/tables";
import { colorMapper } from "../../constants";

const useStyles = makeStyles((theme) => {
  const tableColor = (props) =>
    props.color ? props.color : theme.palette.primary.main;
  return {
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      "&:focus": {
        outlineStyle: "solid",
        outlineColor: tableColor,
      },
    },
    listSubHeader: {
      backgroundColor: tableColor,
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
  };
});

const keyMap = {
  ADD_COLUMN: "alt+n",
  REMOVE_TABLE: "del",
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

  const classes = useStyles({
    color: table.color ? colorMapper[table.color][300] : null,
  });
  const keyMapHandlers = {
    ADD_COLUMN: handleAddColumn,
    REMOVE_TABLE: () => dispatch({ type: "removeTable", tableId: id }),
  };

  const theme = useMemo(() => {
    return table.color
      ? (outerTheme) => ({
          ...outerTheme,
          palette: {
            ...outerTheme.palette,
            primary: {
              ...outerTheme.palette.primary,
              main: colorMapper[table.color][300],
            },
          },
        })
      : {};
  }, [table.color]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <HotKeys keyMap={keyMap} handlers={keyMapHandlers}>
          {FKSource && <div className={classes.fkSelectionBg} />}
          <List
            className={classes.root}
            subheader={
              <ListSubheader
                className={classes.listSubHeader}
                onDoubleClick={toggleEditingTable}
              >
                {name.length ? name : "\u00A0"}
              </ListSubheader>
            }
            tabIndex={parseInt(id)}
          >
            <Collapse
              in={table.editing === -1}
              unmountOnExit
              className="nodrag"
            >
              <TableControls table={table} tableId={id} />
            </Collapse>
            {Object.keys(columns).map((colId, index) => (
              <TableColumn
                editing={table.editing === colId}
                column={columns[colId]}
                colId={colId}
                key={colId}
                tableId={id}
                tabIndex={index}
              />
            ))}
            <Box className={classes.addBox}>
              <Add
                fontSize={"small"}
                className={`${classes.add} nodrag`}
                onClick={handleAddColumn}
              />
            </Box>
          </List>
        </HotKeys>
      </ThemeProvider>
    </>
  );
};
export default memo(Table);
