import { useContext, useEffect, useState } from "react";

import FarmerCard from "../../Components/Cards/FarmerCard";
import Toast from "../../Components/Toast";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchFarmer } from "../../Services/Utils/stakeholder";

const Farmer = () => {
  const { authState }  = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [farmerAddress, setFarmerAddress] = useState(authState.address);
  const [farmer, setFarmer] = useState({});
  const [addRPState, setAddRPState] = useState(null);

  useEffect(() => {
    if(contractState.farmerContract){
      (async () => {
        setFarmer(await fetchFarmer(authState.address, contractState.farmerContract, farmerAddress));
      })();
    }
  },[])

  const addRawProduct = async () => {
    if(!addRPState) {
      Toast("error", "Por favor ingrese un producto agrícola");
      return;
    }
    try{
      await contractState.farmerContract.methods.addRawProduct(addRPState).send({from: authState.address});
      Toast("success", "Producto agrícola agregado exitosamente");
      const temp = {
        ...farmer,
        rawProducts: [...farmer.rawProducts, addRPState]
      }
      setFarmer(temp);
    } catch(e){
      Toast("error", e.message);
    }
  }

  return (
    <div className="">
      <div className = "d-flex justify-content-center">
        {farmer.formattedAddress?
          <FarmerCard id={farmerAddress} farmerObject={farmer}/>
        :
        <div>Cargando...</div>}
      </div>
      <div className="d-flex justify-content-center">
        <input type="text" placeholder="Producto agrícola" onChange={
          (e) => {
            setAddRPState(e.target.value);
          }
        }/>
        <button onClick={addRawProduct}>Agregar</button>
      </div>
    </div>
  )
}
export default Farmer;