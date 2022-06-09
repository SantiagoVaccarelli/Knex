const knexLib = require('knex')

class ContenedorDB {

    constructor(config, tabla){
        this.knex = knexLib(config)
        this.tabla = tabla
          return this.knex.schema.createTableIfNotExists(this.tabla, table => {
                table.increments('id').primary();
                table.string('title', 50).notNullable();
                table.float('price');
                table.string('thumbnail');
          })
    }

    async save(obj) {
        await this.knex(this.tabla).insert(obj)
    }

    async getAll() {
        return await this.knex(this.tabla).select('*')
    }

    async deleteById(id) {
        await this.knex.from(this.tabla).where('id', id).del()
    }

    async deleteAll() {
        await this.knex(this.tabla).del()
    }
}

module.exports = ContenedorDB