import { Card, CardBody, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

function Recipes() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const response = await fetch("http://localhost:3001/recipesInfo");
      const data = await response.json();
      setData(data);
      console.log(data);
    };
    getData();
  }, []);

  return (
    <div className="w-full h-auto ">
      <div className="relative mx-2 my-2">
        <img
          className="object-cover object-center w-full h-auto md:h-[500px]"
          src="/recipeHero.jpeg"
          alt="hero"
        />
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
      <div className="flex flex-col items-center mt-2 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((recipe, index) => (
            <Card key={index} maxW="sm" className="mx-auto">
              <CardBody>
                <Image
                  src={recipe.img_url}
                  alt="Recipe"
                  borderRadius="lg"
                  className="cursor-pointer"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{recipe.name}</Heading>
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
