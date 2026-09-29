// src/helpers/hooks/useTokenPagination.ts
import { useState } from "react";

export const useTokenPagination = (initialPage = 1) => {
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [tokenStack, setTokenStack] = useState<(string | null)[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);

  const goToNextPage = () => {
    if (nextToken) {
      setTokenStack((prev) => [...prev, currentToken]);
      setCurrentToken(nextToken);
      setPageIndex((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pageIndex > 1) {
      const newStack = [...tokenStack];
      const prevToken = newStack.pop();
      setTokenStack(newStack);
      setCurrentToken(prevToken !== undefined ? prevToken : null);
      setPageIndex((prev) => prev - 1);
    }
  };

  const resetPagination = () => {
    setPageIndex(1);
    setCurrentToken(null);
    setTokenStack([]);
    setNextToken(null);
  };

  return {
    pageIndex,
    currentToken,
    nextToken,
    setNextToken, // Used to update the "forward" bookmark after an API call
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  };
};
