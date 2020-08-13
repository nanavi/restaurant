import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { useFetch } from "../utils/useFetch";
// import { Button } from "@material-ui/core";
// import useForm from "react-hook-form";

const show_kitsu_data = (data) => {
  //   console.log(data);
  return (
    <div>
      <h2>Ani</h2>
      {data.map((ani) => (
        <li key={ani.id}>
          <p>id: {ani.id}</p>
          <p>
            titles:
            <br />
            {ani.attributes.titles.en}
            <br />
            {ani.attributes.titles.ja_jp}
          </p>
          <p>poster</p>
          {/* <img src={ani.attributes.posterImage.medium} /> */}
          <p>
            synopsis: <br />
            {ani.attributes.synopsis}
          </p>
        </li>
      ))}
    </div>
  );
};

const options_page = (n) => {
  let content = [];
  for (let i = 0; i < n; ++i) {
    content.push(<option value={i}>Page {i + 1}</option>);
  }
  return content;
};

export default function Ani() {
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(() =>
    JSON.parse(localStorage.getItem("page"))
  );
  // const [loading, setLoading] = useState(true);
  // const [anis, setData] = useState(null);

  const { data, loading } = useFetch(
    `https://kitsu.io/api/edge/anime?page[limit]=5&page[offset]=${page}`
  );

  useEffect(() => {
    localStorage.setItem("page", JSON.stringify(page));
  }, [page]);

  if (loading) return <div> Loading... </div>;

  return (
    <div>
      <p>Hi:</p>
      {/* {console.log(anis)} */}
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>Page: {page / 5 + 1}</p>
      <select
        onChange={(e) => {
          setPage(5 * e.target.value);
          // setLoading(true);
        }}
      >
        <option value={0}>Page</option>
        {options_page(20)}
      </select>
      {show_kitsu_data(data)}
    </div>
  );
}

// export default Ani;
