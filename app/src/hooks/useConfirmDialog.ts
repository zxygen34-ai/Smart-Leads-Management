import { useState } from 'react';

type ConfirmState<T> = {
  open: boolean;
  payload: T | null;
};

export function useConfirmDialog<T>() {
  const [state, setState] = useState<ConfirmState<T>>({ open: false, payload: null });

  const open = (payload: T) => setState({ open: true, payload });
  const close = () => setState({ open: false, payload: null });

  return {
    open,
    close,
    isOpen: state.open,
    payload: state.payload
  };
}
