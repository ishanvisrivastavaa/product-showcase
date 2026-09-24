import { act, renderHook } from "@testing-library/react";

import { useDebouncedUrlParam } from "@/hooks/common/use-debounced-url-param";

describe("useDebouncedUrlParam", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with the given value", () => {
    const onUpdate = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedUrlParam({ value: "phone", onUpdate }),
    );

    expect(result.current[0]).toBe("phone");
  });

  it("syncs with external value updates", () => {
    const onUpdate = jest.fn();
    let value = "phone";
    const { result, rerender } = renderHook(() =>
      useDebouncedUrlParam({ value, onUpdate }),
    );

    expect(result.current[0]).toBe("phone");

    value = "laptop";
    rerender();

    expect(result.current[0]).toBe("laptop");
  });

  it("debounces user input and calls onUpdate after delay", () => {
    const onUpdate = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedUrlParam({ value: "", onUpdate, delay: 300 }),
    );

    act(() => {
      result.current[1]("watch");
    });

    expect(onUpdate).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onUpdate).toHaveBeenCalledWith("watch");
  });

  it("does not call onUpdate if input matches existing value", () => {
    const onUpdate = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedUrlParam({ value: "same", onUpdate, delay: 300 }),
    );

    act(() => {
      result.current[1]("same");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onUpdate).not.toHaveBeenCalled();
  });
});
