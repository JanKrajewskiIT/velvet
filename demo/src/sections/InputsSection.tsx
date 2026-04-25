import type { SectionId } from '../nav/demoNavConfig';
import { createInputsDemoModel } from './inputs/createInputsDemoModel';
import InputsDemoBodies from './inputs/InputsDemoBodies';
import { InputsDemoProvider } from './inputs/InputsDemoContext';

const InputsSection = (props: { sectionId: SectionId }) => {
  const model = createInputsDemoModel();
  return (
    <InputsDemoProvider value={model}>
      <InputsDemoBodies sectionId={() => props.sectionId} />
    </InputsDemoProvider>
  );
};

export default InputsSection;
