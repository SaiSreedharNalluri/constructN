export interface ISideDrawerProps {
  title: string;
  items: string[];
  open: boolean;
  onClose: () => void;
  onSelect: (selectedItem: string) => void;
}
