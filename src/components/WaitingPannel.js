import { 
    CircularProgress, 
    Stack,
    Typography,
} from "@mui/material";

import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

export default function WaitingPannel({loading}) {

  return (
    <Stack flexDirection="column" sx={{
        display: !loading? "none": "flex",
        zIndex: 4,
        position: "absolute",
        opacity: .95,
        width: "100%",
        height: "100%",
        backgroundColor: "#111110",
        alignItems: "center",
        justifyContent: "center"
    }} spacing={2} >
        <CircularProgress color="success" size={80} />
        <Typography variant="h1">Loading...</Typography>       
        <Stack flexDirection="row" alignItems="center" gap={1}>
            <TipsAndUpdatesIcon sx={{color: "white", fontSize: 30}} />
            <Typography>Hint: the lower the depth, the quicker you'll go</Typography>
        </Stack>
    </Stack>
  );
}