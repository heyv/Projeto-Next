"use client";
import { Box, Button, Card, CardContent, IconButton, InputAdornment, TextField, Typography, useMediaQuery } from "@mui/material";
import Grid from '@mui/material/Grid2';
import CustomizedSnackbars from "../../components/alert/Alert";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';


interface FormData {
  email: string;
  password: string;
}

interface UserLocal {
  email: string;
  password: string;
}

let text = "";
let errorType = "";

export default function Login() {
  const router = useRouter();
  const theme = useTheme(); // Pega o tema atual do Material-UI
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [alerta, setAlerta] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      router.push('/pages/profile');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      text = 'Preencha o email';
      errorType = 'warning';
      alertMsg();
      return;
    }

    if (!formData.password) {
      text = 'Preencha a senha';
      errorType = 'warning';
      alertMsg();
      return;
    }

    const usersLocal = JSON.parse(localStorage.getItem('users') || '[]');

    if (usersLocal.length > 0) {
      const userData = usersLocal.find((user: UserLocal) => user.email === formData.email);

      if (!userData || userData.email !== formData.email || userData.password !== formData.password) {
        text = 'Email ou senha inválidos';
        errorType = 'warning';
        alertMsg();
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));
      router.push('/pages/profile');

    } else {
      text = 'Conta não cadastrada';
      errorType = 'warning';
      alertMsg();
      return;
    }
  };

  const alertMsg = () => {
    setAlerta(true);
    setTimeout(() => setAlerta(false), 3000);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={"100vh"}
    >
      <Card sx={{ display: 'flex', alignItems: 'center', height: isMobile ? "100vh" : "auto", maxWidth: 400 }}>
        <CardContent style={{ alignItems: 'center' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: 10, textAlign: 'center' }}>
            Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                  fullWidth
                  label="Senha"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Button type="submit" onClick={handleSubmit} variant="contained" color="primary" fullWidth>
                  Entrar
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Button component={Link} href='/' fullWidth variant="text" color="primary">
                  Criar uma conta
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      {alerta && (
        <CustomizedSnackbars
          text={text}
          errorType={errorType}
        ></CustomizedSnackbars>
      )}
    </Box>
  );
}
