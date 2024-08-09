import React, { useState } from "react";
import { Input } from "@chakra-ui/react";

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setValue(searchValue);
    onSearch(searchValue);
  };

  return (
    <div>
      <Input
        value={value}
        onChange={handleSearch}
        placeholder="Search for recipes..."
        size="md"
        width={"auto"}
        variant={"filled"}
      />
    </div>
  );
};

export default SearchBar;
