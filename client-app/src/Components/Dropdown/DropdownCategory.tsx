import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { category } from 'Components/Forms/FormElements/categoryOptions';

interface PropsDetails {
  categories: any[];
  setPickedCategory: (id: string | undefined) => void;
}

interface Options {
  key: string,
  text: string,
  value: string
}

const DropdownCategory: React.FC<PropsDetails> = ({categories, setPickedCategory}) => {

  const [allOptions, setAllOptions] = useState<Options[]>([]);

  useEffect(() => {
    const optionsArray: Options[] = [];
    categories.forEach(item => {
      const options: Options = {
        key: item.value,
        text: item.text,
        value: item.value,
      }; 
      optionsArray.push(options);
    });
    setAllOptions(optionsArray);
  }, [categories])

  return (
  <Dropdown
    placeholder='Velg Kategori'
    fluid
    selection
    options={allOptions}
    onChange={(e, data) => setPickedCategory(data.value?.toString())}
  />
  )
}

export default DropdownCategory