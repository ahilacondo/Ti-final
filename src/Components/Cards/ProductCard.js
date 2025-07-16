import product_default from '../../Assests/Images/product_default.jpg';
import Rating from '../Rating';
const ProductCard = ({product}) => {
  return (
    <div className="my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-4">
          <img 
            src={product.item["image_url"]}
            width="100%"
          />
        </div>
        <div className="col-12 col-md-8">
          <span className="card-key">Id: </span>
          <span className="card-value">{product.item["id"]}</span>
          <br/>
          <span className="card-key">Nombre: </span>
          <span className="card-value">{product.item["title"]}</span>
          <br/>
          <span className="card-key">Procesadora: </span>
          <span className="card-value">{product.manufacturer["name"]}</span>
          <br/>
          <span className='d-flex align-items-center'>
            <span className="card-key">Calificación: </span> &nbsp;
            <Rating rating={product.item["rating"]/20} editable={false}/>
          </span>
          <br/>
          <span className="d-flex justify-content-around">
            {product.manufacturer.isVerified?
              <span className="">
                <span className="badge bg-success">Verificado</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">No Verificado</span>
              </span>
            }
            {product.manufacturer.isRenewableUsed?
              <span className="">
                <span className="badge bg-success">Eco Amigable</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">Eco Amigable</span>
              </span>
            }
          </span>
        </div>
      </div>
      <hr/>
    </div>
  )
}
export default ProductCard;