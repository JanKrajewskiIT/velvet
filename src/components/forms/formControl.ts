export interface FormControlProps {
  /** Successful form controls submit their committed value under this name. */
  name?: string;
  /** Associates the control with a form outside its DOM ancestors. */
  form?: string;
  required?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
