export function SpinAnimation(props: { height: number; width: number }) {
    return (
      <div className="flex items-center justify-center">
        <div
          className={`animate-spin rounded-full border-2 border-solid border-white border-r-transparent`}
          role="status"
          style={{ height: props.height, width: props.width }}
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }