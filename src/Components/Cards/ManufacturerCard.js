import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
//import '../../Assests/Styles/card.css';
import Toast from "../Toast";
import manufacturer_default from "../../Assests/Images/manufacturer_default.jpg";
import { fetchManufacturer } from "../../Services/Utils/stakeholder";

const ManufacturerCard = ({id, manufacturerObject}) => {
  const {authState} = useContext(AuthContext);
  const {contractState} = useContext(ContractContext);
  const role = authState.stakeholder.role;
  const [manufacturer, setManufacturer] = useState({
    id: "00000",
    name: "",
    location: "",
    isRenewableUsed: false,
    rawProducts: [],
  });

  useEffect(() => {
    if(manufacturerObject){
      setManufacturer(manufacturerObject);
    }
    else if(contractState.manufacturerContract){
      (async() => {
        setManufacturer(await fetchManufacturer(
          authState.address,
          contractState.manufacturerContract,
          id
        ))
      })();
    }
  }, [manufacturerObject])

  const verify = async () => {
    try{
      await contractState.manufacturerContract.methods.verify(id).send({from: authState.address});
      setManufacturer(manufacturer => {
        return {
          ...manufacturer,
          isVerified: true
        }
      })
      Toast("success", "Procesadora verificada exitosamente");
    } catch(e){
      Toast("error", e.message);
    }
  }

  const update = async () => {
    try {
      await contractState.manufacturerContract.methods.updateEnergy(id).send({from: authState.address});
      setManufacturer(manufacturer => {
        return {
          ...manufacturer,
          isRenewableUsed: true
        }
      })
      Toast("success", "Energía de procesadora actualizada");
    } catch(e){
      Toast("error", e.message);
    }
  }

  return (
    <div className="col-12 col-lg-6 my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-4">
          <img 
            src={manufacturer_default}
            width="100%"
          />
        </div>
        <div className="col-12 col-md-8">
          <span className="card-key">Id: </span>
          <span className="card-value">{manufacturer.formattedAddress}</span>
          <br/>
          <span className="card-key">Nombre: </span>
          <span className="card-value">{manufacturer.name}</span>
          <br/>
          <span className="card-key">Ubicacion: </span>
          <span className="card-value">{manufacturer.location}</span>
          <br/>
          <span className="">
            <span className="card-key"> Uso de Energía: </span>
            {manufacturer.isRenewableUsed?
              <span className="">
                <span className="badge bg-success">Renovable</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">No Renovable</span>
                {role === "admin"?
                  <span 
                    className="badge bg-dark mx-1" 
                    type="button"
                    onClick={update}
                  >
                    <i class="fa fa-fire"/>
                    Actualizar
                  </span>
                : ""
                }
              </span>
            }
          </span>
          <br/>
          <span className="">
            <span className="card-key"> Verificación: </span>
            {manufacturer.isVerified?
              <span className="">
                <span className="badge bg-success">Verificado</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">No Verificado</span>
                {role === "admin"? 
                  <span 
                    className="badge bg-dark mx-1" 
                    type="button"
                    onClick={verify}
                  >
                    <i class="fa fa-certificate"/>
                    Verificar
                  </span>
                : ""
                }
              </span>
            }
          </span>
          <br/>
          <span>
            <span className="d-flex justify-content-between">
              <span className="card-key">Material Agrícola</span>
              <span className="card-key">Origen</span>
            </span>
            {manufacturer.rawProducts.map(rawProduct => (
              <span className="d-flex justify-content-between my-1">
                <span className="card-value">{rawProduct["name"]}</span>
                {rawProduct["isVerified"]?
                  <span className="badge bg-success">Verificado</span>
                :
                  <span className="badge bg-danger">No Verificado</span>
                }
              </span>
            ))}
          </span>
        </div>
      </div>
      <hr/>
    </div>
  )
}
export default ManufacturerCard;