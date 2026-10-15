import { startTransition, type FormEvent } from 'react';

/**
 * Submits a form to a useActionState action without React's automatic form reset, so a server-side error
 * doesn't wipe what the person typed. Forms still keep `action` for when JavaScript hasn't loaded.
 */
export const submitKeepingValues = (dispatch: (data: FormData) => void) => (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  startTransition(() => dispatch(data));
};
