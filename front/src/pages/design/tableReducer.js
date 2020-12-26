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
        4: {
          name: "xPos",
          type: "INTEGER",
          allowNull: true,
        },
        5: {
          name: "yPos",
          type: "INTEGER",
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
    case "removeTable":
      // first, remove the table. Then, iterate through 'em all and remove FKs referencing the table
      return {
        ...state,
        tables: Object.map(
          Object.filter(
            state.tables,
            ([tableId]) => tableId !== action.tableId
          ),
          ([tableId, table]) => [
            tableId,
            {
              ...table,
              columns: Object.map(table.columns, ([colId, col]) => [
                colId,
                {
                  ...col,
                  ...(col.fkey?.table === action.tableId ? { fkey: null } : {}),
                },
              ]),
            },
          ]
        ),
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
    case "removeColumn":
      // first, remove the column. Then, iterate through 'em all and remove FKs referencing the table
      return {
        ...state,
        tables: Object.map(
          changeTable({
            columns: Object.filter(
              state.tables[action.tableId].columns,
              ([colId]) => colId !== action.colId
            ),
          }).tables,
          ([tableId, table]) => {
            return [
              tableId,
              {
                ...table,
                columns: Object.map(table.columns, ([colId, col]) => [
                  colId,
                  {
                    ...col,
                    ...(col.fkey?.table.toString() === action.tableId &&
                    col.fkey?.column.toString() === action.colId
                      ? { fkey: null }
                      : {}),
                  },
                ]),
              },
            ];
          }
        ),
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
    case "stopEditing":
      return { ...state, editing: {} };
    case "prevColumn":
      if (!state.editing.colId || !state.editing.tableId) return state;
      const parsedColIdPrev = parseInt(state.editing.colId);
      const lowerIds = Object.keys(state.tables[state.editing.tableId].columns)
        .map((colId) => parseInt(colId))
        .filter((id) => id < parsedColIdPrev);
      if (lowerIds.length)
        return {
          ...state,
          editing: {
            ...state.editing,
            colId: lowerIds[lowerIds.length - 1].toString(),
          },
        };
      const parsedTableIdPrev = parseInt(state.editing.tableId);
      const tableIds = Object.keys(state.tables);
      const lowerTableIds = tableIds
        .map((tableId) => parseInt(tableId))
        .filter((id) => id < parsedTableIdPrev);
      if (lowerTableIds.length)
        return {
          ...state,
          editing: {
            tableId: lowerTableIds[lowerTableIds.length - 1].toString(),
            colId: -1,
          },
        };
      else
        return {
          ...state,
          editing: {
            tableId: tableIds[tableIds.length - 1],
            colId: -1,
          },
        };

    case "nextColumn":
      let { colId, tableId } = state.editing;
      if (!colId || !tableId) return state;
      const parsedColId = parseInt(colId);
      const higherIds = Object.keys(state.tables[tableId].columns)
        .map((colId) => parseInt(colId))
        .filter((id) => id > parsedColId);
      if (higherIds.length)
        return {
          ...state,
          editing: {
            ...state.editing,
            colId: higherIds[0].toString(),
          },
        };
      const parsedTableId = parseInt(tableId);
      const higherTableIds = Object.keys(state.tables)
        .map((tableId) => parseInt(tableId))
        .filter((id) => id > parsedTableId);
      if (higherTableIds.length)
        return {
          ...state,
          editing: {
            tableId: higherTableIds[0].toString(),
            colId: -1,
          },
        };
      else
        return {
          ...state,
          editing: {
            tableId: Object.keys(state.tables)[0],
            colId: -1,
          },
        };

    default:
      throw new Error();
  }
};

const useTableReducer = () => useReducer(reducer, initalTableState);

export default useTableReducer;
