const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

app.use(bodyParser.json())

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            titulo: String!
            descripcion: String!
            precio: Float!
            fecha: String!
        }

        input EventInput {
            titulo: String!
            descripcion: String!
            precio: Float!
            fecha: String!            
        } 

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(input: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: (args) => {
            return events;
        }, 
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                titulo: args.input.titulo,
                descripcion: args.input.descripcion,
                precio: +args.input.precio,
                fecha: args.input.fecha
            };
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

app.listen(3000);