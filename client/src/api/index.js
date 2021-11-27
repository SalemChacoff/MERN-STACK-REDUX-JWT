import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

//url al server de nodejs
//const url = "http://localhost:5000/posts";

//Se accede al middleware del backend
API.interceptors.request.use((req) => {
  //Para comprobar si el token existe
  if (localStorage.getItem("profile")) {
    //Si existe el token se incluira en el header
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

//Funcion para obtener los posts
export const fetchPosts = () => API.get("/posts");
//Funcion para crear un nuevo post
export const createPost = (newPost) => API.post("/posts", newPost);
//Funcion para actualizar un post el cual corresponda su id
export const updatePost = (id, updatePost) =>
  API.patch(`/posts/${id}`, updatePost);

export const deletePost = (id) => API.delete(`/posts/${id}`);

export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
