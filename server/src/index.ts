import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { graphqlHTTP } from 'express-graphql';
import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import { resolvers } from '@generated/type-graphql';
import passport from 'passport';
import './auth';

const prisma = new PrismaClient();

const schema = buildSchemaSync({ resolvers: resolvers, validate: false });

const app = express();
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  },
);
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    customValidateFn: () => [],
    context: () => ({ prisma }),
  }),
);
app.listen(3000);
console.log('started');
