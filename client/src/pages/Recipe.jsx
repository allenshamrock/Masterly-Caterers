import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody, Image, Text } from "@chakra-ui/react";

function Recipe() {
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/recipesInfo/${id}`);
        if (!response.ok)
          throw new Error(`HTTP Error! status: ${response.status}`);
        const data = await response.json();
        setData(data);
        console.log(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getData();
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-auto overflow-hidden">
      <div className="mx-3 mt-2 bg-grey  flex flex-col">
        <div className="flex flex-col mt-4   space-y-3">
          <div className="grid md:grid-cols-2">
            <div className="w-full">
              <Card
                maxW="md"
                className="mx-auto"
              >
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
              <Text className="text-xl tracking-wide">{data.description}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recipe;
