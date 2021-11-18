const axios = require('axios')
const bs58 = require('bs58')
const jp = require('jsonpath')
const NodeCache = require('node-cache')
const config = require('../config.json')

let baseUrl

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
    let didDocument = cache.get(did)

    // retreve DID document & set in cache if not already set
    if (!didDocument) {
      // attempt to retrieve DID document (throws on not found, and other errors)
      const { data: { data: didDoc } } = await axios.get(`${baseUrl}/nugget/${ethereumAddress}/did`)

      // store DID document in cache
      cache.set(did, didDoc)

      // set did document response
      didDocument = didDoc
    }

    // set did document response
    if (parsed.fragment) {
      const didFragment = jp.query(didDocument, `$..[?(@.id=="${parsed.didUrl}")]`)

      if (!didFragment.length) {
        // return DIDResolutionResult object
        return {
          ...responseStructure,
          didResolutionMetadata: {
            error: 'notFound',
            message: 'Unable to resolve DID: Error: Fragment Not Found'
          }
        }
      }

      didDocument = didFragment[0]
    }

    // return DIDResolutionResult object
    return {
      ...responseStructure,
      didDocument
    }

  } catch (error) {
    const apiErrorMsg = error && error.response && error.response.data && error.response.data.error

    if (apiErrorMsg === 'Nugget not found') {
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
        error: error.name || 'unknownError',
        message: `Unable to resolve DID: Error: ${apiErrorMsg || error.message}`
      }
    }
  }
}

/**
 * Get Nuggets DID Method Resolver
 *
 * @param {String} [environment] - Environment to use for DID Resolution
 * @returns {Object}
 */
const getResolver = (environment = 'production') => {
  // set base url for DID Resolution endpoint
  baseUrl = config.api.baseUrl[environment]

  return {
    nuggets: _resolve
  }
}

module.exports = {
  getResolver
}
