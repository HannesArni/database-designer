import {
  CalendarToday,
  Description,
  FormatListBulleted,
  Language,
  PowerSettingsNew,
  Schedule,
  ShortText,
  Storage,
  Subject,
  TextFormat,
  Today,
} from "@material-ui/icons";
import { Hashtag } from "./components/Icons";
import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  indigo,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@material-ui/core/colors";

export const colTypes = [
  { type: "STRING", icon: <ShortText fontSize="inherit" /> },
  {
    type: "TEXT",
    lengthOptions: ["tiny", "medium", "long"],
    icon: <Subject fontSize="inherit" />,
  },
  { type: "CHAR", icon: <TextFormat fontSize="inherit" /> },

  { type: "ENUM", icon: <FormatListBulleted fontSize="inherit" /> },
  {
    type: "BOOLEAN",
    length: null,
    icon: <PowerSettingsNew fontSize="inherit" />,
  },

  { type: "INTEGER", icon: <Hashtag fontSize="inherit" /> },
  { type: "FLOAT", icon: <Hashtag fontSize="inherit" /> },
  { type: "DOUBLE", icon: <Hashtag fontSize="inherit" /> },
  { type: "DECIMAL", icon: <Hashtag fontSize="inherit" /> },
  { type: "REAL", icon: <Hashtag fontSize="inherit" /> },

  { type: "DATE", icon: <Today fontSize="inherit" /> },
  { type: "TIME", length: null, icon: <Schedule fontSize="inherit" /> },
  {
    type: "DATEONLY",
    length: null,
    icon: <CalendarToday fontSize="inherit" />,
  },

  { type: "BLOB", icon: <Description fontSize="inherit" /> },
  { type: "JSONB", icon: <Storage fontSize="inherit" /> },
  { type: "JSONTYPE", icon: <Storage fontSize="inherit" /> },
  { type: "GEOMETRY", icon: <Language fontSize="inherit" /> },
  { type: "GEOGRAPHY", icon: <Language fontSize="inherit" /> },
];

export const colorMapper = {
  green: green,
  teal: teal,
  cyan: cyan,
  blue: blue,
  blueGrey: blueGrey,
  indigo: indigo,
  deepPurple: deepPurple,
  purple: purple,
  pink: pink,
  red: red,
  brown: brown,
  deepOrange: deepOrange,
  orange: orange,
  amber: amber,
  yellow: yellow,
  lime: lime,
};
