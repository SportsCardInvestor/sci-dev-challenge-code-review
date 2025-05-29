import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import { fetchCatalog } from "../../api/api";
import Dropdown from "../Dropdown";

jest.mock("../../api/api", () => ({
  fetchCatalog: jest.fn(),
}));

const mockedFetchCatalog = fetchCatalog as jest.MockedFunction<
  typeof fetchCatalog
>;

describe("Dropdown Component", () => {
  const mockOnSelect = jest.fn();
  const mockOptions = ["HP1", "HP2", "HP3"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockedFetchCatalog.mockImplementation(() => new Promise(() => {}));
    render(<Dropdown onSelect={mockOnSelect} />);
    expect(screen.getByText("Loading options...")).toBeTruthy();
  });

  it("displays error message when API fails", async () => {
    mockedFetchCatalog.mockRejectedValueOnce(new Error("Error: An error occurred"));
    const { findByText } = render(<Dropdown onSelect={mockOnSelect} />);
    const errorMessage = await findByText(/Error: Network error/i);
    expect(errorMessage).toBeTruthy();
  });

  it("renders options and handles selection", async () => {
    mockedFetchCatalog.mockResolvedValueOnce({ data: mockOptions });
    render(<Dropdown onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading options...")).toBeFalsy();
    });

    const picker = screen.getByTestId("picker");
    fireEvent(picker, "valueChange", "HP1");
    expect(mockOnSelect).toHaveBeenCalledWith("HP1");
  });
});
