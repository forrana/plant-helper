import React, {useState} from 'react';
import {
    Button,
    Collapse
  } from 'reactstrap';

function AppFooter() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return  (
        <footer style={{display: "flex", position: "fixed", top: "95%"}}>
            <Button
                color="primary"
                size="sm"
                onClick={toggleMenu}
            >
                <i className={"icon icon-info"}></i>
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
                    <a href="https://github.com/forrana/plant-helper">Project page</a>
                    <a href="mailto:plant.assistant.ml@gmail.com">Email for feedback</a>
                </section>
            </Collapse>
        </footer>
    )
}

export default AppFooter;