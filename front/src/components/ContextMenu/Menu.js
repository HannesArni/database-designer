import { Menu, MenuItem } from "@material-ui/core";

const ContextMenuContent = ({
  open,
  onClose,
  yPos,
  xPos,
  actions,
  handleActionClick,
}) => (
  <Menu
    keepMounted
    open={open}
    onClose={() => onClose()}
    anchorReference="anchorPosition"
    anchorPosition={
      yPos !== null && xPos !== null ? { top: yPos, left: xPos } : undefined
    }
  >
    {actions.map(({ label, action }, index) => (
      <MenuItem key={index} onClick={() => handleActionClick(action)}>
        {label}
      </MenuItem>
    ))}
  </Menu>
);
export default ContextMenuContent;
