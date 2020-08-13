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
          console.log("isCurrent", data.length, data);
          setState({ data: data, loading: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [url, setState]);
  // console.log("Return", state);
  return state;
};
