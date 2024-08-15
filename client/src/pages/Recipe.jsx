import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Image, Text, Button } from "@chakra-ui/react";

function Recipe() {
  const [data, setData] = useState(null);
  const [nextRecipe, setNextRecipe] = useState(null);
  const [previousRecipe, setPreviousRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/recipesInfo/${id}`);
        if (!response.ok) throw new Error(`HTTP Error! status: ${response.status}`);
        const data = await response.json();
        setData(data);

        // Fetch next recipe data
        const nextId = parseInt(id) + 1;
        try {
          const nextResponse = await fetch(`http://localhost:3000/recipesInfo/${nextId}`);
          if (nextResponse.ok) {
            const nextData = await nextResponse.json();
            setNextRecipe(nextData);
          }
        } catch {
          setNextRecipe(null);
        }

        // Fetch previous recipe data
        const previousId = parseInt(id) - 1;
        try {
          const previousResponse = await fetch(`http://localhost:3000/recipesInfo/${previousId}`);
          if (previousResponse.ok) {
            const previousData = await previousResponse.json();
            setPreviousRecipe(previousData);
          }
        } catch {
          setPreviousRecipe(null);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const handleNext = () => {
    const nextId = parseInt(id) + 1;
    navigate(`/recipes/${nextId}`);
  };

  const handlePrevious = () => {
    const previousId = parseInt(id) - 1;
    navigate(`/recipes/${previousId}`);
  };

  if (loading) {
    return <div className="text-2xl font-bold text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-2xl font-bold text-center">Error: {error}</div>;
  }

  if (!data) {
    return <div className="text-2xl font-bold text-center">Recipe not found</div>;
  }

  return (
    <div className="w-full h-auto overflow-hidden">
      <div className="mx-3 mt-2 bg-gray-200 flex flex-col font-libre">
        <div className="flex flex-col mt-4 space-y-3">
          <div className="grid md:grid-cols-2 space-y-3">
            <div className="w-full">
              <Card maxW="md" className="mx-auto">
                <CardBody>
                  <Image
                    src={data.img_url}
                    alt="Recipe"
                    borderRadius="lg"
                    className="cursor-pointer"
                  />
                </CardBody>
              </Card>
            </div>
            <div className="flex flex-col justify-center mx-3">
              <Text className="text-2xl font-bold text-black">{data.name}</Text>
              <Text className="text-md tracking-normal md:text-xl md:tracking-wide">
                {data.description}
              </Text>
              <Text className="mt-3 font-semibold flex">
                Duration: <span className="font-medium">{data.cook_time}</span>
              </Text>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Text className="font-semibold text-xl md:text-2xl">
                Ingredients
              </Text>
              <ul className="list-disc tracking-normal list-inside text-md md:text-xl font-medium md:tracking-wide flex flex-col">
                {data.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <Text className="text-xl md:text-2xl font-semibold">
                Instructions
              </Text>
              <ul className="list-disc list-inside flex flex-col tracking-normal md:tracking-wide text-md md:text-xl">
                {data.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between mx-3 mt-4">
          {previousRecipe && (
            <div className="flex flex-col items-start">
              <Text className="text-md md:text-lg font-semibold">
                Previous: {previousRecipe.name}
              </Text>
              <Button
                background={"gold"}
                marginY={"2"}
                onClick={handlePrevious}
              >
                Previous &larr;
              </Button>
            </div>
          )}
          {nextRecipe && (
            <div className="flex flex-col items-end">
              <Text className="text-md md:text-lg font-semibold">
                Next: {nextRecipe.name}
              </Text>
              <Button
                background={"gold"}
                marginY={"2"}
                onClick={handleNext}
              >
                Next &rarr;
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recipe;
