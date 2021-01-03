import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@material-ui/core";
import { Parser } from "sql-ddl-to-json-schema";
import { useState } from "react";
import { useTableDispatch } from "../../context/tables";

const possibleStarts = [
  "CREATE (?!ALGORITHM)",
  "ALTER",
  "DROP",
  "RENAME TABLE",
];
const possibleStartsExtended = [
  ...possibleStarts.map((start) => "^" + start),
  ...possibleStarts.map((start) => "^K_" + start),
];

const Import = ({ open, onClose }) => {
  const dispatch = useTableDispatch();
  const [parsedTables, setParsedTables] = useState(null);

  const handleFileChange = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split("\n");
      let tableAggregation = "";
      let inInsert = false;
      let inSomethingUseful = false;
      lines.forEach((line) => {
        const semicolonInLine = line.includes(";");
        // just skip every check if we're in an insert
        if (inInsert && !semicolonInLine) return;
        if (possibleStartsExtended.some((start) => line.match(start)))
          inSomethingUseful = true;
        if (inSomethingUseful) tableAggregation += line + "\n";
        if (inSomethingUseful && semicolonInLine) inSomethingUseful = false;
      });
      // Tempfix to make the sql parser parse the foreign key
      tableAggregation = tableAggregation.replaceAll(
        /ADD CONSTRAINT (.*) FOREIGN KEY (.*) REFERENCES (.*)(;|,)/g,
        "ADD CONSTRAINT $1 FOREIGN KEY $2 REFERENCES $3 ON DELETE CASCADE $4"
      );
      const parser = new Parser("mysql");
      setParsedTables(parser.feed(tableAggregation).toCompactJson());
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleImport = () => {
    dispatch({ type: "importFromCompactJson", tables: parsedTables });
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Import database structure</DialogTitle>
      <DialogContent>
        <Button variant="contained" component="label" autoFocus color="primary">
          Upload .sql file
          <input type="file" accept=".sql" onChange={handleFileChange} hidden />
        </Button>
        <br />
        {parsedTables && (
          <Typography variant="p">
            Found {parsedTables.length} tables
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {/*<Button>Import and override</Button>*/}
        <Button onClick={handleImport}>Import and append</Button>
      </DialogActions>
    </Dialog>
  );
};
export default Import;
