import React, { useState } from "react";
import { Button, Collapse } from "reactstrap";
import FilterInput from "./FilterInput";


interface menuArrowProps {
    isOpen: boolean
}

function MenuArrow({ isOpen }: menuArrowProps) {
    if(isOpen) {
        return(
            <i className={"icon icon-arrow-left"}></i>
        )
    } else {
        return(
            <i className={"icon icon-arrow-right"}></i>
        )
    }
}

function FiltersMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return(
        <div style={{display: "flex"}}>
            <Button
                color="primary"
                size="sm"
                onClick={toggleMenu}
            >
                <MenuArrow isOpen={isOpen} />
            </Button>
            <Collapse
                horizontal
                isOpen={isOpen}
            >
                <section style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "100vw",
                    backgroundColor: "rgb(10 10 10 / 11%)"
                    }}>
                    <FilterInput />
                </section>
            </Collapse>
        </div>
    )
}

export default FiltersMenu;