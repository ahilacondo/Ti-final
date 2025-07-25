import { useContext, useEffect, useState } from 'react';

//import '../../Assests/Styles/product.page.css';
import { useLocation } from 'react-router-dom';
import { fetchManufacturer, formattedAddress } from '../../Services/Utils/stakeholder';
import { ContractContext } from '../../Services/Contexts/ContractContext';
import { AuthContext } from '../../Services/Contexts/AuthContext';
import Toast from '../../Components/Toast';
import Rating from '../../Components/Rating';

const Product = () => {
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const { contractState, updateStats } = useContext(ContractContext);
  const [product, setProduct] = useState(location.state.product);
  const [transferState, setTransferState] = useState({
    from: authState.address,
  });
  const [reviewState, setReviewState] = useState({
    rating: 0,
    comment: "",
    from: authState.address,
  })
  const [isOwner, setIsOnwer] = useState(authState.address.toLowerCase() == location.state.product.item["currentOwner"].toLowerCase());

  const reload = async () => {
    const id = location.state.product.item.id;
    const response = await contractState.productContract.methods.get(id).call({from: authState.address});
    const product = {
      "item": response.item,
      "rawProducts": response.rawProducts,
      "reviews": response.reviews,
      "transactions": response.transactions,
      "manufacturer": await fetchManufacturer(authState.address, contractState.manufacturerContract, response.item["manufacturer"])
    }
    setProduct(product);
  }

  const transfer = async () => {
    await contractState.productContract.methods.transfer(transferState.to, product.item.id).send({from: authState.address});
    await reload();
    Toast("success", "Producto transferido exitosamente");
    setTransferState({
      from: authState.address,
    });
    // .on('transactionHash', hash => {
    //   console.log(hash);
    // })
    // .on('receipt', receipt => {
    //   console.log(receipt);
    // })
    // .on('confirmation', (confirmationNumber, receipt) => {
    //   console.log(confirmationNumber, receipt);
    // })
    // .on('error', error => {
    //   console.log(error);
    // })
    updateStats();
  }

  const postReview = async () => {
    if(!isOwner){
      Toast("error", "Usted no es el propietario de este producto");
      return;
    }
    await contractState.productContract.methods.addReview(product.item.id, reviewState.rating, reviewState.comment).send({from: authState.address});
    await reload();
    Toast("success", "Reseña publicada exitosamente");
    setReviewState({
      rating: 0,
      comment: "",
      from: authState.address,
    });
    updateStats();
  }

  const features = [
    {
      "icon": <i className="fa fa-certificate fa-2x"/>,
      "label": "Productos Verificados" 
    },
    {
      "icon": <i className="fa fa-shield fa-2x"/>,
      "label": "Transacciones Seguras" 
    },
    {
      "icon": <i className="fa fa-rotate-left fa-2x"/>,
      "label": "Política de Devolución"  
    },
    {
      "icon": <i className="fa fa-lock fa-2x"/>,
      "label": "Entregado por Blockchain" 
    },
    {
      "icon": <i className="fa fa-check fa-2x"/>,
      "label": "Productos Genuinos"  
    }
  ]
  return (
    <div className="wrapper">
      <div className="row top-wrapper">
        <div className="col-12 col-md-4 tw-left">
          <img src={product.item["image_url"]} width="100%"/>
        </div>
        <div className="col-12 col-md-8 tw-right">
          <span className="tw-heading1">
            {product.item["title"]}
          </span>
          <br/>
          <span className='tw-product-stats d-flex align-items-center'>
            <Rating rating={product.item["rating"]/20} editable={false}/>
            &nbsp;| &nbsp;
            <span>
              {product.reviews.length} calificaciones &nbsp;| &nbsp;
            </span>
            <span>
              {product.transactions.length} transacciones 
            </span>
          </span>
          {new Date(product.item["launchDate"] * 1000).toDateString()}
          <br/>
          <span className='tw-features d-flex justify-content-around'>
            {features.map(feature => (
              <span className='text-center'>
                {feature.icon}
                <br/>
                <span>{feature.label}</span>
              </span>
            ))}
          </span>
          <span className='tw-brand'>
            Brand: {product.manufacturer["name"]} &nbsp;| &nbsp;
            {product.manufacturer.isRenewableUsed?
              <span className="">
                <span className="badge bg-success">Eco Amigable</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">No Eco Amigable</span>
              </span>
            }
          </span>
          <br/>
          <span className='tw-seller text-wrap'>
            Vendido por: {formattedAddress(product.item["currentOwner"])}
          </span>
          <br/>
          <div className='tw-transfer-wrapper'>
            <input type="text" placeholder='direccion' disabled={!isOwner}
            onChange={
              (e) => {
                setTransferState({
                  ...transfer,
                  to: e.target.value
                })
              }
            }/>
            &nbsp;
            &nbsp;
            <button 
              disabled={!isOwner}
              onClick={transfer}
            >Transferir</button>
          </div>
        </div>
      </div>
      <hr/>
      <div className="middle-wrapper">
        <span className='heading'>
          Ingredientes
        </span>
        <br/>
        <span>
          {product.rawProducts.map(rawProduct => (
            <span className='me-3'>
              {rawProduct["name"]} &nbsp;
              {rawProduct["isVerified"]?
                <i className='text-success fa fa-check' title='Verified'/>
              :
                <i className='text-warning fa fa-exclamation' title='Not verified'/>
              }
            </span>
          ))}
        </span>
      </div>
      <hr/>
      <div className="bottom-wrapper">
        <div className='row'>
          <div className='col-12 col-md-6'>
            <span className='heading'>
              Transacciones
            </span>
            {product.transactions.map(transaction => (
              <div className='my-1 border'>
                Transferido desde {formattedAddress(transaction["from"])}
                <br/>
                Transferido a {formattedAddress(transaction["to"])}
                <br/>
                {new Date(transaction["date"] * 1000).toDateString()}
              </div>
            ))}
          </div>
          <div className='col-12 col-md-6'>
            <span className='heading'>
              Reseñas
            </span>
            <div className='bw-review-wrapper'>
              <textarea placeholder='Comentario' className='col-10' disabled={!isOwner}
               onChange={
                (e) => {
                  setReviewState({
                    ...reviewState,
                    comment: e.target.value
                  })
                }
              }/>
              <br/>
              <span className='d-flex align-items-center'>
                <Rating rating={reviewState.rating} editable={isOwner} onChange={
                  (rating) => {
                    setReviewState({
                      ...reviewState,
                      rating: rating*20
                    })
                  }
                }/>
                <button onClick={postReview} disabled={!isOwner}>Publicar</button>
              </span>
              <br/>
            </div>
            {product.reviews.map(review => (
              <div className='my-1 border'> 
                <span className='d-flex align-items-center'>
                  <Rating rating={review["rating"]/20} editable={false}/>
                  &nbsp;
                  <span className='badge bg-success'>Compra Verificada</span>
                </span>
                Revisor: &nbsp; {formattedAddress(review["reviewer"])} &nbsp;
                <br/>
                Revisado el: {new Date(review["date"] * 1000).toDateString()}
                <br/>
                {review["comment"]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Product;