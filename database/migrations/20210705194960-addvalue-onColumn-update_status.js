'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER TYPE "enum_mercadoLibreAd_update_status" ADD VALUE 'not_update'`
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        DELETE 
        FROM
            pg_enum
        WHERE
            enumlabel = 'not_update' AND
            enumtypid = (
                SELECT
                    oid
                FROM
                    pg_type
                WHERE
                    typname = 'enum_mercadoLibreAd_update_status'
            )
    `)
  }
}
