const axios = require('axios')
const didResolver = require('.')
const { Resolver } = require('did-resolver')
const { toBuffer } = require('@nuggetslife/helpers')
const bs58 = require('bs58')
const didDocument = require('../test/didDocument.json')

const nuggetsResolver = didResolver.getResolver()
const resolver = new Resolver(nuggetsResolver)

// we need several addresses, as responses are cached
const addresses = [
  '0x8b5f6a25ff04b98effc188aa01650daee338487f',
  '0xd2339ba4afbf83c1a4a7f682ae962446b7da8292',
  '0x71555EfDE8655158C3B82dFC96dAE7239c45E89A',
  '0x379f989C026643Beb005C3f76EfF80841CD77137'
]

describe('DID Resolver', () => {

  it('should export a "getResolver" function', () =>{
    expect(typeof didResolver.getResolver).toBe('function')
  })

  describe('"did:nuggets:" method', () => {

    describe('should resolve a DID correctly', () => {
      const addressBase58 = bs58.encode(toBuffer(addresses[0]))

      it('where document NOT cached', async () => {

        jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { data: didDocument } })

        await expect(resolver.resolve(`did:nuggets:${addressBase58}`))
          .resolves.toStrictEqual({
            didResolutionMetadata: {
              'contentType': 'application/did+ld+json'
            },
            didDocument: didDocument,
            didDocumentMetadata: {}
          })

        expect(axios.get).toHaveBeenCalledTimes(1)
      })

      it('where document cached', async () => {

        jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { data: didDocument } })

        await expect(resolver.resolve(`did:nuggets:${addressBase58}`))
          .resolves.toStrictEqual({
            didResolutionMetadata: {
              'contentType': 'application/did+ld+json'
            },
            didDocument: didDocument,
            didDocumentMetadata: {}
          })

        expect(axios.get).toHaveBeenCalledTimes(0)
      })

      describe('where document fragment requested', () => {

        it('and fragment is matched', async () => {

          jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { data: didDocument } })

          await expect(resolver.resolve(`did:nuggets:${addressBase58}#bls12381g2`))
            .resolves.toStrictEqual({
              didResolutionMetadata: {
                'contentType': 'application/did+ld+json'
              },
              didDocument: didDocument.verificationMethod[1],
              didDocumentMetadata: {}
            })
        })

        it('and fragment is not matched', async () => {

          jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { data: didDocument } })

          await expect(resolver.resolve(`did:nuggets:${addressBase58}#notMatched`))
            .resolves.toStrictEqual({
              didResolutionMetadata: {
                'contentType': 'application/did+ld+json'
              },
              didDocument: null,
              didDocumentMetadata: {}
            })
        })

      })

    })

    describe('should return an error response', () => {

      it('where DID is invalid', async () => {
        await expect(resolver.resolve('did:nuggets:INVALID_DID'))
          .resolves.toStrictEqual({
            didResolutionMetadata: {
              error: 'invalidDID',
              message: 'Invalid "did:nuggets" method DID'
            },
            didDocument: null,
            didDocumentMetadata: {}
          })
      })

      it('where no DID exists', async () => {
        const addressBase58 = bs58.encode(toBuffer(addresses[1]))

        jest.spyOn(axios, 'get').mockRejectedValueOnce({ response: { success: false, data: { error: 'Nugget not found' } } })

        await expect(resolver.resolve(`did:nuggets:${addressBase58}`))
          .resolves.toStrictEqual({
            didResolutionMetadata: {
              error: 'notFound',
              message: 'Unable to resolve DID: Error: DID Not Found'
            },
            didDocument: null,
            didDocumentMetadata: {}
          })
      })

      describe('where unknown error occurs', () => {

        it('as an axios error structure', async () => {
          const addressBase58 = bs58.encode(toBuffer(addresses[2]))
          const errorMsg = 'UNKNOWN_ERROR'

          jest.spyOn(axios, 'get').mockRejectedValueOnce({ response: { success: false, data: { error: errorMsg } } })

          await expect(resolver.resolve(`did:nuggets:${addressBase58}`))
            .resolves.toStrictEqual({
              didResolutionMetadata: {
                error: 'unknownError',
                message: `Unable to resolve DID: Error: ${errorMsg}`
              },
              didDocument: null,
              didDocumentMetadata: {}
            })
        })

        it('as standard error structure', async () => {
          const addressBase58 = bs58.encode(toBuffer(addresses[2]))
          const errorName = 'ERROR_NAME'
          const errorMsg = 'UNKNOWN_ERROR'

          jest.spyOn(axios, 'get').mockRejectedValueOnce({ name: errorName, message: errorMsg })

          await expect(resolver.resolve(`did:nuggets:${addressBase58}`))
            .resolves.toStrictEqual({
              didResolutionMetadata: {
                error: errorName,
                message: `Unable to resolve DID: Error: ${errorMsg}`
              },
              didDocument: null,
              didDocumentMetadata: {}
            })
        })
      })

    })

  })

  describe('"did:nuggets:keri:" method', () => {

    it('should return a "not implemented" response', async () => {
      const addressBase58 = bs58.encode(toBuffer(addresses[3]))

      await expect(resolver.resolve(`did:nuggets:keri:${addressBase58}`))
        .resolves.toStrictEqual({
          didResolutionMetadata: {
            error: 'notImplemented',
            message: 'Unable to resolve DID: Error: incomplete KERI implmentation'
          },
          didDocument: null,
          didDocumentMetadata: {}
        })
    })

  })

})
