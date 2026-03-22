import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

import "./App.css";

export const ThemeContext = createContext();
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child /> 
    </ThemeContext.Provider>
  );
}

export default App;
