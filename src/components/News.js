import React, {useEffect , useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export default function News(props){
  const [articles , setArticles] = useState([]);
  const [loading , setLoading] = useState(true);
  const [page , setPage] = useState(1);
  const [totalResults , setTotalResults] = useState(0);
  // document.title = `${props.category} - NewsApp`;


  const updateNews = async()=>{
    props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=3418694255dd4865bc7702ff8972648c&page=1&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsed_data = await data.json();
    props.setProgress(70);
    setArticles(parsed_data.articles);
    setTotalResults(parsed_data.totalResults);
    setLoading(false);
    props.setProgress(100);
  }

  useEffect(()=>{
    updateNews();
  }, [])
  

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=3418694255dd4865bc7702ff8972648c&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1);
    // this.setState({ loading: true });
    let data = await fetch(url);
    let parsed_data = await data.json();
    setArticles(articles.concat(parsed_data.articles));
    setTotalResults(parsed_data.totalResults);
  };


    return (
      // <div className="container my-4">
      <>
        <h2 className="text-center" style={{margin: "35px 0px",marginTop: "90px"}}>NewsApp - Top Headlines</h2>
        {/* {loading && <Spinner/>}  */}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title}
                      description={element.description}
                      imageurl={element.urlToImage}
                      newsurl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button
            disabled={page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            Previous
          </button>
          <button
            disabled={
              page + 1 >
              Math.ceil(totalResults / props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next
          </button>
        </div> */}
      </>
    );
}

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};
