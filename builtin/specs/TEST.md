# Generate a Vitest Component Test

Go to `/src/components` and scan all files ending in .tsx and create test files.

## Requirements

- Use `vitest` and `@solidjs/testing-library`.
- Import the component using the project’s existing path aliases or relative paths.
- Do not modify the component implementation.
- Do not create unnecessary mocks.
- Follow the project’s existing formatting and testing conventions.

## Use imports

- Import and use `render`, `screen`, `fireEvent`, `cleanup` from `@solidjs/testing-library`.
- Import and use `afterEach`, `describe`, `expect`, `it` from `vitest`.

## Test Coverage

The generated test file should test:

1. The component renders successfully.
2. All components works properly.
3. Required props are handled correctly.
4. User interactions work as expected, such as:
   - Clicking buttons
   - Typing into inputs
   - Selecting options
   - Submitting forms
5. Callback props are called with the expected arguments.
6. Loading, empty, disabled, and error states are tested when supported.
7. Conditional content is displayed or hidden correctly.
8. Accessibility-related behavior is covered using accessible roles and names.

## Dasig

If you see a `@dasig` import, no need for you to check if it's installed, it is builtin. Check the components on `/builtin/components` if you need clarification.

## Testing Guidelines

- Prefer queries in this order:
  1. `getByRole`
  2. `getByLabelText`
  3. `getByPlaceholderText`
  4. `getByText`
  5. `getByTestId` only when necessary
  6. `toBeInTheDocument`
- Use `userEvent` instead of manually dispatching DOM events.
- Keep each test focused on one behavior.
- Use descriptive test names.
- Avoid testing implementation details.
- Do not use snapshots unless they are already standard in the project.
- Mock network requests and external services only when required.
- Reset mocks between tests when mocks are used.

## Expected File Structure

Create the test file next to the component:

```text
src/components/Component.tsx
src/components/Component.test.tsx
```
