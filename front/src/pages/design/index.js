import ReactFlow, {
  MiniMap,
  Background,
  ReactFlowProvider,
} from "react-flow-renderer";
import ContextMenu from "../../components/ContextMenu";
import Table from "../../components/Table";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
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
      1: { name: "id", type: "INTEGER", pkey: true, ai: true },
      2: { name: "tableId", type: "INTEGER", fkey: { table: 2, column: 1 } },
      3: { name: "name", type: "STRING" },
      4: { name: "type", type: "ENUM" },
      5: { name: "length", type: "INTEGER" },
      6: { name: "default", type: "STRING" },
      7: { name: "pkey", type: "BOOLEAN" },
      8: { name: "ai", type: "BOOLEAN" },
      9: { name: "allowNull", type: "BOOLEAN" },
      10: { name: "fkey", type: "INTEGER", fkey: { table: 1, column: 1 } },
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
      },
      2: {
        name: "name",
        type: "INTEGER",
      },
      3: {
        name: "color",
        type: "STRING",
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
  const [foreignKeySource, setForeignKeySource] = useState();
  const addForeignKey = (target) => {
    setTables({
      ...tables,
      [foreignKeySource.id]: {
        ...tables[foreignKeySource.id],
        columns: {
          ...tables[foreignKeySource.id].columns,
          [foreignKeySource.colId]: {
            ...tables[foreignKeySource.id].columns[foreignKeySource.colId],
            fkey: { table: target.id, column: target.colId },
          },
        },
      },
    });
    setForeignKeySource(null);
  };
  const setTable = (newValue, tableId) =>
    setTables({ ...tables, [tableId]: newValue });
  const getNextElementId = (dict) =>
    Math.max(...Object.keys(tables).map((key) => parseInt(key))) + 1;

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
            style: { stroke: "#fff" },
            arrowHeadType: "arrowclosed",
          });
        }
      });
    });
    console.log(elTables, elFkeys);
    setElements([...elTables, ...elFkeys]);
  }, [tables]);

  const [backgroundContextPos, setBackgroundContextPos] = useState({
    x: null,
    y: null,
  });
  const [backgroundContextOpen, setBackgroundContextOpen] = useState(false);
  const onBackgroundContextOpen = (e) => {
    e.preventDefault();
    console.log(e);
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
          foreignKeySource,
          setForeignKeySource,
          addForeignKey,
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
        </ReactFlow>
      </TableContext.Provider>
    </ReactFlowProvider>
  );
}

export default Designer;
