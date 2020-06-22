export type NavbarAction = {
  name: string;
  description: string;
  onClick: string;
  navigate?: boolean;
} | {
  name: string;
  description: string;
  navigate: true;
}
