import { useState, useEffect } from "react";
import { getListings, getCities, getFavorites } from "../services/api";

const useListings = () => {
  const [listings, setListings] = useState([]);
  const [cities, setCities] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsData, citiesData, favoritesData] = await Promise.all([
          getListings(),
          getCities(),
          getFavorites(),
        ]);
  
        const normalizedListings = Array.isArray(listingsData)
          ? listingsData
          : listingsData?.listings || [];
  
        const normalizedCities = Array.isArray(citiesData)
          ? citiesData
          : citiesData?.cities || [];
  
        const normalizedFavorites = Array.isArray(favoritesData)
          ? favoritesData
          : favoritesData?.favorites || [];
  
        setListings(normalizedListings);
        setCities(normalizedCities);
        setFavorites(normalizedFavorites);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  return { listings, setListings, cities, favorites, setFavorites };
};

export default useListings;


