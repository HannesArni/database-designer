import ReactFlow, {
  MiniMap,
  Background,
  useStoreState,
} from "react-flow-renderer";
import ContextMenu from "../../components/ContextMenu";
import Table from "../../components/Table";
import { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  Drawer,
  List,
  ListItem,
  Tooltip,
} from "@material-ui/core";
import { Publish, GetApp, FileCopy } from "@material-ui/icons";
import { TableDispatchContext, FKContext } from "../../context/tables";
import TableEdge from "../../components/CustomEdge/TableEdge";
import useTableReducer from "./tableReducer";
import { GlobalHotKeys } from "react-hotkeys";
import ImportDialog from "./import";

const useStyles = makeStyles((theme) => ({
  flowBackground: {
    backgroundColor: theme.palette.background.default,
  },
  miniMap: {
    background: theme.palette.background.default,
    "& .react-flow__minimap-mask": {
      fill: theme.palette.background.paper + "80",
    },
    "& .react-flow__minimap-node": {
      fill: theme.palette.background.paper,
      stroke: "#00000000",
    },
  },
  heading: {
    marginTop: "1rem",
    color: theme.palette.text.primary,
  },
  subHeading: {
    color: theme.palette.text.secondary,
  },
  selectFKBg: {
    position: "fixed",
    zIndex: 2,
    backgroundColor: "#00000060",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
}));

const nodeTypes = {
  table: Table,
};
const edgeTypes = {
  default: TableEdge,
};

const keyMap = {
  STOP_EDITING: "Escape",
  ADD_TABLE: "alt+shift+n",
  PREV_COLUMN: "alt+up",
  NEXT_COLUMN: "alt+down",
  NEXT_TABLE: "shift+right",
};

const snapGrid = [15, 15];
const defaultPosition = [0, 0];

function Designer() {
  const classes = useStyles();
  const [elements, setElements] = useState([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const openImportDialog = () => setImportDialogOpen(true);
  const closeImportDialog = () => setImportDialogOpen(false);

  const [state, dispatch] = useTableReducer();

  useEffect(() => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const getTables = params.get('tables')
    if(getTables){
      window.location.href = window.location.origin;
      try{
        const parsedGetTables = JSON.parse(getTables);
        dispatch({type: 'setJson', newValue: {tables: parsedGetTables, editing: {}}})
      } catch(e){
        console.log('Failed loading tables from url', e)
      }
    } else {
      const loadedItems = localStorage.getItem('tables');
      if(loadedItems){
        dispatch({
          type: 'setJson',
          newValue: {tables: JSON.parse(loadedItems), editing: {}}
        })
      }
    }

  }, [])

  useEffect(() => {
    const elTables = [];
    const elFkeys = [];
    localStorage.setItem('tables', JSON.stringify(state.tables));
    Object.keys(state.tables).forEach((tableId) => {
      let table = state.tables[tableId];
      if (!table) return;
      if (state.editing && state.editing.tableId === tableId)
        table = { ...table, editing: state.editing.colId };
      // display the table
      elTables.push({
        id: tableId.toString(),
        type: "table",
        position: table.position,
        data: table,
      });
      // now, for the fkeys
      Object.keys(table.columns).forEach((colId) => {
        const col = table.columns[colId];
        if (col.fkey) {
          const target = col.fkey;
          elFkeys.push({
            id: `e${tableId}-${target.table}`,
            source: tableId.toString(),
            target: target.table.toString(),
            sourceHandle: `${colId}`,
            targetHandle: `${target.column}`,
            animated: true,
            arrowHeadType: "arrowclosed",
          });
        }
      });
    });
    setElements([...elTables, ...elFkeys]);
  }, [state]);

  const addTable = (args) => dispatch({ type: "addTable", ...args });

  const [backgroundContextPos, setBackgroundContextPos] = useState({
    x: null,
    y: null,
  });
  const [backgroundContextOpen, setBackgroundContextOpen] = useState(false);
  const onBackgroundContextOpen = (e) => {
    e.preventDefault();
    setBackgroundContextPos({ x: e.pageX, y: e.pageY });
    setBackgroundContextOpen(true);
  };
  const onBackgroundContextClose = () => {
    setBackgroundContextPos({ x: null, y: null });
    setBackgroundContextOpen(false);
  };
  const backgroundContextActions = [{ label: "New table", action: addTable }];

  const keyMapHandlers = {
    STOP_EDITING: () => {
      dispatch({ type: "stopEditing" });
    },
    ADD_TABLE: () => dispatch({ type: "addTable", xPos: 100, yPos: 100 }),
    PREV_COLUMN: () => dispatch({ type: "prevColumn" }),
    NEXT_COLUMN: () => dispatch({ type: "nextColumn" }),
    NEXT_TABLE: () => dispatch({ type: "nextTable" }),
  };
  const transform = useStoreState((store) => store.transform);

  const generateAndCopyLink = () => {
    const searchParams = new URLSearchParams();
    searchParams.set('tables', JSON.stringify(state.tables));
    navigator.clipboard.writeText(window.location.origin + '?' + searchParams.toString())
      .catch(e => console.log('failed writing to clipboard'))
  }

  return (
    <>
      <Drawer variant="permanent">
        <List>
          <Tooltip title="Import" placement="right">
            <ListItem button onClick={openImportDialog}>
              <Publish title="Import" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Download" placement="right">
            <ListItem button>
              <GetApp />
            </ListItem>
          </Tooltip>
          <Tooltip title="Copy link" placement="right">
            <ListItem button onClick={generateAndCopyLink}>
              <FileCopy />
            </ListItem>
          </Tooltip>
        </List>
      </Drawer>
      <GlobalHotKeys keyMap={keyMap} handlers={keyMapHandlers} />
      <TableDispatchContext.Provider value={dispatch}>
        <ImportDialog open={importDialogOpen} onClose={closeImportDialog} />
        <FKContext.Provider value={state.FKSource}>
          <ReactFlow
            elements={elements}
            onContextMenu={onBackgroundContextOpen}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            snapGrid={snapGrid}
            defaultPosition={defaultPosition}
            onNodeDragStop={(e, node) => {
              dispatch({type: 'setTable', tableId: node.id, newValue: {position: node.position}})
            }}
          >
            <MiniMap className={classes.miniMap} />
            <Background className={classes.flowBackground} />
            <ContextMenu
              pos={backgroundContextPos}
              onClose={onBackgroundContextClose}
              actions={backgroundContextActions}
              open={backgroundContextOpen}
            />
            <div
              style={{
                display: state.FKSource ? "flex" : "none",
              }}
              className={classes.selectFKBg}
            >
              <Typography variant="h5" className={classes.heading}>
                Select foreign key target
              </Typography>
              <Typography variant="h6" className={classes.subHeading}>
                Esc to cancel
              </Typography>
            </div>
          </ReactFlow>
        </FKContext.Provider>
      </TableDispatchContext.Provider>
    </>
  );
}

export default Designer;
