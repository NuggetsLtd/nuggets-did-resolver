# Nuggets DID resolver
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)

DID (Decentralised Identifier Document) Resolver, specific to the Nuggets private network.

This library is intended to use ethereum addresses as static Decentralized Identifiers and wrap them in a DID Document.

It supports the proposed Decentralized Identifiers spec from the W3C Credentials Community Group.

It requires the did-resolver library, which is the primary interface for resolving DIDs.

## DID method

To encode a DID for an Ethereum address on the nuggets network, convert the address to Base58 and prepend `did:nuggets:`.

Base 58 conversion example:
```js
// add the "bs58" package to your project & require
const bs58 = require('bs58')

// convert ethereum address to Base 58
const addressBase58 = bs58.encode(Buffer.from('0xB21528447F362da4affFD62B499a7630C6A59f3b'.slice(2), 'hex'))

console.log(addressBase58) // output = "3Uu42t4rzjC1oUUWfxPFnX2FL1bG"
```

**Resulting DID:** `did:nuggets:3Uu42t4rzjC1oUUWfxPFnX2FL1bG`

## DID Document
The did resolver decodes the ethereum address, and looks up the registered DID Document corresponding to the address.

*Note*: Nuggets ID addresses are derived from the public key in the registration smart contract, meaning that the two are cryptographically linked.

An example DID Document looks like this:

```js
{
  '@context': [
    'https://www.w3.org/ns/did/v1/',
    'https://w3id.org/security/v2',
    'https://w3id.org/security/suites/secp256k1-2019/v1'
  ],
  id: 'did:nuggets:3Uu42t4rzjC1oUUWfxPFnX2FL1bG',
  verificationMethod: [
    {
      id: 'did:nuggets:3Uu42t4rzjC1oUUWfxPFnX2FL1bG#controller',
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: 'did:nuggets:3Uu42t4rzjC1oUUWfxPFnX2FL1bG',
      publicKeyBase58: '2dsbczEiYyxYGy7mZqtnVxfUobpnFqXz1DT4hPiBXAwCutRgMTReW6vP8hskHyahK6MMPyXoFHfZhTdYrhMV5oQq'
    },
    {
      type: 'Bls12381G2Key2020',
      id: 'did:nuggets:3Uu42t4rzjC1oUUWfxPFnX2FL1bG#bls12381g2',
      controller: 'did:nuggets:3Uu42t4rzjC1oUUWfxPFnX2FL1bG',
      publicKeyBase58: 'z7iFxbzoB9FsvxYQ26gvXdS7nWkp1RyVdRFazgMcj9T5Wx5PZFyNJyxQqDe8nyZ7BiafJpJTjXj4ULdaCVfcc3rXpWy8Pph23rqi7AkZvKhQr7D9sc8a5Fi7HxibUnrnPPc'
    }
  ],
  authentication: [ 'did:nuggets:3Uu42t4rzjC1oUUWfxPFnX2FL1bG#controller' ],
  assertionMethod: [ 'did:nuggets:3Uu42t4rzjC1oUUWfxPFnX2FL1bG#controller' ]
}
```

## DID Document Build

The DID Document is not stored as a file, however it is cached for the life of the running script.

## Resolving a DID document
The library presents a resolve() function that returns a Promise returning the DID document. It is not meant to be used directly but through the [did-resolver](https://github.com/decentralized-identity/did-resolver) aggregator.

You can use the getResolver() method to produce an entry that can be used with the Resolver constructor:

```js
const { Resolver } = require('did-resolver')
const nuggets = require('@nuggetslife/nuggets-did-resolver')

const nuggetsResolver = nuggets.getResolver()
const resolver = new Resolver(nuggetsResolver)

const doc = await resolver
  .resolve('did:nuggets:3Uu42t4rzjC1oUUWfxPFnX2FL1bG')
```
