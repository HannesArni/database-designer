import ReactFlow, {
  MiniMap,
  Background,
  ReactFlowProvider,
} from "react-flow-renderer";
import ContextMenu from "../../components/ContextMenu";
import Table from "../../components/Table";
import { useState, useEffect, useCallback, useReducer } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import TableContext from "../../context/tables";
import TableEdge from "../../components/CustomEdge/TableEdge";

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
const initalTableState = {
  tables: {
    1: {
      name: "columns",
      columns: {
        1: {
          name: "id",
          type: "INTEGER",
          pkey: true,
          ai: true,
          allowNull: true,
        },
        2: {
          name: "tableId",
          type: "INTEGER",
          fkey: { table: 2, column: 1 },
          allowNull: true,
        },
        3: { name: "name", type: "STRING", allowNull: true },
        4: { name: "type", type: "ENUM", allowNull: true },
        5: { name: "length", type: "INTEGER", allowNull: true },
        6: { name: "default", type: "STRING", allowNull: true },
        7: { name: "pkey", type: "BOOLEAN", allowNull: true },
        8: { name: "ai", type: "BOOLEAN", allowNull: true },
        9: { name: "allowNull", type: "BOOLEAN", allowNull: true },
        10: {
          name: "fkey",
          type: "INTEGER",
          fkey: { table: 1, column: 1 },
          allowNull: true,
        },
      },
      position: { x: 100, y: 100 },
    },
    2: {
      name: "tables",
      columns: {
        1: {
          name: "id",
          type: "INTEGER",
          pkey: true,
          ai: true,
          allowNull: true,
        },
        2: {
          name: "name",
          type: "STRING",
          allowNull: true,
        },
        3: {
          name: "color",
          type: "STRING",
          allowNull: true,
        },
      },
      position: {
        x: 600,
        y: 300,
      },
    },
  },
};
const isFunc = (maybeFunc) => maybeFunc instanceof Function;

function Designer() {
  const classes = useStyles();
  // const [tables, setTables] = useState(initalTableState);
  const [elements, setElements] = useState([]);
  const [FKSource, setFKSource] = useState();

  const reducer = (state, action) => {
    const changeTable = (newValue, tableId = action.tableId) => ({
      ...state,
      tables: {
        ...state.tables,
        [tableId]: {
          ...state[tableId],
          ...newValue,
        },
      },
    });

    const changeColumn = (
      newValue,
      tableId = action.tableId,
      colId = action.colId
    ) => {
      console.log(state.tables[tableId], state.tables[tableId], tableId);
      return {
        ...state,
        tables: {
          ...state.tables,
          [tableId]: {
            ...state.tables[tableId],
            columns: {
              ...state.tables[tableId].columns,
              [colId]: {
                ...state.tables[tableId].columns[colId],
                ...newValue,
              },
            },
          },
        },
      };
    };

    const getNextElementId = (dict) =>
      Math.max(...Object.keys(dict).map((key) => parseInt(key))) + 1;

    switch (action.type) {
      case "setTable":
        return changeTable(action.newValue);
      case "addTable":
        return changeTable(
          {
            name: ".",
            columns: {
              1: { name: "id", type: "INTEGER", pkey: true, ai: true },
            },
            position: { x: action.xPos, y: action.yPos },
          },
          getNextElementId(state.tables)
        );
      case "setColumn":
        return changeColumn(action.newValue);
      case "addColumn":
        const newId = getNextElementId(state.tables[action.tableId].columns);
        return changeColumn(
          { name: "??", allowNull: true, type: "INTEGER" },
          action.tableId,
          newId
        );
      case "setFKSource":
        return {
          ...state,
          FKSource: { tableId: action.tableId, colId: action.colId },
        };
      case "addFK":
        const table = state.tables[state.FKSource.tableId];
        const sameTableFK = Object.keys(table.columns).filter(
          (colId) =>
            table.columns[colId]?.fkey?.table === parseInt(action.targetTableId)
        )[0];
        if (sameTableFK)
          return changeColumn(
            { fkey: null },
            state.FKSource.tableId,
            sameTableFK
          );
        console.log("source", state.FKSource);
        return {
          ...changeColumn(
            {
              fkey: {
                table: action.targetTableId,
                column: action.targetColumnId,
              },
            },
            state.FKSource.tableId,
            state.FKSource.colId
          ),
          FKSource: null,
        };
      case "removeFK":
        return changeColumn({ fkey: null });

      default:
        throw new Error();
    }
  };
  const [state, dispatch] = useReducer(reducer, initalTableState);

  useEffect(() => {
    const elTables = [];
    const elFkeys = [];
    Object.keys(state.tables).forEach((tableId) => {
      const table = state.tables[tableId];
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
  const addTable = (args) => dispatch({ type: "addTable", ...args });

  const backgroundContextActions = [{ label: "New table", action: addTable }];
  console.log(state.FKSource);

  return (
    <ReactFlowProvider>
      <TableContext.Provider value={dispatch}>
        <ReactFlow
          elements={elements}
          onContextMenu={onBackgroundContextOpen}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
              display: FKSource ? "flex" : "none",
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
      </TableContext.Provider>
    </ReactFlowProvider>
  );
}

export default Designer;
