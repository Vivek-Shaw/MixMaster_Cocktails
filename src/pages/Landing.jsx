import React from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import CocktailList from "../components/CocktailList";
import SearchForm from '../components/SearchForm';
const cocktailSearchUrl =
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

import { useQuery } from "@tanstack/react-query";

const searchCocktailsQuery = (searchTerm) =>{
  return{
    queryKey:['search',searchTerm || 'all'],
    queryFn: async () =>{
      const response = await axios.get(`${cocktailSearchUrl}${searchTerm}`);
      return response.data.drinks;
    }
  }
}
export const loader =(queryClient)=> async ({request}) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("search") || "";
  await queryClient.ensureQueryData(searchCocktailsQuery(searchTerm));
  //const response = await axios.get(`${cocktailSearchUrl}${searchTerm}`);
  //console.log(response);
  //return { drinks: response.data.drinks, searchTerm };
  // we will get the drinks from useQuery in loader as well as landing
  return {  searchTerm };
};
const Landing = () => {
  //const {drinks,searchTerm} = useLoaderData();
  const {  searchTerm } = useLoaderData();
  const {data:drinks} = useQuery(searchCocktailsQuery(searchTerm))
  //console.log(drinks);
  return (
    <>
      <SearchForm searchTerm={searchTerm} />
      <CocktailList drinks={drinks} />
    </>
  );
};

export default Landing;
