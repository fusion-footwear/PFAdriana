import { useDispatch } from "react-redux";
import medios from "../images/mediosdepago.png";
import { useState } from "react";
import { postNewsletter } from "../../Redux/Actions";
import swal from "sweetalert";

export default function Footer() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState({
    email: "",
  });

  const [error, setError] = useState({
    email: "",
  });

  const correo = {
    email: email.email,
    subject: "Gracias por Suscribirte!",
  };

  const capturarEmail = (evento) => {
    const { name, value } = evento.target;
    validateMail(email);
    setEmail({
      ...email,
      [name]: value,
    });
  };

  const newEmail = async () => {
    if (email.email.length > 3) {
      if (error.email.length !== 0) {
        return swal("Error", "Debes colocar un email válido", "error");
      } else {
        try {
          swal(
            "Gracias por suscribirte!",
            "Vas a recibir un correo de confirmación",
            "success"
          );
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          await dispatch(postNewsletter(correo));
        } catch (error) {
          console.log("error login", error);
        }
      }
    } else {
      return swal("Error", "Debes completar email", "error");
    }
  };

  const validateMail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    email.email.length > 0 && emailRegex.test(email.email)
      ? setError({ ...error, email: "" })
      : setError({ ...error, email: "Debes colocar un email válido" });
  };

  const handleBlur = () => {
    //esta es para que reconosca la primer letra que se coloca en el input y llame la validacion
    validateMail(email);
  };

  return (
    <div className="footer">
      <div>
        <h5>MEDIOS DE PAGO</h5>
        <img src={medios} alt="" />
      </div>
      <h5>Suscribite a nuestro Newsletter y no te pierdas las novedades!</h5>
      <div>
        <input
          type="text"
          name="email"
          placeholder="Ingresa tu email..."
          onChange={capturarEmail}
          onBlur={handleBlur} //esta es para que reconosca la primer letra que se coloca en el input y llame la validacion
        /> <br />
        {error.email && <small>{error.email}</small>}
      </div>
      <button className="enviar" onClick={newEmail}>
        Enviar
      </button>
         
    </div>
  );
}
