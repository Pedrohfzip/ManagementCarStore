import { get } from "http";
import { fetcher } from "./api";


async function getCities() {
  return fetcher('/citys/getCities/', {
    method: 'GET',
    credentials: "include",
  });
}

export default {
  getCities,
};