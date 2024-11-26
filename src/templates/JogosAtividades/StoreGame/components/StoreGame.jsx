// src/components/StoreGame.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Confetti from 'react-confetti';
import ProductCard from './ProoductCard';
import products from '../utils/products';

function StoreGame() {
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSell = (product) => {
    setSelectedProduct(product);
    setIsCorrect(false);
  };

  const validationSchema = Yup.object({
    quantity: Yup.number()
      .required("Necessário")
      .min(1, "Quantidade mínima é 1"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const totalCost = selectedProduct.price * values.quantity;
    if (parseInt(values.totalCost) === totalCost) {
      setScore(score + 10);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    resetForm();
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Bem-vindo à sua loja!</Typography>
      <Typography variant="h6">Pontuação: {score}</Typography>

      <Box display="flex" flexWrap="wrap">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onSell={handleSell} />
        ))}
      </Box>

      {selectedProduct && (
        <Formik
          initialValues={{ quantity: '', totalCost: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Typography variant="h6">
                Quantos {selectedProduct.name}s o cliente deseja comprar?
              </Typography>
              <Field
                as={TextField}
                name="quantity"
                type="number"
                label="Quantidade"
                error={touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
              />
              <Field
                as={TextField}
                name="totalCost"
                type="number"
                label="Preço Total"
                error={touched.totalCost && !!errors.totalCost}
                helperText="Digite o preço total esperado pelo cliente."
              />
              <Button type="submit" variant="contained" color="primary">
                Confirmar Venda
              </Button>
            </Form>
          )}
        </Formik>
      )}

      {isCorrect && (
        <>
          <Typography variant="h6" color="success">
            Resposta correta! Cliente satisfeito!
          </Typography>
          <Confetti />
        </>
      )}

      {!isCorrect && selectedProduct && (
        <Typography variant="h6" color="error">
          Resposta incorreta. Tente novamente!
        </Typography>
      )}
    </Box>
  );
}

export default StoreGame;
