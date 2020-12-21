import { useTheme } from "@material-ui/core";

export const Hashtag = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        verticalAlign: "text-bottom",
        fontWeight: "bold",
        marginRight: 3,
        color: theme.palette.text.primary,
      }}
    >
      #
    </div>
  );
};
