import { useContext, useState } from "react";
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";

//import '../Assests/Styles/register.page.css';
import { AuthContext } from "../Services/Contexts/AuthContext";
import { ContractContext } from "../Services/Contexts/ContractContext";
import Toast from "../Components/Toast";

const Register = () => {
  const { authState } = useContext(AuthContext);
  const { contractState, loadStakeholder } = useContext(ContractContext)
  const [stakeholder, setStakeholder] = useState({
    name: "",
    location: "",
    role: "farmer"
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStakeholder({
      ...stakeholder,
      [name]: value
    })
  }

  const register = async () => {
    let contract = null;
    switch (stakeholder.role) {
      case "farmer":
        contract = contractState.farmerContract;
        break;
      case "manufacturer":
        contract = contractState.manufacturerContract;
        break;
      default:
        contract = contractState.stakeholderContract;
    }
    if (contract) {
      await contract.methods.register(stakeholder.name, stakeholder.location, stakeholder.role).send({ from: authState.address });
      Toast("success", "Registrado exitosamente");
      loadStakeholder();
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="col-11 col-sm-10 col-md-5 register-card">
          <span className="register-card-heading">Registrarse</span>
          <hr/>
          <InputGroup>
            <InputGroupText>
              Nombre
            </InputGroupText>
            <Input placeholder="your name" name="name" onChange={(e)=> handleChange(e)}/>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupText>
              Ubicación
            </InputGroupText>
            <Input placeholder="your address" name="location" onChange={(e)=> handleChange(e)}/>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupText>
              Rol
            </InputGroupText>
            <Input type="select" name="role" onChange={(e)=> handleChange(e)}>
              <option value="farmer">Productor</option>
              <option value="manufacturer">Procesadora</option>
              <option value="distributer">Distribuidor</option>
              <option value="retailer">Minorista</option>
              <option value="consumer">Consumidor</option>
            </Input>
          </InputGroup>
          <br/>
          <Button onClick={register}>Registrarse</Button>
        </div>
      </div>
    </div>
  )
}
export default Register;