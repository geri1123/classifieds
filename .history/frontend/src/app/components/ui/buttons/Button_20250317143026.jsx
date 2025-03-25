const Button = ({loading , children  , ...props}) => {
  return (
    <button
    className={` w-full bg-yellow-40 hover:bg-yellow-400 text-black px-4 py-2 rounded-md font-medium shadow-md border border-yellow-40`}
    disabled={loading}
    {...props}
  >
    {loading ? "loading..." : children}
  </button>
  )
}

export default Button
