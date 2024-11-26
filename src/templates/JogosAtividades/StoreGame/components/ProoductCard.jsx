// src/components/ProductCard.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function ProductCard({ product, onSell }) {
  return (
    <Card sx={{ margin: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body1">Preço: ${product.price} cada</Typography>
        <button onClick={() => onSell(product)}>Vender</button>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
