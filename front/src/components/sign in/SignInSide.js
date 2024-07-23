import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Dashboard from "views/Dashboard";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide() {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    var email = data.get("email");
    var password = data.get("password");
   
    axios.post('http://localhost:8000/api/login',{email,password}).then((res) =>{
      
        if(res.status===200){
          const { token } = res.data.access_token;
          
          localStorage.setItem('token',res.data.access_token)
          localStorage.setItem('id_user',res.data.user.id)
          localStorage.setItem('role_connnected_user',res.data.user.role)
          if(res.data.user.role ==='admin' ){
            localStorage.setItem('admin',true)
              navigate('/admin')
          }else if(res.data.user.role ==='superadmin' ){
            localStorage.setItem('admin',true)
             navigate('/admin')
          }else {
              navigate("/user/dashboard"); 
          }
          
        
         
        }
      }).catch((err)=>{
        console.error(err.response.data)
        alert("Error: "+err.response.data.message)
      })
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url('bg.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Button
                onClick={()=>navigate('/signup')}
                variant="outlined"
                sx={{ mt: 3, mb: 3 }}
              >
                Sign Up
              </Button>
              <Button
                onClick={()=>navigate('/forgotpassword')}
                variant="outlined"
                sx={{ m:3 }}
              >
                Forgot Password
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
