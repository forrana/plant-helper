import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import { PlantsData, PlantType } from "./models";
import { usePlantsDispatch } from "./PlantsDispatch";
import { GET_FILTERED_PLANTS } from "./queries";
import { useDebounce } from "./utils";


function FilterInput() {
    const [filterValue, setFilterValue] = useState("");
    const INPUT_DEBOUNCE_TIMEOUT = 500;
    const dispatch = usePlantsDispatch()

    const debouncedValue = useDebounce(filterValue, INPUT_DEBOUNCE_TIMEOUT);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
      };

    const handleCancelButton = (event: React.MouseEvent<HTMLButtonElement>) => {
      setFilterValue("");
    };

    const [filterPlants] = useLazyQuery<PlantsData>(
        GET_FILTERED_PLANTS,
        {
          onCompleted: (data: any) => {
            const plants = data.allFilteredPlants.edges.map((edge: { node: PlantType }) => edge.node)
            dispatch({ type: 'load', plants: plants })
          },
          onError: (e) => console.error('Error getting filtered plants:', e)
        }
      );

    useEffect(() => {
        if(debouncedValue) {
            filterPlants({variables: { name_Icontains: filterValue }})
        }
    }, [debouncedValue, filterPlants, filterValue]);


    return(
      <div className="d-flex">
        <Input
          type="text" name="filter-value" id="filter-value" placeholder="Plant name"
          bsSize={"sm"}
          data-testid="filter-input-value"
          value={filterValue}
          onChange={handleInputChange}
          required
          />
        <Button size="sm" color="danger" onClick={handleCancelButton}>X</Button>
      </div>
    )
}

export default FilterInput;