import React, { useState, useEffect } from "react";
import NewsItems from "./Newsitems";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

const News = ({ country = "in", pageSize = 6, category = "general" }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Function to capitalize first character of a word
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}&pageSize=${pageSize}&page=${page}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("data for new-->", data);
        setArticles(data.articles);
        setTotalResults(data.totalResults);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [country, pageSize, category, page]);

  const handlePrevButton = () => {
    window.scrollTo(0, 0);
    setPage(page - 1);
  };

  const handleNextButton = () => {
    window.scrollTo(0, 0);
    setPage(page + 1);
  };

  return (
    <div className="container">
      <h1 className="text-center " style={{ margin: "35px" }}>
        Category - {capitalizeFirstLetter(category)}
      </h1>
      <div className="rounded mx-auto d-block">{loading && <Spinner />}</div>

      <div className="row ">
        {articles.map((element) => (
          <div className="col-md-4 my-2 " key={element.url}>
            <NewsItems
              title={element.title}
              description={element.description}
              newsUrl={element.url}
              imgUrl={element.urlToImage}
              date={element.publishedAt}
              author={element.author}
            />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between">
        <button
          type="button"
          disabled={page <= 1}
          onClick={handlePrevButton}
          className="btn btn-dark"
        >
          &larr; Previous
        </button>
        <button
          type="button"
          disabled={page + 1 > Math.ceil(totalResults / pageSize)}
          onClick={handleNextButton}
          className="btn btn-dark"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
