// configura las variables de entorno para development
require('dotenv').config();

// importancion de paquetes
const { ApolloServer } = require('apollo-server')
const mongoose = require("mongoose")

// importar variables para configurar el servidor de graphql
const typeDefs = require('./src/graphql/schema')
const resolvers = require('./src/graphql/resolvers')
const {
  getContext,
  AuthDirective,
  AdminAuthDirective
} = require('./src/actions/authActions')

// parametros de la conexion a la base de datos
mongoose.connect(
  process.env.URL_DATABASE,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
  }
);

// crea la conexion a la base de datos
const mongo = mongoose.connection
// listeners
mongo.on('error', console.error.bind(console, 'Error de conexion'))
mongo.on('open', () => console.log('Conectado !'))

// instancia de un nuevo servidor de apollo server
// para iniciarlo es necesario especificar los typeDefs y los resolvers
// contexto: objeto que se pasa atravez de todos los resolvers y se ejecuta en cada request (query o mutation)
// directivas: 
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: false,
  schemaDirectives: {
    AuthDirective: AuthDirective,
    AdminAuthDirective: AdminAuthDirective
  },
  context: async({ req }) => getContext(req)
})

// levanta el servidor
const port = process.env.PORT || 8080
server.listen(port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})