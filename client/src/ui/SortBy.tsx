import Select from "./Select.tsx";
import {useSearchParams} from "react-router-dom";

interface Option {
    value: string;
    label: string;
}

const SortBy = ({ options }: { options: Option[] }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSortByChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSortBy = e.target.value;
    searchParams.set("sortBy", newSortBy);
    setSearchParams(searchParams);
  }

  return (
    <Select options={options} $type="white" onChange={handleSortByChange} />
  );
};

export default SortBy;
