### Payload para criar
```json
    {
    "orderId": "< order_id >",
    "productId": "< product_id >",
    "transaction_in_id": "< transaction_in_id >",
    "userId": "< user_id >",
    "serial_numbers": ["serial 1", "serial 2"]
  }
```

### Payload para alterar
update serial number
```json
  {
    "serial_number": "novo serial"
  }
```

### Payload para desativar
Precisamos desativar o número de serial quando ele sai junto com uma ordem

```json
  {
    "transaction_out_id": "transação que ele está saindo"
  }
```