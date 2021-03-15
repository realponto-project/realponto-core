- bloquear enviar dois produtos iguais na mesma ordem

Ordem com entrada normal e um produto para analise
```json
// pending_review campo usado para saber se precisamos continuar usando essa ordem para análise
// se a ordem precisa enviar equipamentos para analise ou adicionar serial number temos que fazer isso
  {
    "pending_review": false,
    "userId": "7ad1ec7a-bdd0-4212-9333-36c03a1b8920",
    "status": "buy",
    "products": [
      {
        "productId": "fc57d861-e6ea-4873-b7c0-68149a8790ec",
        "quantity": 20,
        "status": "inputs"
      },
      {
        "productId": "b4d2bd13-fa10-4cb9-82bf-a3da3f18b5cb",
        "quantity": 20,
        "status": "pending_analysis"
      }
    ]
  }
```

para alerar algo em uma orderm e gerar movimentação no estoque

```json
  {
    "products": [
        {
            "status": "in_analysis",
            "quantity": 1,
            "productId": "b4d2bd13-fa10-4cb9-82bf-a3da3f18b5cb"
        }
    ]
  }
```

para retornar do estoque
```json
  {
    "products": [
        {
            "status": "analysis_return",
            "quantity": 1,
            "productId": "b4d2bd13-fa10-4cb9-82bf-a3da3f18b5cb"
        }
    ]
  }
```

para encerrarmos a movimentação da ordem podemos usar o pending_review como false
```json
 {
    "pending_review": false
  }
```

query de busca com todos os campos
/api/orders?user_name=ale&customer_name=developement&customer_document=11222333000100&status_value=Reserva&status_typeLabel=Saída&product_name=Air&pendingReview=true&createdAt=2020-12-19&updatedAt=2020-10-10