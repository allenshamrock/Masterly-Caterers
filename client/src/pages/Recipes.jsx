import { Card, CardBody, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

function Recipes() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          "https://masterly-backend.onrender.com/recipesInfo "
        );
        if (!response.ok)
          throw new Error(`Https Error! status: ${response.status}`);
        const data = await response.json();
        setData(data);
        setFilteredData(data); // Set initial filtered data to all recipes
      } catch (error) {
        console.error(error.message);
      }
    };
    getData();
  }, []);

  const handleSearch = (searchValue) => {
    const filteredItems = data.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filteredItems);
  };

  return (
    <div className="w-full h-auto">
      <div className="relative mx-2 my-2">
        <img
          className="object-cover object-center w-full h-auto md:h-[500px] relative"
          src="/recipeHero.jpeg"
          alt="hero"
        />

        <div className="absolute bottom-0 right-0 p-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center space-y-2">
          <div className="h-[50px] w-[100px] bg-gold flex justify-center items-center">
            <Text className="uppercase text-black font-bold text-xs">
              get inspired
            </Text>
          </div>
          <Text className="text-grey uppercase font-bold text-3xl">
            recipes
          </Text>
        </div>
      </div>

      <div className="flex flex-col items-center mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 font-libre">
          {filteredData.map((recipe, index) => (
            <Card
              key={index}
              maxW="sm"
              className="mx-auto"
              as={Link}
              to={`/recipes/${recipe.id}`}
            >
              <CardBody>
                <Image
                  src={recipe.img_url}
                  alt="Recipe"
                  borderRadius="lg"
                  className="cursor-pointer"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{recipe.name}</Heading>
                  <Text>{recipe.description}</Text>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recipes;
