'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'statuses',
      [
        {
          id: 'st_71b4a55b-c463-4f89-8f37-c84f0f96843f',
          label: 'delivery',
          value: 'Entregue',
          color: '#5DA0FC',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_694b1df8-f825-4621-910b-6cf73067791d',
          label: 'sale',
          value: 'Venda',
          color: '#5DA0FC',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_71a2300c-0a5e-4f22-b19a-c90b9c6c9efb',
          label: 'ecommerce',
          value: 'Ecommerce',
          color: '#268E86',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_6ac1c28d-ec4b-4a07-b9c9-02fff41a85ba',
          label: 'free_market',
          value: 'Mercado Livre',
          color: '#F29F03',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_d8abf7e8-500c-4679-b32b-e8a999c2899b',
          label: 'technician',
          value: 'Técnico',
          color: '#1772C9',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_1aad3f7b-79fc-4d21-b809-32b9c46f2937',
          label: 'outputs',
          value: 'Saída',
          color: '#EA5656',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_e4921b5d-22ba-4696-97e9-03a704e0194b',
          label: 'booking',
          value: 'Reserva',
          color: '#7550D8',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_f0511bbf-4373-45a3-afea-f02da0df8b15',
          label: 'tenancy',
          value: 'Locação',
          color: '#2D2D2D',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_8c067e96-b95f-4570-b6bc-db25a6ed693a',
          label: 'borrowing',
          value: 'Empréstimo',
          color: '#F29F03',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_5ea743dc-d9fb-4960-9f3c-493f05b99c8e',
          label: 'in_analysis',
          value: 'Em Análise',
          color: '#D588F2',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_47d942cc-4046-479f-9868-3ccf85b14354',
          label: 'repair',
          value: 'Conserto',
          color: '#F2CB03',
          type: 'outputs',
          typeLabel: 'Saída',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_dc093433-1fa0-409e-9c54-99488c3351fe',
          label: 'buy',
          value: 'Compra',
          color: '#17C9B2',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_0f18206c-ce15-427f-a1b8-64b8ac3799ec',
          label: 'inputs',
          value: 'Entrada',
          color: '#7250D8',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_f49604ac-aea2-45dc-8aaa-d5486694ead7',
          label: 'exchange',
          value: 'Troca',
          color: '#5D3F90',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_dcfa0308-227f-45f1-a7ac-cedfc22fd7a5',
          label: 'pending_analysis',
          value: 'Aguardando análise',
          color: '#CC3A4F',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_618527e3-a827-4390-93d4-d263e2a06517',
          label: 'analysis_return',
          value: 'Retorno Análise',
          color: '#984141',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_d825c34d-4a5d-417b-99f6-3ef730ef158e',
          label: 'repair_return',
          value: 'Retorno Conserto',
          color: '#264ABE',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_a479f58b-5435-40b2-b403-66d105b3fa03',
          label: 'booking_return',
          value: 'Restorno Reserva',
          color: '#F50',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_ec818f68-414d-4e96-a05d-ada97a3fc689',
          label: 'borrowing_with_pending_analysis_return',
          value: 'Retorno Empréstimo e Aguardando Análise',
          color: '#2db7f5',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_5b3033fe-dbf8-4d8c-a968-2afb09eaacbb',
          label: 'tenancy_with_pending_analysis_return',
          value: 'Retorno Locação e Aguardando Análise',
          color: '#87d068',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_df538152-9d00-4fcc-a9a7-5b5f8cd5c36e',
          label: 'technician_return',
          value: 'Retorno Técnico',
          color: '#108ee9',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_e8ef341d-36ac-441b-bce3-3121e182d0ae',
          label: 'technician_with_pending_analysis_return',
          value: 'Retorno Técnico e Aguardando Análise',
          color: '#0052cc',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_a7e960a7-11d1-4a4c-98ee-1dfad07095e6',
          label: 'ecommerce_with_pending_analysis_return',
          value: 'Retorno Ecommerce e Aguardando Análise',
          color: '#A5D0A5',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_e845b1ef-1bcb-43ee-87a0-cc5bd2fba3ba',
          label: 'free_market_return',
          value: 'Retorno Mercado Livre',
          color: '#171383',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'st_e4563129-7a0b-40ff-944b-929394b6183a',
          label: 'free_market_with_analysis_return',
          value: 'Retorno Mercado Livre e Aguardando Análise',
          color: '#5666C8',
          type: 'inputs',
          typeLabel: 'Entrada',
          companyId: 'co_4095e6c0-056d-4b6d-b857-a35584634ad0',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),

  down: (queryInterface) => queryInterface.bulkDelete('statuses', null, {})
}
