import Carousel from "react-multi-carousel";
import { Card, CardBody, CardImg, CardTitle } from "reactstrap";
import img_traceability from '../../Assests/Images/dashboard/traceability.jpg';
import img_tradeability from '../../Assests/Images/dashboard/tradeability.jpg';
import img_reputation_system from '../../Assests/Images/dashboard/reputation_system.jpg';

const MiddleWrapper = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const features = [
    {
      image: img_traceability,
      title: "Trazabilidad",       // era "Traceability"
      description: "Mecanismo para rastrear el origen de un producto y la cadena de distribución. Esto ayuda a garantizar que el producto sea seguro y confiable."
    },
    {
      image: img_tradeability,
      title: "Comercialización",    // era "Tradeability" 
      description: "Mecanismo para comercializar un producto con otros actores. Esto ayuda a garantizar que el producto sea original y auténtico."
    },
    {
      image: img_reputation_system,
      title: "Sistema de Reputación", // era "Reputation System"
      description: "Mecanismo que permite a los usuarios calificar productos en el marketplace para generar confianza a través de la reputación."
    }
  ]
  return (
    <div className="middle-wrapper">
      <h5 className="mw-heading" >
        Mantente <b>"Listo para el Consumidor"</b> con nuestra Plataforma de Experiencia End-to-End Potenciada por Blockchain
      </h5>
      <Carousel responsive={responsive}>
        {features.map((feature, index) => (
          <Card className="border-0" key={index} >
            <CardImg
              src = {feature.image}
              height = "300px"
            />
            <CardBody>
              <CardTitle tag="h5" className="text-center text-uppercase mw-heading">
                {feature.title}
              </CardTitle>
              <span className="mw-sub-heading">
                {feature.description}
              </span>
            </CardBody>
          </Card>
        ))}
      </Carousel>
      <hr/>
    </div>
  )
}
export default MiddleWrapper;