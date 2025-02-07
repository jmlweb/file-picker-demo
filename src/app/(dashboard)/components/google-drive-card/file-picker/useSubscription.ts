import { useCallback, useRef } from 'react';

type Subscription = {
  subscribe: (ids: string[]) => void;
};

export default function useSubscription(
  cb: (ids: string[], isChecked: boolean) => void,
  parentSubscribe?: Subscription['subscribe'],
) {
  const idsStateRef = useRef(new Set<string>());
  const subscribe = useCallback(
    (ids: string[]) => {
      const newIds = new Set(ids);
      idsStateRef.current = new Set([...idsStateRef.current, ...newIds]);

      if (parentSubscribe) {
        parentSubscribe(ids);
      }
    },
    [parentSubscribe],
  );

  const execute = useCallback(
    (isChecked: boolean) => {
      const idsArray = Array.from(idsStateRef.current);
      cb(idsArray, isChecked);
    },
    [cb],
  );

  return { subscribe, execute };
}
