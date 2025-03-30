export default function UpdateStatusType({product}){
    return(
        <div>
        {product.status_type === "published" ? (
            <button className="border-2 px-2 py-1 rounded border-yellow-400 
                               hover:bg-yellow-400 
                               transition ease-in-out duration-300">
              Deactivate
            </button>
          ) : (
            <button className="border-2 px-2 py-1 rounded border-yellow-400 
                               hover:bg-yellow-400 
                               transition ease-in-out duration-300">
              Publish
            </button>
          )}   
          </div>
    )
}