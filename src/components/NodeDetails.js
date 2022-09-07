import { 
    Box,
    Container,
    Typography,
    Grid,
    IconButton
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import Draggable from "react-draggable";

export default function NodeDetails(props) {
    const detailsID = props.detailsID
    const x = props.x
    const y = props.y
    const data = props.data
    const rmHandler = function(e) {
        props.rmHandler(detailsID)
    }

    // this generates subgrids in case we are facing a array or an object
    function drawNestedDetails(obj) {
        
    }

    return (
        <Draggable axis="both" handle=".handle"
                   bounds="parent"
                   defaultPosition={{x, y}}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                position: "absolute",
                zIndex: 95,
                backgroundColor: "#e0e0e0",
                width: "12em",
                padding: 0,
                top: y,
                left: x,
            }} className="NodeDetails">
                <Box className="NodeDetailsBar" sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#d1d1d1",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pointerEvents: "auto"
                }}>
                    <span></span>
                    <div className="handle" style={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "#9e9e9e",
                        margin: "5px",
                        width: "40px",
                        left: "calc(50% - 15px)",
                        cursor: "grab",
                    }}>
                    </div>
                    <IconButton size="small" color="error" onClick={rmHandler}>
                        <CircleIcon fontSize="inherit"/>
                    </IconButton>
                </Box>
                <Container>
                    <Grid container columns={2}>
                        {Object.keys(data).map(dt => 
                            <Grid container item key={dt}>
                                <Grid item>
                                    <Typography variant="body2">{dt}: </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">{data[dt]}</Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>
        </Draggable>
    )
}