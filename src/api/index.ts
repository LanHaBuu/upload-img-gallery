import axios from "axios";

export const uploadImage = async (file: FormData) => {
  return await axios.post("http://localhost:8000/img-webp/upload", file);
};

export const getAllImages = async () => {
  return await axios.get("http://localhost:8000/img-webp/all");
};
