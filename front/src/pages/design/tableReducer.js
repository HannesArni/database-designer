import { useReducer } from "react";
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
  editing: {},
};
const reducer = (state, action) => {
  const changeTable = (newValue, tableId = action.tableId) => ({
    ...state,
    tables: {
      ...state.tables,
      [tableId]: {
        ...state.tables[tableId],
        ...newValue,
      },
    },
  });

  const changeColumn = (
    newValue,
    tableId = action.tableId,
    colId = action.colId
  ) => {
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
      const nextId = getNextElementId(state.tables);
      return {
        ...changeTable(
          {
            name: "",
            columns: {
              1: { name: "id", type: "INTEGER", pkey: true, ai: true },
            },
            position: { x: action.xPos, y: action.yPos },
          },
          nextId
        ),
        editing: { tableId: nextId.toString(), colId: -1 },
      };
    case "setColumn":
      return changeColumn(action.newValue);
    case "addColumn":
      const newId = getNextElementId(state.tables[action.tableId].columns);
      return {
        ...changeColumn(
          { name: "", allowNull: true, type: "INTEGER" },
          action.tableId,
          newId
        ),
        editing: { tableId: action.tableId, colId: newId.toString() },
      };
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
    case "toggleEditing":
      const actionExtracted = { tableId: action.tableId, colId: action.colId };
      if (
        actionExtracted.tableId === state.editing.tableId &&
        actionExtracted.colId === state.editing.colId
      )
        return { ...state, editing: {} };
      return {
        ...state,
        editing: actionExtracted,
      };
    default:
      throw new Error();
  }
};

const useTableReducer = () => useReducer(reducer, initalTableState);

export default useTableReducer;
