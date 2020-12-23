import ReactFlow, {
  MiniMap,
  Background,
  ReactFlowProvider,
} from "react-flow-renderer";
import ContextMenu from "../../components/ContextMenu";
import Table from "../../components/Table";
import { useState, useEffect } from "react";
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
  1: {
    name: "columns",
    columns: {
      1: { name: "id", type: "INTEGER", pkey: true, ai: true, allowNull: true },
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
};

function Designer() {
  const classes = useStyles();
  const [tables, setTables] = useState(initalTableState);
  const [elements, setElements] = useState([]);
  const [FKSource, setFKSource] = useState();
  const setTable = (newValue, tableId) => {
    setTables((prevValue) => ({
      ...prevValue,
      [tableId]: { ...prevValue[tableId], ...newValue },
    }));
  };
  const setColumn = (newValue, tableId, columnId) => {
    setTables((tables) => ({
      ...tables,
      [tableId]: {
        ...tables[tableId],
        columns: {
          ...tables[tableId].columns,
          [columnId]: {
            ...tables[tableId].columns[columnId],
            ...newValue,
          },
        },
      },
    }));
  };
  const removeFK = ({ table, column }) =>
    setColumn({ fkey: null }, parseInt(table), parseInt(column));

  const addForeignKey = ({ id, colId }) => {
    const sTable = tables[FKSource.id];
    const sameTableFK = Object.keys(sTable.columns).filter(
      (colId) => sTable.columns[colId]?.fkey?.table === parseInt(id)
    )[0];
    if (sameTableFK) removeFK({ table: FKSource.id, column: sameTableFK });

    setColumn(
      { fkey: { table: parseInt(id), column: parseInt(colId) } },
      FKSource.id,
      FKSource.colId
    );
    setFKSource(null);
  };

  const getNextElementId = (dict) =>
    Math.max(...Object.keys(dict).map((key) => parseInt(key))) + 1;

  const createNewTable = ({ xPos, yPos }) => {
    const id = getNextElementId(tables);
    setTables({
      ...tables,
      [id]: {
        name: ".",
        columns: {
          1: { name: "id", type: "INTEGER", pkey: true, ai: true },
        },
        position: { x: xPos, y: yPos },
      },
    });
  };

  useEffect(() => {
    const elTables = [];
    const elFkeys = [];
    Object.keys(tables).forEach((tableId) => {
      const table = tables[tableId];
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
  }, [tables]);

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
  const backgroundContextActions = [
    { label: "New table", action: createNewTable },
  ];

  return (
    <ReactFlowProvider>
      <TableContext.Provider
        value={{
          setTable,
          foreignKeySource: FKSource,
          setForeignKeySource: setFKSource,
          addForeignKey,
          removeFK,
        }}
      >
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
