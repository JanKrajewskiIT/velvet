import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import Card from '../Card/Card';

const Accordion = (props: Props<JSX.HTMLAttributes<HTMLDivElement>>) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <Card padding="none" class={local.class} {...rest}>
      {local.children}
    </Card>
  );
};

export default Accordion;
