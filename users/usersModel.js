const db = require('../data/dbConfig');

module.exports = {
    addUser,
    find,
    findById,
    findBy
}

function findById(id){
    return db('users').where({id})
    .first()
}

function findBy(filter) {
    return db('users').where(filter);
  }

function find(){
    return db('users').select('id', 'username', 'password')
}

async function addUser(user){
    const [id] = await db('users').insert(user)

    return findById(id)
}
