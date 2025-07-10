"use client";

import { useState, useEffect } from "react";
// Used to check if the component has mounted for hydration issues
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
