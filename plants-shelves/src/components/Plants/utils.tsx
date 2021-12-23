import { useEffect, useState } from "react";
import { JWTToken } from "../User/models";

const getRandomString = (string_length: number): string => [...Array(string_length)].map(i=>(~~(Math.random()*36)).toString(36)).join('')

function useDebounce(value: string, delay: number) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
  }

const generateColorForGroup = (groupName: string) => {
  // @ts-ignore: iterate through string is needed
  let groupNumber = [...groupName].reduce((prev, current) => prev + current.charCodeAt(), 0)
  let randomColor = "#" + Math.floor(Math.random()*(16777215 - groupNumber)).toString(16);
  return randomColor;
}

const parseJwt = (token: string, separator: string = ".", position: number = 1): JWTToken => {
  try {
    return JSON.parse(atob(token.split(separator)[position]));
  } catch (e) {
    throw new Error("JWTToken parsing error");
  }
};

export { getRandomString, useDebounce, generateColorForGroup, parseJwt }