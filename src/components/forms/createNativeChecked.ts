import { untrack } from 'solid-js';

export interface NativeCheckedProps {
  checked?: boolean | undefined;
  /** Initial checked state for an uncontrolled field, restored by native form reset. */
  defaultChecked?: boolean | undefined;
}

export const createNativeChecked = (props: NativeCheckedProps) => {
  const initial = untrack(() => props.defaultChecked ?? false);

  // The attribute supplies the reset value and server markup. The property also updates dirty controlled inputs.
  return () => {
    const checked = props.checked;
    if (checked === undefined) return { 'bool:checked': initial };
    return { 'bool:checked': checked, 'prop:checked': checked };
  };
};
