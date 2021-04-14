'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'status',
      [
        {
          id: 'st_71b4a55b-c463-4f89-8f37-c84f0f96843f',
          label: 'Entregue',
          value: 'delivery',
          color: '#5DA0FC',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_694b1df8-f825-4621-910b-6cf73067791d',
          label: 'Venda',
          value: 'sale',
          color: '#5DA0FC',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_71a2300c-0a5e-4f22-b19a-c90b9c6c9efb',
          label: 'Ecommerce',
          value: 'ecommerce',
          color: '#268E86',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_6ac1c28d-ec4b-4a07-b9c9-02fff41a85ba',
          label: 'Mercado Livre',
          value: 'free_market',
          color: '#F29F03',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_d8abf7e8-500c-4679-b32b-e8a999c2899b',
          label: 'Técnico',
          value: 'technician',
          color: '#1772C9',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_1aad3f7b-79fc-4d21-b809-32b9c46f2937',
          label: 'Saída',
          value: 'output',
          color: '#EA5656',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_e4921b5d-22ba-4696-97e9-03a704e0194b',
          label: 'Reserva',
          value: 'booking',
          color: '#7550D8',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_f0511bbf-4373-45a3-afea-f02da0df8b15',
          label: 'Locação',
          value: 'tenacy',
          color: '#2D2D2D',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_8c067e96-b95f-4570-b6bc-db25a6ed693a',
          label: 'Empréstimo',
          value: 'borrowing',
          color: '#F29F03',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_5ea743dc-d9fb-4960-9f3c-493f05b99c8e',
          label: 'Em análise',
          value: 'in_analysis',
          color: '#D588F2',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_47d942cc-4046-479f-9868-3ccf85b14354',
          label: 'Conserto',
          value: 'repair',
          color: '#F2CB03',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_dc093433-1fa0-409e-9c54-99488c3351fe',
          label: 'Compra',
          value: 'buy',
          color: '#17C9B2',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_0f18206c-ce15-427f-a1b8-64b8ac3799ec',
          label: 'Entrada',
          value: 'inputs',
          color: '#7250D8',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_f49604ac-aea2-45dc-8aaa-d5486694ead7',
          label: 'Troca',
          value: 'exchange',
          color: '#5D3F90',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_dcfa0308-227f-45f1-a7ac-cedfc22fd7a5',
          label: 'Aguardando análise',
          value: 'pending_analysis',
          color: '#CC3A4F',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_618527e3-a827-4390-93d4-d263e2a06517',
          label: 'Retorno análise',
          value: 'analysis_return',
          color: '#984141',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_d825c34d-4a5d-417b-99f6-3ef730ef158e',
          label: 'Retorno conserto',
          value: 'repair_return',
          color: '#264ABE',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),

  down: (queryInterface) => queryInterface.bulkDelete('status', null, {})
}
