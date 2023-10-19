export default function LoadMore(props) {
  const { isPaginate, onLoadMore, totalPage, limit } = props
  return (
    limit < totalPage && (
      <div className="load-more text-center">
        {isPaginate ? (
          <button
            onClick={onLoadMore}
            type="button"
            className="d-block mx-auto btn btn-primary my-5"
          >
            Load more
          </button>
        ) : (
          <button
            onClick={onLoadMore}
            style={{ opacity: 0.7 }}
            type="button"
            className="d-block mx-auto btn btn-primary my-5"
            disabled
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        )}

        {/* {!isPaginate && <p className="mt-3">Loading...</p>} */}
      </div>
    )
  )
}
