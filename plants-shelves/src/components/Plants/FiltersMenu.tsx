import React, { useState } from "react";
import { Alert, Button, Collapse } from "reactstrap";


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
    const toggleMenu = () => setIsOpen(!isOpen)

    return(
        <div style={{marginTop: "4.5em", display: "flex"}}>
            <Button
                color="primary"
                size="sm"
                onClick={toggleMenu}
                style={{
                marginBottom: '1rem'
                }}
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
                    width: "90vw",
                    backgroundColor: "rgb(10 10 10 / 11%)"
                    }}>
                    <Button
                        size="sm"
                    >
                        Hello.
                    </Button>
                    <Button
                        size="sm"
                    >
                        World.
                    </Button>
                </section>
            </Collapse>
        </div>
    )
}

export default FiltersMenu;