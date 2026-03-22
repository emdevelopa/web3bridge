import { useContext } from "react";
import { ThemeContext } from "./App";
// import { ThemeContext } from "./ThemeContext";

function Child() {
  const theme = useContext(ThemeContext);

  return <p>Theme: {theme}</p>;
}
