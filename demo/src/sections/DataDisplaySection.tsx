import type { SectionId } from '../nav/demoNavConfig';
import { createDataDisplayDemoModel } from './data-display/createDataDisplayDemoModel';
import DataDisplayDemoBodies from './data-display/DataDisplayDemoBodies';
import { DataDisplayDemoProvider } from './data-display/DataDisplayDemoContext';

const DataDisplaySection = (props: { sectionId: SectionId }) => {
  const model = createDataDisplayDemoModel();
  return (
    <DataDisplayDemoProvider value={model}>
      <DataDisplayDemoBodies sectionId={() => props.sectionId} />
    </DataDisplayDemoProvider>
  );
};

export default DataDisplaySection;
