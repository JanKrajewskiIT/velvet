import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';

import Card from '../Card/Card';

type AccordionOwnProps = JSX.HTMLAttributes<HTMLDivElement>;

const Accordion = (props: Props<AccordionOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <Card padding="none" class={local.class} {...rest}>
      {local.children}
    </Card>
  );
};

export default Accordion;
