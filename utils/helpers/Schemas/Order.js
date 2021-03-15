const yup = require('yup')

const ProductSchema = yup.object().shape({
  productId: yup.string().required(),
  quantity: yup.number().required()
})

const OrderSchema = yup.object().shape({
  statusId: yup.string().required(),
  products: yup.array(ProductSchema).required()
})

module.exports = OrderSchema
