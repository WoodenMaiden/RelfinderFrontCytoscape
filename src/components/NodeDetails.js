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

    const bgGrid = {
        "&:nth-of-type(odd)": {
            backgroundColor: "#cfcfcf"
        },
        "&:nth-of-type(even)": {
            backgroundColor: "#e1e1e1"
        }
    }

    // this generates subgrids in case we are facing a array or an object
    function drawNestedDetails(obj) {
        if (obj === null || obj === undefined) return; 

        return (
            <>
            {Object.keys(obj)?.map((key, index) => {
                if (obj[key] instanceof Array) {
                    return (
                        <Grid container item key={key + index}>
                            <Grid item>
                                <Typography variant="body2" component="div">
                                    {key}: 
                                </Typography>
                            </Grid>
                            <Grid container item>
                                <ul>
                                {
                                    Array.from(obj[key]).map(
                                        (v, k) => <li key={k}>
                                            <Typography variant="body2">{v}</Typography>
                                        </li>
                                    )                                
                                }
                                </ul>
                            </Grid>
                        </Grid>
                    )
                    
                }
                else if (typeof obj[key] === "object") {
                    return drawNestedDetails(obj[key])
                }
                else return (
                    <Grid container item key={key + index}>
                        <Grid item>
                            <Typography variant="body2" component="div">
                                {key}: 
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" component="div">
                                {obj[key]}
                            </Typography>
                        </Grid>
                    </Grid>
                )
                
            })}
            </>
        )
    }


    return (
        <Draggable axis="both" handle={`#handle-${detailsID}`}
                   bounds="parent"
                   defaultPosition={{x, y}}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                position: "absolute",
                zIndex: 95,
                backgroundColor: "#e0e0e0",
                borderRadius: "5px",
                boxShadow: "0px 0px 5px 0px #000000",
                width: "12em",
                padding: 0,
            }} className="NodeDetails">
                <Box className="NodeDetailsBar" sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#d1d1d1",
                    zIndex: 100,
                    boxShadow: "0px 1px 5px -3px #000000",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pointerEvents: "auto"
                }}>
                    <span></span>
                    <div id={`handle-${detailsID}`} style={{
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
                <Container sx={{ backgroundColor: "#cfcfcf", zIndex: 99 }}>
                    <Grid container columns={2} sx={{ ...bgGrid }}>
                            {drawNestedDetails(data)} 
                    </Grid>
                </Container>
            </Box>
        </Draggable>
    )
}