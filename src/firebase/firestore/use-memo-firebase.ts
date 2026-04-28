'use client';

import { useMemo, useRef } from 'react';

/**
 * A hook that memoizes a Firebase reference or query.
 * 
 * Because Firebase references and queries are objects that can be recreated on every render
 * (e.g., when passing a dynamic path to `doc()` or `collection()`), using them directly 
 * as dependencies in `useEffect` or `onSnapshot` can cause infinite loops.
 * 
 * This hook uses a reference-based check or simple dependency array to stabilize the object.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<T | null>(null);
  const prevDeps = useRef<any[]>(deps);

  const isDepsEqual = deps.every((dep, i) => dep === prevDeps.current[i]);

  if (!ref.current || !isDepsEqual) {
    ref.current = factory();
    prevDeps.current = deps;
  }

  return ref.current;
}
