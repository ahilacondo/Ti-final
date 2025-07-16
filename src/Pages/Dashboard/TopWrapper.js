import img_cover from '../../Assests/Images/dashboard/top_wrapper.jpg';
const TopWrapper  = () => {
  return (
    <div className="top-wrapper">
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-md-6">
          <img src={img_cover} width="100%"/>
        </div>
        <div className="col-12 col-md-6">
          <div className="tw-about text-center">
            <p className="tw-heading">
              Soluciones de Cadena de Suministro Global🚛 
            </p>
            <p className="tw-sub-heading">
              Planificamos, implementamos y controlamos el movimiento 
              y almacenamiento de productos dentro de una cadena de suministro 
              y entre los puntos de origen y consumo.
            </p>
          </div>
        </div>
      </div>
      <hr/>
    </div>
  ) 
}
export default TopWrapper;