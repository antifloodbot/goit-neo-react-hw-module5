import axios from "axios";

const api = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
  },
});

export async function fetchImages(query, page = 1, perPage = 12) {
  const { data } = await api.get("/search/photos", {
    params: { query, page, per_page: perPage },
  });

  return {
    results: data.results,
    totalPages: data.total_pages,
  };
}