import { splitProps } from 'solid-js';

import Accordion from '~/components/surfaces/Accordion/Accordion';
import AccordionItem from '~/components/surfaces/Accordion/AccordionItem/AccordionItem';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';

interface SectionCardProps extends Omit<DivCoreNativeProps, 'onToggle'> {
  label: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  disabled?: boolean;
}

const SectionCard = (props: Props<SectionCardProps>) => {
  const [local, rest] = splitProps(props, [
    'label',
    'isOpen',
    'defaultOpen',
    'onToggle',
    'disabled',
    'children',
    'class',
  ]);

  return (
    <Accordion class={local.class}>
      <AccordionItem
        {...rest}
        label={local.label}
        isOpen={local.isOpen}
        onToggle={local.onToggle}
        disabled={local.disabled}
        defaultOpen={local.defaultOpen}
      >
        {local.children}
      </AccordionItem>
    </Accordion>
  );
};

export default SectionCard;
