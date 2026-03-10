import { ActionRow, Button, FormField, FormGrid, FormLayout, Input, Select } from '@jankrajewskiit/ui';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const FormsSection = () => {
  return (
    <div>
      <ShowcaseSection title="FormField" subtitle="Label wrapper for form controls">
        <PreviewPanel class="col">
          <FormField label="Full name" id="demo-ff-name">
            <Input id="demo-ff-name" type="text" placeholder="Jan Kowalski" />
          </FormField>
          <FormField label="Email address" id="demo-ff-email">
            <Input id="demo-ff-email" type="email" placeholder="jan@example.com" />
          </FormField>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="FormGrid" subtitle="Responsive multi-column form layout">
        <PreviewPanel>
          <FormLayout>
            <FormGrid>
              <FormField label="First name" id="fn">
                <Input id="fn" type="text" placeholder="Jan" />
              </FormField>
              <FormField label="Last name" id="ln">
                <Input id="ln" type="text" placeholder="Kowalski" />
              </FormField>
              <FormField label="Email" id="email">
                <Input id="email" type="email" placeholder="jan@example.com" />
              </FormField>
              <FormField label="Role" id="role">
                <Select id="role">
                  <option value="">-- select role --</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </Select>
              </FormField>
            </FormGrid>
          </FormLayout>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="ActionRow" subtitle="Horizontal row for action buttons with alignment">
        <PreviewPanel class="col">
          <ActionRow align="start">
            <Button variant="primary">Save</Button>
            <Button variant="ghost">Cancel</Button>
          </ActionRow>

          <ActionRow align="end">
            <Button variant="dashed">Export</Button>
            <Button variant="primary">Submit</Button>
          </ActionRow>
        </PreviewPanel>
        <ShowcaseMeta>
          Use <span class="codeInline">align</span> prop to control button positioning within the row.
        </ShowcaseMeta>
      </ShowcaseSection>
    </div>
  );
};

export default FormsSection;
