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
const initialElements = [
  {
    id: "1",
    type: "table",
    data: {
      name: "wow, its a custom name",
      columns: [
        { name: "id", type: "INTEGER", pkey: true, ai: true },
        { name: "someColumn", type: "INTEGER" },
        { name: "someOtherColumn", type: "STRING" },
      ],
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    type: "table",
    data: {
      name: "wow, its a custom name",
      columns: [
        { name: "id", type: "INTEGER", pkey: true, ai: true },
        { name: "someColumn", type: "INTEGER" },
        { name: "someOtherColumn", type: "STRING" },
      ],
    },
    position: { x: 100, y: 500 },
  },
  {
    id: "2",
    type: "table",
    data: {
      name: "and, its a custom name",
      columns: [
        { name: "id", type: "INTEGER", pkey: true, ai: true },
        { name: "someColumn", type: "INTEGER" },
        { name: "someOtherOtherColumn", type: "STRING" },
      ],
    },
    position: { x: 600, y: 300 },
  },
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "o2r",
    targetHandle: "i0l",
    animated: true,
    style: { stroke: "#fff" },
    arrowHeadType: "arrowclosed",
  },
  {
    id: "e3-2",
    source: "3",
    target: "2",
    sourceHandle: "o1r",
    targetHandle: "i0l",
    animated: true,
    style: { stroke: "#fff" },
    arrowHeadType: "arrowclosed",
  },
];

const nodeTypes = {
  table: Table,
};

function Designer() {
  const classes = useStyles();
  const [elements, setElements] = useState(initialElements);
  const [foreignKeySource, setForeignKeySource] = useState();
  const addForeignKey = (target) => {
    console.log(foreignKeySource, target);
    setElements([
      ...elements.map((el) =>
        el.id === foreignKeySource.id
          ? {
              ...el,
              data: {
                ...el.data,
                columns: el.data.columns.map((col, i) =>
                  i === foreignKeySource.colId
                    ? { ...col, foreignKey: true }
                    : col
                ),
              },
            }
          : el
      ),
      {
        id: `e${foreignKeySource.id}-${target.id}`,
        source: foreignKeySource.id,
        target: target.id,
        sourceHandle: `o${foreignKeySource.colId}r`,
        targetHandle: `i${target.colId}l`,
        animated: true,
        style: {
          stroke: "#fff",
        },
        arrowHeadType: "arrowclosed",
      },
    ]);
    setForeignKeySource(null);
  };
  const setTable = (newValue, tableId) => {
    console.log("Running setTable");
    console.log(newValue);
    const elCopy = elements;
    elCopy.map((el) => (el.id === tableId ? newValue : el));
    setElements([...elCopy]);
  };
  const getNextElementId = () =>
    Math.max(...elements.map((element) => parseInt(element.id))) + 1;

  const createNewTable = ({ xPos, yPos }) => {
    const id = getNextElementId();
    // console.log(id);
    setElements([
      ...elements,
      {
        id: "4",
        data: {
          name: "and, its a custom name",
          columns: [
            { name: "id", type: "INTEGER", pkey: true, ai: true },
            { name: "someColumn", type: "INTEGER" },
            { name: "someOtherOtherColumn", type: "STRING" },
          ],
        },
        type: "table",
        position: { x: xPos, y: yPos },
      },
    ]);
  };

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
          foreignKeySource,
          setForeignKeySource,
          addForeignKey,
        }}
      >
        <ReactFlow
          elements={elements}
          onContextMenu={onBackgroundContextOpen}
          nodeTypes={nodeTypes}
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
