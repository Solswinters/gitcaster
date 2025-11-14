# Code Examples

## Component Examples

### Using Form Components

```typescript
import { Form, FormField, Button } from '@/shared/components';
import { commonValidations } from '@/shared/components/forms/FormValidation';

function LoginForm() {
  const handleSubmit = async (values: { email: string; password: string }) => {
    await authService.login(values);
  };

  const validate = (values: any) => {
    const errors: any = {};
    const emailError = commonValidations.email(values.email);
    const passwordError = commonValidations.password(values.password);
    
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    
    return errors;
  };

  return (
    <Form
      initialValues={{ email: '', password: '' }}
      onSubmit={handleSubmit}
      validate={validate}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <FormField name="email" label="Email" required>
            {(props) => (
              <Input
                type="email"
                {...props}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email ? errors.email : undefined}
              />
            )}
          </FormField>

          <FormField name="password" label="Password" required>
            {(props) => (
              <Input
                type="password"
                {...props}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={touched.password ? errors.password : undefined}
              />
            )}
          </FormField>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      )}
    </Form>
  );
}
```

### Using Layout Components

```typescript
import { Container, Grid, Card, VStack } from '@/shared/components';

function Dashboard() {
  return (
    <Container>
      <VStack spacing="lg">
        <h1>Dashboard</h1>
        
        <Grid cols={3} gap="md" responsive={{ md: 2, sm: 1 }}>
          <Card>
            <h2>Users</h2>
            <p>1,234 total users</p>
          </Card>
          
          <Card>
            <h2>Revenue</h2>
            <p>$12,345</p>
          </Card>
          
          <Card>
            <h2>Growth</h2>
            <p>+15% this month</p>
          </Card>
        </Grid>
      </VStack>
    </Container>
  );
}
```

### Using Data Display Components

```typescript
import { DataTable, Timeline, MetricGroup, Metric } from '@/shared/components';

function AnalyticsDashboard() {
  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'value', header: 'Value', sortable: true },
    { key: 'change', header: 'Change' },
  ];

  const data = [
    { id: '1', name: 'Metric A', value: 1234, change: '+15%' },
    { id: '2', name: 'Metric B', value: 5678, change: '-5%' },
  ];

  return (
    <div>
      <MetricGroup columns={4}>
        <Metric
          label="Total Users"
          value={1234}
          trend="up"
          change={15}
          icon={<span>👥</span>}
        />
        <Metric
          label="Revenue"
          value={98765}
          format="currency"
          trend="up"
          change={23}
        />
        <Metric
          label="Active Sessions"
          value={456}
          trend="down"
          change={-3}
        />
        <Metric
          label="Conversion Rate"
          value={12.5}
          format="percentage"
          trend="up"
          change={2}
        />
      </MetricGroup>

      <DataTable
        columns={columns}
        data={data}
        sortable
        pagination
        pageSize={10}
      />
    </div>
  );
}
```

## Hook Examples

### Using Custom Hooks

```typescript
import { useDebounce, useLocalStorage, useAsync } from '@/shared/hooks';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [savedSearches, setSavedSearches] = useLocalStorage<string[]>('searches', []);

  const {
    data: results,
    loading,
    error,
    execute: search,
  } = useAsync(async (q: string) => {
    return await searchService.search(q);
  });

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    if (!savedSearches.includes(newQuery)) {
      setSavedSearches([...savedSearches, newQuery]);
    }
  };

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      
      {loading && <Spinner />}
      {error && <ErrorDisplay error={error} />}
      {results && <SearchResults data={results} />}
    </div>
  );
}
```

### Using Feature Hooks

```typescript
import { useAuth, useProfile, useGitHubSync } from '@/features';

function UserDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const { profile, updateProfile } = useProfile(user?.id);
  const { syncStatus, triggerSync } = useGitHubSync();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      
      <ProfileCard profile={profile} onUpdate={updateProfile} />
      
      <Button onClick={triggerSync} disabled={syncStatus === 'syncing'}>
        {syncStatus === 'syncing' ? 'Syncing...' : 'Sync GitHub'}
      </Button>
      
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
```

## Utility Examples

### Using Error Handling

```typescript
import { ErrorService, ErrorRecovery } from '@/shared/utils/errors';

async function fetchUserData(userId: string) {
  try {
    const data = await api.get(`/users/${userId}`);
    return data;
  } catch (error) {
    // Log error
    ErrorService.logError(error);
    
    // Attempt recovery
    const recovered = await ErrorRecovery.retryOperation(
      () => api.get(`/users/${userId}`),
      { maxRetries: 3, delay: 1000 }
    );
    
    if (recovered) {
      return recovered;
    }
    
    // Transform and re-throw
    throw ErrorService.transformError(error);
  }
}
```

### Using Validation

```typescript
import { FormValidator } from '@/shared/components/forms/FormValidation';

const validateUserForm = FormValidator.combine(
  FormValidator.required('Name is required'),
  FormValidator.minLength(3, 'Name must be at least 3 characters'),
  FormValidator.maxLength(50, 'Name must be less than 50 characters')
);

function handleSubmit(values: any) {
  const nameError = validateUserForm(values.name);
  if (nameError) {
    toast.error(nameError);
    return;
  }
  
  // Proceed with submission
}
```

## Testing Examples

### Component Testing

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Button } from '@/shared/components';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={onClick}>Click me</Button>
    );
    
    const button = getByRole('button');
    fireEvent.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const { getByRole } = render(
      <Button loading>Loading...</Button>
    );
    
    const button = getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading...');
  });
});
```

### Integration Testing

```typescript
import { render, waitFor } from '@testing-library/react';
import { UserProfile } from '@/features/profile';

describe('UserProfile Integration', () => {
  it('loads and displays user data', async () => {
    const { getByText, getByRole } = render(
      <UserProfile userId="user-123" />
    );
    
    await waitFor(() => {
      expect(getByText('John Doe')).toBeInTheDocument();
    });
    
    const editButton = getByRole('button', { name: /edit/i });
    expect(editButton).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Component Composition** - Build complex UIs from simple components
2. **Custom Hooks** - Extract reusable logic into hooks
3. **Error Handling** - Always handle errors gracefully
4. **Type Safety** - Leverage TypeScript for type safety
5. **Testing** - Write tests alongside implementation
6. **Performance** - Use memo, callback, and lazy loading
7. **Accessibility** - Ensure all components are accessible

## Resources

- [Component Library](/docs/COMPONENT_LIBRARY.md)
- [Code Style Guide](/docs/CODE_STYLE.md)
- [Testing Guide](/docs/TESTING.md)
- [Architecture](/ARCHITECTURE.md)

