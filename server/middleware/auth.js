import jwt from "jsonwebtoken";

//Primero se pasa por el auth para verificar si el usuario tiene permisos para
//Realizar la accion, like, crear, modificar o eliminar.

const auth = async (req, res, next) => {
  try {
    //Para obtener el token del header
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      //Es para identifica el id de google
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
