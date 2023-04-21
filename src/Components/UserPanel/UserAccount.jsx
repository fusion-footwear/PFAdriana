import React from "react";
import cuenta from "../images/f.png";
import { useEffect, useState } from "react";
import {
  getDatosUser,
  getFav,
  getUserCart,
  postDataUser,
} from "../../Redux/Actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

export default function UserAccount() {
  const user = useSelector((state) => state.loginUser);
  const loginUserId = user.id;
  const dataUsers = useSelector((state) => state.dataUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = async () => {
      await dispatch(getDatosUser(loginUserId));
      await dispatch(getUserCart(loginUserId));
      await dispatch(getFav(loginUserId));
    };
    userData();
  }, [loginUserId, dispatch]);

  const [datos, setDatos] = useState({
    name: "",
    last_name: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState();

  const actualizarDatosUser = (evento) => {
    const { name, value } = evento.target;
    setDatos({
      ...datos,
      [name]: value,
    });
  };

  const regex = /^\+[0-9]/;

  const enviarDatos = async () => {
    try {
      for (const [key, value] of Object.entries(datos)) {
        if (value === "") {
          setErrors((prevState) => ({
            ...prevState,
            [key]: "Este campo es obligatorio",
          }));
          Swal.fire(
            "Faltan Datos",
            "Necesitamos que actualices tus datos para que tus compras lleguen correctamente",
            "error"
          );
          return;
        }
      
      }
      if (!datos.phone.startsWith("+") || !regex.test(datos.phone)) {
        setErrors((prevState) => ({
          ...prevState,
          phone: "El número de teléfono debe comenzar con un signo '+'",
        
        }));
        Swal.fire(
          "Teléfono inválido",
          "El número de teléfono debe comenzar con un signo '+'",
          "error"
        );
        return;
      }

      await dispatch(postDataUser(loginUserId, datos));
      await dispatch(getDatosUser(loginUserId));
      Swal.fire(
        "Datos modificados correctamente",
        "¡Ya tienes tus datos actualizados para comprar!",
        "success"
        );
        setErrors(null)
    } catch (error) {
      console.log(error.menssage);
    }
  };



  return (
    <div className="user-content">
      <div className="user-data">
        <img src={cuenta} alt="footwear-fusion" />
        <div className="data-list">
          <h6>MI CUENTA</h6>
          {user && user.email ? (
            <div className="zapato-fav account">
              <p>{user.email}</p>

              <h6>SUSCRIPCIONES</h6>
              <p>Aun no está suscripto al newsletter</p>

              <h6>DATOS DE CONTACTO</h6>
              <p>
                <span>
                  {dataUsers ? (
                    dataUsers.name
                  ) : (
                    <input
                      type="text"
                      name="name"
                      placeholder="Añadir Nombre"
                      onChange={actualizarDatosUser}
                    />
                  )}
                  {errors && errors.name && (
                    <p className="error-message">{errors.name}</p>
                  )}{" "}
                  &nbsp;
                  {dataUsers ? (
                    dataUsers.last_name
                  ) : (
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Añadir Apellido"
                      onChange={actualizarDatosUser}
                    />
                  )}
                </span>
                {errors && errors.last_name && (
                  <p className="error-message">{errors.last_name}</p>
                )}
                <br />

                <span>
                  {dataUsers ? (
                    dataUsers.phone
                  ) : (
                    <input
                      type="text"
                      name="phone"
                      placeholder="Añadir Telefono"
                      onChange={actualizarDatosUser}
                    />
                  )}
                </span>
                {errors && errors.phone && (
            <p className="error-message">{errors.phone}</p>
          )}
                <br />

                <span>
                  {dataUsers ? (
                    dataUsers.address
                  ) : (
                    <input
                      type="text"
                      name="address"
                      placeholder="Añadir Dirección"
                      onChange={actualizarDatosUser}
                    />
                  )}
                </span>
                {errors && errors.address && (
            <p className="error-message">{errors.address}</p>
          )}
                <br />
                {!dataUsers && <button onClick={enviarDatos}>Guardar</button>}
              </p>
            </div>
          ) : (
            <div className="zapato-fav">
              <h1>NO HAY NADIE</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}