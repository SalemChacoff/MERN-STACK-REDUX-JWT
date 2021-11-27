import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModal from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Busca si se encuentra el usuario, segun su email
    const existingUser = await UserModal.findOne({ email });

    //Si no se encuentra se envia un 404 que el usuario no existe
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    //Realiza una comparacion entre la password no encryptada(la que recibe del usuario)
    // y la password encryptada de la base de datos
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    //Si la password no coincide se retorna un mensaje de credenciales invalidas
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    //Se usa el metodo de jwt sign junto con el secret para generar el token
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    //Se envia los datos del usuario junto al token
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    //Busca si se encuentra el usuario, segun su email
    const existingUser = await UserModal.findOne({ email });
    console.log(existingUser);
    //Si se encuentra el usuario, envia un 400 que el usuario existe
    if (existingUser) {
      return res.status(400).json({ message: "User already exist." });
    }

    //Si las contraseñas no coinciden, envia un 400 que las contraseñas no son iguales
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match." });
    }

    //Hash a la contraseña con salt 12
    const hashedPassword = await bcrypt.hash(password, 12);

    //Se crea el usuario en la BD
    const result = await UserModal.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    //Se genera el token junto a los datos del usuario, el scecret y el tiempo de vida
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    //Se envian los datos del usuario y el token
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
