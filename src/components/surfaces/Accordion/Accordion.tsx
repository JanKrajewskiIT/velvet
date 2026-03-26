import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';

import Card from '../Card/Card';

const Accordion = (props: Props<DivCoreNativeProps>) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <Card padding="none" class={local.class} {...rest}>
      {local.children}
    </Card>
  );
};

export default Accordion;
