import { useEffect, useState, useRef } from "react";

export const useFetch = (url) => {
  const isCurrent = useRef(true);
  const [state, setState] = useState({ data: null, loading: true });
  useEffect(() => {
    return () => {
      isCurrent.current = false;
    };
  }, []);
  useEffect(() => {
    setState((state) => ({ data: state.data, loading: true }));

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (isCurrent.current) {
          setState({ data: data.data, loading: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [url, setState]);
  return state;
};
