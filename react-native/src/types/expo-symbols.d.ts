declare module "expo-symbols" {
  export interface SymbolProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default function Symbol(props: SymbolProps): JSX.Element;
}
