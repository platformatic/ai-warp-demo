/// <reference path="../global.d.ts" />
/// <reference path="../ai/ai.d.ts" />
/// <reference path="../movies/movies.d.ts" />
'use strict'
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (fastify, opts) {
  fastify.get('/opening/:id', async (request, reply) => {
    const movie = await request.movies.getMovieById({ id: request.params.id })
    request.log.info({ movie })
    if (!movie && !movie.title) {
      reply.code(404)
      return { message: 'Movie not found' }
    }
    const opening = await request.ai.prompt({
      prompt: `What is the opening line of "${movie.title}"? Put it between brackets, and do not include any additional text or commentary. If there are multiple possibilities, use the correct one.`,
    })

    const matched = /\["?(.*)"]?/g.exec(opening.response)

    request.log.info({ opening, matched })

    return matched[1]
  })
}
