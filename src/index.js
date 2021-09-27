const axios = require('axios')
const bs58 = require('bs58')
const NodeCache = require('node-cache')
const config = require('../config.json')
const { NODE_ENV } = process.env

/* istanbul ignore next */
const baseUrl = config.api.baseUrl[NODE_ENV] || config.api.baseUrl['production']

const cache = new NodeCache()

const didMethodNuggetsRegEx = /^(did:nuggets:[a-zA-HJ-NP-Z0-9]{25,39})(#[a-zA-Z]{1}[a-zA-Z0-9_-]+)?$/

// DIDResolutionResult base object
const responseStructure = {
  didResolutionMetadata: { contentType: 'application/did+ld+json' },
  didDocument: null,
  didDocumentMetadata: { }
}

/**
 * Resolution of DID to DID Docuemnt for the Nuggets KERI DID Method
 *
 * https://keri.one/
 *
 * @returns Promise<Object>
 */
const _resolveKeri = async () => {

  // TODO: retrieve the KERI DID Document
  return {
    ...responseStructure,
    didResolutionMetadata: {
      error: 'notImplemented',
      message: 'Unable to resolve DID: Error: incomplete KERI implmentation'
    }
  }
}

/**
 * Resolution of DID to DID Docuemnt for the Nuggets DID Method
 *
 * @param {String} did - Decentralised Identifier (DID) for the Nuggets method
 * @param {Object} parsed - Parsed DID into component parts
 * @param {DIDResolver} didResolver - DID Resolver object from `did-resolver` package
 * @param {DIDResolutionOptions} options - DID resolution options
 * @returns Promise<Object>
 */
const _resolve = async (did, parsed, didResolver, options) => {
  // check for KERI sub-method
  if (did.startsWith('did:nuggets:keri:')) {
    return _resolveKeri(
      did,
      {
        ...parsed,
        method: 'nuggets:keri',
        id: parsed.id.replace('keri:', '')
      },
      didResolver,
      options
    )
  }

  // check DID format for "did:nuggets" method
  if (!didMethodNuggetsRegEx.test(did)) {
    return {
      ...responseStructure,
      didResolutionMetadata: {
        error: 'invalidDID',
        message: 'Invalid "did:nuggets" method DID'
      }
    }
  }

  // decode parsed id to ethereum address from Base58 encoding
  const ethereumAddress = `0x${bs58.decode(parsed.id).toString('hex')}`

  try {
    // attempt to get DID document from cache
    const didDocument = cache.get(did)

    // retreve DID document & set in cache if not already set
    if (!didDocument) {
      // attempt to retrieve DID document (throws on not found, and other errors)
      const didDocumentResponse = await axios.get(`${baseUrl}/nugget/${ethereumAddress}/did`)

      // store DID document in cache
      cache.set(did, didDocumentResponse)
    }

    // return DIDResolutionResult object
    return {
      ...responseStructure,
      didDocument
    }

  } catch (error) {

    if (error.response.data.error === 'Nugget not found') {
      return {
        ...responseStructure,
        didResolutionMetadata: {
          error: 'notFound',
          message: 'Unable to resolve DID: Error: DID Not Found'
        }
      }
    }

    return {
      ...responseStructure,
      didResolutionMetadata: {
        error: error.name,
        message: `Unable to resolve DID: Error: ${error.message}`
      }
    }
  }
}

const getResolver = () => {
  return {
    nuggets: _resolve
  }
}

module.exports = {
  getResolver
}
