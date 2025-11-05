import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/MenuItemReviewsUtils";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

describe("MenuItemReviewUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It logs the message and shows a toast", () => {
      // arrange
      const restoreConsole = mockConsole();

      // act
      onDeleteSuccess("deleted!");

      // assert
      expect(mockToast).toHaveBeenCalledWith("deleted!");
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("deleted!");

      restoreConsole();
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      // arrange
      const cell = { row: { original: { id: 42 } } };

      // act
      const result = cellToAxiosParamsDelete(cell);

      // assert
      expect(result).toEqual({
        url: "/api/menuitemreviews",
        method: "DELETE",
        params: { id: 42 },
      });
    });
  });
});
