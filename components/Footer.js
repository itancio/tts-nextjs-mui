import { 
    Box,
    Container,
    IconButton,
    Link,
    Typography,
  } from "@mui/material"
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export const Footer = () => {
    return (
    <>
    {/* Footer */}
    <Box
        sx={{
            bgcolor: '#1e1e1e',
            padding: '16px',
            position: 'relative',
            bottom: 0,
            width: '100%',
            color: '#fff',
            background: `linear-gradient(90deg, #201cff -91.5%, #13ef95 120.05%)`,
            border: '4px solid transparent',
            backgroundClip: 'padding-box, border-box',
            boxShadow: 'inset 0 0 0 4px #1e1e1e', // Inner box to create the illusion of a border
        }}
        >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            {/* Social media icons */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton component="a" href="https://github.com/itancio" target="_blank" sx={{ color: '#101014' }}>
                <GitHubIcon />
            </IconButton>
            <IconButton component="a" href="https://linkedin.com/in/irvintancioco" target="_blank" sx={{ color: '#101014' }}>
                <LinkedInIcon />
            </IconButton>
            </Box>
            
            {/* Disclaimer */}
            <Typography variant="body1" sx={{ marginBottom: 1, fontSize: 14, color: '#101014' }}>
            © {new Date().getFullYear()} Talkie. All rights reserved.
            </Typography>
        </Container>
    </Box>
    </>
    )
}

export default Footer;