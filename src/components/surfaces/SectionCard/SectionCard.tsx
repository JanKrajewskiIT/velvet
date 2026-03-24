import { type JSX, splitProps } from 'solid-js';

import Accordion from '~/components/surfaces/Accordion/Accordion';
import AccordionItem from '~/components/surfaces/AccordionItem/AccordionItem';
import type Props from '~/models/Props';

interface SectionCardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'onToggle'> {
  title: JSX.Element;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  disabled?: boolean;
}

const SectionCard = (props: Props<SectionCardProps>) => {
  const [local, rest] = splitProps(props, [
    'title',
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
        title={local.title}
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
