import "@testing-library/jest-native/extend-expect";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (expected: string) => R;
      toBeEnabled: () => R;
      toBeVisible: () => R;
      toBeDisabled: () => R;
      toHaveStyle: (expected: any) => R;
    }
  }
}