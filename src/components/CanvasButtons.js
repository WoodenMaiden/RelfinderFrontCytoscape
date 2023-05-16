import { useState } from "react";

import { 
    Collapse,
    IconButton, 
    Stack
} from "@mui/material";

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function CanvasButton(props) {

    const [ expanded, setExpanded ] = useState(false)

    const children = props.children

    const clickCallback = !children? 
        props.clickCallback:
        () => setExpanded(!expanded)

    return (
        <Stack direction="row-reverse"
            sx={{
                backgroundColor: "#ffffff",
                borderRadius: "50px",
                textAlign: "center",
                paddingLeft: expanded? "10px": "0px",
            }}
            alignItems="center"
        >                           
            <IconButton onClick={clickCallback}>
                {!expanded? props.icon: <ChevronRightIcon/>}
            </IconButton>
            <Collapse
                orientation="horizontal"
                in={expanded}
            >
                <span 
                    style={{
                        width: "100%",
                        paddingBottom: "10px",
                    }}
                >
                    {children}
                </span>
            </Collapse>
        </Stack>
    )
}