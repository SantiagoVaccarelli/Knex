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

    save(obj) {
        this.knex(this.tabla).insert(obj)
    }

    getAll() {
        return this.knex(this.tabla).select('*')
    }

    borrarPorId(id) {
        this.knex.from(this.tabla).where('id', id).del()
    }

    vaciar() {
        this.knex(this.tabla).del()
    }
}

module.exports = ContenedorDB