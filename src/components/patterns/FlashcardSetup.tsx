import { partitionProps } from '../../utils/props';
import type { FlashcardConfig, FlashDeck } from './flashcard';
import { PracticeSetup, type PracticeSetupProps } from './PracticeSetup';

export interface FlashcardSetupProps extends Omit<PracticeSetupProps, 'collections' | 'onStart'> {
  decks: FlashDeck[];
  onStart?: (config: FlashcardConfig) => void;
}

export const FlashcardSetup = (props: FlashcardSetupProps) => {
  const [local, rest] = partitionProps(props, ['decks', 'onStart']);
  return (
    <PracticeSetup
      {...rest}
      collections={local.decks}
      onStart={({ collection, ...config }) => local.onStart?.({ ...config, deck: collection })}
    />
  );
};
