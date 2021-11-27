import PostMessage from "../models/postsMessage.js";
import mongoose from "mongoose";
//Todas las funciones tienen que estar en un try catch
//Logica de las rutas
export const getPosts = async (req, res) => {
  try {
    //Funcion asyncrona para buscar los posts
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPosts = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    //El id se renombra de esa forma, ya que mongoDB emplea los id con dicha sintaxis (_id)
    const { id: _id } = req.params;
    //Obtiene los datos del post, tags, etc
    const post = req.body;
    //Validacion si se encuentra el post con dicho id
    if (!mongoose.Types.ObjectId.isValid(_id))
      res.status(404).send("No post with that id");
    //Si se encuentra se actualiza y crea uno nuevo
    await PostMessage.findByIdAndUpdate(_id, post, { new: true });
    res.json(updatePost);
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send("No post with that id");
    await PostMessage.findByIdAndRemove(id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    //Se verifica si no existe el userId que viene del middleware
    if (!req.userId) return res.json({ message: "Unauthenticated" });

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send("No post with that id");
    const post = await PostMessage.findById(id);
    //Se busca si el post ya tiene un like de la persona
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      //Le da like al post
      post.likes.push(req.userId);
    } else {
      //le quita el like
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatePost = await PostMessage.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.status(200).json(updatePost);
  } catch (error) {
    console.log(error);
  }
};
