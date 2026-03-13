import type { JSX } from 'solid-js';

import AccordionItem from '~/components/data-display/Accordion/AccordionItem';
import type Props from '~/models/Props';

import Text from '../../typography/Text/Text';
import styles from './SectionCard.module.css';

interface SectionCardProps {
  title: string;
  defaultOpen?: boolean;
  children: JSX.Element;
}

const SectionCard = (props: Props<SectionCardProps>) => {
  return (
    <AccordionItem
      title={
        <Text as="span" variant="labelMd" class={styles.title}>
          {props.title}
        </Text>
      }
      defaultOpen={props.defaultOpen}
      variant="card"
      class={props.class}
    >
      {props.children}
    </AccordionItem>
  );
};

export default SectionCard;
