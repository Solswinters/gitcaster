# Component Library Documentation

## Overview

GitCaster includes a comprehensive component library built with React, TypeScript, and Tailwind CSS. All components follow industry best practices for accessibility, performance, and maintainability.

## Component Categories

### Layout Components
- **Container**: Responsive container with max-width constraints
- **Grid**: Flexible grid system with responsive columns
- **Flex**: Flexbox layout with alignment options
- **Stack** (VStack/HStack): Vertical and horizontal stacking
- **Section**: Page section with variants and padding
- **Center**: Center content horizontally and/or vertically

### Form Components
- **Form**: Unified form with validation and state management
- **FormValidation**: Comprehensive validation rules
- **FormContext**: Share form state across components
- **FormErrorBoundary**: Error boundary for forms
- **FormGroup**: Group related form elements
- **FormField**: Individual form field with label and error

### Data Display Components
- **DataTable**: Feature-rich data table with sorting and pagination
- **StatCard**: Display statistics and KPIs
- **List** (ListItem, DescriptionList): Various list types
- **KeyValue** (KeyValueCard): Display key-value pairs
- **Timeline**: Chronological event display
- **Tag** (TagGroup): Labels and categories
- **Metric** (MetricGroup): KPI display with trends

### Feedback Components
- **Toast**: Toast notifications
- **Notification** (NotificationStack): Rich notifications
- **Banner**: Page-wide announcements
- **Progress** (ProgressBar, ProgressCircle, ProgressSteps): Progress indicators
- **StatusMessage**: Success/error/loading states
- **Alert**: Inline alerts
- **ErrorDisplay**: Error messages
- **ErrorBoundary**: React error boundaries

### UI Components
- **Button**: Versatile button component
- **Input**: Text input with variants
- **Card**: Card container
- **Modal**: Modal dialogs
- **Select**: Dropdown select
- **Textarea**: Multi-line text input
- **Checkbox**: Checkbox input
- **Radio**: Radio button input
- **Switch**: Toggle switch
- **Tabs**: Tab navigation
- **Tooltip**: Hover tooltips
- **Dropdown**: Dropdown menus
- **Breadcrumbs**: Breadcrumb navigation
- **Badge**: Status badges
- **Avatar**: User avatars
- **Divider**: Visual dividers
- **EmptyState**: Empty state placeholders
- **Table**: Basic table component
- **Pagination**: Pagination controls
- **Menu**: Menu component
- **Accordion**: Collapsible sections

### Navigation Components
- **Navbar**: Top navigation bar
- **Sidebar**: Side navigation
- **Menu**: Menu navigation

### Loading Components
- **Spinner**: Loading spinner
- **LoadingDots**: Animated dots
- **Skeleton**: Skeleton screens
- **Progress**: Progress bars
- **LoadingContainer**: Wrap content with loading states

### Overlay Components
- **Modal**: Modal overlays
- **Drawer**: Slide-out drawers

### Display Components
- **Code**: Code display with syntax highlighting

### Widget Components
- **Widget**: Generic widget container

## Usage Guidelines

### Importing Components

```typescript
// Import specific components
import { Button, Card, Modal } from '@/shared/components/ui';
import { Grid, Flex, Container } from '@/shared/components/layout';
import { Form, FormField } from '@/shared/components/forms';
import { Notification, Toast } from '@/shared/components/feedback';
import { DataTable, Metric } from '@/shared/components/data-display';
```

### Component Composition

Components are designed to work together:

```typescript
<Container>
  <Grid cols={2} gap="lg">
    <Card>
      <Form {...formProps}>
        {({ values, errors, handleChange, handleSubmit }) => (
          <VStack spacing="md">
            <FormField name="email" label="Email">
              {(props) => <Input {...props} />}
            </FormField>
            <Button onClick={handleSubmit}>Submit</Button>
          </VStack>
        )}
      </Form>
    </Card>
    <Card>
      <MetricGroup columns={2}>
        <Metric label="Total Users" value={1234} trend="up" change={15} />
        <Metric label="Revenue" value={98765} format="currency" trend="up" />
      </MetricGroup>
    </Card>
  </Grid>
</Container>
```

### Theming and Styling

All components use Tailwind CSS classes and can be customized via the `className` prop:

```typescript
<Button className="custom-class">Custom Button</Button>
```

### Accessibility

All components follow WAI-ARIA guidelines:
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support

### Performance

Components are optimized for performance:
- React.memo where appropriate
- Lazy loading for large components
- Virtualization for long lists
- Code splitting

## Testing

All components include comprehensive test coverage:
- Unit tests with Jest and React Testing Library
- Integration tests for component interactions
- Accessibility tests

## Contributing

When adding new components:
1. Follow existing patterns
2. Include TypeScript types
3. Add comprehensive tests
4. Document props and usage
5. Ensure accessibility compliance
6. Keep files under 500 lines

## Support

For questions or issues with components, please refer to:
- Component source code in `src/shared/components/`
- Test files in `tests/unit/shared/components/`
- Architecture documentation in `ARCHITECTURE.md`

